from abc import ABC, abstractmethod

import httpx

from ..core.config import settings
from ..models.chat import ChatMessage


class InferenceError(RuntimeError):
    pass


class InferenceProvider(ABC):
    name: str

    @abstractmethod
    async def chat(
        self,
        messages: list[ChatMessage],
        model: str | None,
        temperature: float,
    ) -> tuple[str, str]:
        raise NotImplementedError


class OllamaProvider(InferenceProvider):
    name = "ollama"

    async def chat(
        self,
        messages: list[ChatMessage],
        model: str | None,
        temperature: float,
    ) -> tuple[str, str]:
        selected_model = model or settings.ollama_model
        payload = {
            "model": selected_model,
            "messages": [message.model_dump() for message in messages],
            "stream": False,
            "options": {"temperature": temperature},
        }
        async with httpx.AsyncClient(timeout=120) as client:
            response = await client.post(f"{settings.ollama_base_url}/api/chat", json=payload)
        if response.is_error:
            raise InferenceError(response.text)
        data = response.json()
        return selected_model, data.get("message", {}).get("content", "")


class LlamaCppProvider(InferenceProvider):
    name = "llamacpp"

    async def chat(
        self,
        messages: list[ChatMessage],
        model: str | None,
        temperature: float,
    ) -> tuple[str, str]:
        selected_model = model or settings.llamacpp_model
        payload = {
            "model": selected_model,
            "messages": [message.model_dump() for message in messages],
            "temperature": temperature,
            "stream": False,
        }
        async with httpx.AsyncClient(timeout=120) as client:
            response = await client.post(f"{settings.llamacpp_base_url}/v1/chat/completions", json=payload)
        if response.is_error:
            raise InferenceError(response.text)
        data = response.json()
        choices = data.get("choices", [])
        if not choices:
            return selected_model, ""
        return selected_model, choices[0].get("message", {}).get("content", "")


class InferenceService:
    def __init__(self) -> None:
        self.providers: dict[str, InferenceProvider] = {
            "ollama": OllamaProvider(),
            "llamacpp": LlamaCppProvider(),
        }

    async def chat(
        self,
        provider_name: str | None,
        messages: list[ChatMessage],
        model: str | None,
        temperature: float,
    ) -> tuple[str, str, str]:
        provider_key = provider_name or settings.ai_default_provider
        provider = self.providers.get(provider_key)
        if provider is None:
            raise InferenceError(f"Unknown provider: {provider_key}")
        selected_model, content = await provider.chat(messages, model, temperature)
        return provider.name, selected_model, content


inference_service = InferenceService()
