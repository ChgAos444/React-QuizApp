// =============================================================================
// E2E / SYSTEM TESTS — Timer & failure handling (black-box, full stack)
// Author: Arlind Frakulla
//
// Covers a time-based journey and a failure path. The error test uses
// Playwright request interception to simulate the backend being unreachable,
// demonstrating the app's resilience (the "error" status screen).
// =============================================================================
import { test, expect } from "@playwright/test";
import { QuizPage } from "../poms/quiz-page";

test.describe("Timer & resilience", () => {
  test("counts the timer down while the quiz is active", async ({ page }) => {
    const quiz = new QuizPage(page);
    await quiz.goto();
    await quiz.waitForReady();
    await quiz.start();

    const before = await quiz.timerSeconds();
    expect(before).toBeGreaterThan(0);

    // Wait a few real seconds and confirm the countdown progressed.
    await page.waitForTimeout(2500);
    const after = await quiz.timerSeconds();
    expect(after).toBeLessThan(before);
  });

  test("shows the error screen when questions cannot be loaded", async ({ page }) => {
    const quiz = new QuizPage(page);

    // Simulate a backend outage: abort the questions request.
    await page.route("**/questions", (route) => route.abort());

    await quiz.goto();
    await expect(quiz.errorMessage).toBeVisible();
  });
});
