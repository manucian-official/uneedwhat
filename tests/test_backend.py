import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.models.workspace import Note
from app.services.workspace import WorkspaceError, WorkspaceService

def test_health_endpoint():
    client = TestClient(app)
    r = client.get("/health")
    assert r.status_code == 200
    body = r.json()
    assert body["status"] == "ok"
    assert "uptime_seconds" in body
    assert "version" in body

def test_workspace_rejects_path_escape(monkeypatch, tmp_path):
    monkeypatch.setattr("app.services.workspace.settings.workspace_root", str(tmp_path))
    service = WorkspaceService()
    with pytest.raises(WorkspaceError, match="escapes"):
        service.read_note("../secret.txt")

def test_workspace_round_trip(monkeypatch, tmp_path):
    monkeypatch.setattr("app.services.workspace.settings.workspace_root", str(tmp_path))
    service = WorkspaceService()
    note = service.write_note(Note(name="session.md", content="hello local"))
    assert note.content == "hello local"
    assert service.read_note("session.md").content == "hello local"

def test_workspace_delete_note(monkeypatch, tmp_path):
    monkeypatch.setattr("app.services.workspace.settings.workspace_root", str(tmp_path))
    service = WorkspaceService()
    service.write_note(Note(name="delete-me.md", content="bye"))
    service.delete_note("delete-me.md")
    with pytest.raises(WorkspaceError, match="not found"):
        service.read_note("delete-me.md")

def test_workspace_api_write_and_read(monkeypatch, tmp_path):
    monkeypatch.setattr("app.services.workspace.settings.workspace_root", str(tmp_path))
    client = TestClient(app)
    r = client.put("/api/workspace/notes/test.md", json={"name": "test.md", "content": "API round trip"})
    assert r.status_code == 200
    r2 = client.get("/api/workspace/notes/test.md")
    assert r2.status_code == 200
    assert r2.json()["content"] == "API round trip"

def test_workspace_api_delete(monkeypatch, tmp_path):
    monkeypatch.setattr("app.services.workspace.settings.workspace_root", str(tmp_path))
    client = TestClient(app)
    client.put("/api/workspace/notes/to-delete.md", json={"name": "to-delete.md", "content": "gone"})
    r = client.delete("/api/workspace/notes/to-delete.md")
    assert r.status_code == 204
    assert client.get("/api/workspace/notes/to-delete.md").status_code == 404

def test_workspace_api_name_mismatch(monkeypatch, tmp_path):
    monkeypatch.setattr("app.services.workspace.settings.workspace_root", str(tmp_path))
    client = TestClient(app)
    r = client.put("/api/workspace/notes/foo.md", json={"name": "bar.md", "content": "mismatch"})
    assert r.status_code == 400

def test_search_get_requires_query():
    client = TestClient(app)
    assert client.get("/api/search").status_code == 422
