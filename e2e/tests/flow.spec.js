// =============================================================================
// E2E / SYSTEM TESTS — Full quiz journey (black-box, full stack)
// Author: Arens Danja
//
// Verifies the two business-critical journeys (WAT4 "E2E Best Practices":
// verify only business-critical journeys — happy path + a key alternative).
// =============================================================================
import { test, expect } from "@playwright/test";
import { QuizPage } from "../poms/quiz-page";

test.describe("Quiz journey", () => {
  test("plays the whole quiz from start to finish screen", async ({ page }) => {
    const quiz = new QuizPage(page);
    await quiz.goto();
    await quiz.waitForReady();

    // Start screen advertises the number of loaded questions.
    await expect(quiz.startHeading).toBeVisible();

    await quiz.start();
    await quiz.completeQuiz();

    // Finish screen shows a score line and the highscore.
    await expect(quiz.result).toBeVisible();
    await expect(quiz.result).toContainText(/you scored/i);
    await expect(quiz.highscore).toBeVisible();
  });

  test("can restart the quiz after finishing", async ({ page }) => {
    const quiz = new QuizPage(page);
    await quiz.goto();
    await quiz.waitForReady();
    await quiz.start();
    await quiz.completeQuiz();

    await expect(quiz.restartButton).toBeVisible();
    await quiz.restartButton.click();

    // Back to the start screen, ready for another run.
    await expect(quiz.startButton).toBeVisible();
  });
});
