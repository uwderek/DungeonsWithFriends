# Test Orchestrator MCP Server

An MCP server that orchestrates the test workflow for the Dungeons With Friends project.

## Tools

| Tool | Description |
|------|-------------|
| `run_tests` | Full workflow: lint → unit tests. Set `includeE2E: true` for E2E. |
| `run_lint` | TypeScript type checking only |
| `run_unit_tests` | Jest unit tests with coverage |
| `run_e2e_tests` | Playwright E2E (chromium-first, then all browsers) |
| `get_coverage_gaps` | Files below 80% coverage from last run |

---

## Instructions for AI Developers 🤖

This MCP server is explicitly designed to handle the complexity of test environments for you. **DO NOT** use default testing commands like `npm test` or `npx jest` directly, as they bypass critical architectural constraints.

### 1. Mandatory Linting
Linting must **always** run and pass before unit tests can execute. The `run_tests` tool automatically enforces this sequence. If linting fails, it will return the file name, line, and column error contexts. **You must fix lint errors before attempting test execution.**

### 2. Reading and Evaluating Test Results
When testing fails, the MCP returns a structured payload.
- **Failures output the assertion error and logs explicitly:** Pay attention to the `error` string and the associated `logs` array. 
- **Check the debug trace:** Run the tool with `debug: true` to receive `debugTrace` logs of the entire pipeline execution if you are unsure why a tool timed out or failed to parse.
- **Where to look:** Do not read log files off the disk directly unless instructed. The `test-orchestrator` parses standard out logs directly into the JSON/TOON response payload.

### 3. Adding Logging to Application Code
To aid in test debugging, standard `console.log()` and `console.error()` inside application code are automatically captured by the orchestrator during test execution and appended to the failing test's `logs` payload.
- **Log thoughtfully**: Only emit logs right before state changes or significant logic forks. High noise will truncate the payload.
- **Ensure log prefixing**: When printing variables, always prefix with context, e.g., `console.error('[AuthProvider] State Transition Failed:', error);`.

### 4. Meeting the 80% Code Coverage Constraint
The project enforces a strict **minimum of 80% code coverage** per file. 
- After running `run_unit_tests`, evaluate the `coverageGaps` payload returned by the server. 
- If a file has less than 80% coverage, the `get_coverage_gaps` tool can be used to scan the current missing line numbers.
- **Write tests for uncovered branches**: The `missingLineDetails` object will provide you with exact context and line numbers that lack test coverage. You must implement tests to satisfy these missing paths before concluding your task.

---

## Parameters

All tools accept optional parameters:

| Parameter | Tools | Description |
|-----------|-------|-------------|
| `file` | All except `run_lint`, `get_coverage_gaps` | Limit to specific test file |
| `debug` | All | Return internal trace logs for debugging |
| `skipLint` | `run_tests` | Skip TypeScript type checking |
| `includeE2E` | `run_tests` | Include E2E tests after unit tests |
| `skipCoverage` | `run_unit_tests` | Skip coverage collection |
| `runAllProjects` | `run_e2e_tests` | Run all browsers after chromium (default: true) |

## Debug Mode

When `debug: true` is passed, the tool returns a `debugTrace` array with internal execution logs:
- Commands executed
- Log file paths discovered
- Parsing steps

Use this when output is unclear or unexpected.

## E2E Strategy

1. Run chromium first (fastest feedback)
2. If chromium passes and `runAllProjects: true` (default), run firefox + webkit
3. Return failures with debug console output

## Log Format (TOON Tabular)

Server logs use TOON tabular array format for AI efficiency:

```toon
logs{timestamp,level,message,data}:
2025-12-14T19:59:20.378Z,INFO,"Server starting...",null
2025-12-14T19:59:20.379Z,DEBUG,"Environment",nodeVersion: v24.8.0
```

## Installation

```bash
cd mcp/test-orchestrator
npm install
npm run build
```

## Usage

### MCP Server Mode

Configure in your MCP client:
```bash
node dist/index.js
```

### CLI Mode (Direct Execution)

Run tools directly from the command line without the MCP server:

#### Shortcut Scripts

```bash
npm run lint          # Run TypeScript type checking
npm run unit          # Run Jest unit tests
npm run e2e           # Run Playwright E2E tests
npm run tests         # Run full workflow: lint → unit tests
npm run coverage      # Get files below 75% coverage
```

#### With Options

Use `--` to pass additional options:

```bash
npm run unit -- --file auth.test.ts --debug
npm run tests -- --skip-lint --include-e2e
npm run e2e -- --file login.spec.ts
```

#### Generic CLI

```bash
npm run cli -- <tool> [options]

# Examples:
npm run cli -- run_lint
npm run cli -- run_unit_tests --file projects.test.ts --json
npm run cli -- run_tests --skip-lint --include-e2e --debug
```

#### CLI Options

| Option | Description | Tools |
|--------|-------------|-------|
| `--file <path>` | Limit to a single test file | unit, e2e, tests |
| `--skip-lint` | Skip TypeScript type checking | tests |
| `--skip-coverage` | Skip coverage collection | unit |
| `--include-e2e` | Include E2E tests after unit tests | tests |
| `--run-all-projects` | Run all browser projects (default: true) | e2e |
| `--debug` | Include debug trace logs | all |
| `--json` | Output raw JSON instead of TOON format | all |
| `--help` | Show help message | all |
