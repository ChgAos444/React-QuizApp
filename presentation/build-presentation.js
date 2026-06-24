// Generates the WAT4 project presentation (PptxGenJS).
// Run inside a Node container (see presentation/README or the build command).
const pptxgen = require("pptxgenjs");

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.3 x 7.5 in
pres.author = "Prenci / Danja / Frakulla";
pres.title = "Testing the React Quiz App";

// ---- palette (Teal Trust + deep slate) ------------------------------------
const C = {
  dark: "0B3C49",   // dark teal-slate (title / closing)
  primary: "028090", // teal
  sea: "00A896",     // seafoam
  mint: "02C39A",    // mint accent
  ink: "1E293B",     // body text
  muted: "64748B",   // captions
  light: "F1F5F7",   // light tint for cards
  white: "FFFFFF",
};
const HEAD = "Cambria";
const BODY = "Calibri";
const W = 13.3;

const shadow = () => ({ type: "outer", color: "000000", blur: 7, offset: 3, angle: 90, opacity: 0.12 });

function titleBar(slide, kicker, title) {
  slide.addText(kicker.toUpperCase(), { x: 0.6, y: 0.42, w: 12, h: 0.3, fontFace: BODY, fontSize: 12, bold: true, color: C.primary, charSpacing: 2, margin: 0 });
  slide.addText(title, { x: 0.6, y: 0.72, w: 12.1, h: 0.7, fontFace: HEAD, fontSize: 30, bold: true, color: C.ink, margin: 0 });
}

// Reusable card
function card(slide, x, y, w, h, fill) {
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.08, fill: { color: fill || C.light }, line: { color: "E2E8F0", width: 1 }, shadow: shadow() });
}

// number chip in a circle
function chip(slide, x, y, text, fill) {
  slide.addShape(pres.shapes.OVAL, { x, y, w: 0.5, h: 0.5, fill: { color: fill }, line: { type: "none" } });
  slide.addText(text, { x, y, w: 0.5, h: 0.5, align: "center", valign: "middle", fontFace: HEAD, fontSize: 16, bold: true, color: C.white, margin: 0 });
}

/* ============================ Slide 1: Title ============================= */
let s = pres.addSlide();
s.background = { color: C.dark };
s.addShape(pres.shapes.OVAL, { x: 10.6, y: -1.6, w: 4.4, h: 4.4, fill: { color: C.primary, transparency: 60 }, line: { type: "none" } });
s.addShape(pres.shapes.OVAL, { x: 11.7, y: 4.6, w: 3.2, h: 3.2, fill: { color: C.mint, transparency: 70 }, line: { type: "none" } });
s.addText("WAT4 — WEB APPLICATION TESTING", { x: 0.8, y: 1.55, w: 11, h: 0.4, fontFace: BODY, fontSize: 15, bold: true, color: C.mint, charSpacing: 3, margin: 0 });
s.addText("Testing the React Quiz App", { x: 0.8, y: 2.05, w: 11.5, h: 1.2, fontFace: HEAD, fontSize: 46, bold: true, color: C.white, margin: 0 });
s.addText("A full test pyramid — unit · integration · end-to-end · load — with a CI/CD pipeline and Docker-isolated testing.", { x: 0.8, y: 3.35, w: 10.5, h: 0.8, fontFace: BODY, fontSize: 17, color: "CADCFC", margin: 0 });
s.addText([
  { text: "Erti Prenci", options: { bold: true, color: C.white } },
  { text: "   ·   ", options: { color: C.sea } },
  { text: "Arens Danja", options: { bold: true, color: C.white } },
  { text: "   ·   ", options: { color: C.sea } },
  { text: "Arlind Frakulla", options: { bold: true, color: C.white } },
], { x: 0.8, y: 5.6, w: 11, h: 0.5, fontFace: BODY, fontSize: 18, margin: 0 });
s.addText("Forked from github.com/VINAYAK9669/React-QuizApp", { x: 0.8, y: 6.15, w: 11, h: 0.4, fontFace: BODY, fontSize: 12, italic: true, color: "8FB3BD", margin: 0 });

