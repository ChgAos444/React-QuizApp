// Central configuration for the quiz frontend.
//
// API_URL is read from the build-time environment variable REACT_APP_API_URL
// (Create React App convention). This lets us point the app at different
// back ends without code changes:
//   - default: the original public GitHub Pages JSON file
//   - local development / E2E / load testing: a json-server instance, e.g.
//     REACT_APP_API_URL=http://localhost:9000/questions
//
// This indirection follows the Dependency Inversion idea from the WAT4 slides:
// the component depends on a configurable abstraction (a URL), not on a single
// hard-coded data source.
const API_URL =
  process.env.REACT_APP_API_URL ||
  "https://vinayak9669.github.io/React_quiz_api/questions.json";

const config = { API_URL };

export default config;
