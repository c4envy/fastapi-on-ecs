from typing import List
from redis import Redis
from decouple import config
from pydantic import AnyHttpUrl, BaseSettings


class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    JWT_SECRET_KEY: str = config("JWT_SECRET_KEY", cast=str)
    JWT_REFRESH_SECRET_KEY: str = config("JWT_REFRESH_SECRET_KEY", cast=str)
    ALGORITHM = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1 * 120  # 2 minutes
    REFRESH_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7   # 7 days
    BACKEND_CORS_ORIGINS: List[AnyHttpUrl] = [
        "http://localhost:3000"
    ]
    PROJECT_NAME: str = "MUSICALLY"
    
    # Database
    MONGO_CONNECTION_STRING: str = config("MONGO_CONNECTION_STRING", cast=str)

    #Spotify secrets
    SPOTIPY_CLIENT_ID: str = config("SPOTIPY_CLIENT_ID", cast=str)
    SPOTIPY_CLIENT_SECRET: str = config("SPOTIPY_CLIENT_SECRET", cast=str)
    SPOTIPY_REDIRECT_URI: str = config("SPOTIPY_REDIRECT_URI", cast=str)

    APPLE_MUSIC_KEY: str = config("APPLE_MUSIC_KEY", cast=str)
    TIDAL_CLIENT_ID: str = config("TIDAL_CLIENT_ID", cast=str)
    TIDAL_CLIENT_SECRET: str = config("TIDAL_CLIENT_SECRET", cast=str)
    
    #AWS S3 SECRETS
    AWS_SERVER_PUBLIC_KEY: str = config("AWS_SERVER_PUBLIC_KEY", cast=str)
    AWS_SERVER_SECRET_KEY: str = config("AWS_SERVER_SECRET_KEY", cast=str)
    AWS_REGION: str = config("AWS_REGION", cast=str)
    
    #STRIPE SECRETS
    STRIPE_SECRET_KEY: str = config("STRIPE_SECRET_KEY", cast=str)
    
    #REDIS SECRETS
    REDIS_HOST: str = config("REDIS_HOST", cast=str)
    REDIS_PORT: str = config("REDIS_PORT", cast=str)
    REDIS_PASSWORD: str = config("REDIS_PASSWORD", cast=str)
    REDIS_CLIENT : Redis = None
    
    #CLOUDINARY SECRETS
    CLOUDFRONT_BASE_URL: str = config("CLOUDFRONT_BASE_URL", cast=str)
    
    #TWILIO SECRETS
    TWILIO_ACCOUNT_SID: str = config("TWILIO_ACCOUNT_SID", cast=str)
    TWILIO_AUTH_TOKEN: str = config("TWILIO_AUTH_TOKEN", cast=str)
    class Config:
        case_sensitive = True
        
settings = Settings()
