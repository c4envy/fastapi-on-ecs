from datetime import datetime
from uuid import UUID
from pydantic import BaseModel


class CreateCoupon(BaseModel):
    coupon_code: str
    coupon_type: str
    discount: float
    expiration_date: datetime
    exclusion_list: list[str] = []
    used_by: list[UUID] = []
    num_of_uses: int = 0
    disabled: bool = False