/* ====================== Slide 2: The application ======================== */
s = pres.addSlide();
s.background = { color: C.white };
titleBar(s, "The application", "A timed React quiz, fed by a REST API");
s.addText([
  { text: "Single-page app built with Create React App (React 18).", options: { bullet: true, breakLine: true } },
  { text: "Fetches questions from a REST endpoint, then runs a timed quiz.", options: { bullet: true, breakLine: true } },
  { text: "State is one useReducer state machine:", options: { bullet: true, breakLine: true } },
  { text: "loading → ready → active → finished  (+ error)", options: { bullet: false, indentLevel: 1, breakLine: true, italic: true, color: C.primary } },
  { text: "Points for correct answers, 5 s per question, score + high score.", options: { bullet: true } },
], { x: 0.6, y: 1.7, w: 6.6, h: 3.2, fontFace: BODY, fontSize: 16, color: C.ink, paraSpaceAfter: 8 });

// mini architecture diagram (right)
card(s, 7.5, 1.75, 5.2, 4.4, C.light);
s.addText("Architecture", { x: 7.7, y: 1.9, w: 4.8, h: 0.4, fontFace: HEAD, fontSize: 15, bold: true, color: C.ink, margin: 0 });
s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 7.8, y: 2.45, w: 4.6, h: 1.7, rectRadius: 0.06, fill: { color: C.white }, line: { color: C.primary, width: 1.5 } });
s.addText([{ text: "Frontend (React, CRA)\n", options: { bold: true, color: C.primary } }, { text: "reducer · components · config (API URL)", options: { fontSize: 12, color: C.muted } }], { x: 7.95, y: 2.6, w: 4.3, h: 1.4, fontFace: BODY, fontSize: 14, color: C.ink, valign: "top", margin: 0 });
s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 7.8, y: 4.5, w: 4.6, h: 1.4, rectRadius: 0.06, fill: { color: C.white }, line: { color: C.sea, width: 1.5 } });
s.addText([{ text: "Backend — json-server\n", options: { bold: true, color: C.sea } }, { text: "GET /questions  (data/questions.json)", options: { fontSize: 12, color: C.muted } }], { x: 7.95, y: 4.62, w: 4.3, h: 1.1, fontFace: BODY, fontSize: 14, color: C.ink, valign: "top", margin: 0 });
s.addShape(pres.shapes.LINE, { x: 10.1, y: 4.15, w: 0, h: 0.35, line: { color: C.muted, width: 1.5, endArrowType: "triangle" } });
s.addText("HTTP", { x: 10.2, y: 4.18, w: 1, h: 0.3, fontFace: BODY, fontSize: 10, italic: true, color: C.muted, margin: 0 });

/* ==================== Slide 3: What & why we tested ===================== */
s = pres.addSlide();
s.background = { color: C.white };
titleBar(s, "What & why", "Designing the app to be testable first");
s.addText("The fork had no tests. Before writing any, we made small, behaviour-preserving changes guided by the lecture's Principles for Testable Design:", { x: 0.6, y: 1.7, w: 12, h: 0.7, fontFace: BODY, fontSize: 16, color: C.ink, margin: 0 });
const why = [
  ["SRP", "Extracted reducer", "Pure state logic moved into its own module — testable in full isolation, no DOM, no network."],
  ["DIP", "Configurable API URL", "App depends on a configurable URL, not a hard-coded one — same code runs against any backend."],
  ["REST", "Restored json-server", "Added the missing data file, giving us a real REST API to load-test."],
];
why.forEach((c, i) => {
  const x = 0.6 + i * 4.15;
  card(s, x, 2.55, 3.85, 2.75, C.light);
  chip(s, x + 0.25, 2.8, c[0] === "REST" ? "{ }" : c[0][0], i === 0 ? C.primary : i === 1 ? C.sea : C.mint);
  s.addText(c[1], { x: x + 0.9, y: 2.83, w: 2.8, h: 0.5, fontFace: HEAD, fontSize: 16, bold: true, color: C.ink, valign: "middle", margin: 0 });
  s.addText(c[2], { x: x + 0.25, y: 3.5, w: 3.35, h: 1.65, fontFace: BODY, fontSize: 14, color: C.ink, margin: 0, valign: "top" });
});

