from app.tokens.tidal_token_gen import get_or_refresh_token
from app.core.config import settings
import httpx
import logging

logger = logging.getLogger('tidal_service_class')
logger.setLevel(logging.INFO)

TIDAL_BASEURL = "https://openapi.tidal.com"


class TidalService:
    @staticmethod
    async def get_artist_by_id(id: str, countryCode: str):
        token = get_or_refresh_token()
        async with httpx.AsyncClient() as client:
            headers = {
                'Authorization': f'Bearer {token}',
                'Content-Type': 'application/vnd.tidal.v1+json',
            }
            params = { 'countryCode': countryCode }
            response = await client.get(f"{TIDAL_BASEURL}/artists/{id}", headers=headers, params=params)
            if response.status_code == 200:
                return response.json()
            else:
                logger.error(f"Error: {response.json()}")
                return response.json()
            
    @staticmethod
    async def get_artists(ids: list[str], countryCode: str):
        token = get_or_refresh_token()
        async with httpx.AsyncClient() as client:
            headers = {
                'Authorization': f'Bearer {token}',
                'Content-Type': 'application/vnd.tidal.v1+json',
            }
            params = { 'countryCode': countryCode, 'ids': ','.join(ids) }
            response = await client.get(f"{TIDAL_BASEURL}/artists", headers=headers, params=params)
            if response.status_code == 200:
                return response.json()
            else:
                logger.error(f"Error: {response.json()}")
                return response.json()
            
    @staticmethod
    async def get_track(id: str, countryCode: str):
        token = get_or_refresh_token()
        async with httpx.AsyncClient() as client:
            headers = {
                'Authorization': f'Bearer {token}',
                'Content-Type': 'application/vnd.tidal.v1+json',
            }
            params = { 'countryCode': countryCode }
            response = await client.get(f"{TIDAL_BASEURL}/artists/{id}/tracks", headers=headers, params=params)
            if response.status_code == 200:
                return response.json()
            else:
                logger.error(f"Error: {response.json()}")
                return response.json()
            
    @staticmethod
    async def get_tracks(ids: list[str], countryCode: str):
        token = get_or_refresh_token()
        async with httpx.AsyncClient() as client:
            headers = {
                'Authorization': f'Bearer {token}',
                'Content-Type': 'application/vnd.tidal.v1+json',
            }
            params = { 'countryCode': countryCode, 'ids': ','.join(ids) }
            response = await client.get(f"{TIDAL_BASEURL}/tracks", headers=headers, params=params)
            if response.status_code == 200:
                return response.json()
            else:
                logger.error(f"Error: {response.json()}")
                return response.json()
            
    @staticmethod
    async def get_album(id: str, countryCode: str):
        token = get_or_refresh_token()
        async with httpx.AsyncClient() as client:
            headers = {
                'Authorization': f'Bearer {token}',
                'Content-Type': 'application/vnd.tidal.v1+json',
            }
            params = { 'countryCode': countryCode }
            response = await client.get(f"{TIDAL_BASEURL}/albums/{id}", headers=headers, params=params)
            if response.status_code == 200:
                return response.json()
            else:
                logger.error(f"Error: {response.json()}")
                return response.json()
            
    @staticmethod
    async def get_albums(ids: list[str], countryCode: str):
        token = get_or_refresh_token()
        async with httpx.AsyncClient() as client:
            headers = {
                'Authorization': f'Bearer {token}',
                'Content-Type': 'application/vnd.tidal.v1+json',
            }
            params = { 'countryCode': countryCode, 'ids': ','.join(ids) }
            response = await client.get(f"{TIDAL_BASEURL}/albums/byIds", headers=headers, params=params)
            if response.status_code == 200:
                return response.json()
            else:
                logger.error(f"Error: {response.json()}")
                return response.json()
            
    @staticmethod
    async def get_album_items(id: str, countryCode: str):
        token = get_or_refresh_token()
        async with httpx.AsyncClient() as client:
            headers = {
                'Authorization': f'Bearer {token}', 
                'Content-Type': 'application/vnd.tidal.v1+json',
            }
            params = { 'countryCode': countryCode }
            response = await client.get(f"{TIDAL_BASEURL}/albums/{id}/items", headers=headers, params=params)
            if response.status_code == 200:
                return response.json()
            else:
                logger.error(f"Error: {response.json()}")
                return response.json()