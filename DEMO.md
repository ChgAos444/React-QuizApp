# Live demo runbook (presentation)

Everything runs through **Docker** — no Node.js needs to be installed.
**Before the presentation:** open **Docker Desktop** and wait until the whale icon is
steady/green. (All required images are already downloaded on this machine, so nothing
big downloads during the demo.)

Open a terminal in the project folder first:

```powershell
cd C:\Users\arens\OneDrive\Desktop\React-QuizApp
```

> One-time only (if `node_modules` is missing, e.g. on a fresh machine):
> `docker run --rm -v "${PWD}:/app" -w /app node:20-bullseye-slim npm ci`

---

## 1. Run the app (the quiz itself)

```powershell
docker compose -f docker-compose.demo.yml up --build
```

Then open **http://localhost:3000** in a browser → click **"Let's start"**, answer
questions, watch the score + timer, reach the finish screen.
(The questions are served by the local backend on http://localhost:9000/questions.)

Stop it: press **Ctrl + C**, then:

```powershell
docker compose -f docker-compose.demo.yml down
```

---

## 2. Run the unit + integration tests (Jest) — ~30 s

```powershell
docker run --rm -v "${PWD}:/app" -w /app -e CI=true node:20-bullseye-slim npx react-scripts test src/__tests__ --watchAll=false
```

Expected: **`Tests: 24 passed`** (15 unit + 9 integration).

---

## 3. Run the end-to-end tests (Playwright, real browser) — ~1–2 min

```powershell
docker compose -f docker-compose.e2e.yml up --build --exit-code-from playwright
docker compose -f docker-compose.e2e.yml down -v
```

Expected: **`6 passed`**. This spins up the isolated stack (backend + frontend +
browser) in Docker, runs the journeys, and tears it down.

---

## 4. Run a load test (k6) — ~30 s

Start the backend, then fire load at it:

```powershell
docker compose -f docker-compose.demo.yml up -d backend
docker run --rm -v "${PWD}/load-tests:/scripts" -e TARGET=http://host.docker.internal:9000 grafana/k6 run /scripts/01-constant-load.js
```

Expected: all checks ✓, **p95 well under 500 ms, 0% errors** (thresholds pass).
Swap the script for `02-ramp-up-down.js` or `03-spike.js` to show the other profiles.

Stop the backend afterwards:

```powershell
docker compose -f docker-compose.demo.yml down
```

---

## If the live run fails (backup plan)

You already have committed **proof** to show on screen instead:

* Load-test charts/reports: `load-tests/results/*.report.html` (open in a browser) and
  `*.summary.json` / `*.txt`.
* The full write-up with results & analysis: `REPORT.md`.
* After an E2E run, the Playwright report: `e2e/playwright-report/index.html`.

> Tip: do one full dry-run of sections 1–4 **before** your slot so the images are warm
> and you know the timing.
