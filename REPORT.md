# Web Application Testing — Project Report

**Application tested:** React Quiz App
**Original repository (forked):** <https://github.com/VINAYAK9669/React-QuizApp>

**Team:**

| Member | Area of responsibility |
|---|---|
| **Erti Prenci** | Scoring & answer logic |
| **Arens Danja** | Quiz flow & navigation |
| **Arlind Frakulla** | Timer, status changes & resilience |

We took an existing open-source app that had **no tests at all** and built a full
test suite around it: **33 tests in total, 11 per person**, spread across every level
of the *test pyramid* (unit, integration, end-to-end and load tests). Each test file
names its author, so it's clear who wrote what.

> New to the terms used here? There's a plain-English **glossary at the end (§6)**.

---

## 1. The application

The **React Quiz App** is a small website (a "single-page app") that runs a
multiple-choice quiz about React. In short:

1. When it opens, it **downloads a list of questions** from a small backend server.
2. You start the quiz and answer questions. Correct answers earn points, and each
   question has a **5-second timer**.
3. When the questions run out (or the timer hits zero), a **finish screen** shows your
   score and your best score. You can restart.

Behind the scenes the whole app is run by **one piece of logic** (a "reducer" — see
glossary) that moves the app through a few clear stages:
**loading → ready → playing → finished** (plus an **error** stage if the questions
can't be loaded).

```
   Frontend (the React app)                 Backend (a small server)
 ┌──────────────────────────┐   asks for   ┌────────────────────────┐
 │  the quiz screens + the   │  questions   │  json-server           │
 │  logic that runs the quiz │ ───────────► │  returns the questions │
 └──────────────────────────┘    (HTTP)    └────────────────────────┘
```

---

## 2. What we changed before testing (and why)

The original app worked, but it was written in a way that made it hard to test. So,
**before writing any tests**, we made three small changes. Importantly, none of them
change how the app behaves for a user — they just make it testable:

| Change | What it means | Why it helps |
|---|---|---|
| **Separated the logic** | Moved the quiz rules into their own file, away from the screen code. | The rules can now be tested completely on their own — no browser needed. |
| **Made the data source flexible** | The app reads the questions from a *configurable* address instead of a fixed one. | The same code can point at the real server, a local one, or a test one. |
| **Restored the backend** | Added the missing data file so the small backend server works again. | Gives us a real server to run our load tests against. |

We also added a few invisible "labels" to buttons and elements so our automated
browser tests can find them reliably.

---

## 3. How we tested — the test pyramid

We followed the **test pyramid**: write **lots of small, fast tests** at the bottom,
**fewer** as they get slower and more expensive, and only a **handful** of the slow,
full-system tests at the top. On the side we added **load tests**, which check
*performance* rather than *correctness*.

```
                  ┌──────────────────┐
                  │   6  End-to-end   │   slow — real browser (Playwright)
              ┌───┴──────────────────┴───┐
              │     9  Integration       │   medium — components in a fake browser
          ┌───┴──────────────────────────┴───┐
          │          15  Unit                 │   fast — pure logic only
          └───────────────────────────────────┘
                  +  3  Load tests (performance)
```

| Level | Tool | How many | Per person |
|---|---|---:|---|
| **Unit** | Jest | 15 | 5 |
| **Integration** | Jest + React Testing Library | 9 | 3 |
| **End-to-end** | Playwright | 6 | 2 |
| **Load** | k6 | 3 | 1 |
| **Total** | | **33** | **11** |

### What each level does

* **Unit tests** check the **quiz logic on its own** — no browser, no internet. We give
  it a situation and an action ("the user picked the correct answer") and check the
  result ("points went up"). These are tiny and run in seconds.
  *Example: "a correct answer adds the question's points"; "the timer reaching zero
  ends the quiz".*

* **Integration tests** check that the **screens are wired to the logic correctly**.
  We render a real component in a *fake browser* and check it shows the right thing and
  triggers the right action when clicked. We use a **stand-in** ("mock") for the part
  that would normally update the app, so we can test one screen in isolation.

* **End-to-end (E2E) tests** check the **whole app in a real browser**, the way a user
  would use it. We only test the **important journeys**: playing the quiz through to the
  finish, restarting, and a failure case — *if the backend is down, the app shows an
  error screen instead of crashing*.

* **Load tests** check **performance** — how the backend behaves under many users at
  once (see §4).

### Keeping tests independent (isolation)

Tests must not interfere with each other:
* Unit tests share nothing — the logic is a pure function.
* Integration tests get a fresh fake browser each time.
* **E2E tests run in throwaway Docker containers** — a backend, the app, and the
  browser, all started fresh and thrown away after the run, so each run is clean and
  repeatable.

### Automated checks (CI/CD)

We set up **GitHub Actions** so that **every time code is pushed, all the tests run
automatically**. If something breaks — including a load test missing its performance
target — the build is marked as failed. This catches problems early.

---

## 4. Load testing (performance)

Load testing answers *"how well does it hold up under pressure?"* rather than
*"is it correct?"*.

**Our target (SLO):** the questions should load in **under 500 ms for 95% of requests**,
with **fewer than 1% errors**.

We ran three realistic patterns against the backend:

| # | Pattern | Author | What it does |
|---|---|---|---|
| 01 | **Steady load** | Erti Prenci | 20 users for 30 seconds — checks the target |
| 02 | **Ramp up/down** | Arens Danja | slowly grows to 100 users, then back down |
| 03 | **Spike** | Arlind Frakulla | jumps to **200 users** almost instantly |

### Results

![Load test results](docs/load-test-results.svg)

| Measurement | 01 Steady | 02 Ramp | 03 Spike |
|---|---:|---:|---:|
| Requests | 600 | 4,158 | 10,271 |
| Requests per second | 19.5 | 44.0 | 197.9 |
| Typical response time (p95) | ~5 ms | ~4 ms | ~4 ms |
| Slowest single response (max) | 29 ms | 20 ms | **580 ms** |
| Errors | 0% | 0% | 0% |
| Target met | ✅ | ✅ | ✅ |

*(The detailed charts are saved in `load-tests/results/*.report.html`.)*

### What the numbers tell us

* **The target is met easily.** Even under load the questions come back in about 5 ms —
  far under our 500 ms target — with zero errors.
* **Why we look at the slowest response, not just the average.** During the spike, the
  *typical* response stayed around 4 ms, **but the single slowest one jumped to 580 ms**
  — the moment 200 users all connected at once. An average would hide that; the maximum
  shows it. That's why we report both.
* **We never reached the breaking point.** The backend handled everything we threw at it
  because the data is tiny. The weak spot would be that the backend is **one simple
  process with no caching**. To handle real scale you'd add **caching**, run **several
  copies behind a load balancer**, and serve the data from a **CDN**.

---

## 5. How to run everything

The machine used has **only Docker** installed (no Node.js), so every command runs
inside a container — nothing needs to be installed globally.

```bash
# 1) one-time setup: install the app's dependencies
docker run --rm -v "$PWD:/app" -w /app node:20-bullseye-slim npm ci

# 2) unit + integration tests  → expect "24 passed"
docker run --rm -v "$PWD:/app" -w /app -e CI=true \
  node:20-bullseye-slim npx react-scripts test src/__tests__ --watchAll=false

# 3) end-to-end tests (isolated Docker stack)  → expect "6 passed"
docker compose -f docker-compose.e2e.yml up --build --exit-code-from playwright
docker compose -f docker-compose.e2e.yml down -v

# 4) a load test (k6)
docker network create wat4-load
docker run -d --name wat4-backend --network wat4-load -v "$PWD:/app" -w /app \
  node:20-bullseye-slim npx json-server --watch data/questions.json --host 0.0.0.0 --port 9000
docker run --rm --network wat4-load -v "$PWD/load-tests:/scripts" \
  -e TARGET=http://wat4-backend:9000 grafana/k6 run /scripts/03-spike.js
```

---

## 6. Glossary — key terms in plain English

* **Test pyramid** — a strategy: many fast tests at the bottom, few slow ones at the top.
* **Unit test** — tests one small piece of code completely on its own.
* **Integration test** — tests a piece together with the parts around it (or stand-ins).
* **End-to-end (E2E) test** — tests the whole running app like a real user would.
* **Load test** — measures performance when many users hit the app at once.
* **Reducer** — the single function that holds all the quiz rules. You give it the
  current state and an action; it returns the new state.
* **State machine** — the idea that the app is always in one clear stage (loading,
  ready, playing, finished, error) and moves between them on events.
* **Mock / test double** — a fake stand-in for a real part, so you can test one piece
  without running everything.
* **jsdom** — a fake browser used so component tests can run without a real window.
* **Page Object Model** — a tidy way to organise browser tests (one helper per screen).
* **SLO (Service Level Objective)** — a performance target you promise to meet
  (here: 95% of requests under 500 ms, under 1% errors).
* **p95** — "95th percentile": 95% of requests were at least this fast. A fairer summary
  than the average because it accounts for the slower ones.
* **CI/CD (GitHub Actions)** — automation that runs all the tests on every code push.
* **Docker container** — a sealed, throwaway box that runs software the same way on any
  machine; we use it so tests are clean and repeatable.
* **json-server** — a tiny tool that turns a data file into a real web backend.
