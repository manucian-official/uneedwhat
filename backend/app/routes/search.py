from fastapi import APIRouter, HTTPException, Query
from ..models.search import SearchRequest, SearchResponse
from ..services.search import SearchError, search_service

router = APIRouter(prefix="/search", tags=["search"])

@router.post("", response_model=SearchResponse)
async def search(request: SearchRequest) -> SearchResponse:
    try:
        return await search_service.search(request)
    except SearchError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc

@router.get("", response_model=SearchResponse)
async def search_get(q: str = Query(..., min_length=1), limit: int = Query(default=5, ge=1, le=20), language: str = "en") -> SearchResponse:
    try:
        return await search_service.search(SearchRequest(query=q, limit=limit, language=language))
    except SearchError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc
