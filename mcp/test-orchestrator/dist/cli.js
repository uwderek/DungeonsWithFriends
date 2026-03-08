#!/usr/bin/env node
/**
 * CLI interface for test-orchestrator tools
 * Run directly to execute tools without MCP server overhead
 *
 * Usage:
 *   npm run lint              - Run TypeScript type checking
 *   npm run unit              - Run Jest unit tests
 *   npm run e2e               - Run Playwright E2E tests
 *   npm run tests             - Run full workflow
 *   npm run coverage          - Get coverage gaps
 *
 * Or with the generic CLI:
 *   npm run cli -- <tool> [options]
 */
import { encode } from '@toon-format/toon';
import { getCoverageGaps } from './handlers/CoverageHandler.js';
import { runE2ETests } from './handlers/E2EHandler.js';
import { runLint } from './handlers/LintHandler.js';
import { runUnitTests } from './handlers/UnitTestHandler.js';
import { PROJECT_ROOT } from './utils.js';
const TOOLS = ['run_lint', 'run_unit_tests', 'run_e2e_tests', 'run_tests', 'get_coverage_gaps'];
function printUsage() {
    console.log(`
Test Orchestrator CLI
=====================

Usage: npm run cli -- <tool> [options]

Tools:
  run_lint              Run TypeScript type checking + CSS linting
  run_unit_tests        Run Jest unit tests
  run_e2e_tests         Run Playwright E2E tests  
  run_tests             Run full workflow: lint (TS + CSS) → unit tests
  get_coverage_gaps     Get files below 75% coverage

Options:
  --file <path>         Limit to a single test file
  --skip-lint           Skip TypeScript type checking (run_tests only)
  --skip-coverage       Skip coverage collection (run_unit_tests only)
  --include-e2e         Include E2E tests (run_tests only)
  --run-all-projects    Run all browser projects (run_e2e_tests, default: true)
  --debug               Include debug trace logs
  --json                Output raw JSON instead of TOON format
  --help                Show this help message

Shortcut Scripts:
  npm run lint          → run_lint
  npm run unit          → run_unit_tests  
  npm run e2e           → run_e2e_tests
  npm run tests         → run_tests
  npm run coverage      → get_coverage_gaps

Examples:
  npm run lint
  npm run unit -- --file auth.test.ts --debug
  npm run tests -- --skip-lint --include-e2e
  npm run cli -- run_unit_tests --file projects.test.ts --json
`);
}
function parseArgs(args) {
    const result = {};
    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        switch (arg) {
            case '--file':
                if (i + 1 < args.length) {
                    result.file = args[++i];
                }
                break;
            case '--skip-lint':
                result.skipLint = true;
                break;
            case '--skip-coverage':
                result.skipCoverage = true;
                break;
            case '--include-e2e':
                result.includeE2E = true;
                break;
            case '--run-all-projects':
                result.runAllProjects = true;
                break;
            case '--debug':
                result.debug = true;
                break;
            case '--json':
                result.json = true;
                break;
            case '--help':
            case '-h':
                result.help = true;
                break;
        }
    }
    return result;
}
function runTool(toolName, options) {
    const debug = options.debug === true;
    switch (toolName) {
        case 'run_lint':
            return runLint(PROJECT_ROOT);
        case 'run_unit_tests':
            return runUnitTests(PROJECT_ROOT, options.file, options.skipCoverage === true, debug);
        case 'run_e2e_tests':
            return runE2ETests(PROJECT_ROOT, options.file, options.runAllProjects !== false, debug);
        case 'get_coverage_gaps':
            return getCoverageGaps(PROJECT_ROOT);
        case 'run_tests': {
            const skipLint = options.skipLint === true;
            const includeE2E = options.includeE2E === true;
            const testFile = options.file;
            // Step 1: Lint (unless skipped)
            if (!skipLint) {
                const lintResult = runLint(PROJECT_ROOT);
                if (!lintResult.success) {
                    return {
                        success: false,
                        phase: 'lint',
                        lintErrors: lintResult.lintErrors,
                        summary: lintResult.summary,
                        debugTrace: debug ? ['Linting failed'] : undefined
                    };
                }
                console.log('✓ Lint passed\n');
            }
            // Step 2: Unit tests
            const unitResult = runUnitTests(PROJECT_ROOT, testFile, options.skipCoverage === true, debug);
            if (!unitResult.success) {
                return { ...unitResult, phase: 'all' };
            }
            console.log('✓ Unit tests passed\n');
            // Step 3: E2E tests (if requested)
            if (includeE2E) {
                const e2eResult = runE2ETests(PROJECT_ROOT, testFile, options.runAllProjects !== false, debug);
                if (!e2eResult.success) {
                    return {
                        ...e2eResult,
                        phase: 'all',
                        coverageGaps: unitResult.coverageGaps,
                        debugTrace: debug
                            ? [...(unitResult.debugTrace || []), ...(e2eResult.debugTrace || [])]
                            : undefined
                    };
                }
                console.log('✓ E2E tests passed\n');
            }
            return {
                success: true,
                phase: 'all',
                coverageGaps: unitResult.coverageGaps,
                summary: unitResult.summary,
                debugTrace: debug ? unitResult.debugTrace : undefined
            };
        }
    }
}
function main() {
    const args = process.argv.slice(2);
    if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
        printUsage();
        process.exit(0);
    }
    const toolName = args[0];
    if (!TOOLS.includes(toolName)) {
        console.error(`❌ Unknown tool: ${toolName}\n`);
        console.error(`Available tools: ${TOOLS.join(', ')}`);
        process.exit(1);
    }
    const options = parseArgs(args.slice(1));
    console.log('═══════════════════════════════════════════════════════════════');
    console.log(`  Test Orchestrator CLI`);
    console.log('═══════════════════════════════════════════════════════════════');
    console.log(`  Tool:         ${toolName}`);
    console.log(`  Project Root: ${PROJECT_ROOT}`);
    if (options.file) {
        console.log(`  File Filter:  ${options.file}`);
    }
    if (options.debug) {
        console.log(`  Debug Mode:   enabled`);
    }
    console.log('═══════════════════════════════════════════════════════════════\n');
    const result = runTool(toolName, options);
    // Output the result
    console.log('═══════════════════════════════════════════════════════════════');
    console.log(`  RESULT: ${result.success ? '✓ SUCCESS' : '✗ FAILED'}`);
    console.log('═══════════════════════════════════════════════════════════════\n');
    if (options.json) {
        console.log(JSON.stringify(result, null, 2));
    }
    else {
        console.log(encode(result));
    }
    process.exit(result.success ? 0 : 1);
}
main();
