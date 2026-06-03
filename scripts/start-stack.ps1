param(
    [switch]$WithMcp,
    [switch]$WithLlamaCpp
)

$profiles = @()
if ($WithMcp) { $profiles += "--profile"; $profiles += "mcp" }
if ($WithLlamaCpp) { $profiles += "--profile"; $profiles += "llamacpp" }

docker compose @profiles up --build

