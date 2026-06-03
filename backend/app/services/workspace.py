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
        notes: list[NoteSummary] = []
        for path in sorted(self.root.glob("*")):
            if path.is_file():
                notes.append(NoteSummary(name=path.name, size=path.stat().st_size))
        return notes

    def read_note(self, name: str) -> Note:
        path = self._note_path(name)
        if not path.exists():
            raise WorkspaceError("Note not found")
        return Note(name=path.name, content=path.read_text(encoding="utf-8"))

    def write_note(self, note: Note) -> Note:
        path = self._note_path(note.name)
        path.write_text(note.content, encoding="utf-8")
        return note


workspace_service = WorkspaceService()
