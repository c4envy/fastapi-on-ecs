from uuid import UUID
from pydantic import BaseModel
from typing import List, Optional
from app.models.music_model import Music
from app.schemas.user_schema import Account, AccountType, ArtistProfile


class SearchRequest(BaseModel):
    search_term: str

class MusicResult(BaseModel):
    _id: str
    artist_name: str
    track_name: str
    album_name: str
    image_url: str
    price_per_share: float
    available_shares: int
    track_id: UUID
    genres: List[str]
    featured: bool
    
class UserResult(BaseModel):
    user_id: Optional[UUID]
    username: Optional[str]
    account: Optional[Account]
    account_type: Optional[AccountType]

class CombinedResults(BaseModel):
    music_results: List[MusicResult]
    artist_results: List[UserResult]
  
   
    