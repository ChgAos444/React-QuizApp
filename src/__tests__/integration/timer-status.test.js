// =============================================================================
// INTEGRATION TESTS — Timer rendering/ticking & status screens
// Author: Arlind Frakulla
//
// The Timer test integrates a component with React's effect/timer machinery,
// using Jest fake timers to drive setInterval deterministically and asserting
// the `dispatch` collaborator is called. Loader/Error verify the status screens
// the app shows while loading and on failure (resilience).
// =============================================================================
import { render, screen, act } from "@testing-library/react";
import Timer from "../../components/Timer";
import Loader from "../../components/Loader";
import Error from "../../components/Error";

test("Timer formats remaining seconds as mm:ss", () => {
  const dispatch = jest.fn();
  // 125s -> 2 minutes and 5 seconds -> "02:05"
  render(<Timer dispatch={dispatch} secondsRemaining={125} />);
  expect(screen.getByText("02:05")).toBeInTheDocument();
});

test("Timer dispatches a tick every second", () => {
  jest.useFakeTimers();
  try {
    const dispatch = jest.fn();
    render(<Timer dispatch={dispatch} secondsRemaining={30} />);

    // Advance three seconds deterministically.
    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(dispatch).toHaveBeenCalledTimes(3);
    expect(dispatch).toHaveBeenLastCalledWith({ type: "tick" });
  } finally {
    jest.useRealTimers();
  }
});

test("Status screens: Loader shows loading, Error shows the failure message", () => {
  // Loader is shown while questions are being fetched ...
  const { unmount } = render(<Loader />);
  expect(screen.getByText(/loading questions/i)).toBeInTheDocument();
  unmount();

  // ... and Error is shown if the fetch fails (resilience / failure path).
  render(<Error />);
  expect(screen.getByText(/there was an error/i)).toBeInTheDocument();
});
