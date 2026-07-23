import path from "node:path";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

// Vitest configuration for unit/component tests.
// Coverage is produced here (lcov + clover) and consumed by SonarCloud via
// `sonar.javascript.lcov.reportPaths=./coverage/lcov.info` in sonar-project.properties.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/unit/setup.ts"],
    include: ["tests/unit/**/*.{test,spec}.{ts,tsx}"],
    exclude: ["node_modules", ".next", "tests/smoke.spec.ts"],
    coverage: {
      provider: "istanbul",
      reporter: ["text", "text-summary", "lcov", "clover"],
      reportsDirectory: "./coverage",
      include: ["src/**/*.{ts,tsx}"],
      // Mirrors sonar.coverage.exclusions so the local report and SonarCloud
      // agree on the measured surface. Keep these two lists in lockstep.
      //
      // src/components/ui/** (shadcn / base-ui primitives) are thin
      // presentational wrappers exercised through routes + E2E, so they are
      // excluded from the coverage gate rather than unit-tested.
      exclude: [
        "src/**/*.d.ts",
        "src/sentry.client.config.ts",
        "src/sentry.edge.config.ts",
        "src/sentry.server.config.ts",
        "src/instrumentation.ts",
        "src/components/ui/**",
        "src/hooks/useFileDropzone.ts",
        "src/lib/utils/dropzone-errors.ts",
      ],
      // Threshold OFF initially so the harness can land without blocking on
      // legacy uncovered code. The SonarCloud "Coverage on new code" gate
      // already protects against newly-introduced uncovered code.
      // Ramp up here once the suite matures, e.g.:
      //   thresholds: { lines: 80, functions: 80, statements: 80, branches: 75 }
    },
  },
});
