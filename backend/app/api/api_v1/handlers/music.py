from typing import List
from uuid import UUID
from app.models.trackpayment_model import TrackPayment
from app.models.transaction_model import Transaction
from app.schemas.mongo_schema import CombinedResults
from app.schemas.music_schema import MusicCreate, MusicOut, MusicSearch, MusicUpdate
from app.services.mongo_service import  atlas_music_search
from app.services.music_service import MusicService
from fastapi import APIRouter, Depends, Query, File, UploadFile
from app.models.user_model import User
from app.api.deps.user_deps import get_current_user
from app.models.music_model import Music


music_router = APIRouter()

@music_router.post('/get_track_by_id/{music_id}', summary="Search for a single music track by music_id", response_model=MusicOut)
async def retrieve_track_by_id(music_id: UUID):
    return await MusicService.retrieve_track_by_id(music_id)

@music_router.post('/search_for_track', summary="Search for music track by multiple criterias", response_model=List[MusicOut])
async def search_for_track(data: MusicSearch):
    return await MusicService.search_for_track(data)

@music_router.post('/get_track', summary="Get all music track by multiple criterias", response_model=MusicOut)
async def retrieve_tracks(data: MusicSearch):
    return await MusicService.retrieve_a_track(data)

@music_router.post('/get_tracks_by_id', summary="Get all music tracks", response_model=List[MusicOut])
async def retrieve_tracks_by_id(data: list[UUID]):
    return await MusicService.retrieve_tracks_by_id(data)

@music_router.post('/delete_track/{music_id}', summary="Delete a single music track by music_id")
async def delete_track_by_id(music_id: UUID):
    return await MusicService.delete_tracks_by_id(music_id)

@music_router.delete('/delete_tracks', summary="Delete multiple music tracks by multiple criterias")
async def delete_tracks(search_model: MusicSearch):
    return await MusicService.delete_tracks_by_search(search_model)

@music_router.post('/create_track', summary="Create a music track", response_model=MusicOut)
async def create_track(data: MusicCreate, current_user: User = Depends(get_current_user)):
    return await MusicService.create_track( current_user, data)

@music_router.get('/get_top_tracks', summary="Get top tracks", response_model=List[MusicOut])
async def get_top_tracks():
    return await MusicService.retrieve_top_tracks()

@music_router.get('/get_new_releases', summary="Get new tracks", response_model=List[MusicOut])
async def get_new_releases():
    return await MusicService.retrieve_new_tracks()

@music_router.put('/update_tracks', summary="Update multiple tracks by multiple criterias", response_model=MusicOut)
async def update_tracks(search: MusicSearch, data: MusicUpdate, current_user: User = Depends(get_current_user)):
    return await MusicService.update_tracks(current_user, search, data)

@music_router.put('/update_track/{music_id}', summary="Update a single track by music_id", response_model=MusicOut)
async def update_track( data: MusicUpdate,music_id: UUID, current_user: User= Depends(get_current_user)):
    return await MusicService.update_track(data,music_id, current_user)

@music_router.post('/complete_order/', summary="Buy shares in a music track", response_model=List[MusicOut])
async def buy_track(transaction: Transaction, current_user: User = Depends(get_current_user)):
    return await MusicService.complete_order(transaction, current_user)

@music_router.post('/save/track/art/s3/', summary="Save an track's image to S3")
async def save_track_to_s3(url: str, artist: str, track: str):
    return await MusicService.save_image_on_s3(url, artist, track)

@music_router.post('/upload/file', summary="Save an artist's image to S3")
async def save_artist_to_s3(file: UploadFile, artist: str):
    return await MusicService.upload_file_to_s3(artist, file)

@music_router.post('/upload/files', summary="Upload multiple files to S3 bucket and track the files")
async def upload_files(files: List[UploadFile] = File(...)):
    return await MusicService.upload_files_to_s3(files)

@music_router.post("/atlas/search", summary="Search for music by track name, artist name, and album name" , response_model=CombinedResults)
async def search(request: str):
    return await atlas_music_search(request)

@music_router.get("/get/user/transactions", summary="Get all transactions for a user", response_model=List[Transaction])
async def get_user_transactions(user: User = Depends(get_current_user)):
    return await MusicService.retrieve_user_transactions(user)

@music_router.post("/complete_track_listing", summary="Complete list a track", response_model=TrackPayment)
async def list_track(payment: Transaction, current_user: User = Depends(get_current_user)):
    return await MusicService.pay_for_track_listing(payment, current_user)

@music_router.get("/get/all/tracks", summary="Get all tracks", response_model=List[MusicOut])
async def get_all_tracks():
    return await MusicService.retrieve_all_tracks()

@music_router.post("/upload/track/s3/", summary="Upload a track to S3")
async def upload_track_to_s3(file: UploadFile, bucket: str, artist: str):
    return await MusicService.save_track_on_s3(file, bucket, artist)


# @music_router.post('/sell_track/{music_id}', summary="Sell a music track", response_model=Music)
# async def sell_track(music_id: UUID, current_user: User = Depends(get_current_user)):
#     return await MusicService.buy_track(music_id, current_user)

# @music_router.post('/save/track/art/s3/', summary="Save a track's image to S3")
# async def save_track_to_s3(url: str, track: str, artist: str):
#     return await MusicService.save_album_art_on_s3(url, artist,track)

# @music_router.post('/save/artist/art/s3/', summary="Save an artist's image to S3")
# async def save_artist_to_s3(url: str, artist: str):
#     return await MusicService.save_artist_art_on_s3(url, artist)



