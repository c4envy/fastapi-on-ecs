import json
import requests
import base64
from datetime import datetime, timedelta
from app.core.config import settings

def get_access_token():
    url = "https://auth.tidal.com/v1/oauth2/token"
    client_id = settings.TIDAL_CLIENT_ID
    client_secret = settings.TIDAL_CLIENT_SECRET
    credentials = f"{client_id}:{client_secret}"
    b64creds = base64.urlsafe_b64encode(credentials.encode()).decode('utf-8')

    headers = {
        'Authorization': f'Basic {b64creds}',
        'Content-Type': 'application/x-www-form-urlencoded',
    }

    data = {
        'grant_type': 'client_credentials',
    }

    response = requests.post(url, headers=headers, data=data)

    if response.status_code == 200:
        token_data = response.json()
        expires_at = datetime.now() + timedelta(seconds=token_data['expires_in'])
        token_data['expires_at'] = expires_at.isoformat()
        with open('tidal_token.json', 'w') as token_file:
            json.dump(token_data, token_file)
        return token_data['access_token']
    else:
        print(f"Error: {response.status_code}")
        return None

def load_access_token():
    try:
        with open('tidal_token.json', 'r') as token_file:
            token_data = json.load(token_file)
        expires_at = datetime.strptime(token_data['expires_at'], '%Y-%m-%dT%H:%M:%S.%f')
        if expires_at > datetime.utcnow():
            return token_data['access_token']
    except FileNotFoundError:
        pass
    except (json.JSONDecodeError, KeyError, ValueError) as e:
        print(f"Error loading access token: {e}")
    return None

def save_access_token(token):
    with open('tidal_token.json', 'w') as token_file:
        json.dump({'access_token': token}, token_file)

def get_or_refresh_token():
    token = load_access_token()
    if token is None:
        token = get_access_token()
    return token

