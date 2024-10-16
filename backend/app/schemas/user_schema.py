from datetime import datetime
from enum import Enum
from typing import Optional, Union
from uuid import UUID
from pydantic import BaseModel, EmailStr, Field
from app.models.music_model import Music


class ArtistID(BaseModel):
    id: str
    platform: str
      
class AccountType(Enum):
    fan = "fan"
    artist = "artist"
    thirdparty = "merchant"

class Address(BaseModel):
    street: str
    city: str
    state: str
    country: str
    postal_code: str
    
class PortfolioItem(BaseModel):
    track_id: UUID
    date_acquired = datetime.utcnow()
    num_of_shares: int
    
class ArtistProfile(BaseModel):
    artist_name: str
    genres: list[str]
    artist_id: list[ArtistID]
    image_url: str
    catalogue: list[Music] = None
    portfolio: list[PortfolioItem] = None
    total_shares_sold: float = None
    total_revenue: float = None
    featured: bool = False
    isArtistVerified: bool = False

class MerchantProfile(BaseModel):
    company: str
    company_address: Address
    business_type: str
    state_of_incorporation: str
    registration_number: str
    catalogue: list[Music] = None
    portfolio: list[PortfolioItem] = None
    image_url: str
    total_shares_sold: float = None
    total_revenue: float = None
    featured: bool = False
    isMerchantVerified: bool = False

class FanProfile(BaseModel):
    portfolio: list[PortfolioItem] = None
    total_shares_owned: int = None
    total_revenue: float = None
    lifetime_revenue: float = None
    
class Artist(BaseModel):
    artist_profile: ArtistProfile
class Merchant(BaseModel):
    merchant_profile: MerchantProfile
    
class Account(BaseModel):
    profile: Optional[Union[ArtistProfile, MerchantProfile, FanProfile]] = None
    
class AccountStatus(Enum):
    active = "active"
    inactive = "inactive"
    suspended = "suspended"
    delete = "delete"
    banned = "banned"
    reviewing = "reviewing"
    # awaiting_document = "awaiting_document"
    # payment_pending = "payment_pending"
    
class UserAuth(BaseModel):
    username: str = Field(..., min_length=5, max_length=50, description="user username")
    password: str = Field(..., min_length=5, max_length=24, description="user password")
    firstname: str = Field(..., min_length=3, max_length=20, description="user username")
    lastname: str = Field(..., min_length=3, max_length=20, description="user username")
    email: EmailStr = Field(..., description="user email") 
    account_type: AccountType = Field(..., description="user account type")
    account: Account = Field(..., description="Artist or Merchant profile")
    
class UserUpdate(BaseModel):
    # email: Optional[EmailStr] = None
    firstname: Optional[str] = None
    lastname: Optional[str] = None
    account: Optional[Account] = None
    phone: Optional[str] = None
    username: Optional[str] = None
    disabled: Optional[bool] = None
    
    
    
# class ArtistUpdate(BaseModel):
#     artist_name: Optional[str] = None
#     genres: Optional[list[str]] = None
#     artist_id: Optional[list[ArtistID]] = None
#     image_url: Optional[str] = None
#     featured: bool = False
    
# class MerchantUpdate(BaseModel):
#     company: Optional[str] = None
#     company_address: Optional[Address] = None
#     business_type: Optional[str] = None
#     state_of_incorporation: Optional[str] = None
#     registration_number: Optional[str] = None
#     image_url: Optional[str] = None
    
# class FanUpdate(BaseModel):
#     tracks: Optional[list[Purchased]] = None
#     total_shares_owned: Optional[int] = None
#     total_revenue: Optional[float] = None
#     lifetime_revenue: Optional[float] = None
    
class UserSearch(BaseModel):
    user_id: Optional[UUID] 
    username: Optional[str] 
    email: Optional[EmailStr] 
    firstname: Optional[str] 
    lastname: Optional[str] 
    account_type: Optional[AccountType] 
    account_status: Optional[AccountStatus]
    account: Optional[Account] 
    disabled: Optional[bool] = False
    
class UserOut(BaseModel):
    user_id: Optional[UUID] 
    username: Optional[str] 
    email: Optional[EmailStr] 
    firstname: Optional[str] 
    lastname: Optional[str] 
    account_type: Optional[AccountType] 
    account_status: Optional[AccountStatus]
    account: Optional[Account] 
    image_url: Optional[str]
    isEmailVerified: Optional[bool] 
    isPhoneVerified: Optional[bool] 
    disabled: Optional[bool] = False
    created_on: Optional[datetime]
    isUserOTPVerified: Optional[bool] = False
    # profile: Optional[Union[ArtistProfile, MerchantProfile, FanProfile]] = None
    
    
class LoginOTP(BaseModel):
    user_id: UUID
    email: EmailStr
    phone: str
    status_code: str
    message: str
    
class ResetPasswordRequest(BaseModel):
    otp: str
    email: str
    new_password: str