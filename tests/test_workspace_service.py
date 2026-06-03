from app.models.workspace import Note
from app.services.workspace import WorkspaceError, WorkspaceService


def test_workspace_rejects_path_escape(monkeypatch, tmp_path) -> None:
    monkeypatch.setattr("app.services.workspace.settings.workspace_root", str(tmp_path))
    service = WorkspaceService()
    try:
        service.read_note("../secret.txt")
    except WorkspaceError as exc:
        assert "escapes" in str(exc)
    else:
        raise AssertionError("Expected path escape to be rejected")


def test_workspace_round_trip(monkeypatch, tmp_path) -> None:
    monkeypatch.setattr("app.services.workspace.settings.workspace_root", str(tmp_path))
    service = WorkspaceService()
    note = service.write_note(Note(name="session.md", content="hello local"))
    assert note.content == "hello local"
    assert service.read_note("session.md").content == "hello local"
