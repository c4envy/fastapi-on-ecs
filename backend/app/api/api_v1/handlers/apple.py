from fastapi import APIRouter
from app.services.apple_music_service import AppleMusicService


apple_router = APIRouter()

@apple_router.get('/artist/{storefront}/{id}', summary="Get artist by id")
async def get_artist_by_id(storefront: str, id: str):
    return await AppleMusicService.get_artist(id, storefront)

@apple_router.post('/artists/{storefront}/', summary="Get artists by id")       
async def get_artists_by_id(storefront: str, ids: list[str] = None):
    return await AppleMusicService.get_artists(ids, storefront)

@apple_router.get('/song/{storefront}/{id}', summary="Get song by id")
async def get_song_by_id(storefront: str, id: str):
    return await AppleMusicService.get_song(id, storefront)

@apple_router.post('/songs/{storefront}/', summary="Get songs by id")       
async def get_songs_by_id(storefront: str, ids: list[str] = None):
    return await AppleMusicService.get_songs(ids, storefront)

@apple_router.get('/album/{storefront}/{id}', summary="Get album by id")
async def get_album_by_id(storefront: str, id: str):
    return await AppleMusicService.get_album(id, storefront)

@apple_router.post('/albums/{storefront}/', summary="Get albums by id")
async def get_albums_by_id(storefront: str, ids: list[str] = None):
    return await AppleMusicService.get_albums(ids, storefront)


