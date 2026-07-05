This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Setup

1. Copy `.env.example` to `.env.local` and fill in values:

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

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Scripts

| Script            | Description                              |
| ----------------- | ---------------------------------------- |
| `pnpm dev`        | Start development server                 |
| `pnpm build`      | Production build                         |
| `pnpm start`      | Start production server                   |
| `pnpm lint`       | Run Biome lint & format checks           |
| `pnpm format`     | Auto-format with Biome                    |
| `pnpm typecheck`  | Run TypeScript type checking             |
| `pnpm test`       | Run Playwright E2E tests                  |
| `pnpm test:ui`    | Run Playwright with interactive UI        |
| `pnpm test:install` | Install Playwright Chromium browser     |

## Git Hooks

[Husky](https://typicode.github.io/husky/) manages Git hooks:

- **pre-commit**: runs `nano-staged` which executes `biome check --staged` on staged files
- **pre-push**: runs `pnpm typecheck && pnpm test`

Hooks are installed automatically via the `prepare` script when running `pnpm install`.

## CI (GitHub Actions)

The `.github/workflows/ci.yml` workflow runs on push to `main` and pull requests:

1. Lint (Biome)
2. Typecheck (`tsc --noEmit`)
3. E2E tests (Playwright, Chromium only)
4. Build (`next build` with Sentry source map upload)

### Required GitHub Secrets

Configure these in **Settings → Secrets and variables → Actions**:

| Secret                  | Description                          |
| ----------------------- | ------------------------------------ |
| `NEXT_PUBLIC_SENTRY_DSN`| Sentry DSN (client + server)         |
| `SENTRY_AUTH_TOKEN`     | Sentry auth token for source map upload |
| `SENTRY_ORG`            | Sentry organization slug             |
| `SENTRY_PROJECT`        | Sentry project slug                  |

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Sentry Next.js SDK](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [Playwright](https://playwright.dev/)
- [Biome](https://biomejs.dev/)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.