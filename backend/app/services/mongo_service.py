from pydantic import BaseModel
from typing import Dict, List
from app.models.music_model import Music
from app.models.user_model import User
from app.schemas.mongo_schema import CombinedResults, MusicResult, UserResult


async def atlas_music_search(request: str) -> CombinedResults:
    search_term = request
    print(f"Searching for: {search_term}")

    music_pipeline = [
        {
            "$search": {
                "index": "music",
                "compound": {
                    "should": [
                        {
                            "text": {
                                "query": search_term,
                                "path": "artist_name",
                                "fuzzy": {
                                    "maxEdits": 2,
                                    "prefixLength": 3
                                }
                            }
                        },
                        {
                            "text": {
                                "query": search_term,
                                "path": "track_name",
                                "fuzzy": {
                                    "maxEdits": 2,
                                    "prefixLength": 3
                                }
                            }
                        },
                        {
                            "text": {
                                "query": search_term,
                                "path": "album_name",
                                "fuzzy": {
                                    "maxEdits": 2,
                                    "prefixLength": 3
                                }
                            }
                        }
                    ]
                }
            }
        },
        {
            "$limit": 20  # Limit the number of results
        },
        {
            "$project": {
                "_id": 1,
                "artist_name": 1,
                "track_name": 1,
                "album_name": 1,
                "price_per_share": 1,
                "available_shares": 1,
                "image_url": 1,
                "track_id": 1,
                "genres": 1,
                "featured": 1
            }
        }
    ]
    
    user_pipeline = [
        {
            "$search": {
                "index": "user",
                "compound": {
                    "should": [
                        # {
                        #     "text": {
                        #         "query": search_term,
                        #         "path": "username",
                        #         "fuzzy": {
                        #             "maxEdits": 2,
                        #             "prefixLength": 3
                        #         }
                        #     }
                        # },
                        {
                            "text": {
                                "query": search_term,
                                "path": "account.profile.artist_name",
                                "fuzzy": {
                                    "maxEdits": 2,
                                    "prefixLength": 3
                                }
                            }
                        }
                    ]
                }
            }
        },
        {
            "$match": {
                "account_type": "artist"
            }
        },
        {
            "$limit": 20
        },
        {
            "$project": {
                "_id": 1,
                "user_id": 1,
                "username": 1,
                "account": 1,
                "account_type": 1
            }
        }
    ]


    music_cursor = Music.aggregate(music_pipeline)
    user_cursor = User.aggregate(user_pipeline)
    
    music_results = await music_cursor.to_list(length=None)
    print(f"Music results: {music_results}")
    user_results = await user_cursor.to_list(length=None)
    print(f"User results: {user_results}")

    # Convert results to SearchResult objects
    # search_results = [SearchResult(**result) for result in results]
    
     # Convert results to SearchResult and UserResult objects
    music_search_results = [MusicResult(**result) for result in music_results]
    print(f"Music search results: {music_search_results}")
    user_search_results = [UserResult(**result) for result in user_results]
    print(f"User search results: {user_search_results}")
    
    # Optionally, deduplicate results if necessary
    # search_results = list({v['_id']: v for v in results}.values())

    # return search_results
    
   # Combine results
    combined_results = CombinedResults(
        music_results=music_search_results,
        artist_results=user_search_results
    )

    return combined_results






