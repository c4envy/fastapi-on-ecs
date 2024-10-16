from typing import List
from redis import Redis
from pydantic import AnyHttpUrl, BaseSettings
import boto3
from botocore.exceptions import ClientError


class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    JWT_SECRET_KEY: str
    JWT_REFRESH_SECRET_KEY: str
    ALGORITHM = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1 * 120  # 2 hours
    REFRESH_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7   # 7 days
    BACKEND_CORS_ORIGINS: List[AnyHttpUrl] = [
        "http://localhost:3000"
    ]
    PROJECT_NAME: str = "MUSICALLY"
    
    # Database
    MONGO_CONNECTION_STRING: str

    # Spotify secrets
    SPOTIPY_CLIENT_ID: str
    SPOTIPY_CLIENT_SECRET: str
    SPOTIPY_REDIRECT_URI: str

    # Apple Music and Tidal secrets
    APPLE_MUSIC_KEY: str
    TIDAL_CLIENT_ID: str
    TIDAL_CLIENT_SECRET: str
    
    # AWS S3 Secrets
    AWS_SERVER_PUBLIC_KEY: str
    AWS_SERVER_SECRET_KEY: str
    AWS_REGION: str
    
    # Stripe Secrets
    STRIPE_SECRET_KEY: str
    
    # Redis Secrets
    REDIS_HOST: str
    REDIS_PORT: str
    REDIS_PASSWORD: str
    REDIS_CLIENT: Redis = None
    
    class Config:
        case_sensitive = True

    @classmethod
    def load_from_parameter_store(cls):
        """Load settings from AWS Parameter Store."""
        client = boto3.client('ssm')
        parameter_names = [
            '/myapp/JWT_SECRET_KEY',
            '/myapp/JWT_REFRESH_SECRET_KEY',
            '/myapp/MONGO_CONNECTION_STRING',
            '/myapp/SPOTIPY_CLIENT_ID',
            '/myapp/SPOTIPY_CLIENT_SECRET',
            '/myapp/SPOTIPY_REDIRECT_URI',
            '/myapp/APPLE_MUSIC_KEY',
            '/myapp/TIDAL_CLIENT_ID',
            '/myapp/TIDAL_CLIENT_SECRET',
            '/myapp/AWS_SERVER_PUBLIC_KEY',
            '/myapp/AWS_SERVER_SECRET_KEY',
            '/myapp/AWS_REGION',
            '/myapp/STRIPE_SECRET_KEY',
            '/myapp/REDIS_HOST',
            '/myapp/REDIS_PORT',
            '/myapp/REDIS_PASSWORD'
        ]

        try:
            # Fetch parameters from AWS Parameter Store with decryption
            response = client.get_parameters(Names=parameter_names, WithDecryption=True)
            parameters = {param['Name']: param['Value'] for param in response['Parameters']}
            
            return cls(
                JWT_SECRET_KEY=parameters.get('/myapp/JWT_SECRET_KEY'),
                JWT_REFRESH_SECRET_KEY=parameters.get('/myapp/JWT_REFRESH_SECRET_KEY'),
                MONGO_CONNECTION_STRING=parameters.get('/myapp/MONGO_CONNECTION_STRING'),
                SPOTIPY_CLIENT_ID=parameters.get('/myapp/SPOTIPY_CLIENT_ID'),
                SPOTIPY_CLIENT_SECRET=parameters.get('/myapp/SPOTIPY_CLIENT_SECRET'),
                SPOTIPY_REDIRECT_URI=parameters.get('/myapp/SPOTIPY_REDIRECT_URI'),
                APPLE_MUSIC_KEY=parameters.get('/myapp/APPLE_MUSIC_KEY'),
                TIDAL_CLIENT_ID=parameters.get('/myapp/TIDAL_CLIENT_ID'),
                TIDAL_CLIENT_SECRET=parameters.get('/myapp/TIDAL_CLIENT_SECRET'),
                AWS_SERVER_PUBLIC_KEY=parameters.get('/myapp/AWS_SERVER_PUBLIC_KEY'),
                AWS_SERVER_SECRET_KEY=parameters.get('/myapp/AWS_SERVER_SECRET_KEY'),
                AWS_REGION=parameters.get('/myapp/AWS_REGION'),
                STRIPE_SECRET_KEY=parameters.get('/myapp/STRIPE_SECRET_KEY'),
                REDIS_HOST=parameters.get('/myapp/REDIS_HOST'),
                REDIS_PORT=parameters.get('/myapp/REDIS_PORT'),
                REDIS_PASSWORD=parameters.get('/myapp/REDIS_PASSWORD'),
            )

        except ClientError as e:
            print(f"Error fetching parameters: {e}")
            raise

# Load settings at runtime
settings = Settings.load_from_parameter_store()
