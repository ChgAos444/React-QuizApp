// @ts-check
import { defineConfig, devices } from "@playwright/test";

// BASE_URL points at the frontend container inside the isolated E2E stack
// (docker-compose.e2e.yml sets it to http://frontend:3000). When running
// against a manually started dev server it falls back to localhost:3000.
const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["html", { open: "never" }], ["list"]],
  use: {
    baseURL: BASE_URL,
    // "logs, logs, logs (& screenshots & traces)" — WAT4 E2E best practices.
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  ],
});
