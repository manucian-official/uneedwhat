# Local Oddity AI Workspace

Self-hosted AI workspace inspired by ChatGPT and Claude, tuned for local-first privacy and a little delightful weirdness. It ships with a FastAPI backend, Ollama and llama.cpp inference adapters, SearXNG web search integration, local MCP servers, and Docker Compose for the whole stack.

## Architecture

```text
apps/web                Browser UI for chat, search, and workspace notes
backend/app             FastAPI API layer, services, routes, settings
config/searxng          SearXNG configuration
docs                    Architecture and implementation notes
mcp_servers             Local MCP tools exposed to compatible clients
scripts                 Local developer and deployment helpers
tests                   Backend service and API tests
docker-compose.yml      Backend, web, Ollama, llama.cpp, SearXNG
```

Detailed design notes are in `docs/architecture.md`.

## Quick Start

1. Copy environment defaults:

```powershell
Copy-Item .env.example .env
```

2. Start the stack:

```powershell
docker compose up --build
```

Or on Windows during development:

```powershell
.\launch-windows.ps1
```

3. Pull a local Ollama model:

```powershell
docker compose exec ollama ollama pull llama3.1:8b
```

4. Open:

- Web UI: http://localhost:5173
- API docs: http://localhost:8000/docs
- SearXNG: http://localhost:8080

## Inference Providers

The backend supports:

- `ollama`: `http://ollama:11434/api/chat`
- `llamacpp`: OpenAI-compatible llama.cpp server at `http://llamacpp:8080/v1/chat/completions`

Choose the default with `AI_DEFAULT_PROVIDER`.

## MCP Servers

MCP servers live in `mcp_servers/`:

- `workspace_server.py`: safe local workspace file tools
- `web_search_server.py`: SearXNG search tool

Run locally:

```powershell
python -m venv .venv
.venv\Scripts\pip install -r mcp_servers/requirements.txt
.venv\Scripts\python mcp_servers\workspace_server.py
```

MCP containers are also available as a Compose profile:

```powershell
docker compose --profile mcp up --build
```

## Checks

```powershell
.\.venv\Scripts\python -m pip install -r backend\requirements-dev.txt
.\.venv\Scripts\python -m compileall backend mcp_servers
.\.venv\Scripts\pytest
cd apps\web
npm run build
```

## Privacy Posture

- Local inference by default
- No telemetry
- SearXNG search through your own container
- Workspace file tools are path-scoped
- No remote API keys required
