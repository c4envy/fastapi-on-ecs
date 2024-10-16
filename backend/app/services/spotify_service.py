import logging
import sys
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
from typing import List
from uuid import UUID
from app.core.config import settings

logger = logging.getLogger('spotify_service_class')
logging.basicConfig(level='INFO')

spotify = spotipy.Spotify(client_credentials_manager=SpotifyClientCredentials(client_id=settings.SPOTIPY_CLIENT_ID,
                                                           client_secret=settings.SPOTIPY_CLIENT_SECRET))

class SpotifyService:
    @staticmethod
    async def get_artist_image_by_name(name: str):
      results = spotify.search(q='artist:' + name, type='artist')
      items = results['artists']['items']
      if len(items) > 0:
         artist = items[0]
         return artist
      #print(artist['name'], artist['images'][0]['url'])
      return None
    
    @staticmethod
    async def get_artist_by_name(name):
      results = spotify.search(q='artist:' + name, type='artist')
      items = results['artists']['items']
      if len(items) > 0:
         return items[0]
      else:
         return None
      
    @staticmethod
    async def show_artist_albums(artist):
      albums = []
      results = spotify.artist_albums(artist['id'], album_type='album')
      albums.extend(results['items'])
      while results['next']:
         results = spotify.next(results)
         albums.extend(results['items'])
         seen = set()  # to avoid dups
      albums.sort(key=lambda album: album['name'].lower())
      for album in albums:
          name = album['name']
          if name not in seen:
             logger.info('ALBUM: %s', name)
             seen.add(name)
             return seen
      return None

    @staticmethod
    async def show_artist_popularity(artist):
      logger.info('====%s====', artist['name'])
      logger.info('Popularity: %s', artist['popularity'])
      if len(artist['genres']) > 0:
         logger.info('Genres: %s', ','.join(artist['genres']))

    @staticmethod
    async def show_album_tracks(album):
      tracks = []
      results = spotify.album_tracks(album['id'])
      tracks.extend(results['items'])
      while results['next']:
          results = spotify.next(results)
          tracks.extend(results['items'])
      for i, track in enumerate(tracks):
          logger.info('%s. %s', i + 1, track['name'])
      return track
    
    # @staticmethod
    # async def show_album_by_urn(urn: str):
    #    album = spotify.album(urn)
    #    return album 
    
    @staticmethod
    async def get_artist_by_urn(id: str):
       print("printing artist's id " + id)
       artist = spotify.artist(id)
       print("artists's name " + artist['name'])
       if artist is not None:
          return artist
       return "The artist does not exist"

    @staticmethod
    async def get_track(trackID: str):
      response = spotify.track(trackID)
      return response
    
    @staticmethod
    async def get_tracks(trackIDs: list):
      response = spotify.tracks(trackIDs)
      logger.info('TRACKS: %s', response) 
      return response

    
    @staticmethod
    async def get_album_tracks(album_id: str):
      results = spotify.album_tracks(album_id)
      for track in results['items']:
            print(track['name'])
      return results
    

    

   
