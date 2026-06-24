// =============================================================================
// LOAD TEST 01 — Constant load / SLO validation
// Author: Erti Prenci
// Tool: k6   (run inside Docker, see load-tests/README.md)
//
// Purpose (WAT4 "Types of Load Testing" -> Load Testing):
//   Drive the questions REST API (json-server) with a steady, realistic number
//   of concurrent users and validate our Service Level Objective:
//        SLO: p95 response time < 500 ms AND error rate < 1 %.
//   This is the baseline run the ramp and spike tests are compared against.
//
// Workload model: 20 constant virtual users for 30s, each with ~1s think time
// between requests (WAT4 "Think Time": without it the load is unrealistic).
// =============================================================================
import http from "k6/http";
import { check, sleep } from "k6";

const TARGET = __ENV.TARGET || "http://localhost:9000";

export const options = {
  scenarios: {
    constant_load: {
      executor: "constant-vus",
      vus: 20,
      duration: "30s",
    },
  },
  // Thresholds turn the run into a pass/fail gate suitable for CI/CD
  // ("Threshold-based pipeline failures" from the Load Testing slides).
  thresholds: {
    http_req_duration: ["p(95)<500"],
    http_req_failed: ["rate<0.01"],
    checks: ["rate>0.99"],
  },
};

export default function () {
  const res = http.get(`${TARGET}/questions`);

  check(res, {
    "status is 200": (r) => r.status === 200,
    "returns 15 questions": (r) => {
      try {
        return JSON.parse(r.body).length === 15;
      } catch (e) {
        return false;
      }
    },
  });

  sleep(1); // think time
}
