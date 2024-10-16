from datetime import datetime
from typing import Dict, List, Tuple
import logging
from uuid import UUID
from app.models.music_model import Music
from app.models.statistics_model import Statistics
from app.models.transaction_model import Transaction
from app.models.user_model import User
from app.schemas.statistics_schema import  TopSalesModel, TopTracksModel

logger = logging.getLogger('statistics_service_class')
logger.setLevel(logging.INFO)

class StatisticsService:
   
    @staticmethod
    async def generate_top_sales(start_date: datetime, end_date: datetime) -> List[Tuple[UUID, int]]: 

        # Query transactions within the specified date range
        cursor = Transaction.find({
            "purchase_date": {"$gte": start_date, "$lt": end_date}
        })
        # Dictionary to count occurrences of each track_id and accumulate num_of_shares
        track_count: Dict[UUID, int] = {}
        async for transac in cursor:
            # Convert to TransactionDocument model
            # transaction_doc = PurchasedItems(**transaction)
            for item in transac.transaction.cart_items:
                track_id = item.track_id
                num_of_shares = item.num_of_shares
                if track_id in track_count:
                    track_count[track_id] += num_of_shares
                else:
                    track_count[track_id] = num_of_shares
        # Filter the dictionary to include only track_ids that repeat
        repeating_uuids = {track_id: count for track_id, count in track_count.items() if count > 1}
        # Sort the dictionary by num_of_shares in descending order and convert to list of tuples
        sorted_repeating_uuids = sorted(repeating_uuids.items(), key=lambda x: x[1], reverse=True)
        Transaction.save()
        logger.log(logging.INFO, f"Top sales: {sorted_repeating_uuids}")
        return sorted_repeating_uuids
    
    @staticmethod
    async def fetch_top_artists(model: TopSalesModel):
        user_details_list = list[TopTracksModel]
        for user_id, number in model.data:
            user_details = User.find_one(user_id)
            top_artist = TopTracksModel(track=user_details, sold=number)
            user_details_list.append((user_details, number))
            logger.log(logging.INFO, f"Top artist: {top_artist}")
            Statistics.save()
        return user_details_list
    
    @staticmethod
    async def fetch_top_tracks(model: TopSalesModel):
        music_details_list = list[TopTracksModel]
        for music_id, number in model.data:
            music_details = Music.find_one(music_id)
            top_track = TopTracksModel(track=music_details, sold=number)
            music_details_list.append(top_track)
            logger.log(logging.INFO, f"Top track: {top_track}")
            Statistics.save()
        return music_details_list

