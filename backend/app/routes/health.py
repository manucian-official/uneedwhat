import time
from fastapi import APIRouter

router = APIRouter(tags=["health"])
_START_TIME = time.time()

@router.get("/health")
async def health() -> dict:
    return {"status": "ok", "uptime_seconds": round(time.time() - _START_TIME, 1), "version": "0.2.0"}