/* ====================== Slide 4: The test pyramid ======================= */
s = pres.addSlide();
s.background = { color: C.white };
titleBar(s, "Strategy", "The Practical Test Pyramid — 33 tests");
// pyramid (3 stacked rects, narrowing upward)
const py = [
  { w: 3.0, label: "6  System / E2E", sub: "Playwright", col: C.dark },
  { w: 4.6, label: "9  Integration", sub: "Jest + RTL", col: C.primary },
  { w: 6.2, label: "15  Unit", sub: "Jest (pure reducer)", col: C.sea },
];
let py_y = 1.95;
py.forEach((b) => {
  const x = 0.6 + (6.2 - b.w) / 2 + 0.0;
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.6 + (6.2 - b.w) / 2, y: py_y, w: b.w, h: 1.05, rectRadius: 0.05, fill: { color: b.col }, line: { type: "none" } });
  s.addText([{ text: b.label, options: { bold: true, fontSize: 16, breakLine: true } }, { text: b.sub, options: { fontSize: 11, color: "D7ECF0" } }], { x: 0.6 + (6.2 - b.w) / 2, y: py_y, w: b.w, h: 1.05, align: "center", valign: "middle", fontFace: BODY, color: C.white, margin: 0 });
  py_y += 1.15;
});
s.addText("+ 3 Load tests (k6) — non-functional", { x: 0.6, y: py_y + 0.05, w: 6.2, h: 0.4, align: "center", fontFace: BODY, fontSize: 13, italic: true, bold: true, color: C.mint, margin: 0 });

// per-person table (right)
card(s, 7.3, 1.95, 5.4, 4.0, C.white);
s.addText("11 tests per person", { x: 7.55, y: 2.1, w: 5, h: 0.4, fontFace: HEAD, fontSize: 16, bold: true, color: C.ink, margin: 0 });
s.addTable([
  [
    { text: "Member", options: { bold: true, color: C.white, fill: { color: C.primary } } },
    { text: "Area", options: { bold: true, color: C.white, fill: { color: C.primary } } },
  ],
  ["Erti Prenci", "Scoring & answers"],
  ["Arens Danja", "Quiz flow & navigation"],
  ["Arlind Frakulla", "Timer, status & resilience"],
], { x: 7.55, y: 2.55, w: 4.9, colW: [1.9, 3.0], rowH: [0.45, 0.55, 0.55, 0.55], fontFace: BODY, fontSize: 13, color: C.ink, border: { pt: 0.5, color: "D7DEE3" }, valign: "middle", align: "left" });
s.addText("Each layer split 5 / 3 / 2 / 1 per person.", { x: 7.55, y: 5.2, w: 5, h: 0.5, fontFace: BODY, fontSize: 13, italic: true, color: C.muted, margin: 0 });

/* ====================== Slide 5: Unit tests ============================= */
s = pres.addSlide();
s.background = { color: C.white };
titleBar(s, "Layer 1 — Unit", "Fast, solitary tests of the pure reducer");
s.addText([
  { text: "What: ", options: { bold: true, color: C.primary } },
  { text: "the reducer — given (state, action) it returns the next state.", options: {} },
], { x: 0.6, y: 1.75, w: 7.2, h: 0.5, fontFace: BODY, fontSize: 16, color: C.ink, margin: 0 });
s.addText([
  { text: "Why: ", options: { bold: true, color: C.primary, breakLine: false } },
  { text: "it holds all the quiz rules (scoring, navigation, timer). It is pure → no DOM, no network → the fastest, most stable safety net.", options: {} },
], { x: 0.6, y: 2.3, w: 7.2, h: 0.9, fontFace: BODY, fontSize: 16, color: C.ink, margin: 0 });
s.addText([
  { text: "How: ", options: { bold: true, color: C.primary } },
  { text: "Jest, AAA pattern (Arrange–Act–Assert), one behaviour per test. Examples:", options: {} },
], { x: 0.6, y: 3.25, w: 7.2, h: 0.5, fontFace: BODY, fontSize: 16, color: C.ink, margin: 0 });
s.addText([
  { text: "correct answer adds the question's points", options: { bullet: true, breakLine: true } },
  { text: "timer reaching zero auto-finishes the quiz", options: { bullet: true, breakLine: true } },
  { text: "restart resets progress but keeps the questions", options: { bullet: true, breakLine: true } },
  { text: "unknown action throws (defensive)", options: { bullet: true } },
], { x: 0.85, y: 3.8, w: 7, h: 1.9, fontFace: BODY, fontSize: 15, color: C.ink, paraSpaceAfter: 6 });
// big stat
card(s, 8.3, 1.95, 4.4, 3.9, C.dark);
s.addText("15", { x: 8.3, y: 2.3, w: 4.4, h: 1.6, align: "center", fontFace: HEAD, fontSize: 90, bold: true, color: C.mint, margin: 0 });
s.addText("unit tests", { x: 8.3, y: 3.9, w: 4.4, h: 0.5, align: "center", fontFace: BODY, fontSize: 20, bold: true, color: C.white, margin: 0 });
s.addText("run in ~ seconds", { x: 8.3, y: 4.45, w: 4.4, h: 0.4, align: "center", fontFace: BODY, fontSize: 14, italic: true, color: "CADCFC", margin: 0 });
s.addText("5 per person", { x: 8.3, y: 5.0, w: 4.4, h: 0.5, align: "center", fontFace: BODY, fontSize: 15, color: "8FB3BD", margin: 0 });

