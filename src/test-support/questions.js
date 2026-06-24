// Small, deterministic question fixture used across unit and integration
// tests. Points differ per question so scoring assertions are unambiguous.
export const QUESTIONS = [
  { question: "Q1: 2 + 2 = ?", options: ["3", "4", "5", "6"], correctOption: 1, points: 10 },
  { question: "Q2: Capital of Austria?", options: ["Berlin", "Vienna", "Bern"], correctOption: 1, points: 20 },
  { question: "Q3: React is a ...", options: ["library", "language"], correctOption: 0, points: 30 },
];

// Convenience: the maximum reachable score for the fixture above (10+20+30).
export const MAX_POINTS = 60;
