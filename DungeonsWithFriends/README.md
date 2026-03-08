# Dungeons With Friends - Foundation (React Native Web + Nativewind v4)

This represents the foundational codebase for the Dungeons With Friends project. It is structured using Feature-Sliced Design to eventually build out complex offline-first capabilities using TinyBase and Nhost synchronization.

## 🚀 Getting Started

First, install your dependencies. 

```bash
npm install
```

### Running the App Locally

To start the development server:

```bash
npm start
``` 

Press **`w`** in the terminal to open the web application. You can press `a` or `i` to open an Android or iOS emulator if installed.

To export the web bundle, run:

```bash
npx expo export -p web
```

## 🧪 Testing Architecture

> **CRITICAL RULE**: ALL testing, linting, and coverage mapping must occur strictly through the **Test Orchestrator MCP** server. Do not run `jest` or `playwright` natively, and do not use generic terminal commands to execute tests.

The Test Orchestrator wraps Jest, Playwright, and Stylelint to automatically assert project constraints (like fixing lint errors first) and aggregates assertions and runtime logs into structural payloads.

### Using the Test Orchestrator MCP

As an AI developer, you have access to the `test-orchestrator` MCP server which provides the following tools:

1. **`run_tests`**: The primary tool for running the full workflow (Lint → Unit tests). Linting includes **both TypeScript (`tsc`) and CSS (`stylelint`)**. You can optionally set `includeE2E: true` to run End-to-End tests as well. Set `skipLint: true` only if you specifically need to bypass the mandatory linting phase.
2. **`run_lint`**: Runs TypeScript type checking **and CSS linting (Stylelint)** independently. Returns the file, line, column, and error message for each issue.
3. **`run_unit_tests`**: Runs only the Jest unit tests. Supports limiting execution to a specific file via the `file` parameter. Set `skipCoverage: true` to bypass coverage collection.
4. **`run_e2e_tests`**: Runs Playwright E2E tests. By default (`runAllProjects: true`), it uses a fail-fast "chromium-first" strategy: if chromium passes, it runs other simulated browsers (Mobile Chrome, Mobile Safari). Use the `file` parameter to isolate a specific spec.
5. **`get_coverage_gaps`**: Retrieves files with coverage below the 80% threshold and their exact uncovered line numbers, based on the *last* test run. Does not execute tests itself.

**Debugging Tests**
Every tool accepts a `debug: true` parameter. If a tool fails to parse or times out, re-run it with `debug: true` to receive internal execution traces. Additionally, when a tool crashes without producing parseable output (e.g., Babel syntax errors, module resolution failures), the `rawStderr` field in the response will contain the raw process error output for debugging — eliminating the need to run commands manually.

### CSS Linting

The project uses **Stylelint** with `stylelint-config-standard` for CSS quality enforcement. Configuration lives in `.stylelintrc.json` at the project root. Tailwind directives (`@tailwind`, `@apply`, `@layer`, `@config`) are explicitly whitelisted.

Generated files in `coverage/`, `output/`, and `dist/` are automatically excluded from CSS linting.

### Logging Requirements
To aid debugging during automated tests, application code is expected to log its execution cleanly.
1. **Always prefixed:** `console.log('[SyncProvider] Initializing');`
2. **Captured natively:** If an E2E or Unit test fails, the orchestrator parses the execution buffers for that specific test run and includes the exact logs printed by the React components during assertion into the `logs` payload automatically.

### Evaluating Test Results
Do not search for output natively on disk. The test-orchestrator automatically captures and surfaces these to you directly:
- **`run_tests` output:** Parses test assertions into structured JSON arrays listing the exact locator missed or element missing.
- **Trace Debugging:** Use the `debug: true` flag inside an MCP tool invocation (or `--debug` in the CLI) if the tests fail catastrophically and you need to view the execution timeline.
- **Raw Error Output:** When structured parsing fails, check the `rawStderr` field for raw process output to diagnose configuration, Babel, or module resolution errors.

### Coverage Expectations
The project maintains a strict minimum baseline of **80% Code Coverage**.
- Each test run outputs `coverageGaps` with line details if files fall beneath the threshold.
- Run `get_coverage_gaps` to request the exact line numbers missing branch coverage to guide testing efforts.