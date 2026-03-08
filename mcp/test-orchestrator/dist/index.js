/**
 * Test Orchestrator MCP Server
 *
 * Orchestrates test workflows: lint → unit tests → E2E tests
 * with structured, parseable log output and coverage analysis.
 */
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema, } from '@modelcontextprotocol/sdk/types.js';
import { encode } from '@toon-format/toon';
import * as fs from 'fs';
import { getCoverageGaps } from './handlers/CoverageHandler.js';
import { runE2ETests } from './handlers/E2EHandler.js';
import { runLint } from './handlers/LintHandler.js';
import { runUnitTests } from './handlers/UnitTestHandler.js';
import { PROJECT_ROOT, serverLog } from './utils.js';
// Create MCP server
const server = new Server({
    name: 'test-orchestrator',
    version: '1.0.0',
}, {
    capabilities: {
        tools: {},
    },
});
// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: [
        {
            name: 'run_tests',
            description: 'Run the full test workflow: lint (TypeScript + CSS) → unit tests. Returns structured errors, failures, and coverage gaps. Linting must pass before tests run.',
            inputSchema: {
                type: 'object',
                properties: {
                    file: {
                        type: 'string',
                        description: 'Optional: Limit to a single test file (basename or path)',
                    },
                    skipLint: {
                        type: 'boolean',
                        description: 'Skip TypeScript type checking (default: false)',
                    },
                    includeE2E: {
                        type: 'boolean',
                        description: 'Include E2E tests after unit tests (default: false)',
                    },
                    debug: {
                        type: 'boolean',
                        description: 'Include internal debug trace logs in response (default: false)',
                    },
                },
            },
        },
        {
            name: 'run_lint',
            description: 'Run TypeScript type checking and CSS linting (Stylelint). Returns file, line, column, and error message for each error.',
            inputSchema: {
                type: 'object',
                properties: {},
            },
        },
        {
            name: 'run_unit_tests',
            description: 'Run Jest unit tests only. Returns test failures with associated log output and coverage gaps.',
            inputSchema: {
                type: 'object',
                properties: {
                    file: {
                        type: 'string',
                        description: 'Optional: Limit to a single test file (basename or path)',
                    },
                    skipCoverage: {
                        type: 'boolean',
                        description: 'Skip coverage collection (default: false)',
                    },
                    debug: {
                        type: 'boolean',
                        description: 'Include internal debug trace logs in response (default: false)',
                    },
                },
            },
        },
        {
            name: 'run_e2e_tests',
            description: 'Run Playwright E2E tests. Uses chromium-first strategy: runs chromium first, then if it passes, runs other browsers. Returns test failures with debug console output.',
            inputSchema: {
                type: 'object',
                properties: {
                    file: {
                        type: 'string',
                        description: 'Optional: Limit to a single spec file',
                    },
                    runAllProjects: {
                        type: 'boolean',
                        description: 'After chromium passes, run all other browser projects (default: true)',
                    },
                    debug: {
                        type: 'boolean',
                        description: 'Include internal debug trace logs in response (default: false)',
                    },
                },
            },
        },
        {
            name: 'get_coverage_gaps',
            description: 'Get files below 80% coverage threshold with uncovered line numbers. Does not run tests, uses last coverage report.',
            inputSchema: {
                type: 'object',
                properties: {},
            },
        },
    ],
}));
// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    const projectRoot = PROJECT_ROOT;
    let result;
    try {
        switch (name) {
            case 'run_lint':
                result = runLint(projectRoot);
                break;
            case 'run_unit_tests': {
                const debug = args?.debug === true;
                result = runUnitTests(projectRoot, args?.file, args?.skipCoverage === true, debug);
                break;
            }
            case 'run_e2e_tests': {
                const runAllProjects = args?.runAllProjects !== false; // Default true
                const debug = args?.debug === true;
                result = runE2ETests(projectRoot, args?.file, runAllProjects, debug);
                break;
            }
            case 'get_coverage_gaps':
                result = getCoverageGaps(projectRoot);
                break;
            case 'run_tests': {
                const skipLint = args?.skipLint === true;
                const includeE2E = args?.includeE2E === true;
                const debug = args?.debug === true;
                const testFile = args?.file;
                // Step 1: Lint (unless skipped)
                if (!skipLint) {
                    const lintResult = runLint(projectRoot);
                    if (!lintResult.success) {
                        result = {
                            success: false,
                            phase: 'lint',
                            lintErrors: lintResult.lintErrors,
                            summary: lintResult.summary,
                            debugTrace: debug ? ['Linting failed'] : undefined
                        };
                        break;
                    }
                }
                // Step 2: Unit tests
                const unitResult = runUnitTests(projectRoot, testFile, false, debug);
                if (!unitResult.success) {
                    result = {
                        ...unitResult,
                        phase: 'all',
                    };
                    break;
                }
                // Step 3: E2E tests (if requested)
                let e2eTrace = [];
                if (includeE2E) {
                    const e2eResult = runE2ETests(projectRoot, testFile, true, debug);
                    e2eTrace = e2eResult.debugTrace || [];
                    if (!e2eResult.success) {
                        result = {
                            ...e2eResult,
                            phase: 'all',
                            coverageGaps: unitResult.coverageGaps,
                            debugTrace: debug ? [...(unitResult.debugTrace || []), ...e2eTrace] : undefined
                        };
                        break;
                    }
                }
                result = {
                    success: true,
                    phase: 'all',
                    coverageGaps: unitResult.coverageGaps,
                    summary: unitResult.summary,
                    debugTrace: debug ? [...(unitResult.debugTrace || []), ...e2eTrace] : undefined
                };
                break;
            }
            default:
                return {
                    content: [{ type: 'text', text: `Unknown tool: ${name}` }],
                    isError: true,
                };
        }
        // Use TOON encoding for result
        return {
            content: [
                {
                    type: 'text',
                    text: encode(result),
                },
            ],
        };
    }
    catch (error) {
        serverLog('ERROR', 'Tool execution failed', { error });
        return {
            content: [{ type: 'text', text: `Tool execution failed: ${error instanceof Error ? error.message : String(error)}` }],
            isError: true,
        };
    }
});
// Start server with comprehensive error handling
async function main() {
    try {
        serverLog('INFO', 'Test Orchestrator MCP server starting...');
        serverLog('DEBUG', 'Environment', {
            nodeVersion: process.version,
            platform: process.platform,
            cwd: process.cwd(),
            projectRoot: PROJECT_ROOT,
            projectRootExists: fs.existsSync(PROJECT_ROOT),
        });
        // Validate project root
        if (!fs.existsSync(PROJECT_ROOT)) {
            serverLog('ERROR', `Project root does not exist: ${PROJECT_ROOT}`);
            process.exit(1);
        }
        const transport = new StdioServerTransport();
        serverLog('DEBUG', 'Transport created, connecting to server...');
        await server.connect(transport);
        serverLog('INFO', 'Test Orchestrator MCP server ready on stdio');
        serverLog('DEBUG', 'Server capabilities', { tools: true });
    }
    catch (error) {
        serverLog('ERROR', 'Failed to start MCP server', {
            error: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
        });
        process.exit(1);
    }
}
// Handle uncaught errors
process.on('uncaughtException', (error) => {
    serverLog('ERROR', 'Uncaught exception', {
        error: error.message,
        stack: error.stack,
    });
    process.exit(1);
});
process.on('unhandledRejection', (reason) => {
    serverLog('ERROR', 'Unhandled rejection', {
        reason: reason instanceof Error ? reason.message : String(reason),
    });
    process.exit(1);
});
main();
