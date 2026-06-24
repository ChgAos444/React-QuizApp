# E2E frontend image: builds the React app with the API URL baked in, then
# serves the static production build. Used only by docker-compose.e2e.yml to
# create an isolated, production-like frontend for the Playwright tests.

# ---- build stage -----------------------------------------------------------
FROM node:20-bullseye-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY . .
# The browser (running inside the Playwright container) reaches the backend by
# its compose service name, so we bake that URL into the production bundle.
ARG REACT_APP_API_URL="http://backend:9000/questions"
ENV REACT_APP_API_URL=${REACT_APP_API_URL}
# The app's package.json sets "homepage" to a GitHub Pages sub-path, which would
# make CRA emit asset URLs under /React-QuizApp/. We serve the build at the root
# (`serve -s`), so override PUBLIC_URL to "/" to keep asset URLs root-relative.
ENV PUBLIC_URL=/
RUN npm run build

# ---- runtime stage ---------------------------------------------------------
FROM node:20-bullseye-slim
WORKDIR /app
RUN npm install -g serve@14
COPY --from=build /app/build ./build

EXPOSE 3000
HEALTHCHECK --interval=2s --timeout=5s --start-period=5s --retries=40 \
  CMD node -e "fetch('http://localhost:3000/').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["serve", "-s", "build", "-l", "3000"]
