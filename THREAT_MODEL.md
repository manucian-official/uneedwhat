# Threat Model

## Assets

- Local chat history and notes.
- Local model prompts and responses.
- Files exposed through MCP workspace tools.
- Search queries sent through SearXNG.

## Trust Boundaries

- Browser to FastAPI over HTTP.
- FastAPI to local model providers.
- FastAPI and MCP servers to workspace storage.
- SearXNG to upstream search engines.

## Main Risks

- Prompt injection persuading a model to misuse tools.
- Path traversal through workspace file APIs.
- Accidental internet exposure of the API or SearXNG.
- Malicious model files or untrusted GGUF downloads.
- Sensitive data leakage through web search queries.

## Existing Mitigations

- Workspace paths are resolved and checked against `WORKSPACE_ROOT`.
- No telemetry is added by the app.
- SearXNG is self-hosted.
- llama.cpp runs behind an optional Compose profile.

## Needed Mitigations

- Add local auth for non-loopback deployments.
- Add per-tool approval for destructive MCP actions.
- Add request logging controls that avoid storing secrets.
- Add dependency scanning in CI.

