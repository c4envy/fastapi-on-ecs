from datetime import datetime
from pickletools import pylong
from typing import Optional
from uuid import UUID

from fastapi import HTTPException
from app.models.coupon_model import Coupon
from app.schemas.coupon_schema import CreateCoupon


class CouponService:
    @staticmethod
    async def get_coupon_by_code(code: str) -> Optional[Coupon]:
        coupon = await Coupon.find_one(Coupon.coupon_code == code)
        return coupon

    @staticmethod
    async def get_coupon_by_id(id: UUID) -> Optional[Coupon]:
        coupon = await Coupon.find_one(Coupon.coupon_id == id)
        return coupon

    @staticmethod
    async def get_all_coupons() -> list[Coupon]:
        coupons = await Coupon.all()
        return coupons

    @staticmethod
    async def create_coupon(data: Coupon) -> Coupon:
        coupon = await Coupon.insert_one(data)
        return coupon

    @staticmethod
    async def update_coupon(id: UUID, data: CreateCoupon) -> Coupon:
        coupon = await Coupon.find_one(Coupon.coupon_id == id)
        if not coupon:
            raise pylong.errors.OperationFailure("Coupon not found")
        
        await coupon.update({"$set": data.dict(exclude_unset=True)})
        return coupon

    @staticmethod
    async def delete_coupon(id: UUID) -> None:
        coupon = await Coupon.find_one(Coupon.coupon_id == id)
        if not coupon:
            raise pylong.errors.OperationFailure("Coupon not found")
        await coupon.delete()
        return "Coupon deleted"

    @staticmethod
    async def disable_coupon(id: UUID) -> Coupon:
        coupon = await Coupon.find_one(Coupon.coupon_id == id)
        if not coupon:
            raise pylong.errors.OperationFailure("Coupon not found")
        
        await coupon.update({"$set": {"disabled": True}})
        return coupon

    @staticmethod
    async def enable_coupon(id: UUID) -> Coupon:
        coupon = await Coupon.find_one(Coupon.coupon_id == id)
        if not coupon:
            raise pylong.errors.OperationFailure("Coupon not found")
        
        await coupon.update({"$set": {"disabled": False}})
        return coupon

    @staticmethod
    async def use_coupon(id: UUID, user_id: UUID) -> "Coupon":
        coupon = await Coupon.find_one(Coupon.coupon_id == id)
        
        if not coupon:
            raise HTTPException(status_code=404, detail="Coupon not found")
        
        if user_id in coupon.used_by:
            raise HTTPException(status_code=400, detail="User has already used this coupon")
        
        if user_id in coupon.exclusion_list:
            raise HTTPException(status_code=400, detail="User is excluded from using this coupon")
        
        # if coupon.num_of_uses >= coupon.max_uses:
        #     raise HTTPException(status_code=400, detail="Coupon has reached maximum uses")
        
        # Update the coupon in the database
        await coupon.update(
            {"$push": {"used_by": user_id}, "$inc": {"num_of_uses": 1}, "$push": {"exclusion_list": user_id}}
        )    
        return coupon
    
    @staticmethod
    async def get_coupons_by_user(user_id: UUID) -> list[Coupon]:
        coupons = await Coupon.find(Coupon.used_by == user_id)
        return coupons

    @staticmethod
    async def get_coupons_by_exclusion_list(exclusion_list: list[str]) -> list[Coupon]:
        coupons = await Coupon.find(Coupon.exclusion_list == exclusion_list)
        return coupons

    @staticmethod
    async def get_coupons_by_discount(discount: float) -> list[Coupon]:
        coupons = await Coupon.find(Coupon.discount == discount)
        return coupons

    @staticmethod
    async def get_coupons_by_type(coupon_type: str) -> list[Coupon]:
        coupons = await Coupon.find(Coupon.coupon_type == coupon_type)
        return coupons

    @staticmethod
    async def get_coupons_by_expiration_date(expiration_date: datetime) -> list[Coupon]:
        coupons = await Coupon.find(Coupon.expiration_date == expiration_date)
        return coupons

    @staticmethod
    async def get_coupons_by_num_of_uses(num_of_uses: int) -> list[Coupon]:
        coupons = await Coupon.find(Coupon.num_of_uses == num_of_uses)
        return coupons

    @staticmethod
    async def get_enabled_coupons(enabled: bool) -> list[Coupon]:
        coupons = await Coupon.find(Coupon.disabled == enabled)
        return coupons

    @staticmethod
    async def get_unexpired_coupons(expired: bool) -> list[Coupon]:
        coupons = await Coupon.find(Coupon.expiration_date > datetime.now())
        return coupons

    @staticmethod
    async def get_used_coupons(used: bool) -> list[Coupon]:
        coupons = await Coupon.find(Coupon.num_of_uses > 0)
        return coupons

    @staticmethod
    async def get_expired_coupons(expired: bool) -> list[Coupon]:
        coupons = await Coupon.find(Coupon.expiration_date < datetime.now())
        return coupons

    @staticmethod
    async def get_unused_coupons(unused: bool) -> list[Coupon]:
        coupons = await Coupon.find(Coupon.num_of_uses == 0)
        return coupons

    @staticmethod
    async def get_disabled_coupons(disabled: bool) -> list[Coupon]:
        coupons = await Coupon.find(Coupon.disabled == disabled)
        return coupons

    @staticmethod
    async def get_coupons_by_discount_range(min_discount: float, max_discount: float) -> list[Coupon]:
        coupons = await Coupon.find(Coupon.discount >= min_discount, Coupon.discount <= max_discount)
        return coupons

    @staticmethod
    async def get_coupons_by_num_of_uses_range(min_uses: int, max_uses: int) -> list[Coupon]:
        coupons = await Coupon.find(Coupon.num_of_uses >= min_uses, Coupon.num_of_uses <= max_uses)
        return coupons

    @staticmethod
    async def get_coupons_by_expiration_date_range(start_date: datetime, end_date: datetime) -> list[Coupon]:
        coupons = await Coupon.find(Coupon.expiration_date >= start_date, Coupon.expiration_date <= end_date)
        return coupons

    @staticmethod
    async def get_coupons_by_discount_range_and_num_of_uses_range(min_discount: float, max_discount: float, min_uses: int, max_uses: int) -> list[Coupon]:
        coupons = await Coupon.find(Coupon.discount >= min_discount, Coupon.discount <= max_discount, Coupon.num_of_uses >= min_uses, Coupon.num_of_uses <= max_uses)
        return coupons

    @staticmethod
    async def get_coupons_by_discount_range_and_expiration_date_range(min_discount: float, max_discount: float, start_date: datetime, end_date: datetime) -> list[Coupon]:
        coupons = await Coupon.find(Coupon.discount >= min_discount, Coupon.discount <= max_discount, Coupon.expiration_date >= start_date, Coupon.expiration_date <= end_date)
        return coupons



