// =============================================================================
// UNIT TESTS — Scoring & answer logic
// Author: Erti Prenci
//
// Subject under test (SUT): the pure `reducer` from src/logic/quizReducer.js.
// These are solitary unit tests (WAT4 "Solitary vs. Sociable"): no React, no
// DOM, no network — just state in, state out. Structured with the AAA pattern
// (Arrange / Act / Assert).
// =============================================================================
import { reducer, initialState } from "../../logic/quizReducer";
import { QUESTIONS } from "../../test-support/questions";

// An "active" quiz state on the first question, used as the arrange baseline.
const activeState = {
  ...initialState,
  questions: QUESTIONS,
  status: "active",
  index: 0,
  answer: null,
  points: 0,
  secondsRemaining: 30,
};

describe("reducer — scoring (newAnswer)", () => {
  test("adds the question's points when the correct option is chosen", () => {
    // Arrange: question 0 has correctOption 1 and is worth 10 points.
    // Act
    const next = reducer(activeState, { type: "newAnswer", payload: 1 });
    // Assert
    expect(next.points).toBe(10);
  });

  test("does not change points when a wrong option is chosen", () => {
    const next = reducer(activeState, { type: "newAnswer", payload: 0 });
    expect(next.points).toBe(0);
  });

  test("stores the chosen answer index", () => {
    const next = reducer(activeState, { type: "newAnswer", payload: 2 });
    expect(next.answer).toBe(2);
  });
});

describe("reducer — finish & highscore", () => {
  test("finishing raises the highscore when the run beats it", () => {
    const state = { ...activeState, points: 50, highscore: 20 };
    const next = reducer(state, { type: "finish" });
    expect(next.status).toBe("finished");
    expect(next.highscore).toBe(50);
  });

  test("finishing keeps the previous highscore when it is not beaten", () => {
    const state = { ...activeState, points: 30, highscore: 90 };
    const next = reducer(state, { type: "finish" });
    expect(next.highscore).toBe(90);
  });
});
