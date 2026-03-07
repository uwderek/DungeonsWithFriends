import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { FileTestFailures, TestFailure, TestResult } from '../types.js';
import { cleanStackTrace, getCommand, PROJECT_ROOT, sanitizeFilename, serverLog } from '../utils.js';
import { runLint } from './LintHandler.js';

/**
 * Parse E2E test failures from results.json and capture debug logs
 */
function parseE2EFailures(rawJsonOutput: string, logsDir: string): { failures: FileTestFailures[], debugTrace: string[] } {
    const failuresMap = new Map<string, TestFailure[]>();
    const trace: string[] = [];

    if (!rawJsonOutput) {
        trace.push(`Result JSON output was empty.`);
        return { failures: [], debugTrace: trace };
    }

    let results: any;
    try {
        results = JSON.parse(rawJsonOutput);
    } catch (e) {
        trace.push(`Failed to parse Playwright JSON stdout: ${e}`);
        return { failures: [], debugTrace: trace };
    }

    trace.push(`Loaded results.json. Suites: ${results.suites?.length}`);

    // Find the most recent e2e-run directory for logs
    let e2eRunDir = '';
    if (fs.existsSync(logsDir)) {
        const runDirs = fs.readdirSync(logsDir)
            .filter(d => d.startsWith('e2e-run-'))
            .sort()
            .reverse();
        if (runDirs.length > 0) {
            e2eRunDir = path.join(logsDir, runDirs[0]);
            trace.push(`Log dir found: ${e2eRunDir}`);
        } else {
            trace.push('No e2e-run directories found');
        }
    } else {
        trace.push(`Logs base dir not found: ${logsDir}`);
    }

    for (const suite of results.suites || []) {
        trace.push(`Processing specific suite: ${suite.title} (${suite.file})`);

        const specs: any[] = [];
        const collectSpecs = (s: any) => {
            if (s.specs) specs.push(...s.specs);
            if (s.suites) s.suites.forEach(collectSpecs);
        };
        collectSpecs(suite);
        trace.push(`  Specs found: ${specs.length}`);

        for (const spec of specs) {
            for (const test of spec.tests || []) {
                trace.push(`    Test: ${spec.title} - Status: ${test.status}`);
                // Playwright uses 'unexpected' for failures, 'flaky' for retries that eventually pass (or fail differently)
                if (test.status === 'unexpected' || test.status === 'flaky' || test.status === 'failed' || test.status === 'timedOut') {
                    const testName = `${spec.title}`;
                    const file = (spec.file || suite.file || 'unknown').replace(PROJECT_ROOT, '').replace(/^[\\\/]/, '');
                    trace.push(`      Adding failure for file: ${file}`);

                    let debugOutput = '';
                    if (e2eRunDir) {
                        const testLogName = sanitizeFilename(spec.title) + '.log';
                        const testLogPath = path.join(e2eRunDir, testLogName);
                        if (fs.existsSync(testLogPath)) {
                            debugOutput = fs.readFileSync(testLogPath, 'utf-8').substring(0, 2000);
                        }
                    }

                    if (!debugOutput && Array.isArray(test.results?.[0]?.stdout)) {
                        debugOutput = test.results[0].stdout
                            .map((o: any) => o.text || '')
                            .join('\n')
                            .substring(0, 2000);
                    }
                    if (!debugOutput && Array.isArray(test.results?.[0]?.stderr)) {
                        const stderr = test.results[0].stderr
                            .map((o: any) => o.text || '')
                            .join('\n');
                        debugOutput = (debugOutput ? debugOutput + '\n' : '') + stderr.substring(0, 2000);
                    }

                    // Clean error message: strip duration logic
                    let errorMessage = (test.results?.[0]?.error?.message || 'Test failed');
                    // Remove "Duration: 123ms" or similar timing noise if present
                    errorMessage = errorMessage.replace(/Duration: \s*\d+(\.\d+)?ms/g, '');

                    // Also strip "received: ... expected: ..." extra lines if they are very long or time-based?
                    // For now, Playwright's default error usually includes diffs which are useful.
                    // Just removing explicit Duration tags.

                    const failure: TestFailure = {
                        testName,
                        error: cleanStackTrace(errorMessage).trim(),
                        logs: [],
                        debugOutput: debugOutput || undefined,
                    };

                    if (!failuresMap.has(file)) {
                        failuresMap.set(file, []);
                    }
                    failuresMap.get(file)?.push(failure);
                }
            }
        }
    }

    return {
        failures: Array.from(failuresMap.entries()).map(([file, failures]) => ({
            file,
            failures
        })),
        debugTrace: trace
    };
}

