// =============================================================================
// LOAD TEST 03 — Spike test (sudden traffic surge)
// Author: Arlind Frakulla
// Tool: k6
//
// Purpose (WAT4 "Types of Load Testing" -> Spike Testing, e.g. ticket sales):
//   Hit the API with a sudden surge of virtual users (a near-instant jump to
//   200 concurrent users), hold it briefly, then drop back to normal. We want
//   to see how the service behaves under an abrupt spike (error-rate spikes,
//   response-time spikes) and whether it recovers afterwards.
//
// This run is also a small POST workload: it increments-style writes are not
// available on a read API, so we exercise the read endpoint that the frontend
// actually depends on at start-up.
// =============================================================================
import http from "k6/http";
import { check, sleep } from "k6";
import { Rate } from "k6/metrics";

const TARGET = __ENV.TARGET || "http://localhost:9000";

// Custom metric so the summary clearly reports how many requests failed
// during the spike.
export const errorRate = new Rate("spike_errors");

export const options = {
  scenarios: {
    spike: {
      executor: "ramping-vus",
      startVUs: 5,
      stages: [
        { duration: "10s", target: 5 }, // calm baseline
        { duration: "5s", target: 200 }, // sudden spike
        { duration: "20s", target: 200 }, // hold the spike
        { duration: "5s", target: 5 }, // drop back
        { duration: "10s", target: 5 }, // observe recovery
      ],
    },
  },
  thresholds: {
    // We only require that the service does not collapse entirely: fewer than
    // 25 % of requests may fail during the surge.
    spike_errors: ["rate<0.25"],
  },
};

export default function () {
  const res = http.get(`${TARGET}/questions`);
  const ok = check(res, { "status is 200": (r) => r.status === 200 });
  errorRate.add(!ok);
  sleep(0.5);
}
