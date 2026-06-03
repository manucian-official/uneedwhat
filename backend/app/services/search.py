import httpx

from ..core.config import settings
from ..models.search import SearchRequest, SearchResponse, SearchResult


class SearchError(RuntimeError):
    pass


class SearchService:
    async def search(self, request: SearchRequest) -> SearchResponse:
        params = {
            "q": request.query,
            "format": "json",
            "categories": ",".join(request.categories),
            "language": request.language,
        }
        async with httpx.AsyncClient(timeout=30) as client:
            response = await client.get(f"{settings.searxng_base_url}/search", params=params)
        if response.is_error:
            raise SearchError(response.text)
        payload = response.json()
        results = [
            SearchResult(
                title=item.get("title", "Untitled"),
                url=item.get("url", ""),
                snippet=item.get("content", ""),
                engine=item.get("engine"),
            )
            for item in payload.get("results", [])[: request.limit]
            if item.get("url")
        ]
        return SearchResponse(query=request.query, results=results)


search_service = SearchService()
