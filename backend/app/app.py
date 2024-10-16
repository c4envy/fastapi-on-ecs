import logging
from beanie import init_beanie
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from app.api.api_v1.router import router
from app.core.config import settings
from app.models.coupon_model import Coupon
from app.models.trackpayment_model import TrackPayment
from app.models.transaction_model import Transaction
from app.models.user_model import User
from app.models.music_model import Music
from app.models.statistics_model import Statistics
from app.core.config import settings
from app.services.redis_service import redis_client_instance as RedisClient


app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def app_init():
    await RedisClient.connect()
    
    db_client = AsyncIOMotorClient(settings.MONGO_CONNECTION_STRING).musically
    
    await init_beanie(
        database=db_client,
        document_models= [
            User,
            Music,
            Statistics,
            Transaction,
            Coupon,
            TrackPayment
        ]
    )
    
@app.on_event("shutdown")
async def shutdown_event():
    if settings.REDIS_CLIENT:
        await RedisClient.close()
        print("Redis connection closed")
        logging.info("Redis connection closed")
        
    
app.include_router(router, prefix=settings.API_V1_STR)


if __name__ == "__app__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)

