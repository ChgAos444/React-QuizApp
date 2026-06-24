// =============================================================================
// INTEGRATION TESTS — Flow & navigation controls (UI + state wiring)
// Author: Arens Danja
//
// Render the navigation components and verify they display the right
// information and dispatch the right lifecycle actions. `dispatch` is a Jest
// mock collaborator.
// =============================================================================
import { render, screen, fireEvent } from "@testing-library/react";
import StartScreen from "../../components/StartScreen";
import NextButton from "../../components/NextButton";
import FinishScreen from "../../components/FinishScreen";

test("StartScreen shows the question count and dispatches start", () => {
  // Arrange
  const dispatch = jest.fn();
  render(<StartScreen numQuestions={15} dispatch={dispatch} />);

  // Assert: the count is shown to the user
  expect(screen.getByText(/15 questions/i)).toBeInTheDocument();

  // Act: start the quiz
  fireEvent.click(screen.getByRole("button", { name: /let's start/i }));

  // Assert
  expect(dispatch).toHaveBeenCalledWith({ type: "start" });
});

test("NextButton: hidden before answering, then Next mid-quiz, Finish on last", () => {
  const dispatch = jest.fn();

  // 1) answer === null -> the button must not render at all
  const { rerender, container } = render(
    <NextButton dispatch={dispatch} answer={null} index={0} numQuestions={15} />
  );
  expect(container).toBeEmptyDOMElement();

  // 2) answered, not last -> "Next" dispatches nextQuestion
  rerender(
    <NextButton dispatch={dispatch} answer={2} index={0} numQuestions={15} />
  );
  fireEvent.click(screen.getByRole("button", { name: /next/i }));
  expect(dispatch).toHaveBeenCalledWith({ type: "nextQuestion" });

  // 3) answered, last question -> "Finish" dispatches finish
  rerender(
    <NextButton dispatch={dispatch} answer={1} index={14} numQuestions={15} />
  );
  fireEvent.click(screen.getByRole("button", { name: /finish/i }));
  expect(dispatch).toHaveBeenCalledWith({ type: "finish" });
});

test("FinishScreen reports score + highscore and dispatches restart", () => {
  const dispatch = jest.fn();
  render(
    <FinishScreen
      points={40}
      maxPossiblePoints={60}
      highscore={55}
      dispatch={dispatch}
    />
  );

  // Score line "... You scored 40 out of 60 ..."
  expect(screen.getByText(/you scored/i)).toHaveTextContent("40");
  expect(screen.getByText(/highscore: 55/i)).toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: /restart quiz/i }));
  expect(dispatch).toHaveBeenCalledWith({ type: "restart" });
});
