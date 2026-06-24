// =============================================================================
// UNIT TESTS — Timer, status transitions & resilience
// Author: Arlind Frakulla
//
// SUT: the pure `reducer`. Covers the time-driven `tick` transition (including
// the auto-finish at timeout and highscore promotion) and defensive behavior
// for unknown actions.
// =============================================================================
import { reducer, initialState } from "../../logic/quizReducer";
import { QUESTIONS } from "../../test-support/questions";

const activeState = {
  ...initialState,
  questions: QUESTIONS,
  status: "active",
  index: 0,
  answer: null,
  points: 0,
  secondsRemaining: 10,
};

describe("reducer — timer (tick)", () => {
  test("tick counts the remaining seconds down by one", () => {
    const next = reducer(activeState, { type: "tick" });
    expect(next.secondsRemaining).toBe(9);
  });

  test("tick keeps the quiz active while time remains", () => {
    const next = reducer(activeState, { type: "tick" });
    expect(next.status).toBe("active");
  });

  test("tick finishes the quiz when the clock reaches zero", () => {
    // Arrange: one second of slack left expressed as secondsRemaining === 0.
    const lastTick = { ...activeState, secondsRemaining: 0 };
    // Act
    const next = reducer(lastTick, { type: "tick" });
    // Assert
    expect(next.status).toBe("finished");
  });

  test("tick at timeout promotes the score to highscore when it is higher", () => {
    const lastTick = {
      ...activeState,
      secondsRemaining: 0,
      points: 50,
      highscore: 20,
    };
    const next = reducer(lastTick, { type: "tick" });
    expect(next.highscore).toBe(50);
  });
});

describe("reducer — resilience", () => {
  test("throws on an unknown action type", () => {
    expect(() => reducer(activeState, { type: "does-not-exist" })).toThrow(
      "Action unknown"
    );
  });
});
