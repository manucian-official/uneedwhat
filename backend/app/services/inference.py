from abc import ABC, abstractmethod
from collections.abc import AsyncGenerator
import httpx
from ..core.config import settings
from ..models.chat import ChatMessage

class InferenceError(RuntimeError):
    pass

class InferenceProvider(ABC):
    name: str

    @abstractmethod
    async def chat(self, messages, model, temperature) -> tuple[str, str]:
        raise NotImplementedError

    async def stream(self, messages, model, temperature) -> AsyncGenerator[str, None]:
        _, content = await self.chat(messages, model, temperature)
        yield content

class OllamaProvider(InferenceProvider):
    name = "ollama"

    async def chat(self, messages, model, temperature):
        selected_model = model or settings.ollama_model
        payload = {"model": selected_model, "messages": [m.model_dump() for m in messages],
                   "stream": False, "options": {"temperature": temperature}}
        async with httpx.AsyncClient(timeout=120) as client:
            r = await client.post(f"{settings.ollama_base_url}/api/chat", json=payload)
        if r.is_error:
            raise InferenceError(r.text)
        return selected_model, r.json().get("message", {}).get("content", "")

    async def stream(self, messages, model, temperature):
        import json
        selected_model = model or settings.ollama_model
        payload = {"model": selected_model, "messages": [m.model_dump() for m in messages],
                   "stream": True, "options": {"temperature": temperature}}
        async with httpx.AsyncClient(timeout=120) as client:
            async with client.stream("POST", f"{settings.ollama_base_url}/api/chat", json=payload) as r:
                if r.is_error:
                    raise InferenceError(await r.aread())
                async for line in r.aiter_lines():
                    if not line.strip():
                        continue
                    try:
                        data = json.loads(line)
                    except json.JSONDecodeError:
                        continue
                    chunk = data.get("message", {}).get("content", "")
                    if chunk:
                        yield chunk
                    if data.get("done"):
                        break

class LlamaCppProvider(InferenceProvider):
    name = "llamacpp"

    async def chat(self, messages, model, temperature):
        selected_model = model or settings.llamacpp_model
        payload = {"model": selected_model, "messages": [m.model_dump() for m in messages],
                   "temperature": temperature, "stream": False}
        async with httpx.AsyncClient(timeout=120) as client:
            r = await client.post(f"{settings.llamacpp_base_url}/v1/chat/completions", json=payload)
        if r.is_error:
            raise InferenceError(r.text)
        choices = r.json().get("choices", [])
        return selected_model, (choices[0].get("message", {}).get("content", "") if choices else "")

    async def stream(self, messages, model, temperature):
        import json
        selected_model = model or settings.llamacpp_model
        payload = {"model": selected_model, "messages": [m.model_dump() for m in messages],
                   "temperature": temperature, "stream": True}
        async with httpx.AsyncClient(timeout=120) as client:
            async with client.stream("POST", f"{settings.llamacpp_base_url}/v1/chat/completions", json=payload) as r:
                if r.is_error:
                    raise InferenceError(await r.aread())
                async for line in r.aiter_lines():
                    if not line.startswith("data: "):
                        continue
                    raw = line[6:].strip()
                    if raw == "[DONE]":
                        break
                    try:
                        data = json.loads(raw)
                    except json.JSONDecodeError:
                        continue
                    delta = data.get("choices", [{}])[0].get("delta", {}).get("content", "")
                    if delta:
                        yield delta

class InferenceService:
    def __init__(self):
        self.providers = {"ollama": OllamaProvider(), "llamacpp": LlamaCppProvider()}

    def _get(self, name):
        key = name or settings.ai_default_provider
        p = self.providers.get(key)
        if p is None:
            raise InferenceError(f"Unknown provider: {key!r}")
        return p

    async def chat(self, provider_name, messages, model, temperature):
        p = self._get(provider_name)
        model_out, content = await p.chat(messages, model, temperature)
        return p.name, model_out, content

    async def stream(self, provider_name, messages, model, temperature):
        p = self._get(provider_name)
        async for chunk in p.stream(messages, model, temperature):
            yield chunk

inference_service = InferenceService()