/* =================== Slide 6: Integration tests ========================= */
s = pres.addSlide();
s.background = { color: C.white };
titleBar(s, "Layer 2 — Integration", "Components wired to state (React Testing Library)");
s.addText([
  { text: "What: ", options: { bold: true, color: C.primary } },
  { text: "render real components into a jsdom DOM and check they show the right thing and dispatch the right action.", options: {} },
], { x: 0.6, y: 1.75, w: 7.4, h: 0.9, fontFace: BODY, fontSize: 16, color: C.ink, margin: 0 });
s.addText([
  { text: "Why: ", options: { bold: true, color: C.primary } },
  { text: "unit tests prove the logic; integration proves the UI is wired to it correctly.", options: {} },
], { x: 0.6, y: 2.75, w: 7.4, h: 0.7, fontFace: BODY, fontSize: 16, color: C.ink, margin: 0 });
s.addText([
  { text: "How: ", options: { bold: true, color: C.primary } },
  { text: "the dispatch collaborator is a Jest mock (a test double); fake timers drive the countdown deterministically.", options: {} },
], { x: 0.6, y: 3.55, w: 7.4, h: 0.9, fontFace: BODY, fontSize: 16, color: C.ink, margin: 0 });
s.addText([
  { text: "clicking an option dispatches newAnswer + disables the others", options: { bullet: true, breakLine: true } },
  { text: "Start / Next / Finish buttons emit the right actions", options: { bullet: true, breakLine: true } },
  { text: "Timer renders mm:ss and ticks every second", options: { bullet: true } },
], { x: 0.85, y: 4.55, w: 7.2, h: 1.5, fontFace: BODY, fontSize: 15, color: C.ink, paraSpaceAfter: 6 });
card(s, 8.4, 1.95, 4.3, 3.9, C.light);
s.addText("9", { x: 8.4, y: 2.3, w: 4.3, h: 1.6, align: "center", fontFace: HEAD, fontSize: 90, bold: true, color: C.primary, margin: 0 });
s.addText("integration tests", { x: 8.4, y: 3.9, w: 4.3, h: 0.5, align: "center", fontFace: BODY, fontSize: 19, bold: true, color: C.ink, margin: 0 });
s.addText("Jest + React Testing Library", { x: 8.4, y: 4.45, w: 4.3, h: 0.4, align: "center", fontFace: BODY, fontSize: 13, italic: true, color: C.muted, margin: 0 });
s.addText("3 per person", { x: 8.4, y: 5.05, w: 4.3, h: 0.5, align: "center", fontFace: BODY, fontSize: 15, color: C.muted, margin: 0 });

