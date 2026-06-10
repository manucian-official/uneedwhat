from pathlib import Path
from ..core.config import settings
from ..models.workspace import Note, NoteSummary

class WorkspaceError(RuntimeError):
    pass

class WorkspaceService:
    @property
    def root(self) -> Path:
        path = Path(settings.workspace_root).resolve()
        path.mkdir(parents=True, exist_ok=True)
        return path

    def _note_path(self, name: str) -> Path:
        path = (self.root / name).resolve()
        if self.root not in path.parents and path != self.root:
            raise WorkspaceError("Path escapes workspace root")
        return path

    def list_notes(self) -> list[NoteSummary]:
        return [NoteSummary(name=p.name, size=p.stat().st_size) for p in sorted(self.root.glob("*")) if p.is_file()]

    def read_note(self, name: str) -> Note:
        path = self._note_path(name)
        if not path.exists():
            raise WorkspaceError(f"Note not found: {name!r}")
        return Note(name=path.name, content=path.read_text(encoding="utf-8"))

    def write_note(self, note: Note) -> Note:
        self._note_path(note.name).write_text(note.content, encoding="utf-8")
        return note

    def delete_note(self, name: str) -> None:
        path = self._note_path(name)
        if not path.exists():
            raise WorkspaceError(f"Note not found: {name!r}")
        path.unlink()

workspace_service = WorkspaceService()
