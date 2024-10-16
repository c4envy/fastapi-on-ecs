from typing import Optional
from datetime import datetime
from uuid import UUID, uuid4
from beanie import Document, Indexed
from pydantic import Field, EmailStr
from app.schemas.user_schema import Account, AccountStatus, AccountType

class User(Document):
    user_id: UUID = Field(default_factory=uuid4)
    username: Indexed(str, unique=True)
    email: Indexed(EmailStr, unique=True)
    phone: Optional[str] 
    hashed_password: str
    firstname: str
    lastname: str
    account_type: AccountType
    account: Account 
    account_status: AccountStatus = "reviewing"
    secret: str
    transaction_history: list[UUID] = []
    isEmailVerified: bool = False
    isPhoneVerified: bool = False
    isUserOTPVerified: bool = False
    otp_retry_count: int = 0
    created_on = datetime.utcnow()
    last_login: Optional[datetime]
    disabled: bool = False
    
    def __repr__(self) -> str:
        return f"<User {self.email}>"

    def __str__(self) -> str:
        return self.email

    def __hash__(self) -> int:
        return hash(self.email)

    def __eq__(self, other: object) -> bool:
        if isinstance(other, User):
            return self.email == other.email
        return False
    
    @property
    def create(self) -> datetime:
        return self.id.generation_time
    
    @classmethod
    async def by_email(self, email: str) -> "User":
        return await self.find_one(self.email == email)
    
    class Collection:
        name = "users"