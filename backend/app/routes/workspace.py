from fastapi import APIRouter, HTTPException

from ..models.workspace import Note, NoteSummary
from ..services.workspace import WorkspaceError, workspace_service


router = APIRouter(prefix="/workspace", tags=["workspace"])


@router.get("/notes", response_model=list[NoteSummary])
async def list_notes() -> list[NoteSummary]:
    return workspace_service.list_notes()


@router.get("/notes/{name}", response_model=Note)
async def read_note(name: str) -> Note:
    try:
        return workspace_service.read_note(name)
    except WorkspaceError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.put("/notes/{name}", response_model=Note)
async def write_note(name: str, note: Note) -> Note:
    if name != note.name:
        raise HTTPException(status_code=400, detail="Path name and note name must match")
    try:
        return workspace_service.write_note(note)
    except WorkspaceError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
