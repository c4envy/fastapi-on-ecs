from typing import List
from fastapi import APIRouter
from app.services.tidal_service import TidalService


tidal_router = APIRouter()

@tidal_router.get('/artist/{id}/{countryCode}', summary="Get artist by id")
async def get_artist_by_id(id: str, countryCode: str):
    return await TidalService.get_artist_by_id(id, countryCode)

@tidal_router.post('/artists/{countryCode}/', summary="Get artists by id")
async def get_artists_by_id(countryCode: str, ids: list[str] = None):
    return await TidalService.get_artists(ids, countryCode)

@tidal_router.get('/track/{id}/{countryCode}', summary="Get track by id")
async def get_track_by_id(id: str, countryCode: str):
    return await TidalService.get_track(id, countryCode)

@tidal_router.post('/tracks/{countryCode}/', summary="Get tracks by id")
async def get_tracks_by_id(countryCode: str, ids: list[str] = None):
    return await TidalService.get_tracks(ids, countryCode)

@tidal_router.get('/album/{id}/{countryCode}', summary="Get album by id")
async def get_album_by_id(id: str, countryCode: str):
    return await TidalService.get_album(id, countryCode)

@tidal_router.post('/albums/{countryCode}/', summary="Get albums by id")
async def get_albums_by_id(countryCode: str, ids: list[str] = None):
    return await TidalService.get_albums(ids, countryCode)

@tidal_router.get('/album/items/{id}/{countryCode}', summary="Get album items by id")   
async def get_album_items_by_id(id: str, countryCode: str):
    return await TidalService.get_album_items(id, countryCode)
  
