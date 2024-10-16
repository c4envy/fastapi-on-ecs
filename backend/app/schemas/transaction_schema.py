from datetime import datetime
from enum import Enum
from typing import List, Optional, Union
from uuid import UUID, uuid4
from pydantic import BaseModel, Field
from app.schemas.music_schema import MusicOwner, Platform, Publisher

class CartItem(BaseModel):
    track_id: UUID
    track_name: str
    artist_name: str
    num_of_shares: int
    price_per_share: float
    album_name: str
    publisher: Publisher
    quantity: Optional[int]
    


class TransactionObj(BaseModel):
    cart_items: list[CartItem]
    total_price: float
    payment_method: str
    buyer_id: UUID
    
class Items(BaseModel):
    items: List[CartItem]

class TransactionType(Enum):
    shares = "shares"
    listing = "listing"

    
    