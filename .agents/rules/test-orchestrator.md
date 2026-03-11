---
trigger: always_on
---

# Test Orchestrator MCP Rules & Workflow

## CORE MANDATE
You are integrated with the `test-orchestrator` MCP Server for this project. This server entirely replaces standard CLI testing commands. 
- ABSOLUTE RULE: You must NEVER run default testing commands (like `npm test`, `npx jest`, or `npm run lint`) directly in the terminal. You must exclusively use the provided MCP tools to interact with the test environment.
- STATE MANAGEMENT: You must use your active task-tracking system (TODO checklist, artifact, or implementation plan) to track all testing progress, failures, coverage gaps, and tool improvements granularly.

## AVAILABLE MCP TOOLS
- `run_tests`: Executes the full workflow (Lint → Unit Tests). Accepts `includeE2E`, `skipLint`, `debug`.
- `run_lint`: Executes TypeScript type checking and CSS linting (Stylelint).
- `run_unit_tests`: Executes Jest unit tests with coverage. Accepts `file`, `skipCoverage`, `inspect`, `debug`.
- `run_e2e_tests`: Executes Playwright E2E tests. Accepts `file`, `runAllProjects`, `inspect`, `debug`.
- `get_coverage_gaps`: Returns exact line numbers for files below the 80% coverage threshold.

## 1. EXECUTION & ERROR HANDLING
- Mandatory Linting: Linting (TypeScript and CSS) must pass before unit tests are considered valid. Fix file, line, and column errors immediately.
- Raw Stderr Passthrough: If a tool crashes without parseable output, read the `rawStderr` field.
- Deep Debugging: If a tool times out or fails unexpectedly, re-run with `debug: true` to receive internal `debugTrace` logs. Do not read log files directly off the disk unless explicitly instructed.
- Log Prefixing: When adding `console.log()` to application code for debugging, always prefix with context (e.g., `[PlayerService] Action Failed:`). 

## 2. CONTINUOUS MCP SERVER IMPROVEMENT (STRICT PROTOCOL)
The test-orchestrator is a living tool. You are responsible for improving it if it exhibits brittle behavior, poor UX, or fails to parse inputs gracefully.

If you encounter an error using an MCP tool, an unparseable response, or usability friction (e.g., you provided a file name but the tool crashed because it expected an absolute path), you must immediately trigger the MCP Improvement Protocol:
1. Document the Friction: Note what action you took, what you expected to happen, and why it failed.
2. Define the Solution: Formulate a fix (e.g., "Update `run_unit_tests` to search the project directory for matching file names if an absolute path is not provided").
3. Update the Task List: Append a specific task to the END of your active TODO/task list to update the MCP server's source code with this improvement.
4. Immediate Execution: You must address and implement this MCP server improvement immediately to unblock your workflow before continuing with standard application development.
5. Manual Review & Restart: After modifying the MCP server code, you must PAUSE execution. Explicitly prompt the user to manually review your changes, rebuild the server, and restart the MCP process. Do not proceed with any testing or development tasks until the user confirms the server is back online.

## 3. THE STRICT CODE COVERAGE MANDATE
This project enforces a minimum of 80% code coverage per file. A coverage warning is a fatal test failure.
1. Evaluate Coverage: Check the `coverageGaps` payload returned by `run_unit_tests`. 
2. Identify Gaps: If any file has <80% coverage, call `get_coverage_gaps` to scan for exact missing lines.
3. Granular Task Generation: You are strictly forbidden from grouping coverage fixes. For EVERY INDIVIDUAL FILE returned, append a separate, distinct task to your list (e.g., "Write tests for uncovered branches in GameBoard.ts lines 45-60").
4. Resolution: Implement tests to satisfy these specific missing paths. You cannot mark your overarching goal complete until all individual file coverage tasks are done and the files no longer appear in the coverage gaps report.

## 4. FIX THE CODE, NOT JUST THE TEST
- If a test is failing or coverage is exceptionally difficult to achieve because the code is tightly coupled or lacks dependency injection, DO NOT write a convoluted "band-aid" test.
- Halt testing, add a refactoring task to your list, and refactor the underlying application code to be properly testable before proceeding.

