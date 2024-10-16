import datetime
from fastapi import APIRouter

from app.services.statistics_service import StatisticsService

stats_router = APIRouter()

@stats_router.get('/get_top_artists', summary="Get top artists")
async def get_top_artists():
    return await StatisticsService.fetch_top_artists()

@stats_router.get('/get_top_tracks', summary="Get top tracks")
async def get_top_tracks():
    return await StatisticsService.fetch_top_tracks()

#sample input arg: start_date = datetime(2023, 1, 1)  end_date = datetime(2023, 12, 31)
@stats_router.post('/generate_top_sales', summary="Get top sales")
async def get_top_sales(start_date: datetime.datetime, end_date: datetime.datetime):
    return await StatisticsService.generate_top_sales(start_date, end_date)

# @stats_router.get("/")
# async def read_root():
#     if redis_client:
#         redis_client.incr("visits")
#         visits = redis_client.get("visits")
#         return {"visits": visits}
#     return {"error": "Redis connection not available"}
