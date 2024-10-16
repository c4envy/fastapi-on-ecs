from typing import List
from app.services.spotify_service import SpotifyService
from fastapi import APIRouter

spotify_router = APIRouter()

@spotify_router.get('/image/artist/{artist_name}', summary="Get an artist's image usign the artist's name.")
async def get_artist_image_by_name(artist_name: str):
    return await SpotifyService.get_artist_image_by_name(artist_name)

@spotify_router.get('/artist/{name}', summary="Get artist by name")
async def get_artist_by_name(name: str):
    return await SpotifyService.get_artist_by_name(name)


# @spotify_router.get('/artist/{urn}', summary="Get artist by urn id")
# async def get_artist_by_urn(urn: str):
#     return await SpotifyService.get_artist_by_urn(urn)

# @spotify_router.get('/album/{urn}', summary="Get album by urn id")
# async def get_albumb_urn(urn: str):
#     return await SpotifyService.show_album_by_urn(urn)

@spotify_router.get('/albums/{artist}', summary="Get all the albums of an artist", response_model=str)
async def get_artist_by_name(artist: str):
    return await SpotifyService.show_artist_albums(artist)

@spotify_router.get("/track/{track_id}", summary="Get a track by spotify ID. URL, or URI")
async def get_track(track_id: str):
    return await SpotifyService.get_track(track_id)

@spotify_router.post("/track_ids/", summary="Get multiple tracks by spotify ID. URL, or URI")
async def get_track(track_ids: list[str] = None):
    return await SpotifyService.get_tracks(track_ids)

@spotify_router.get("/album/tracks/{album_id}", summary="Get a tracks by spotify ID. URL, or URI")
async def get_album_tracks(album_id: str):
    return await SpotifyService.get_album_tracks(album_id)

@spotify_router.get("/artist_info/{artist_Id}", summary="Get an artist's info by spotify ID, URL, or URI")  
async def get_artist_by_urn(artist_Id: str):
    return await SpotifyService.get_artist_by_urn(artist_Id)




# @spotify_router.get("/top/tracks/", summary="Get a tracks by spotify ID. URL, or URI", response_model=List)
# async def get_track():
#     top_tracks = ['36tVdsRWDbPBekxVYEWhph','0nbXyq5TXYPCO7pr3N8S4I','1ZHYJ2Wwgxes4m8Ba88PeK', '3DK6m7It6Pw857FcQftMds','7y8oNMMKf0E7pgDeRGbsDf',
#     '27H75QUZMb6C0vNfN3T370','0X6KeoX1HANrLI20m4Hc1V','0LWo1USV7wlguM1Y3RePOM','42VsgItocQwOQC3XWZ8JNA','0fX4oNGBWO3dSGUZcVdVV2']
#     return await SpotifyService.get_tracks(top_tracks)


# @spotify_router.get("/top/artists/", summary="Get artists by spotify ID. URL, or URI")
# async def get_artists_by_id():
#     top_artists = ['3tVQdUvClmAT7URs9V3rsp','3TVXtAsR1Inumwj472S9r4','3wcj11K77LjEY1PkEazffa',
#     '3Isy6kedDrgPYoTS1dazA9','0Y3agQaa6g2r0YmHPOO9rh','2p1fiYHYiXz9qi0JJyxBzN','5yOvAmpIR7hVxiS6Ls5DPO',
#     '4V8LLVI7PbaPR0K2TGSxFF','46pWGuE3dSwY3bMMXGBvVS','6IhG3Yxm3UW98jhyBvrIut']
#     return await SpotifyService.get_artists(top_artists)


