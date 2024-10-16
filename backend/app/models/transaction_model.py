from datetime import datetime
from typing import List, Optional, Union
from uuid import UUID, uuid4
from beanie import Document
from pydantic import Field
from datetime import datetime
from app.schemas.transaction_schema import CartItem, Items, TransactionType

class Transaction(Document):
    transaction_id: UUID = Field(default_factory=uuid4, unique=True)
    purchase_date: datetime = Field(default_factory=datetime.utcnow)
    # cart_items: list[CartItem]
    cart_items: Items
    total_price: float
    payment_method: str
    buyer_id: UUID
    total_shares: Optional[int]
    coupon_code: str = "None"
    transaction_type: Optional[TransactionType] 
    
     
class Collection:
     name = "transactions"
     
