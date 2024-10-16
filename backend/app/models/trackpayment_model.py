from datetime import datetime
from typing import List, Optional, Union
from uuid import UUID, uuid4
from beanie import Document
from pydantic import Field
from datetime import datetime
from app.schemas.trackpayment_schema import TrackItem

class TrackPayment(Document):
    transaction_id: UUID = Field(default_factory=uuid4, unique=True)
    purchase_date: datetime = Field(default_factory=datetime.utcnow)
    track_item: TrackItem  
    total_price: float
    payment_method: str
    buyer_id: UUID
    coupon_code: str = "None"
    type: Optional[str] = "purchase"
     
class Collection:
     name = "trackpayments"
     
