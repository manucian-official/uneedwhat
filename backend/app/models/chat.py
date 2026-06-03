from typing import Literal

from pydantic import BaseModel, Field


Role = Literal["system", "user", "assistant", "tool"]


class ChatMessage(BaseModel):
    role: Role
    content: str


class ChatRequest(BaseModel):
    messages: list[ChatMessage]
    provider: Literal["ollama", "llamacpp"] | None = None
    model: str | None = None
    temperature: float = Field(default=0.7, ge=0, le=2)
    stream: bool = False


class ChatResponse(BaseModel):
    provider: str
    model: str
    content: str

