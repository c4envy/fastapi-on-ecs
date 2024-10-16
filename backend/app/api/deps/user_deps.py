from asyncio.log import logger
from datetime import datetime
import logging
from fastapi import Depends, HTTPException, status
from fastapi.params import Header
from fastapi.security import OAuth2PasswordBearer
from app import app
from app.core.config import settings
from app.models.user_model import User
from jose import jwt, JWTError
from pydantic import ValidationError
# from app.services import redis_service
from app.services.user_service import UserService
from app.schemas.auth_schema import TokenPayload
from app.services.redis_service import redis_client_instance as RedisClient



reuseable_oauth = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_STR}/auth/login",
    scheme_name="JWT"
)


async def get_current_user(token: str = Depends(reuseable_oauth)) -> User:
    
    try:
         # Ensure that token is a string, not a User object
        if not isinstance(token, str):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid token format",
            )
            
        # Check if the token is blacklisted
        await verify_token_not_blacklisted(token)
        
        payload = jwt.decode(
            token, settings.JWT_SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        token_data = TokenPayload(**payload)
        
        if datetime.fromtimestamp(token_data.exp) < datetime.now():
            raise HTTPException(
                status_code = status.HTTP_401_UNAUTHORIZED,
                detail="Token expired",
                headers={"WWW-Authenticate": "Bearer"},
            )
    except(jwt.JWTError, ValidationError):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    user = await UserService.get_user_by_id(token_data.sub)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Could not find user",
        )   
    return user

async def logout(token: str = Depends(reuseable_oauth)): 
    await RedisClient.connect()
    redis_client_instance = RedisClient.get_client()  
    try:
        # Ensure that token is a string, not a User object
        if not isinstance(token, str):
            print(token)
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid token format",
            )
            
        # Decode the token to get its expiration time
        payload = jwt.decode(
            token, settings.JWT_SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        token_data = TokenPayload(**payload)
        
        # Calculate how long until the token expires
        expires_delta = datetime.fromtimestamp(token_data.exp) - datetime.now()
        
        # Add the token to a blacklist in Redis
        # The key will automatically expire when the token becomes invalid
        redis_client_instance.setex(f"blacklist_token:{token}", int(expires_delta.total_seconds()), "true")
        await redis_client_instance.close()
        return {"message": "Successfully logged out"}
    except (jwt.JWTError, ValidationError):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid token",
        )


async def verify_token_not_blacklisted(token: str = Depends(reuseable_oauth)):
    await RedisClient.connect()
    redis_client_instance = RedisClient.get_client()
    
    if redis_client_instance is not None:
        is_blacklisted = await redis_client_instance.get(f"blacklist_token:{token}")
        if is_blacklisted:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token has been revoked",
                headers={"WWW-Authenticate": "Bearer"},
            )
        logging.info("Token is not blacklisted")
        await redis_client_instance.close()
        return "Token is not blacklisted"
    else:
            logging.error("Redis client is not initialized.")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Internal server error",
            )

