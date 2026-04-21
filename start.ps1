$ErrorActionPreference = 'Stop'
$root = $PSScriptRoot

Write-Host "Starting server (EI.Api) in background..."
$server = Start-Process -FilePath "dotnet" `
    -ArgumentList "run", "--project", "EI.Api" `
    -WorkingDirectory "$root\server" `
    -NoNewWindow -PassThru

try {
    Write-Host "Starting client (Vite)..."
    Push-Location "$root\client"
    npm run dev
}
finally {
    Pop-Location
    if ($server -and -not $server.HasExited) {
        Write-Host "Stopping server (PID $($server.Id))..."
        Stop-Process -Id $server.Id -Force -ErrorAction SilentlyContinue
    }
}
