from typing import Optional
from datetime import datetime
from uuid import UUID, uuid4
from beanie import Document, Indexed, Link, before_event, Replace, Insert, after_event
from pydantic import EmailStr, Field
from app.schemas.music_schema import MusicOwner, PaymentStatus, Platform, Publisher, TrackStatus

class Music(Document):
    track_id: UUID = Field(default_factory=uuid4, unique=True)
    track_status: TrackStatus = TrackStatus.reviewing
    payment_status: PaymentStatus = PaymentStatus.pending
    artist_name: Indexed(str)
    track_name: str
    streaming_platforms: list[Platform]
    album_name: str
    album_type: str
    image_url: str
    track_url: Optional[str]
    release_date: datetime
    genres: list[str]
    num_of_shares: int
    available_shares: int
    price_per_share: float
    publisher: Publisher
    owners: list[MusicOwner] 
    share_limit: int = 0
    dividend_percent = 0.0
    total_track_percent_for_sale: float = 0.0
    disabled: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)
    featured: bool = False
    ownership_term: int = 5
    db_version: float = 0.6


    def __status__(self) -> bool:
        return f"<is this expired? {self.disabled}>"
    
    def _repr_(self) -> str:
        return self.publisher.email
    
    def _created_(self)->datetime:
        return self.created_at
    
    def _publisher_(self)->Publisher:
        return self.publisher
    
    def _uuid_(self)->UUID:
        return self.track_id
    
    class Collection:
        name = "music"