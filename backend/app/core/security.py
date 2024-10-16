from datetime import datetime, timedelta
import time
from passlib.context import CryptContext
from typing import Union, Any
import pyotp
import pyotp
import pyqrcode
from app.core.config import settings
from jose import jwt

password_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def create_access_token(subject: Union[str, Any], expires_delta: int = None) -> str:
    if expires_delta is not None:
        expires_delta = datetime.utcnow() + expires_delta
    else:
        expires_delta = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode = {"exp": expires_delta, "sub": str(subject)}
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET_KEY, settings.ALGORITHM)
    return encoded_jwt

def create_refresh_token(subject: Union[str, Any], expires_delta: int = None) -> str:
    if expires_delta is not None:
        expires_delta = datetime.utcnow() + expires_delta
    else:
        expires_delta = datetime.utcnow() + timedelta(minutes=settings.REFRESH_TOKEN_EXPIRE_MINUTES)
    
    to_encode = {"exp": expires_delta, "sub": str(subject)}
    encoded_jwt = jwt.encode(to_encode, settings.JWT_REFRESH_SECRET_KEY, settings.ALGORITHM)
    return encoded_jwt


def get_password(password: str) -> str:
    return password_context.hash(password)


def verify_password(password: str, hashed_pass: str) -> bool:
    return password_context.verify(password, hashed_pass)

def generate_secret():
    # Generate a random secret key
    secret = pyotp.random_base32()
    
    # Store this secret key securely and share it with the user
    print("Secret key:", secret)
    return secret


def generate_otp(secret: str): 
    totp = pyotp.TOTP(secret, interval=30*1)
    return totp.now()


def generate_qr_code(secret: str, app_name: str, company_name: str, file_name: str = "qrcode.png", scale: int = 8): 
    # Generate a QR code from the secret key
    url = pyotp.totp.TOTP(secret).provisioning_uri(app_name, company_name)
    qr = pyqrcode.create(url)
    # Save the QR code to a file or display it
    # qr.png("qrcode.png", scale=8)
    # return qr
      # Save the QR code to a PNG file
    qr.png(file_name, scale=scale)
    return file_name


# def verify_code_with_time_left(secret, code):
#     totp = pyotp.TOTP(secret)
#     current_time = int(time.time())
#     # Check for valid codes within a 10-minute window (60 * 10 seconds)
#     for i in range(-5, 6):  # Check 5 intervals before and after
#         valid_time = current_time + i * 30  # Each interval is 30 seconds
#         if totp.verify(code, valid_time):
#             time_left = 30 - (current_time % 30)
#             return True, time_left  
#     return False, 0

def verify_otp_code(secret, code):
    totp = pyotp.TOTP(secret, interval=30*1)
    if totp.verify(code, None, 60*2):
        return True
    return False
