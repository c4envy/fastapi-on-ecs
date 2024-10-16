from datetime import datetime
from typing import List,Tuple
from uuid import UUID
from pydantic import BaseModel, Field
from app.models.music_model import Music
from app.schemas.user_schema import Artist

    
class TracksStatsOut(BaseModel):
    tracks: list[Music]
    date_created: datetime
       
class ArtistStatsOut(BaseModel):
    artists: list[Artist]
    date_created: datetime
    
class MusicStatsOut(BaseModel):
    tracks: list[Music]
    date_created: datetime
    
class TopSalesModel(BaseModel):
    data: List[Tuple[UUID, int]] = Field(..., description="A list of tuples containing a UUID and an integer")
    
class TopTracksModel(BaseModel):
    track: Music
    sold: int
    
class TopArtistsModel(BaseModel):
    artist: Artist
    sold: int