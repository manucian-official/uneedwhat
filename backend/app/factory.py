from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import JSONResponse
from .core.config import settings
from .routes import chat, health, search, workspace

def create_app() -> FastAPI:
    app = FastAPI(title="Nexus — Local AI Workspace", version="0.2.0")
    app.add_middleware(GZipMiddleware, minimum_size=1024)
    app.add_middleware(CORSMiddleware, allow_origins=settings.cors_origin_list,
                       allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

    @app.exception_handler(Exception)
    async def unhandled(request: Request, exc: Exception):
        return JSONResponse(status_code=500, content={"detail": "Internal server error", "type": type(exc).__name__})

    app.include_router(health.router)
    app.include_router(chat.router, prefix="/api")
    app.include_router(search.router, prefix="/api")
    app.include_router(workspace.router, prefix="/api")
    return app
