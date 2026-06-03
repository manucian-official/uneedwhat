from pydantic import BaseModel, Field


class Note(BaseModel):
    name: str = Field(pattern=r"^[a-zA-Z0-9_.-]+$")
    content: str


class NoteSummary(BaseModel):
    name: str
    size: int

