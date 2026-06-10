from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from ..models.chat import ChatRequest, ChatResponse
from ..services.inference import InferenceError, inference_service

router = APIRouter(prefix="/chat", tags=["chat"])

@router.post("", response_model=ChatResponse)
async def chat(request: ChatRequest) -> ChatResponse | StreamingResponse:
    if request.stream:
        async def event_stream():
            try:
                async for chunk in inference_service.stream(
                    provider_name=request.provider, messages=request.messages,
                    model=request.model, temperature=request.temperature,
                ):
                    yield f"data: {chunk}\n\n"
                yield "data: [DONE]\n\n"
            except InferenceError as exc:
                yield f"data: [ERROR] {exc}\n\n"
        return StreamingResponse(event_stream(), media_type="text/event-stream",
                                 headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"})
    try:
        provider, model, content = await inference_service.chat(
            provider_name=request.provider, messages=request.messages,
            model=request.model, temperature=request.temperature,
        )
    except InferenceError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc
    return ChatResponse(provider=provider, model=model, content=content)
