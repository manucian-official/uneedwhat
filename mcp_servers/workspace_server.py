import os
from pathlib import Path

from mcp.server.fastmcp import FastMCP


mcp = FastMCP("local-workspace")
WORKSPACE_ROOT = Path(os.getenv("WORKSPACE_ROOT", Path(__file__).resolve().parents[1] / "workspace_data"))


def safe_path(relative_path: str) -> Path:
    root = WORKSPACE_ROOT.resolve()
    path = (root / relative_path).resolve()
    if root not in path.parents and path != root:
        raise ValueError("Path escapes workspace root")
    return path


@mcp.tool()
def list_files() -> list[str]:
    """List files in the local workspace."""
    WORKSPACE_ROOT.mkdir(parents=True, exist_ok=True)
    return [path.name for path in sorted(WORKSPACE_ROOT.iterdir()) if path.is_file()]


@mcp.tool()
def read_file(name: str) -> str:
    """Read a UTF-8 file from the local workspace."""
    return safe_path(name).read_text(encoding="utf-8")


@mcp.tool()
def write_file(name: str, content: str) -> str:
    """Write a UTF-8 file inside the local workspace."""
    WORKSPACE_ROOT.mkdir(parents=True, exist_ok=True)
    safe_path(name).write_text(content, encoding="utf-8")
    return f"wrote {name}"


if __name__ == "__main__":
    mcp.run()
