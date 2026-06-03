$repoRoot = Split-Path -Parent $PSScriptRoot
Set-Location "$repoRoot\apps\web"
npm run dev -- --host 127.0.0.1 --port 5173