/* ======================= Slide 7: E2E tests ============================= */
s = pres.addSlide();
s.background = { color: C.white };
titleBar(s, "Layer 3 — System / E2E", "Real browser, real stack, real journeys");
s.addText([
  { text: "What: ", options: { bold: true, color: C.primary } },
  { text: "black-box tests driving a real browser against the running system (Playwright).", options: {} },
], { x: 0.6, y: 1.75, w: 7.4, h: 0.7, fontFace: BODY, fontSize: 16, color: C.ink, margin: 0 });
s.addText([
  { text: "Why: ", options: { bold: true, color: C.primary } },
  { text: "verify only business-critical journeys end-to-end — the happy path plus key failure paths.", options: {} },
], { x: 0.6, y: 2.55, w: 7.4, h: 0.7, fontFace: BODY, fontSize: 16, color: C.ink, margin: 0 });
s.addText([
  { text: "How: ", options: { bold: true, color: C.primary } },
  { text: "Page Object Model, traces / screenshots / video on failure, request interception for the outage test.", options: {} },
], { x: 0.6, y: 3.35, w: 7.4, h: 0.9, fontFace: BODY, fontSize: 16, color: C.ink, margin: 0 });
s.addText([
  { text: "play the whole quiz → finish screen; then restart", options: { bullet: true, breakLine: true } },
  { text: "a correct answer awards points; can't answer twice", options: { bullet: true, breakLine: true } },
  { text: "timer counts down; outage → error screen shown", options: { bullet: true } },
], { x: 0.85, y: 4.35, w: 7.2, h: 1.5, fontFace: BODY, fontSize: 15, color: C.ink, paraSpaceAfter: 6 });
card(s, 8.4, 1.95, 4.3, 3.9, C.dark);
s.addText("6", { x: 8.4, y: 2.3, w: 4.3, h: 1.6, align: "center", fontFace: HEAD, fontSize: 90, bold: true, color: C.mint, margin: 0 });
s.addText("end-to-end tests", { x: 8.4, y: 3.9, w: 4.3, h: 0.5, align: "center", fontFace: BODY, fontSize: 19, bold: true, color: C.white, margin: 0 });
s.addText("Playwright · ran in 16.5 s", { x: 8.4, y: 4.45, w: 4.3, h: 0.4, align: "center", fontFace: BODY, fontSize: 13, italic: true, color: "CADCFC", margin: 0 });
s.addText("2 per person", { x: 8.4, y: 5.05, w: 4.3, h: 0.5, align: "center", fontFace: BODY, fontSize: 15, color: "8FB3BD", margin: 0 });

/* ================= Slide 8: Isolation & CI/CD =========================== */
s = pres.addSlide();
s.background = { color: C.white };
titleBar(s, "How it runs", "Test isolation & the CI/CD pipeline");
s.addText("Isolated E2E stack (Docker Compose)", { x: 0.6, y: 1.7, w: 6, h: 0.4, fontFace: HEAD, fontSize: 16, bold: true, color: C.ink, margin: 0 });
const stack = [["backend", "json-server", C.sea], ["frontend", "production build", C.primary], ["playwright", "browser + tests", C.dark]];
stack.forEach((b, i) => {
  const y = 2.2 + i * 1.15;
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.6, y, w: 5.7, h: 0.95, rectRadius: 0.06, fill: { color: C.white }, line: { color: b[2], width: 1.5 }, shadow: shadow() });
  s.addShape(pres.shapes.OVAL, { x: 0.85, y: y + 0.27, w: 0.4, h: 0.4, fill: { color: b[2] }, line: { type: "none" } });
  s.addText([{ text: b[0] + "  ", options: { bold: true, color: C.ink } }, { text: "— " + b[1], options: { color: C.muted } }], { x: 1.45, y, w: 4.7, h: 0.95, valign: "middle", fontFace: BODY, fontSize: 15, margin: 0 });
});
s.addText("One private network, the browser reaches the backend by name. Torn down with `down -v` → fully isolated, reproducible.", { x: 0.6, y: 5.75, w: 6.0, h: 0.9, fontFace: BODY, fontSize: 13, italic: true, color: C.muted, margin: 0 });

