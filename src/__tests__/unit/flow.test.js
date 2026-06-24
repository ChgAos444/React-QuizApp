// =============================================================================
// UNIT TESTS — Quiz flow & navigation
// Author: Arens Danja
//
// SUT: the pure `reducer`. Covers the lifecycle transitions that move a quiz
// from loading → ready → active and back (data loading, start, next, restart).
// =============================================================================
import { reducer, initialState, SECS_PER_QUESTION } from "../../logic/quizReducer";
import { QUESTIONS } from "../../test-support/questions";

describe("reducer — quiz flow", () => {
  test("dataReceived stores the questions and marks the quiz ready", () => {
    // Arrange: app starts in 'loading' with no questions.
    // Act
    const next = reducer(initialState, {
      type: "dataReceived",
      payload: QUESTIONS,
    });
    // Assert
    expect(next.questions).toEqual(QUESTIONS);
    expect(next.status).toBe("ready");
  });

  test("dataFailed switches the status to error", () => {
    const next = reducer(initialState, { type: "dataFailed" });
    expect(next.status).toBe("error");
  });

  test("start activates the quiz and sets the total countdown time", () => {
    // Arrange: a ready quiz with the 3-question fixture.
    const ready = { ...initialState, questions: QUESTIONS, status: "ready" };
    // Act
    const next = reducer(ready, { type: "start" });
    // Assert: 3 questions * SECS_PER_QUESTION seconds.
    expect(next.status).toBe("active");
    expect(next.secondsRemaining).toBe(QUESTIONS.length * SECS_PER_QUESTION);
  });

  test("nextQuestion advances the index and clears the previous answer", () => {
    const state = {
      ...initialState,
      questions: QUESTIONS,
      status: "active",
      index: 0,
      answer: 2,
    };
    const next = reducer(state, { type: "nextQuestion" });
    expect(next.index).toBe(1);
    expect(next.answer).toBeNull();
  });

  test("restart resets progress but keeps the loaded questions", () => {
    const finished = {
      ...initialState,
      questions: QUESTIONS,
      status: "finished",
      index: 2,
      answer: 1,
      points: 60,
      highscore: 60,
    };
    const next = reducer(finished, { type: "restart" });
    expect(next.status).toBe("ready");
    expect(next.index).toBe(0);
    expect(next.answer).toBeNull();
    expect(next.points).toBe(0);
    // Questions must survive a restart so the user can play again.
    expect(next.questions).toEqual(QUESTIONS);
  });
});
