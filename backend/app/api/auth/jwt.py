from datetime import datetime
from uuid import UUID
from venv import logger
from fastapi import APIRouter, Depends, HTTPException, status, Body
from fastapi.security import OAuth2PasswordRequestForm
from typing import Any
from app.services import aws_service
from app.services.user_service import UserService
from app.core.security import create_access_token, create_refresh_token, generate_otp, generate_qr_code, verify_otp_code
from app.schemas.auth_schema import TokenSchema
from app.schemas.user_schema import LoginOTP, UserOut, UserUpdate
from app.models.user_model import User
from app.api.deps.user_deps import get_current_user, logout
from app.core.config import settings
from app.schemas.auth_schema import TokenPayload
from pydantic import ValidationError
from jose import jwt
from fastapi.responses import FileResponse, JSONResponse
import asyncio
from twilio.rest import Client



auth_router = APIRouter()
MAX_RETRIES = 10
OTP_VERIFICATION_TIMEOUT = 60.0 * 10  # 10 minutes

@auth_router.post('/login', summary="Create access and refresh tokens for user", response_model=TokenSchema)
async def login(form_data: OAuth2PasswordRequestForm = Depends()) -> Any:
    user = await UserService.authenticate(email=form_data.username, password=form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect email or password"
        ) 
    
    await UserService.update_user_last_login(user.user_id)
    await UserService.update_user_retry(user.user_id, 0)
    return {
        "access_token": create_access_token(user.user_id),
        "refresh_token": create_refresh_token(user.user_id),
    }


@auth_router.post('/login_otp', summary="Create access and refresh tokens for user", response_model=LoginOTP)
async def login(form_data: OAuth2PasswordRequestForm = Depends()) -> Any:
    user = await UserService.authenticate(email=form_data.username, password=form_data.password)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect email or password"
        )
        
    await UserService.update_user_last_login(user.user_id)
    await UserService.update_user_retry(user.user_id, 0)
    
    if user:
        # awaiting two factor authentication
        resp = LoginOTP(user_id=user.user_id, email=user.email, phone='3343343334', status_code="200", message="User authentication successfull. Send OTP to user")
        return resp
   
           
@auth_router.post('/test-token', summary="Test if the access token is valid", response_model=UserOut)
async def test_token(user: User = Depends(get_current_user)):
    return user


@auth_router.post('/refresh', summary="Refresh token", response_model=TokenSchema)
async def refresh_token(refresh_token: str = Body(...)):
    try:
        payload = jwt.decode(
            refresh_token, settings.JWT_REFRESH_SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        token_data = TokenPayload(**payload)
    except (jwt.JWTError, ValidationError):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    user = await UserService.get_user_by_id(token_data.sub)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invalid token for user",
        )
    return {
        "access_token": create_access_token(user.user_id),
        "refresh_token": create_refresh_token(user.user_id),
    }
    
    
# @auth_router.post('/logout', summary="Logout user")
# async def logout_user(current_user: User = Depends(get_current_user), logout: bool = Depends(logout)):
#     print("user is :", current_user)
#     current_user.isUserOTPVerified = False
#     current_user.save()
#     return logout

@auth_router.post('/logout', summary="Logout user")
async def logout_user(email: str, logout: bool = Depends(logout)):
    user = await UserService.get_user_by_email(email)
    user.isUserOTPVerified = False
    await user.save()
    return logout
    
    
# @auth_router.post('/generate/qr-code', summary="Generate QR code")
# async def get_qr_code(app_name: str, company_name: str, current_user: User = Depends(get_current_user)):
#     qr = generate_qr_code(current_user.secret, app_name, company_name)
#     return qr

@auth_router.post('/generate/otp', summary="Generate OTP")
async def get_otp(current_user: User = Depends(get_current_user)):
    otp = generate_otp(current_user.secret)
    return otp

@auth_router.post('/send/otp', summary="Send OTP")
async def send_otp(user_id: UUID, email: str = None, sms: str = None):
    user = await UserService.get_user_by_id(user_id)
    
    try:
        otp = generate_otp(user.secret)
        print(f" The OTP is: {otp}")
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
                            detail=f"Failed to generate or send OTP: {str(e)}")
        
    # Send OTP to the user's preferred method (email or SMS)
    if email:
        try:
            await aws_service.send_otp_email(user,otp)
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                                detail=f"Failed to generate or send OTP: {str(e)}")
        return {"message": "OTP email sent successfully"}
    # Send sms using twillio
    elif sms:
        # twillio sms integration coming soon
        client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
        message = client.messages.create (
        body= f"Your one time code. Please enter it before it expires.{otp}",
        from_='+18888595605',
        to=sms,
        # media_url=['https://example.com/image.jpg']
        )
        print(f"Message SID: {message.sid}")
        return {"message": "OTP SMS sent successfully"} 
    # If the request is not for email or SMS, return an error
    else:
        return {"message": "Invalid request"}


@auth_router.post('/verify/otp/{user_id}/{otp}', summary="Verify OTP", response_model=TokenSchema)
async def verify_otp(otp: str, user_id: UUID):   
    user = await UserService.get_user_by_id(user_id)
    
    # Check if the user has exceeded the max retry limit
    if user.otp_retry_count >= MAX_RETRIES:
        logger.info(f"User {user.email} has exceeded the maximum retry limit of {MAX_RETRIES}.")
        logger.info(f"user retry count: {user.otp_retry_count}")
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=f"Maximum retry limit of {MAX_RETRIES} reached. Please request a new OTP."
        )
    
    result = verify_otp_code(user.secret, otp)
    
    if result == True:
        if not user.isEmailVerified:
            user.isEmailVerified = True 
        user.isUserOTPVerified = True
        # await user.save()
        await user.update({"$set": {"isEmailVerified": "True", "isUserOTPVerified": "True"}})
        # Reset the retry count upon successful verification
        updated_count = 0
        await UserService.update_user_retry(user_id, updated_count)
        logger.info(f"User {user.email} has successfully verified their OTP.")
        return {
            "access_token": create_access_token(user.user_id),
            "refresh_token": create_refresh_token(user.user_id),
        }
  
    else:
        updated_count = user.otp_retry_count + 1
        await UserService.update_user_retry(user_id, updated_count)
        remaining_retries = MAX_RETRIES - updated_count
        logger.info(f"user otp retry count: {updated_count}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid OTP. You have {remaining_retries} retries left."
        )
        
@auth_router.post('/test-otp/{otp}/{secret}', summary="Test OTP")
async def test_otp(otp: str, secret: str):
    result = verify_otp_code(secret, otp)
    return result

@auth_router.post('/generate-totp', summary="Generate TOTP")
async def generate_user_totp(secret: str):
    totp = generate_otp(secret)
    return totp

@auth_router.post('/verify/totp/{totp}/{email}', summary="Verify TOTP")
async def verify_user_totp(totp: str, email: str):
    user = await UserService.get_user_by_email(email)
    print(f"user secret is: {user.secret}")
    result = verify_otp_code(user.secret, totp)
    if result:
        return JSONResponse(status_code=status.HTTP_200_OK, content={"message": "User is verified"})
    # Raise an HTTP exception with 401 status code for invalid TOTP
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid TOTP"
    )

@auth_router.get("/qr-code" , summary="Get QR Code")
async def get_qr_code( current_user: User = Depends(get_current_user)):
    # Generate the QR code and get the file path
    file_name = "qrcode.png"
    generate_qr_code(current_user.secret, current_user.email, "BeatStake Music Platform", file_name)

    # Return the PNG file as a response
    return FileResponse(file_name, media_type='image/png', filename="qrcode.png")