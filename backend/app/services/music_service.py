from datetime import datetime
import logging
from typing import List, Union
from uuid import UUID
from fastapi import File, HTTPException, UploadFile
from app.models.trackpayment_model import TrackPayment
from app.services import aws_service
from app.services.aws_service import delete_file_from_s3, save_file_on_disk, upload_file_to_s3, upload_files_to_s3, upload_image_to_s3, send_welcome_email
from app.models.transaction_model import Transaction
from app.models.user_model import User
from app.models.music_model import Music
from app.schemas.music_schema import MusicCreate, MusicOut, MusicOwner, MusicSearch, MusicUpdate,Publisher
from app.schemas.stripe_schema import StripeProductModel
from app.schemas.transaction_schema import CartItem
from app.schemas.user_schema import PortfolioItem
from app.services.coupon_service import CouponService
from app.services.stripe_service import StripeService
from app.core.config import settings

logger = logging.getLogger('music_service_class')
logger.setLevel(logging.INFO)

class MusicService:
   
    @staticmethod
    async def search_for_track(data: MusicSearch) -> List[MusicOut]:
        query = {key: getattr(data, key) for key in data.dict().keys() if getattr(data, key) is not None}
        #handle cases where the query is empty
        if not query:
          logger.info("Empty query, returning all music")
          return await Music.find().to_list()
        #handle cases where the query is not empty
        logger.info(f"Query: {query}")
        music_list = await Music.find(query).to_list()
        #handle cases where the query returns no results
        if not music_list:
           logger.info("Music not found")
           return []
        
        return music_list
    
    @staticmethod
    async def retrieve_a_track(data: MusicSearch) -> Music:
        query = {key: getattr(data, key) for key in data.dict().keys() if getattr(data, key) is not None}
        #handle cases where the query is empty
        if not query:
          logger.info("Empty query, returning all music")
          return await Music.find().to_list()
        #handle cases where the query is not empty
        logger.info(f"Query: {query}")
        music = await Music.find_one(query)
        #handle cases where the query returns no results
        if not music:
           logger.info("Music not found")
           return None
        return music
    
    @staticmethod
    async def create_track(user: User, data: MusicCreate, file: UploadFile) -> Union[MusicOut, str]:
        # Modify the data to change the url to the s3 url
        if data.image_url:
            data.image_url = await MusicService.save_image_on_s3(data.image_url, 
                                                           data.artist_name, data.track_name) 
        if data.track_url:
            data.track_url = await MusicService.save_track_on_s3(file, 'beatstake-stream',
                                                            data.artist_name)
        music = Music(**data.dict(), publisher=Publisher(email=user.email), 
                    owners=[MusicOwner(email=user.email, shares=data.num_of_shares,
                                        owner_id=user.user_id, date_acquired=datetime.utcnow())])
        try:
            response = await music.insert()
            logger.info(f"Music creation response: {response}")
            #add the music to the user's catalogue
            if user.account.profile.catalogue:
                user.account.profile.catalogue.append(music)
            else:
                user.account.profile.catalogue = [music]
            #save the user's catalogue
            logger.info(f"User's catalogue: {user.account.profile.catalogue}")        
            await user.save()
            
                ############## STRIPE IMPLEMENTATION ################
            try:
                # Create and save a Stripe price model
                # await StripeService.create_price(f"price_{music.track_id}", music.price_per_share, "usd")
            
                # Create a Stripe product model and add it to the Stripe database
                prod_model = StripeProductModel(
                    name=data.track_name,
                    type=music,
                    images=[data.image_url],
                    id= music.track_id,
                    default_price=music.price_per_share,
                    active=False,
                    metadata={"artist": data.artist_name},
                    statement_descriptor=f"Music Ownership- {data.track_name}",
                    unit_label="share",
                )
            
                # Create this product in the Stripe database
                await StripeService.create_product(prod_model)
            except Exception as e:
                logger.error(f"Stripe integration error: {e}")
            ######################################################   
                   
            return response
        except Exception as e:
            logger.error(f"Error creating music: {e}")
            return "Music creation failed"

    
    @staticmethod
    async def create_tracks(user: User, data: MusicCreate) -> List[MusicOut]:
        music = Music(**data.dict(), publisher=Publisher(email=user.email),
                      owners=[MusicOwner(email=user.email, shares=data.num_of_shares,
                owner_id=user.user_id, date_aquired=datetime.utcnow())])
        response = await music.insert_many()
        logger.info(f"Music creation response: {response}")
        if isinstance(response, List[Music]):
            #add the music to the user's catalogue
            user.account.profile.catalogue.extend(response)
            user.save()
            
            ############## STRIPE IMPLEMENTATION ################
            #create and save a stripe price model
            StripeService.create_price("price_" + music.track_id, music.price_per_share, "usd")
            #create a stripe product model and add it to the stripe database
            prod_model = StripeProductModel(name = data.track_name, type = music, images =[data.image_url], id = "prod_" + music.track_id, 
                                    default_price = "price_" + music.track_id, active = False, metadata = {"artist": data.artist_name})
            # stripe_product_model = {"name": data.track_name, "type": "music", "images": [data.image], 
            #                         "default_price": data.price_per_share, "active": True, "metadata": {"artist": data.artist_name}}
            #create this product in the stripe database
            StripeService.create_product(prod_model)
            ######################################################
            
            return response
        return "Music not created"
    
    @staticmethod
    async def update_track(data: MusicUpdate, track_id: UUID, user: User) -> None:
        if data.image_url:
            #save the new image to s3
            data.image_url = await MusicService.save_image_on_s3(data.image_url, 
                                                    data.artist_name, data.track_name)
        music = await Music.find_one(Music.track_id == track_id, Music.publisher.email == user.email)
        if music:
            #delete the old image from s3
            delete_file_from_s3(music.image_url)
            await music.update({"$set": data.dict(exclude_unset=True)}) 
            await music.save()
            if music.price_per_share:
                #if the price has been updated, update the stripe product
                None
            return music
        return "Music not found"
    
    @staticmethod
    async def update_tracks(data: MusicUpdate, track_id: UUID, user: User) -> None:
        music = await Music.find(Music.track_id == track_id, Music.publisher.email == user.email).to_list()
        if music:
            for track in music:
              await track.update({"$set": data.dict(exclude_unset=True)})
              await Music.save(music)
            return music
        return "Music not found"

    @staticmethod
    async def delete_tracks_by_search(data: MusicSearch, user: User) -> List[MusicOut]:
        res = await MusicService.search_for_track(data)
        tracks_to_delete = []
        if res:
            for music in res:
                if music.publisher.email == user.email:
                    await music.delete()
                    tracks_to_delete.append(music)
                    
        return tracks_to_delete

    
    @staticmethod
    async def delete_tracks_by_search(data: MusicSearch, user: User) -> List[MusicOut]:
        tracks_to_delete = []       
        try:
            res = await MusicService.search_for_track(data)
            if res:
                for music in res:
                    if music.publisher.email == user.email:
                        await music.delete()
                        tracks_to_delete.append(music)           
            # Optional: Add logging to track the deletion process
            print(f"Deleted {len(tracks_to_delete)} tracks for user {user.email}.")      
        except Exception as e:
            # Optional: Add error logging
            print(f"An error occurred: {e}")
        return tracks_to_delete

 
    @staticmethod
    async def retrieve_track_by_id(track_id: UUID):
        music = await Music.find_one(Music.track_id == track_id)
        return music

    @staticmethod
    async def retrieve_tracks_by_id(track_ids: List[UUID]):
        music_list = []
        for track_id in track_ids:
            music = await Music.find_one(Music.track_id == track_id)
            if music:
                music_list.append(music)
        return music_list
    
    @staticmethod
    async def retrieve_top_tracks():
        return await Music.find().limit(10).to_list()
    
    @staticmethod
    async def retrieve_new_tracks():
        return await Music.find().sort([("created_at", -1)]).limit(10).to_list()
    
    @staticmethod
    async def track_check(track_id: UUID, user: User, shares: int) -> bool:
        music = await Music.find_one(Music.track_id == track_id)
        if music:
            if music.available_shares < shares:
                raise ValueError("Insufficient shares")
            # if music.publisher.email == user.email: 
            #     raise ValueError("You can't buy your own music")
            if music.share_limit > 0 and shares > music.share_limit:
                raise ValueError(f'You can\'t buy more than {music.share_limit} shares.')
        return True
    
    
    @staticmethod
    async def complete_order(trans_: Transaction, user: User) -> List[MusicOut]:
        logger.info(f"Items: {trans_}")
        music_list = []
        try:
            for item in trans_.cart_items.items:
                music = await Music.find_one(Music.track_id == item.track_id)
                print(music)
                if not music:
                    raise ValueError(f"Music with track_id {item.track_id} not found")

                track_check = await MusicService.track_check(item.track_id, user, item.quantity)
                if not track_check:
                    raise ValueError(f"Track check failed for track_id {item.track_id}")
                
                # Check if coupon code is not None and update accordingly
                if trans_.coupon_code is not 'None':
                    await CouponService.use_coupon(trans_.coupon_code, trans_.buyer_id)

                # Update music shares
                await MusicService._update_music_shares(music, user, item.quantity)

                # Update user portfolio
                await MusicService._update_user_portfolio(user, item)

                # Send notifications
                await MusicService._send_notifications(user,trans_.total_price)

                # Record transaction
                await MusicService._record_transaction(trans_)
                
                # # Update user wallet
                # await MusicService._update_user_transactions(user, trans_.transaction_id)
                
                # Add item to list of music to return
                music_list.append(music)
                
            # Update user wallet
            await MusicService._update_user_transactions(user, trans_.transaction_id)

            return music_list
        except Exception as e:
            logger.error(f"Error in transfer_shares: {str(e)}")
            raise

    @staticmethod
    async def _update_music_shares(music: Music, user: User, quantity: int):
        # Logic to update music shares
        owner_found = False
        for owner in music.owners:
            if owner.email == user.email:
                owner.shares += quantity
                owner_found = True
                break
        
        if not owner_found:
            music.owners.append(MusicOwner(email=user.email, shares=quantity, owner_id=user.user_id))
        
        music.available_shares -= quantity
        await music.save()

    @staticmethod
    async def _update_user_portfolio(user: User, item: CartItem):
        # Logic to update user portfolio. Add the music to the user's portfolio
        sold = PortfolioItem(track_id=item.track_id, num_of_shares=item.quantity)
        if user.account.profile.portfolio:
            #check if the music is already in the user's portfolio
            for item in user.account.profile.portfolio:
                if item.track_id == sold.track_id:
                    item.num_of_shares += sold.num_of_shares
                    break
                else:   
                    user.account.profile.portfolio.append(sold)
        else:
            user.account.profile.portfolio = [sold]
        await user.save()

    @staticmethod
    async def _send_notifications(user: User, total_shares: int):
        # await aws_service.thank_you_email(user, total_shares)
        pass

    @staticmethod
    async def _record_transaction(transaction: Transaction):
        # Logic to record transaction. Record the transacton details in the transaction database
        await transaction.save()
        
    @staticmethod
    async def _update_user_transactions(user: User, trans_id: UUID):
        # Logic to update user transactions. Add the transaction id to the user's transaction history
        user.transaction_history.append(trans_id)
        await user.save()
    
    @staticmethod
    async def save_image_on_s3(url: str, artist: str, track_name: str) -> str:
        file_name = save_file_on_disk(url)
        print(f'{file_name:}{file_name[0]}')
        resp = await upload_image_to_s3(file_name[1],"orinbackupbucket", f'/track/{artist}/{track_name}/{file_name[0]}')
        # return parse.quote(f'https://orinbackupbucket.s3.amazonaws.com//artist/{artist}/{file_name[0]}')
        return resp
    
    @staticmethod
    async def upload_file_to_s3(s3_dir: str, file: UploadFile, bucket_name: str = "orinbackupbucket") -> str:
        resp = await upload_file_to_s3(file, bucket_name, f'/artist/{s3_dir}')
        return resp
    
    @staticmethod
    async def upload_files_to_s3(files: List[UploadFile], bucket_name: str = 'orindocuments', s3_dir: str = '/documents'):
        resp = await upload_files_to_s3(files, bucket_name, s3_dir)
        return resp
    
    @staticmethod
    async def retrieve_user_transactions(user: User) -> List[Transaction]:
        transactions = []
        for transac_id in user.transaction_history:
            transaction = await Transaction.find_one(Transaction.transaction_id == transac_id)
            transactions.append(transaction)
        return transactions
    
    
    @staticmethod
    async def pay_for_track_listing(data: Transaction, user: User) -> Transaction:
        logger.info(f"Transaction Item: {data}")
        print(data)
        track_id = data.cart_items.items[0].track_id    
        try:
            music = await Music.find_one(Music.track_id == track_id)
            if not music:
                raise HTTPException(status_code=404, detail="Track not found")
        except Exception as e:
            # Handle the exception here
            raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
        
        await music.update({"$set": {"track_status": 'active', "payment_status": 'paid'}})
    
        # record the transaction
        # await TrackPayment.insert_one(data)
        await Transaction.save(data)
        
    @staticmethod
    async def retrieve_all_tracks() -> List[Music]:
        tracks = await Music.find_all().to_list()
        return tracks
    
    @staticmethod
    async def save_track_on_s3(track_file: UploadFile, bucket: str, artist_name):
        # Upload the track to S3 and return the URL
        try:
            await upload_file_to_s3(track_file, bucket, f'artists/{artist_name}')
            return settings.CLOUDFRONT_BASE_URL + f'/artists/{artist_name}/{track_file.filename}'
        except Exception as e:
            logger.error(f"Error uploading track to S3: {e}")
            return None
   
            
    # @staticmethod
    # async def save_artist_art_on_s3(file: UploadFile, artist: str) -> str:
    #     resp = await upload_file_to_s3(file, 'orinbackupbucket', f'/artist/{artist}/{file.filename}')
    #     return resp

    # @staticmethod
    # async def upload_files(list_of_files: List[str], bucket_name: str, s3_dir: str) -> List[str]:
    #     resp = []
    #     for file in list_of_files:
    #         resp.append(await upload_file_to_s3(file, bucket_name, s3_dir))
    #     return resp
    
     # @staticmethod
    # async def upload_file_to_s3(file: UploadFile, artist: str, track: str) -> str:
    #     print("called save_album_art_on_s3")
    #     # file_name = save_file_on_disk(url)
    #     print(file.filename)
    #     resp = await upload_file_to_s3(file,"orinbackupbucket", f'/album/{artist}/{track}/{file_name[0]}')
    #     # return f'https://orinbackupbucket.s3.amazonaws.com//album/{artist}/{track}/{file_name[0]}'
    #     return resp
    
   
        