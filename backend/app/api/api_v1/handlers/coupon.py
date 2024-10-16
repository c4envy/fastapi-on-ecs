from datetime import datetime
from uuid import UUID
from fastapi import APIRouter
from app.models.coupon_model import Coupon
from app.schemas.coupon_schema import CreateCoupon
from app.services.coupon_service import CouponService


coupon_router = APIRouter()

@coupon_router.get('/get/all', summary="Get all coupons",response_model=list[Coupon])
async def get_coupons():
    return await CouponService.get_all_coupons()

@coupon_router.get('/get_coupon_by_id/{coupon_id}', summary="Get coupon by id",response_model=Coupon)
async def get_coupon(coupon_id: UUID):
    return await CouponService.get_coupon_by_id(coupon_id)


@coupon_router.get('/get_coupon_by_code/{coupon_code}', summary="Get coupon by code",response_model=Coupon)
async def get_coupon_by_code(coupon_code: str):
    return await CouponService.get_coupon_by_code(coupon_code)

@coupon_router.post('/create/coupon', summary="Create a coupon",response_model=Coupon)
async def create_coupon(data: Coupon):
    return await CouponService.create_coupon(data)

@coupon_router.put('/update/coupon/{coupon_id}', summary="Update a coupon",response_model=Coupon)
async def update_coupon(coupon_id: UUID, data: CreateCoupon):
    return await CouponService.update_coupon(coupon_id, data)

@coupon_router.delete('/delete/coupon/{coupon_id}', summary="Delete a coupon",response_model=str)
async def delete_coupon(coupon_id: UUID):
    return await CouponService.delete_coupon(coupon_id)

@coupon_router.put('/disable/coupon/{coupon_id}', summary="Disable a coupon",response_model=Coupon)
async def disable_coupon(coupon_id: UUID):
    return await CouponService.disable_coupon(coupon_id)

@coupon_router.put('/enable/coupon/{coupon_id}', summary="Enable a coupon",response_model=Coupon)
async def enable_coupon(coupon_id: UUID):
    return await CouponService.enable_coupon(coupon_id)

@coupon_router.post('/use/coupon/{coupon_id}', summary="Use a coupon", response_model=Coupon)
async def use_coupon(coupon_id: UUID):
    return await CouponService.use_coupon(coupon_id)

@coupon_router.get('/coupon/used', summary="Get all used coupons", response_model=list[Coupon])
async def get_used_coupons():
    return await CouponService.get_used_coupons()

@coupon_router.get('/coupon/unused', summary="Get all unused coupons", response_model=list[Coupon])
async def get_unused_coupons():
    return await CouponService.get_unused_coupons()

@coupon_router.get('/coupon/disabled', summary="Get all disabled coupons", response_model=list[Coupon])
async def get_disabled_coupons():
    return await CouponService.get_disabled_coupons()

@coupon_router.get('/coupons/range/num_of_uses/{min_uses}/{max_uses}', summary="Get number of coupons", response_model=int)
async def get_coupons_num_of_uses(min_uses: int, max_uses: int):
    return await CouponService.get_coupons_by_num_of_uses_range(min_uses, max_uses)

@coupon_router.get('/coupons/range/discount/{min_discount}/{max_discount}', summary="Get number of coupons",response_model=int)
async def get_coupons_discount_range(min_discount: float, max_discount: float):
    return await CouponService.get_coupons_by_discount_range(min_discount, max_discount)

@coupon_router.get('/coupons/range/exp_date/{start_date}/{end_date}', summary="Get number of coupons",response_model=int)
async def get_coupons_by_expiration_date_range(start_date: datetime, end_date: datetime):
    return await CouponService.get_coupons_by_expiration_date_range(start_date, end_date)

