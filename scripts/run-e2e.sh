#!/bin/sh
# Runs the full end-to-end suite inside the isolated Docker stack and tears it
# down afterwards. Exit code mirrors the Playwright result (CI-friendly).
set -e
COMPOSE="$(dirname "$0")/../docker-compose.e2e.yml"

docker compose -f "$COMPOSE" down -v >/dev/null 2>&1 || true
docker compose -f "$COMPOSE" up --build --exit-code-from playwright
code=$?
docker compose -f "$COMPOSE" down -v >/dev/null 2>&1 || true
exit $code
