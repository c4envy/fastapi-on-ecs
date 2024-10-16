from app.api.api_v1.handlers import apple, coupon, spotify, tidal, stripe, statistics, music, transactions, user
from fastapi import APIRouter
from app.api.auth.jwt import auth_router


router = APIRouter()

router.include_router(user.user_router, prefix='/users', tags=["users"])
router.include_router(auth_router, prefix='/auth', tags=["auth"])
router.include_router(spotify.spotify_router, prefix='/spotify', tags=["spotify"])
router.include_router(music.music_router, prefix='/music', tags=["music"])
router.include_router(apple.apple_router, prefix='/apple', tags=["apple"])
router.include_router(tidal.tidal_router, prefix='/tidal', tags=["tidal"])
router.include_router(stripe.stripe_router, prefix='/stripe', tags=["stripe"])
router.include_router(statistics.stats_router, prefix='/stats', tags=["stats"])
router.include_router(transactions.transaction_router, prefix='/transactions', tags=["transactions"])
router.include_router(coupon.coupon_router, prefix='/coupons', tags=["coupons"])
