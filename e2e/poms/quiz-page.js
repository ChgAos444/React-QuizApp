import { expect } from "@playwright/test";

// Page Object Model for the React Quiz (WAT4 E2E "POM" pattern). It hides the
// concrete selectors behind intention-revealing methods so the specs read like
// user journeys, not like DOM queries.
export class QuizPage {
  constructor(page) {
    this.page = page;

    // Stable selectors: data-testid where we added them, ARIA roles otherwise.
    this.startButton = page.getByRole("button", { name: /let's start/i });
    this.options = page.getByTestId("option");
    this.nextButton = page.getByRole("button", { name: /^next$/i });
    this.finishButton = page.getByRole("button", { name: /finish/i });
    this.restartButton = page.getByRole("button", { name: /restart quiz/i });
    this.score = page.getByTestId("score");
    this.timer = page.getByTestId("timer");
    this.question = page.getByTestId("question");
    this.result = page.getByTestId("result");
    this.highscore = page.getByText(/highscore:/i);
    this.errorMessage = page.getByText(/there was an error/i);
    this.startHeading = page.getByText(/questions to test your react mastery/i);
  }

  async goto() {
    await this.page.goto("/");
  }

  async waitForReady() {
    await expect(this.startButton).toBeVisible();
  }

  async start() {
    await this.startButton.click();
    await expect(this.question).toBeVisible();
  }

  // Current score (the left number of the "X / Y" progress display).
  async points() {
    const text = await this.score.locator("strong").innerText();
    return Number(text);
  }

  // Remaining seconds parsed from the "mm:ss" timer.
  async timerSeconds() {
    const text = (await this.timer.innerText()).trim();
    const [m, s] = text.split(":").map(Number);
    return m * 60 + s;
  }

  async answer(optionText) {
    await this.page.getByRole("button", { name: optionText, exact: true }).click();
  }

  // Walk through the entire quiz (picking the first option each time) until the
  // finish screen is reached. The safety bound prevents an infinite loop if the
  // UI ever changes.
  async completeQuiz(maxQuestions = 50) {
    for (let i = 0; i < maxQuestions; i++) {
      await this.options.first().click();
      if (await this.finishButton.isVisible()) {
        await this.finishButton.click();
        return;
      }
      await this.nextButton.click();
    }
    throw new Error("Finish button never appeared");
  }
}