s.addText("CI/CD — GitHub Actions (on every push / PR)", { x: 7.0, y: 1.7, w: 6, h: 0.4, fontFace: HEAD, fontSize: 16, bold: true, color: C.ink, margin: 0 });
const jobs = [["1", "Unit + Integration", "Jest"], ["2", "End-to-End", "Docker-isolated Playwright"], ["3", "Load smoke", "k6 thresholds = quality gate"]];
jobs.forEach((j, i) => {
  const y = 2.2 + i * 1.15;
  card(s, 7.0, y, 5.7, 0.95, C.light);
  chip(s, 7.25, y + 0.22, j[0], C.primary);
  s.addText([{ text: j[1] + "\n", options: { bold: true, color: C.ink, fontSize: 15 } }, { text: j[2], options: { color: C.muted, fontSize: 12 } }], { x: 7.9, y, w: 4.6, h: 0.95, valign: "middle", fontFace: BODY, margin: 0 });
});
s.addText("Same command locally and in CI — no global tools, only Docker.", { x: 7.0, y: 5.75, w: 5.7, h: 0.9, fontFace: BODY, fontSize: 13, italic: true, color: C.muted, margin: 0 });

/* ====================== Slide 9: Load testing =========================== */
s = pres.addSlide();
s.background = { color: C.white };
titleBar(s, "Load testing (k6)", "Non-functional: how well does it hold up?");
s.addText([
  { text: "SLO: ", options: { bold: true, color: C.primary } },
  { text: "p95 < 500 ms  and  error rate < 1 %  on  GET /questions.", options: {} },
], { x: 0.6, y: 1.7, w: 12, h: 0.4, fontFace: BODY, fontSize: 16, color: C.ink, margin: 0 });
s.addText([
  { text: "Constant", options: { bold: true, color: C.sea, breakLine: true } },
  { text: "20 VUs, 30 s — validate the SLO", options: { fontSize: 13, color: C.muted, breakLine: true } },
  { text: "Ramp 0→100", options: { bold: true, color: C.primary, breakLine: true } },
  { text: "find the saturation point", options: { fontSize: 13, color: C.muted, breakLine: true } },
  { text: "Spike →200", options: { bold: true, color: C.dark, breakLine: true } },
  { text: "sudden surge & recovery", options: { fontSize: 13, color: C.muted } },
], { x: 0.6, y: 2.3, w: 3.3, h: 3.4, fontFace: BODY, fontSize: 15, color: C.ink, paraSpaceAfter: 4 });
// native column chart: throughput
s.addChart(pres.charts.BAR, [{ name: "req/s", labels: ["Constant", "Ramp", "Spike"], values: [19.5, 44.0, 197.9] }], {
  x: 4.1, y: 2.05, w: 4.4, h: 3.8, barDir: "col", chartColors: [C.sea, C.primary, C.dark],
  showTitle: true, title: "Throughput (req/s)", titleColor: C.ink, titleFontSize: 14, titleFontFace: BODY,
  showValue: true, dataLabelPosition: "outEnd", dataLabelColor: C.ink, dataLabelFontSize: 11,
  catAxisLabelColor: C.muted, valAxisLabelColor: C.muted, valGridLine: { color: "E2E8F0", size: 0.5 }, catGridLine: { style: "none" }, showLegend: false,
});
// native column chart: max latency
s.addChart(pres.charts.BAR, [{ name: "ms", labels: ["Constant", "Ramp", "Spike"], values: [28.9, 20.1, 580.4] }], {
  x: 8.5, y: 2.05, w: 4.4, h: 3.8, barDir: "col", chartColors: [C.sea, C.primary, "E15759"],
  showTitle: true, title: "Max response time (ms)", titleColor: C.ink, titleFontSize: 14, titleFontFace: BODY,
  showValue: true, dataLabelPosition: "outEnd", dataLabelColor: C.ink, dataLabelFontSize: 11,
  catAxisLabelColor: C.muted, valAxisLabelColor: C.muted, valGridLine: { color: "E2E8F0", size: 0.5 }, catGridLine: { style: "none" }, showLegend: false,
});
s.addText("All three runs passed their thresholds with 0 % errors.", { x: 0.6, y: 6.0, w: 12, h: 0.4, fontFace: BODY, fontSize: 13, italic: true, color: C.muted, margin: 0 });

