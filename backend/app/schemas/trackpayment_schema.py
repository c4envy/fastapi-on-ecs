from uuid import UUID
from pydantic import BaseModel
from app.schemas.music_schema import Publisher


class TrackItem(BaseModel):
    track_id: UUID
    track_name: str
    artist_name: str
    num_of_shares: int
    price_per_share: float
    album_name: str
    publisher: Publisher