export function runE2ETests(projectRoot: string, testFile?: string, runAllProjects: boolean = true, debug: boolean = false): TestResult {
    // 1. Run Linting First
    const lintResult = runLint(projectRoot);
    if (!lintResult.success) {
        return {
            success: false,
            phase: 'lint',
            lintErrors: lintResult.lintErrors,
            summary: lintResult.summary || 'Lint check failed. Fix these errors before running tests.',
        };
    }

    const outputDir = path.join(projectRoot, 'output');
    const resultsDir = path.join(outputDir, 'test-results', 'e2e');
    const resultsPath = path.join(resultsDir, 'results.json');
    const logsDir = path.join(outputDir, 'logs');

    // Ensure output directories exist
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    if (!fs.existsSync(resultsDir)) {
        fs.mkdirSync(resultsDir, { recursive: true });
    }
    if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir, { recursive: true });
    }

    // Fail-Fast Strategy: 
    // In order to save time with running E2E tests, chromium is run first. 
    // If there's an error during the chromium run, it is highly likely that the error 
    // exists in all other browser configurations. By failing early here, we save 
    // significant time bypassing redundant failing browser tests.
    // NOTE: Keep this rationale and behavior in place so it doesn't get changed.
    let cmd = `${getCommand('npx')} playwright test --project=chromium --reporter=json`;
    if (testFile) {
        cmd += ` "${testFile}"`;
    }

    // Set the environment variable for playwright.config.ts to pick up the exact JSON output file path
    const env = { ...process.env, PLAYWRIGHT_JSON_OUTPUT_NAME: resultsPath };

    try {
        serverLog('DEBUG', 'Running E2E tests (Chromium first)', { cmd });
        const stdout = execSync(cmd, {
            cwd: projectRoot,
            encoding: 'utf-8',
            stdio: ['ignore', 'pipe', 'pipe'],
            env
        });

        // Chromium passed - now run all other projects to ensure full coverage
        if (runAllProjects) {
            try {
                // To maintain a general-purpose MCP (not hardcoding Firefox/WebKit or Mobile Safari), 
                // we simply run playwright without project constraints. This will run ALL projects 
                // defined in the user's playwright.config.ts.
                let fullCmd = `${getCommand('npx')} playwright test --reporter=json`;
                if (testFile) {
                    fullCmd += ` "${testFile}"`;
                }
                serverLog('DEBUG', 'Running E2E remaining platforms', { fullCmd });
                const fullStdout = execSync(fullCmd, {
                    cwd: projectRoot,
                    encoding: 'utf-8',
                    stdio: ['ignore', 'pipe', 'pipe'],
                    env
                });

                return {
                    success: true,
                    phase: 'e2e',
                    lintErrors: [],
                    summary: 'All E2E tests passed on all browser projects.',
                    debugTrace: debug ? ['All tests passed'] : undefined
                };
            } catch (otherError: any) {
                const stdoutBuf = otherError.stdout;
                const stderrBuf = otherError.stderr;
                const stdoutError = stdoutBuf ? stdoutBuf.toString('utf-8') : '';
                const stderrError = stderrBuf ? stderrBuf.toString('utf-8') : '';
                const { failures, debugTrace } = parseE2EFailures(stdoutError, logsDir);

                if (failures.length === 0 && debugTrace.length > 0) {
                    debugTrace.push(`execSync Error Message: ${otherError.message}`);
                    debugTrace.push(`execSync stderr: ${stderrError}`);
                }

                return {
                    success: false,
                    phase: 'e2e',
                    testFailures: failures.length > 0 ? failures : undefined,
                    lintErrors: [],
                    summary: `Chromium passed but ${failures.reduce((acc, f) => acc + f.failures.length, 0)} test(s) failed on other target platforms.`,
                    debugTrace: debug ? debugTrace : undefined
                };
            }
        }

        return {
            success: true,
            phase: 'e2e',
            lintErrors: [],
            summary: 'All E2E tests passed (chromium only).',
            debugTrace: debug ? ['Chromium tests passed'] : undefined
        };
    } catch (error: any) {
        const stdoutBuf = error.stdout;
        const stderrBuf = error.stderr;
        const stdoutError = stdoutBuf ? stdoutBuf.toString('utf-8') : '';
        const stderrError = stderrBuf ? stderrBuf.toString('utf-8') : '';
        const { failures, debugTrace } = parseE2EFailures(stdoutError, logsDir);

        // Add error details to trace if parsing fails
        if (failures.length === 0 && debugTrace.length > 0) {
            debugTrace.push(`execSync Error Message: ${error.message}`);
            debugTrace.push(`execSync stderr: ${stderrError}`);
        }

        return {
            success: false,
            phase: 'e2e',
            testFailures: failures.length > 0 ? failures : undefined,
            lintErrors: [],
            summary: `E2E tests failed in Chromium fail-fast check. Found ${failures.reduce((acc, f) => acc + f.failures.length, 0)} failures.`,
            debugTrace: debug ? debugTrace : undefined
        };
    }
}
