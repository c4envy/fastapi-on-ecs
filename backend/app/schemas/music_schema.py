from enum import Enum
from typing import List, Optional
from uuid import UUID
from pydantic import UUID4, BaseModel, EmailStr, Field
from datetime import datetime
from bson import ObjectId

class Platform(BaseModel):
    id: str
    platform: str

class MusicOwner(BaseModel):
    owner_id: UUID
    email: EmailStr
    date_aquired= datetime.utcnow()
    shares: int
    for_sale: bool = False
    disabled: bool = False

class Publisher(BaseModel):
    email: EmailStr
    
class TrackStatus(Enum):
    active = "active"
    inactive = "inactive"
    reviewing = "reviewing"
    paused = "paused"
    cancelled = "cancelled"
    delete = "delete"
    unverified = "unverified"
    
class PaymentStatus(Enum):
    pending = "pending"
    failed = "failed"
    paid = "paid"
    
class MusicCreate(BaseModel):
    track_status: Optional[str] = Field(..., description="status of the song")
    artist_name: str = Field(..., min_length=1, description="name of the artist")
    track_name: str = Field(..., min_length=1, description="name of the song")
    streaming_platforms: list[Platform] = Field(..., description="list of platforms the song is available on")
    album_name: str = Field(..., min_length=1, max_length=100, description="album name")
    album_type: str = Field(..., min_length=1, max_length=100, description="album type")
    image_url: Optional[str] = Field(..., description="album cover")
    release_date: Optional[datetime] = Field(..., description="date of release")
    num_of_shares: int = Field(..., description="number of shares the song has")
    available_shares: int = Field(..., description="number of shares available for sale")
    price_per_share: float = Field(..., description="price per each share of the song")
    genres: list = Field(..., description="list of genres the song belongs to")
    total_track_percent_for_sale: float = Field(..., description="total percentage of the song for sale")
    ownership_term: int = Field(..., description="ownership term")
    track_url: Optional[str] = Field(..., description="url of the song")
    
    class Config:
        allow_population_by_field_name = True
        json_encoders = {ObjectId: str}
    
class MusicSearch(BaseModel):
    track_id: Optional[UUID] 
    track_status: Optional[TrackStatus] 
    artist_name: Optional[str]
    track_name: Optional[str] 
    streaming_platforms: Optional[list[Platform]] 
    album_name: Optional[str] 
    album_type: Optional[str] 
    image_url: Optional[str] 
    release_date: Optional[datetime] 
    num_of_shares: Optional[int] 
    available_shares: Optional[int] 
    price_per_share: Optional[float] 
    publisher: Optional[Publisher]
    featured: Optional[bool]
    ownership_term: Optional[int]
    disabled: Optional[bool] = False
    
class MusicUpdate(BaseModel):
    artist_name: Optional[str]
    track_name: Optional[str]
    album_name: Optional[str]
    album_type: Optional[str]
    release_date: Optional[datetime]
    image_url: Optional[str]
    track_status: Optional[TrackStatus]
    price_per_share: Optional[float] 
    streaming_platforms: Optional[list[Platform]]
    share_limit: Optional[int]
    featured: Optional[bool]
    disabled: Optional[bool] = False

class MusicOut(BaseModel):
    track_id: UUID
    track_status: Optional[TrackStatus]
    payment_status: Optional[PaymentStatus]
    artist_name: Optional[str]
    track_name: Optional[str]
    streaming_platforms: List[Platform]
    album_name: Optional[str]
    album_type: Optional[str]
    image_url: Optional[str]
    release_date: datetime
    num_of_shares: Optional[int]
    available_shares: Optional[int]
    price_per_share: float
    owners: Optional[list[MusicOwner]]
    publisher: Optional[Publisher]
    disabled: Optional[bool]
    created_at: datetime
    share_limit: Optional[int]
    proceeds_per_share: Optional[float]
    dividend_percent: Optional[float]
    genres: Optional[list]
    featured: Optional[bool]
    ownership_term: Optional[int]
