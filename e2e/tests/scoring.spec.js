// =============================================================================
// E2E / SYSTEM TESTS — Scoring (black-box, full stack)
// Author: Erti Prenci
//
// These run against the complete, Docker-isolated system (frontend container +
// json-server backend container) in a real browser. They verify business
// behavior end-to-end without any knowledge of the implementation.
// The backend serves a fixed, known question set (data/questions.json), so the
// correct answer to question 1 ("React") is deterministic.
// =============================================================================
import { test, expect } from "@playwright/test";
import { QuizPage } from "../poms/quiz-page";

test.describe("Scoring", () => {
  test("awards points for a correct answer", async ({ page }) => {
    const quiz = new QuizPage(page);
    await quiz.goto();
    await quiz.waitForReady();
    await quiz.start();

    // Question 1 is "Which is the most popular JavaScript framework?" -> React.
    expect(await quiz.points()).toBe(0);
    await quiz.answer("React");
    expect(await quiz.points()).toBe(10);
  });

  test("prevents answering the same question twice", async ({ page }) => {
    const quiz = new QuizPage(page);
    await quiz.goto();
    await quiz.waitForReady();
    await quiz.start();

    await quiz.options.first().click();

    // After answering, every option button is disabled.
    const count = await quiz.options.count();
    for (let i = 0; i < count; i++) {
      await expect(quiz.options.nth(i)).toBeDisabled();
    }
  });
});
