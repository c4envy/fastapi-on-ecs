from fastapi import APIRouter, HTTPException, status
from app.schemas.user_schema import ArtistOut, ArtistUpdate, MerchantOut, MerchantUpdate, UserAuth, UserOut, UserUpdate
from fastapi import Depends
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
        
@user_router.post('/update/merchant_profile', summary='Update Merchant Profile', response_model=MerchantOut)
async def update_merchant_profile(data: MerchantUpdate, user: User = Depends(get_current_user)):
    try:
        return await UserService.update_merchant_profile(user.user_id, data)
    except pymongo.errors.OperationFailure:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Merchant Profile does not exist"
        )
        
@user_router.post('/update/artist_profile', summary='Update Artist Profile', response_model=ArtistOut)
async def update_artist_profile(data: ArtistUpdate, user: User = Depends(get_current_user)):
    try:
        return await UserService.update_artist_profile(user.user_id, data)
    except pymongo.errors.OperationFailure:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Artist Profile does not exist"
        )

##Create a function for deleting user 
##Create a function for banning user
##Create a function for making user account inactive? maybe already created by oauth sign in 