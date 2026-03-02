Param()
$root = Split-Path -Path $MyInvocation.MyCommand.Path -Parent
Set-Location $root

Write-Host "Starting PostgreSQL via docker-compose..."
docker-compose up -d db

Write-Host "Waiting for Postgres to become ready..."
while (-not (docker exec up-postgres pg_isready -U postgres -q)) {
  Start-Sleep -Seconds 1
}

Write-Host "Postgres is ready. Starting backend and frontend dev servers..."

# Start backend in a new PowerShell window and keep it running
$backendEnv = @{ CORS_ORIGIN = 'http://localhost:3000'; JWT_SECRET = 'devsecret'; DATABASE_URL = 'postgresql://postgres:postgres@localhost:5432/universalplace'; NODE_ENV='development' }
Start-Process -NoNewWindow -FilePath pwsh -ArgumentList "-NoExit","-Command","cd $root/backend; $env:CORS_ORIGIN='$($backendEnv.CORS_ORIGIN)'; $env:JWT_SECRET='$($backendEnv.JWT_SECRET)'; $env:DATABASE_URL='$($backendEnv.DATABASE_URL)'; $env:NODE_ENV='$($backendEnv.NODE_ENV)'; npm run dev"

# Start frontend in current window
npm run dev
