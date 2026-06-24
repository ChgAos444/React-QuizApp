// =============================================================================
// LOAD TEST 02 — Ramp-up / ramp-down (finding the saturation point)
// Author: Arens Danja
// Tool: k6
//
// Purpose (WAT4 "Load Profiles" -> Ramp-Up / Ramp-Down,
//          "Detecting the Saturation Point"):
//   Gradually increase the concurrent users from 0 up to 100 and back down,
//   so we can watch where response time stops scaling linearly (the "knee
//   point") and the single-threaded json-server starts to queue work.
//
// We deliberately read the questions list (the app's read-heavy hot path).
// Thresholds are intentionally looser than the baseline SLO because this run
// pushes the service past its comfort zone on purpose.
// =============================================================================
import http from "k6/http";
import { check, sleep } from "k6";

const TARGET = __ENV.TARGET || "http://localhost:9000";

export const options = {
  scenarios: {
    ramp: {
      executor: "ramping-vus",
      startVUs: 0,
      stages: [
        { duration: "20s", target: 20 }, // warm-up ramp
        { duration: "20s", target: 50 }, // moderate load
        { duration: "30s", target: 100 }, // push towards saturation
        { duration: "20s", target: 0 }, // ramp down
      ],
    },
  },
  thresholds: {
    // Record the p90/p95/p99 so the report can discuss percentiles.
    http_req_duration: ["p(95)<1500"],
    http_req_failed: ["rate<0.05"],
  },
};

export default function () {
  const res = http.get(`${TARGET}/questions`);
  check(res, { "status is 200": (r) => r.status === 200 });
  sleep(1); // think time
}
