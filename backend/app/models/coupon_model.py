from pydantic import BaseModel, Field
from typing import List
from uuid import UUID, uuid4
from datetime import datetime
from bson import ObjectId
from beanie import Document

class Coupon(Document):
    coupon_id: UUID = Field(default_factory=uuid4, unique=True)
    coupon_code: str
    coupon_type: str
    discount: float
    max_uses: int = 1
    expiration_date: datetime
    created_at: datetime = Field(default_factory=datetime.utcnow)
    exclusion_list: List[str] = Field(default_factory=list)
    used_by: List[UUID] = Field(default_factory=list)
    num_of_uses: int = 0
    disabled: bool = False
    
    @property
    def create(self) -> datetime:
        # Assuming you're storing this document in a MongoDB collection, the `id` attribute
        # is typically an ObjectId which includes a timestamp of when the document was created.
        if isinstance(self.id, ObjectId):
            return self.id.generation_time
        return self.created_at

    @classmethod
    async def by_code(cls, code: str) -> "Coupon":
        # This method fetches a coupon by its code.
        return await cls.find_one(cls.coupon_code == code)
    
    class Collection:
        name = "coupons"
