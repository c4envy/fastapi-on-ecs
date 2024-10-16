from typing import List
from uuid import UUID
from fastapi import APIRouter, HTTPException, status
from app.core.security import generate_otp
from app.schemas.user_schema import  ResetPasswordRequest, UserAuth, UserOut, UserSearch, UserUpdate
from fastapi import Depends
from app.services.aws_service import send_otp_email
from app.services.user_service import UserService
import pymongo
from app.models.user_model import User
from app.api.deps.user_deps import get_current_user


user_router = APIRouter()

@user_router.post('/create', summary="Create new user", response_model=UserOut)
async def create_user(data: UserAuth):
    try:
        return await UserService.create_user(data)
    except pymongo.errors.DuplicateKeyError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email or username already exist"
        )



@user_router.get('/me', summary='Get details of currently logged in user', response_model=UserOut)
async def get_me(user: User = Depends(get_current_user)):
    return user


@user_router.post('/update/user', summary='Update User', response_model=UserOut)
async def update_user(data: UserUpdate, user: User = Depends(get_current_user)):
    try:
        return await UserService.update_user(user.user_id, data)
    except pymongo.errors.OperationFailure:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User does not exist"
        )
        
# @user_router.put('/update/merchant', summary='Update Merchant Profile', response_model=UserOut)
# async def update_merchant_profile(data: MerchantUpdate, user: User = Depends(get_current_user)):
#     try:
#         return await UserService.update_merchant_profile(user.user_id, data)
#     except pymongo.errors.OperationFailure:
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail="Merchant Profile does not exist"
#         )
        
# @user_router.put('/update/artist', summary='Update Artist Profile', response_model=UserOut)
# async def update_artist_profile(data: ArtistUpdate, user: User = Depends(get_current_user)):
#     try:
#         return await UserService.update_artist_profile(user.user_id, data)
#     except pymongo.errors.OperationFailure:
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail="Artist Profile does not exist"
#         )
        
# @user_router.put('/update/fan', summary='Update Fan Profile', response_model=UserOut)
# async def update_fan_profile(data: FanUpdate, user: User = Depends(get_current_user)):
#     try:
#         return await UserService.update_fan_profile(user.user_id, data)
#     except pymongo.errors.OperationFailure:
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail="Fan Profile does not exist"
#         )
                
# @user_router.post('/artist/{id}', summary='Get Artist Profile', response_model=UserOut)
# async def get_artist_profile(id: UUID):
#     try:
#         return await UserService.get_artist_profile(id)
#     except pymongo.errors.OperationFailure:
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail="Artist Profile does not exist"
#         )
        
# @user_router.post('/merchant/{uuid}', summary='Get Merchant Profile', response_model=UserOut)
# async def get_merchant_profile(uuid: UUID):
#     try:
#         return await UserService.get_merchant_profile(uuid)
#     except pymongo.errors.OperationFailure:
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail="Merchant Profile does not exist"
#         )
        
@user_router.post('/search/user', summary="Search for user or users by multiple criterias", response_model=List[UserOut])
async def search_for_user(data: UserSearch):
    return await UserService.search_for_user(data)

@user_router.get('/top/artists', summary="Get top artists", response_model=List[UserOut])
async def get_top_artists():
    return await UserService.retrieve_top_artists()

@user_router.get('/save/artist/art/s3/', summary="Save an artist's image to S3")
async def save_artist_to_s3(url: str, artist: str):
    return await UserService.save_artist_art_on_s3(url, artist)

@user_router.post('/reset/password', summary="Reset Password")
async def reset_password(input: ResetPasswordRequest):
    return await UserService.reset_password(input)

@user_router.get('/get/user/{id}', summary="Get user by id", response_model=UserOut)
async def get_user_by_id(id: UUID):
    return await UserService.get_user_by_id(id)

@user_router.get('/verify/user_email/{email}', summary="Verify email address exists", response_model=bool)
async def verify_email(email: str):
    user = await UserService.get_user_by_email(email)
    if user:
        otp = generate_otp(user.secret)
        print(f"The Generated OTP IS: {otp}")
        await send_otp_email(user, otp)
        return True
    # Raise an HTTP exception with 401 status code for invalid TOTP
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="USER WITH EMAIL ADDRESS NOT FOUND"
    )