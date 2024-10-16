from app.core.config import settings
import httpx
import logging

logger = logging.getLogger('apple_music_service_class')
logging.basicConfig(level='INFO')


APPLE_MUSIC_KEY = settings.APPLE_MUSIC_KEY
BASEURL = "https://api.music.apple.com/v1/catalog/"

class AppleMusicService:
   
   
    @staticmethod
    async def get_artist(id: str, storefront: str):
        async with httpx.AsyncClient() as client:
            headers = {
            'Authorization': f'Bearer {APPLE_MUSIC_KEY}',
            'Content-Type': 'application/json',
            }
            response = await client.get(f"{BASEURL}{storefront}/artists/{id}", headers=headers)
            if response.status_code == 200:
              return response.json()
            else:
                logger.error(f"Error: {response.status_code}")
                return response.status_code
            
    @staticmethod
    async def get_artists(ids: list[str], storefront: str):
        async with httpx.AsyncClient() as client:
            headers = {
            'Authorization': f'Bearer {APPLE_MUSIC_KEY}',
            'Content-Type': 'application/json',
            }
            params = { 'ids': ','.join(ids) }
            response = await client.get(f"{BASEURL}{storefront}/artists", headers=headers, params=params)
            if response.status_code == 200:
              return response.json()
            else:
              logger.error(f"Error: {response.status_code}")
              return response.status_code
        
    @staticmethod
    async def get_song(id: str, storefront: str):
        async with httpx.AsyncClient() as client:
            headers = {
            'Authorization': f'Bearer {APPLE_MUSIC_KEY}',
            'Content-Type': 'application/json',
            }
            response = await client.get(f"{BASEURL}{storefront}/songs/{id}", headers=headers)
            if response.status_code == 200:
              return response.json()
            else:
              logger.error(f"Error: {response.status_code}")
              return response.status_code
        
    @staticmethod
    async def get_songs(ids: list[str], storefront: str):
        async with httpx.AsyncClient() as client:
            headers = { 'Authorization': f'Bearer {APPLE_MUSIC_KEY}', 
                        'Content-Type': 'application/json'
                    } 
            params = {  'ids': ','.join(ids) }  
            response = await client.get(f"{BASEURL}{storefront}/songs", headers=headers, params=params)
            if response.status_code == 200:
              return response.json()
            else:
              logger.error(f"Error: {response.status_code}")
              return response.status_code

    @staticmethod
    async def get_album(id: str, storefront: str):
        async with httpx.AsyncClient() as client:
            headers = { 'Authorization': f'Bearer {APPLE_MUSIC_KEY}', 
                        'Content-Type': 'application/json'
                    }
            response = await client.get(f"{BASEURL}{storefront}/albums/{id}", headers=headers)  
            if response.status_code == 200:
              return response.json()
            else:
              logger.error(f"Error: {response.status_code}")
              return response.status_code  

    @staticmethod
    async def get_albums(ids: list[str], storefront: str):
        async with httpx.AsyncClient() as client:
            headers = { 'Authorization': f'Bearer {APPLE_MUSIC_KEY}', 
                        'Content-Type': 'application/json'
                    }            
            params = { 'ids': ','.join(ids) }
            response = await client.get(f"{BASEURL}{storefront}/albums", headers=headers, params=params)
            if response.status_code == 200:
              return response.json()
            else:
              logger.error(f"Error: {response.status_code}")
              return response.status_code  



    