/* ==================== Slide 10: Load analysis =========================== */
s = pres.addSlide();
s.background = { color: C.white };
titleBar(s, "Load testing — findings", "What the numbers tell us");
const finds = [
  ["SLO met easily", "Under expected load: p95 ≈ 5 ms — two orders of magnitude under the 500 ms budget, 0 errors.", C.sea],
  ["Percentiles AND max matter", "During the spike, avg & p95 stay ~3.8 ms, yet the max jumps to 580 ms — a connection-storm outlier invisible in the average.", C.primary],
  ["No saturation reached", "Throughput scaled 20→200 req/s with flat latency: the small dataset is served very efficiently.", C.dark],
];
finds.forEach((f, i) => {
  const y = 1.85 + i * 1.35;
  card(s, 0.6, y, 7.4, 1.2, C.light);
  s.addShape(pres.shapes.OVAL, { x: 0.85, y: y + 0.35, w: 0.5, h: 0.5, fill: { color: f[2] }, line: { type: "none" } });
  s.addText(String(i + 1), { x: 0.85, y: y + 0.35, w: 0.5, h: 0.5, align: "center", valign: "middle", fontFace: HEAD, fontSize: 18, bold: true, color: C.white, margin: 0 });
  s.addText([{ text: f[0] + "\n", options: { bold: true, color: C.ink, fontSize: 16 } }, { text: f[1], options: { color: C.muted, fontSize: 13 } }], { x: 1.55, y, w: 6.3, h: 1.2, valign: "middle", fontFace: BODY, margin: 0 });
});
card(s, 8.3, 1.85, 4.4, 4.05, C.dark);
s.addText("Bottleneck & scaling", { x: 8.55, y: 2.1, w: 4, h: 0.4, fontFace: HEAD, fontSize: 16, bold: true, color: C.mint, margin: 0 });
s.addText([
  { text: "The bottleneck is the single-threaded json-server, re-serving the data with no caching.", options: { breakLine: true } },
  { text: "To find the real knee: remove think-time and push to thousands of VUs (a dedicated stress test).", options: { breakLine: true } },
  { text: "Scale it with: caching, multiple instances behind a load balancer, and a CDN for the static JSON.", options: {} },
], { x: 8.55, y: 2.65, w: 3.95, h: 3.1, fontFace: BODY, fontSize: 14.5, color: "E6F2F4", paraSpaceAfter: 14, valign: "top", margin: 0 });

/* ======================= Slide 11: Closing ============================== */
s = pres.addSlide();
s.background = { color: C.dark };
s.addShape(pres.shapes.OVAL, { x: 11.4, y: -1.4, w: 3.6, h: 3.6, fill: { color: C.mint, transparency: 70 }, line: { type: "none" } });
s.addShape(pres.shapes.OVAL, { x: 12.2, y: 5.3, w: 2.6, h: 2.6, fill: { color: C.primary, transparency: 65 }, line: { type: "none" } });
s.addText("RESULT", { x: 0.8, y: 1.5, w: 11, h: 0.4, fontFace: BODY, fontSize: 15, bold: true, color: C.mint, charSpacing: 3, margin: 0 });
s.addText("33 tests, every layer green", { x: 0.8, y: 1.95, w: 11.5, h: 1.0, fontFace: HEAD, fontSize: 42, bold: true, color: C.white, margin: 0 });
const stats = [["15", "Unit"], ["9", "Integration"], ["6", "E2E"], ["3", "Load"]];
stats.forEach((st, i) => {
  const x = 0.8 + i * 3.0;
  s.addText(st[0], { x, y: 3.35, w: 2.6, h: 1.1, fontFace: HEAD, fontSize: 60, bold: true, color: C.mint, margin: 0 });
  s.addText(st[1], { x, y: 4.45, w: 2.6, h: 0.4, fontFace: BODY, fontSize: 16, color: "CADCFC", margin: 0 });
});
s.addText("Pyramid-shaped suite · Docker-isolated E2E · CI/CD quality gates · load-tested with clear SLOs.", { x: 0.8, y: 5.4, w: 11.5, h: 0.6, fontFace: BODY, fontSize: 16, color: C.white, margin: 0 });
s.addText("Erti Prenci · Arens Danja · Arlind Frakulla       —       Thank you!", { x: 0.8, y: 6.3, w: 11.5, h: 0.5, fontFace: BODY, fontSize: 15, italic: true, color: "8FB3BD", margin: 0 });

pres.writeFile({ fileName: "WAT4-React-Quiz-Testing.pptx" }).then((f) => console.log("WROTE " + f));
