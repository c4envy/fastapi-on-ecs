from datetime import datetime
from typing import List, Optional
from uuid import UUID
from venv import logger
from passlib.context import CryptContext
from fastapi import HTTPException, status
# from app.api.deps import s3_deps
from app.services.aws_service import save_file_on_disk, send_password_reset_otp_email, upload_file_to_s3, upload_image_to_s3,send_welcome_email
from app.schemas.user_schema import  ResetPasswordRequest, UserAuth, UserOut, UserSearch
from app.models.user_model import User
from app.core.security import generate_otp, generate_secret, get_password, verify_otp_code, verify_password
import pymongo
from app.schemas.user_schema import UserUpdate

password_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class UserService:
    @staticmethod
    async def create_user(user: UserAuth):
        if user.account_type == "artist":
            user.account.profile.image_url = await UserService.save_artist_art_on_s3(user.account.profile.image_url, user.username)
        user_in = User(
            firstname=user.firstname,
            lastname=user.lastname,
            username=user.username,
            email=user.email,
            account_type=user.account_type,
            account=user.account,
            secret=generate_secret(),
            hashed_password=get_password(user.password)
        )
        await user_in.save()
        # Generate OTP for user email verification
        totp = generate_otp(user_in.secret)
        #send email verification to the user
        send_welcome_email(user.email)
        return user_in
    
    @staticmethod
    async def authenticate(email: str, password: str) -> Optional[User]:
        user = await UserService.get_user_by_email(email=email)
        if not user:
            return None
        if not verify_password(password=password, hashed_pass=user.hashed_password):
            return None
        
        return user
    
    @staticmethod
    async def get_user_by_username(username: str) -> Optional[User]:
        user = await User.find_one(User.username == username)
        return user
    
    @staticmethod
    async def get_user_by_email(email: str) -> Optional[User]:
        user = await User.find_one(User.email == email)
        return user
    
    @staticmethod
    async def get_user_by_id(id: UUID) -> Optional[User]:
        user = await User.find_one(User.user_id == id)
        return user
    
    @staticmethod
    async def update_user(id: UUID, data: UserUpdate) -> User:
        user = await User.find_one(User.user_id == id)
        if not user:
            raise pymongo.errors.OperationFailure("User not found")
        
        await user.update({"$set": data.dict(exclude_unset=True)})
        return user
    
    @staticmethod
    async def delete_user(id: UUID) -> None:
        user = await User.find_one(User.user_id == id and User.account_status == "delete")
        if not user:
            raise pymongo.errors.OperationFailure("User not found")
        await user.delete()
        return "User deleted"
    
    
    # @staticmethod
    # async def update_artist_profile(id: UUID, data: ArtistProfile) -> UserOut:
    #     user = await User.find_one(User.user_id == id)
    #     if not user:
    #         raise pymongo.errors.OperationFailure("User not found")
    #     await user.update({"$set": {"account.profile.artist_profile": data.dict(exclude_unset=True)}})
    #     return user
    
    # @staticmethod
    # async def update_merchant_profile(id: UUID, data: MerchantProfile) -> UserOut:
    #     user = await User.find_one(User.user_id == id)
    #     if not user:
    #         raise pymongo.errors.OperationFailure("User not found")
    #     await user.update({"$set": {"account.profile.merchant_profile": data.dict(exclude_unset=True)}})
    #     return user
    
    # @staticmethod
    # async def update_fan_profile(id: UUID, data: FanProfile) -> UserOut:
    #     user = await User.find_one(User.user_id == id)
    #     if not user:
    #         raise pymongo.errors.OperationFailure("User not found")
    #     await user.update({"$set": {"account.profile.fan_profile": data.dict(exclude_unset=True)}})
    #     return user
    
    @staticmethod
    async def update_email(id: UUID, email: str) -> UserOut:
        user = await User.find_one(User.user_id == id)
        if not user:
            raise pymongo.errors.OperationFailure("User not found")
        #send email verification to the new email
        # aws_ses.send_email(email)
        await user.update({"$set": {"email": email}})
        return user
    
    @staticmethod
    async def get_artist_profile(id: UUID) -> UserOut:
        user = await User.find_one(User.user_id == id)
        print(user)
        if not user:
            raise pymongo.errors.OperationFailure("User not found or user is not an artist")
        return user
    
    @staticmethod
    async def get_merchant_profile(id: UUID) -> UserOut:
        user = await User.find_one(User.user_id == id and User.account_type == "merchant")
        if not user:
            raise pymongo.errors.OperationFailure("User not found or user is not a merchant")
        return user
     
    async def search_for_user(data: UserSearch) -> List[UserOut]:
        query = {key: getattr(data, key) for key in data.dict().keys() if getattr(data, key) is not None}
        #handle cases where the query is empty
        if not query:
          logger.info("Empty query, returning all users")
          return await User.find().to_list() 
        #handle cases where the query is not empty
        logger.info(f"Query: {query}")
        user_list = await User.find(query).to_list()
        #handle cases where the query returns no results
        if not user_list:
           logger.info("User not found")
           return []
        return user_list    
    
    async def retrieve_top_artists() -> List[UserOut]:
        return await User.find(User.account_type == "artist").to_list()
    
    @staticmethod
    async def save_artist_art_on_s3(url: str, artist: str) -> str:
        file_name = save_file_on_disk(url)
        print(f'{file_name:}{file_name[0]}')
        resp = await upload_image_to_s3(file_name[1],"orinbackupbucket", f'/artist/{artist}/{file_name[0]}')
        # return f'https://orinbackupbucket.s3.amazonaws.com//artist/{artist}/{file_name[0]}'
        return resp
    
    @staticmethod
    async def update_user_retry(user_id: UUID, updated_count: int) -> User:
        user  = await User.find_one(User.user_id == user_id)
        if not user:
            raise pymongo.errors.OperationFailure("User not found")         
        await user.update({"$set": {"otp_retry_count": updated_count}})
        return user
    
    @staticmethod
    async def update_user_last_login(user_id: UUID) -> User:
        user    = await User.find_one(User.user_id == user_id)
        if not user:
            raise pymongo.errors.OperationFailure("User not found")
        await user.update({"$set": {"last_login": datetime.utcnow()}})
        return user
    
    @staticmethod
    async def update_user_email(user_id: UUID, email: str) -> User:
        user = await User.find_one(User.user_id == user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        await user.update({"$set": {"email": email}})
        return user
    
    
    @staticmethod
    async def reset_password(email: str, password: str) -> User:
        user    = await User.find_one(User.email == email)
        if not user:
            raise pymongo.errors.OperationFailure("User not found")
        await user.update({"$set": {"password": password}})
        return user
    
    
    @staticmethod
    async def update_user_password(email: str, password: str) -> User:
        user = await User.find_one(User.email == email)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        # Hash the password before storing it
        hashed_password = password_context.hash(password)

        await user.update({"$set": {"password": hashed_password}})
        return user
    
    
    @staticmethod
    async def reset_password_with_otp(email: str, otp: str, password: str) -> User:
        user = await User.find_one(User.email == email)
        
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        otp_result = verify_otp_code(user.secret, otp)
        
        if not otp_result:
            raise HTTPException(status_code=400, detail="Invalid OTP")
        await UserService.update_user_password(email, password)
        
    
    @staticmethod
    async def send_password_reset_email(email: str, otp: str) -> None:
        user = await User.find_one(User.email == email)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
       # Generate a new OTP for the user
        otp = generate_otp(user.secret)
        
        # Send the OTP to the user's email
        try:
            send_password_reset_otp_email(user.email, otp)
        except Exception as e:
            # Handle the exception here
            print(f"An error occurred while sending password reset email: {str(e)}")
            
    @staticmethod
    async def reset_password(request: ResetPasswordRequest):
        # Get the user by email
        user = await UserService.get_user_by_email(request.email)   
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found",
            )
            
        # Verify the OTP
        is_valid_otp = verify_otp_code(user.secret, request.otp)
        
        if not is_valid_otp:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid or expired OTP",
            )
        
        # Hash the new password
        new_password = password_context.hash(request.new_password)
        
        # Update the user's password
        user.hashed_password = new_password
        await user.save()
        return {"message": "Password reset successful"}


        
    

    
    
    