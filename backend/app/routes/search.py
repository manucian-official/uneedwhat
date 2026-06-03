from fastapi import APIRouter, HTTPException

from ..models.search import SearchRequest, SearchResponse
from ..services.search import SearchError, search_service


router = APIRouter(prefix="/search", tags=["search"])


@router.post("", response_model=SearchResponse)
async def search(request: SearchRequest) -> SearchResponse:
    try:
        return await search_service.search(request)
    except SearchError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc
