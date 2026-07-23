# next-scaffold

[![Quality gate status](https://sonarcloud.io/api/project_badges/measure?project=Agustin-Perezz_next-scaffold&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=Agustin-Perezz_next-scaffold)

A production-ready [Next.js](https://nextjs.org) starter that keeps server and client boundaries explicit, pushes interactivity to the leaves of the component tree, and colocates data fetching with Server Actions. The scaffold follows a shift-left approach: fast feedback (lint, typecheck, unit tests + coverage) runs first, then SonarCloud analysis (importing the coverage report), then the production build, and finally the expensive E2E suite — so issues are caught as early and cheaply as possible in the development cycle.

## Tech Stack

| Area            | Choice                                        |
| --------------- | --------------------------------------------- |
| Framework       | Next.js 16 (App Router)                        |
| UI runtime      | React 19                                       |
| Language        | TypeScript (strict)                           |
| Components      | base-ui + shadcn                               |
| Styling         | Tailwind CSS v4                                |
| Forms           | react-hook-form + zod                          |
| Lint / Format   | Biome 2                                        |
| Unit tests      | Vitest + Testing Library (jsdom)               |
| Coverage        | `@vitest/coverage-istanbul` (lcov → SonarCloud) |
| E2E             | Playwright (Chromium)                          |
| Monitoring      | Sentry (`@sentry/nextjs`)                      |
| Security scan   | Snyk (SARIF → GitHub Code Scanning)            |
| Code quality    | SonarCloud (static analysis + Quality Gate)    |
| Package manager | pnpm 9                                         |
| Git hooks       | Husky + nano-staged                            |

## Folder Structure

```
next-scaffold/
├── .github/
│   └── workflows/
│       └── ci.yml                # Shift-left chain: static → unit → sonar → build → e2e (+ snyk)
├── docs/                         # Engineering guidelines
│   ├── 01_COMPONENT-PATTERNS.md
│   ├── 02_FRONTEND-FOLDER-STRUCTURE.md
│   └── 04_TYPESCRIPT-STANDARDS.md
├── public/                       # Static assets served at root
├── src/
│   ├── app/                      # App Router routes (pages, layouts, actions)
│   ├── components/
│   │   └── ui/                   # Reusable base-ui / shadcn primitives
│   └── lib/
│       └── utils.ts              # Shared utilities (cn, helpers)
├── tests/                        # Playwright E2E specs + Vitest unit tests (tests/unit/)
├── biome.json                    # Linter & formatter config
├── sonar-project.properties      # SonarCloud analysis configuration
├── next.config.ts                # Next.js configuration
├── package.json
├── playwright.config.ts
├── vitest.config.ts              # Unit test + coverage configuration
└── tsconfig.json                 # Path alias: @/* -> ./src/*
```

See [`AGENTS.md`](./AGENTS.md) for the engineering conventions agents and contributors should follow.

## Setup

1. Copy `.env.example` to `.env.local` and fill in the values:

   ```bash
   cp .env.example .env.local
   ```

2. Install dependencies and Playwright browsers:

   ```bash
   pnpm install
   pnpm test:install
   ```

3. Start the dev server:

   ```bash
   pnpm dev
   ```

The app runs at [http://localhost:3000](http://localhost:3000).

## Scripts

| Script                | Description                              |
| --------------------- | ---------------------------------------- |
| `pnpm dev`            | Start development server                  |
| `pnpm build`          | Production build                         |
| `pnpm start`          | Start production server                  |
| `pnpm lint`           | Run Biome lint & format checks           |
| `pnpm format`         | Auto-format with Biome                   |
| `pnpm typecheck`      | Run TypeScript type checking (`tsc --noEmit`) |
| `pnpm test`           | Run unit tests (Vitest)                  |
| `pnpm test:unit`      | Run unit tests (Vitest)                  |
| `pnpm test:unit:watch`| Run unit tests in watch mode             |
| `pnpm test:coverage`  | Run unit tests with coverage (writes `coverage/lcov.info`) |
| `pnpm test:e2e`       | Run Playwright E2E tests                 |
| `pnpm test:ui`        | Run Playwright with interactive UI       |
| `pnpm test:install`   | Install Playwright Chromium browser      |

## Git Hooks

[Husky](https://typicode.github.io/husky/) manages Git hooks:

- **pre-commit**: runs `nano-staged`, which executes `biome check --staged` on staged files.
- **pre-push**: runs `pnpm typecheck && pnpm test:unit` (fast unit tests — E2E runs in CI, not on push).

Hooks are installed automatically via the `prepare` script when running `pnpm install`.

## CI (GitHub Actions)

The `.github/workflows/ci.yml` workflow runs on push to `main` and on pull requests as a shift-left, fail-fast chain — each stage gates the next, so a red PR never wastes SonarCloud tokens or browser minutes:

1. **static** — Biome lint + TypeScript typecheck (fast gate)
2. **unit** — Vitest unit tests with coverage; uploads the `coverage-report` artifact (contains `lcov.info`)
3. **sonar** — SonarCloud static analysis + Quality Gate, importing the coverage report produced by `unit`
4. **build** — production build with Sentry source map upload
5. **e2e** — Playwright E2E tests (runs **last** — the most expensive stage)
6. **snyk** — scans dependencies for high-severity vulnerabilities and uploads the results as SARIF to GitHub Code Scanning (runs in parallel off `sonar`; allowed to continue on error so findings do not block the pipeline)

```
static ──> unit ──> sonar ──┬──> build ──> e2e
                           └──> snyk
```

Coverage feeds the SonarCloud Quality Gate: `pnpm test:coverage` writes `coverage/lcov.info`, which `sonar-project.properties` points SonarCloud at via `sonar.javascript.lcov.reportPaths`. The Quality Gate enforces **Coverage on new code ≥ 80%** (configured in the SonarCloud UI) — a delta gate that does not penalize pre-existing uncovered code.

### Required GitHub Secrets

Configure these in **Settings → Secrets and variables → Actions**:

| Secret                   | Description                            |
| ------------------------ | -------------------------------------- |
| `SONAR_TOKEN`            | SonarCloud analysis token              |
| `NEXT_PUBLIC_SENTRY_DSN` | Sentry DSN (client + server)           |
| `SENTRY_AUTH_TOKEN`      | Sentry auth token for source map upload |
| `SENTRY_ORG`             | Sentry organization slug               |
| `SENTRY_PROJECT`         | Sentry project slug                    |
| `SNYK_TOKEN`             | Snyk API token for vulnerability scans |

## Documentation

- [Component Patterns](./docs/01_COMPONENT-PATTERNS.md)
- [Frontend Folder Structure](./docs/02_FRONTEND-FOLDER-STRUCTURE.md)
- [TypeScript Standards](./docs/04_TYPESCRIPT-STANDARDS.md)

