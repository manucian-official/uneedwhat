$repoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
New-Item -ItemType Directory -Force -Path "$repoRoot\logs" | Out-Null

Start-Process -FilePath "$repoRoot\.venv\Scripts\python.exe" `
    -ArgumentList "-m","uvicorn","app.main:app","--host","127.0.0.1","--port","8000" `
    -WorkingDirectory "$repoRoot\backend" `
    -RedirectStandardOutput "$repoRoot\logs\backend.log" `
    -RedirectStandardError "$repoRoot\logs\backend.err.log" `
    -WindowStyle Hidden

Start-Process -FilePath "npm.cmd" `
    -ArgumentList "run","dev","--","--host","127.0.0.1","--port","5173" `
    -WorkingDirectory "$repoRoot\apps\web" `
    -RedirectStandardOutput "$repoRoot\logs\web.log" `
    -RedirectStandardError "$repoRoot\logs\web.err.log" `
    -WindowStyle Hidden

Write-Host "Web UI: http://127.0.0.1:5173"
Write-Host "API docs: http://127.0.0.1:8000/docs"

