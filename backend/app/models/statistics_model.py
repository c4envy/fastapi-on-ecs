from beanie import Document
from app.schemas.statistics_schema import  TopArtistsModel, TopSalesModel, TopTracksModel


class Statistics(Document):
    top_sales_uuid: TopSalesModel
    top_tracks: list[TopTracksModel]
    top_artists: list[TopArtistsModel]
    
class Collection:
    name = "statistics"