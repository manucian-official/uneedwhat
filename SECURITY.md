# Security

## Supported Posture

This project is designed for local-first use on trusted hardware. Do not expose it directly to the public internet without adding authentication, TLS, rate limits, and network controls.

## Reporting

For now, treat security reports as private project issues. Include the affected route, service, version, reproduction steps, and expected impact.

## Hardening Checklist

- Replace the SearXNG `secret_key` before deployment.
- Keep `WORKSPACE_ROOT` scoped to a non-sensitive directory.
- Do not mount your whole home directory into MCP tools.
- Keep Ollama, SearXNG, and Docker images updated.
- Add authentication before remote access.

