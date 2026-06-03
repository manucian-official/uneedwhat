from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .core.config import settings
from .routes import chat, health, search, workspace


def create_app() -> FastAPI:
    app = FastAPI(
        title="Local Oddity AI Workspace",
        description="Local-first AI workspace API with Ollama, llama.cpp, SearXNG, and MCP-ready tools.",
        version="0.2.0",
    )
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origin_list,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    app.include_router(health.router)
    app.include_router(chat.router, prefix="/api")
    app.include_router(search.router, prefix="/api")
    app.include_router(workspace.router, prefix="/api")
    return app
