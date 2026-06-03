from pydantic import BaseModel, Field


class SearchRequest(BaseModel):
    query: str = Field(min_length=1)
    categories: list[str] = Field(default_factory=lambda: ["general"])
    language: str = "en"
    limit: int = Field(default=5, ge=1, le=20)


class SearchResult(BaseModel):
    title: str
    url: str
    snippet: str = ""
    engine: str | None = None


class SearchResponse(BaseModel):
    query: str
    results: list[SearchResult]

