from fastapi import APIRouter, HTTPException, Query
from ..models.workspace import Note, NoteSummary
from ..services.workspace import WorkspaceError, workspace_service

router = APIRouter(prefix="/workspace", tags=["workspace"])

@router.get("/notes", response_model=list[NoteSummary])
async def list_notes(limit: int = Query(default=50, ge=1, le=200)) -> list[NoteSummary]:
    return workspace_service.list_notes()[:limit]

@router.get("/notes/{name}", response_model=Note)
async def read_note(name: str) -> Note:
    try:
        return workspace_service.read_note(name)
    except WorkspaceError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc

@router.put("/notes/{name}", response_model=Note)
async def write_note(name: str, note: Note) -> Note:
    if name != note.name:
        raise HTTPException(status_code=400, detail="Path name and note body name must match.")
    try:
        return workspace_service.write_note(note)
    except WorkspaceError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

@router.delete("/notes/{name}", status_code=204)
async def delete_note(name: str) -> None:
    try:
        workspace_service.delete_note(name)
    except WorkspaceError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
