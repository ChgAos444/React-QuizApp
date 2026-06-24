// =============================================================================
// INTEGRATION TESTS — Scoring & answering (UI + state wiring)
// Author: Erti Prenci
//
// These render real React components into a jsdom DOM (via React Testing
// Library) and verify the integration between the rendered UI and the
// `dispatch` collaborator. `dispatch` is replaced with a Jest mock (a test
// double, see WAT4 "Mocking and Stubbing"): we assert the component emits the
// right actions and reflects answered state, without booting the whole app.
// The Question test is "sociable" — it integrates Question with its child
// Options component.
// =============================================================================
import { render, screen, fireEvent } from "@testing-library/react";
import Options from "../../components/Options";
import Question from "../../components/Question";
import Progress from "../../components/Progress";
import { QUESTIONS, MAX_POINTS } from "../../test-support/questions";

const question = QUESTIONS[0]; // 4 options, correctOption = 1

test("Options renders every option and dispatches newAnswer with the clicked index", () => {
  // Arrange
  const dispatch = jest.fn();
  render(<Options question={question} dispatch={dispatch} answer={null} />);

  // Assert: all four options are on screen
  question.options.forEach((opt) =>
    expect(screen.getByRole("button", { name: opt })).toBeInTheDocument()
  );

  // Act: click the third option (index 2)
  fireEvent.click(screen.getByRole("button", { name: question.options[2] }));

  // Assert: correct action + payload emitted
  expect(dispatch).toHaveBeenCalledWith({ type: "newAnswer", payload: 2 });
});

test("Question marks correct/wrong and disables options once answered", () => {
  // Arrange: integrate Question + Options, simulate an answer of index 0 (wrong)
  const dispatch = jest.fn();
  render(<Question question={question} dispatch={dispatch} answer={0} />);

  const buttons = screen.getAllByRole("button");
  // The correct option (index 1) is highlighted as correct ...
  expect(buttons[1]).toHaveClass("correct");
  // ... the chosen wrong option (index 0) is highlighted as wrong.
  expect(buttons[0]).toHaveClass("wrong");
  // After answering, all options are disabled (no double answering).
  buttons.forEach((btn) => expect(btn).toBeDisabled());
});

test("Progress shows the current points out of the maximum", () => {
  render(
    <Progress
      index={0}
      numQuestions={QUESTIONS.length}
      points={30}
      maxPossiblePoints={MAX_POINTS}
      answer={null}
    />
  );
  const pointsEl = screen.getByText("30");
  expect(pointsEl).toBeInTheDocument();
  // The points paragraph reads "<points> / <maxPossiblePoints>".
  expect(pointsEl.closest("p")).toHaveTextContent(`30 / ${MAX_POINTS}`);
});
