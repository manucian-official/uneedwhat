# Architecture

## Goals

- Run on user-owned hardware with local models first.
- Keep workspace data private and path-scoped.
- Support multiple inference backends without changing API routes.
- Expose tools through both HTTP API routes and MCP servers.
- Keep deployment understandable with Docker Compose.

## System Map

```text
Browser UI
  |
  | HTTP
  v
FastAPI backend
  |-- routes/chat.py       chat completion endpoint
  |-- routes/search.py     SearXNG-backed web search endpoint
  |-- routes/workspace.py  local note storage endpoint
  |
  | services
  |-- inference.py         Ollama and llama.cpp providers
  |-- search.py            SearXNG client
  |-- workspace.py         safe local file access
  |
  +--> Ollama              local model runtime
  +--> llama.cpp           optional GGUF runtime profile
  +--> SearXNG             self-hosted metasearch

MCP servers
  |-- workspace_server.py  list/read/write workspace files
  |-- web_search_server.py SearXNG search tool
```

## Repository Layout

```text
.github/workflows       CI checks
apps/web                React workspace UI
backend/app             FastAPI implementation
config/searxng          Self-hosted search configuration
docker                  Deployment notes and env examples
mcp_servers             Local MCP tool servers
scripts                 Developer commands
tests                   Backend tests
```

## Provider Contract

Inference providers implement a shared `chat(messages, model, temperature)` method and return `(model, content)`. This keeps routes thin and makes it easy to add providers such as vLLM, LM Studio, or an internal gateway later.

## Privacy Boundaries

- The backend only talks to local Docker services by default.
- Notes are stored in `workspace_data`.
- MCP workspace tools reject paths that escape the configured workspace root.
- SearXNG is self-hosted and can be configured with your preferred engines.

## Deployment Profiles

- Default: `backend`, `web`, `ollama`, `searxng`.
- `llamacpp`: adds a llama.cpp server expecting `models/model.gguf`.
- `mcp`: starts MCP server containers for local tool hosting experiments.
