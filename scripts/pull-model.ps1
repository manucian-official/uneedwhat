param(
    [string]$Model = "llama3.1:8b"
)

docker compose exec ollama ollama pull $Model

