# import logging
# from redis import ConnectionPool, Redis
# from app.core.config import settings


# class RedisClient:
 
#     def __init__(self):
#         self.redis_client = None
#         self.pool = None
    
#     def connect(self):
#         try:
#             # Initialize the connection pool for Redis
#             self.pool = ConnectionPool(
#                 host=settings.REDIS_HOST,
#                 port=settings.REDIS_PORT,
#                 password=settings.REDIS_PASSWORD,
#                 decode_responses=True  # This allows the responses to be returned as strings instead of bytes
#             )
#             self.redis_client = Redis(connection_pool=self.pool)
#             settings.REDIS_CLIENT = self.redis_client

#             # Test the connection
#             self.redis_client.ping()

#             logging.info("Redis connection established")
#             print("Redis connection established")
        
#         except ConnectionError as e:
#             settings.REDIS_CLIENT = None
#             logging.error(f"Failed to connect to Redis: {e}")
#             print(f"Failed to connect to Redis: {e}")
            
#     def get_client(self) -> Redis:
#         if self.redis_client:
#             return self.redis_client
#         else:
#             logging.error("Redis client is not connected")
#             raise ConnectionError("Redis client is not connected")
    
#     @staticmethod
#     def close(self):
#         if self.pool:
#             self.pool.disconnect()
#             logging.info("Redis connection pool closed")
#             print("Redis connection pool closed")
#         else:
#             logging.warning("Redis connection pool was not established")


# # Usage Example:
# redis_client_instance = RedisClient()

# async def startup_redis():
#     redis_client_instance.connect()

# async def shutdown_redis():
#     redis_client_instance.close()


import logging
import aioredis
from aioredis import Redis
from app.core.config import settings


class RedisClient:
    def __init__(self):
        self.redis_client: Redis = None

    async def connect(self):
        try:
            # Initialize the connection pool for Redis asynchronously
            redis_url = f"redis://{settings.REDIS_HOST}:{settings.REDIS_PORT}"
            self.redis_client = await aioredis.from_url(
                redis_url,
                password=settings.REDIS_PASSWORD,
                encoding="utf-8",
                decode_responses=True  # This allows the responses to be returned as strings instead of bytes
            )
            settings.REDIS_CLIENT = self.redis_client

            # Test the connection
            await self.redis_client.ping()

            logging.info("Redis connection established")
            print("Redis connection established")
        
        except Exception as e:
            settings.REDIS_CLIENT = None
            logging.error(f"Failed to connect to Redis: {e}")
            print(f"Failed to connect to Redis: {e}")

    def get_client(self) -> Redis:
        if self.redis_client:
            return self.redis_client
        else:
            logging.error("Redis client is not connected")
            raise ConnectionError("Redis client is not connected")

    async def close(self):
        if self.redis_client:
            await self.redis_client.close()
            logging.info("Redis connection closed")
            print("Redis connection closed")
        else:
            logging.warning("Redis connection was not established")


# Usage Example:
redis_client_instance = RedisClient()

async def startup_redis():
    await redis_client_instance.connect()

async def shutdown_redis():
    await redis_client_instance.close()
