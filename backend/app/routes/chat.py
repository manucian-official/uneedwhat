from fastapi import APIRouter, HTTPException

from ..models.chat import ChatRequest, ChatResponse
from ..services.inference import InferenceError, inference_service


router = APIRouter(prefix="/chat", tags=["chat"])


@router.post("", response_model=ChatResponse)
async def chat(request: ChatRequest) -> ChatResponse:
    try:
        provider, model, content = await inference_service.chat(
            provider_name=request.provider,
            messages=request.messages,
            model=request.model,
            temperature=request.temperature,
        )
    except InferenceError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc
    return ChatResponse(provider=provider, model=model, content=content)
