import os

import httpx
from mcp.server.fastmcp import FastMCP


mcp = FastMCP("searxng-search")
SEARXNG_BASE_URL = os.getenv("SEARXNG_BASE_URL", "http://localhost:8080")


@mcp.tool()
async def web_search(query: str, limit: int = 5) -> list[dict[str, str]]:
    """Search the web through the local SearXNG instance."""
    params = {"q": query, "format": "json"}
    async with httpx.AsyncClient(timeout=30) as client:
        response = await client.get(f"{SEARXNG_BASE_URL}/search", params=params)
    response.raise_for_status()
    payload = response.json()
    results: list[dict[str, str]] = []
    for item in payload.get("results", [])[:limit]:
        results.append(
            {
                "title": item.get("title", "Untitled"),
                "url": item.get("url", ""),
                "snippet": item.get("content", ""),
            }
        )
    return results


if __name__ == "__main__":
    mcp.run()

