# Runs the full end-to-end suite inside the isolated Docker stack and tears it
# down afterwards. Exit code mirrors the Playwright result (CI-friendly).
$ErrorActionPreference = "Stop"
$compose = Join-Path $PSScriptRoot "..\docker-compose.e2e.yml"

docker compose -f $compose down -v 2>$null | Out-Null
docker compose -f $compose up --build --exit-code-from playwright
$code = $LASTEXITCODE
docker compose -f $compose down -v | Out-Null
exit $code
