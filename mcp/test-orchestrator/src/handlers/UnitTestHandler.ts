import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { FileTestFailures, TestFailure, TestResult } from '../types.js';
import { parseCoverageGaps } from './CoverageHandler.js';
import { cleanStackTrace, extractLogsForTest, getCommand, PROJECT_ROOT, serverLog } from '../utils.js';
import { runLint } from './LintHandler.js';

/**
 * Parse Jest JSON output for failures
 */
function parseJestOutput(jsonPath: string, logPath: string): {
    failures: FileTestFailures[];
    passed: number;
    failed: number;
    stats: {
        suites: { passed: number; failed: number; total: number };
        snapshots: { matched: number; total: number; failed: number };
    }
} {
    const failuresMap = new Map<string, TestFailure[]>();
    let passed = 0;
    let failed = 0;

    const emptyStats = {
        suites: { passed: 0, failed: 0, total: 0 },
        snapshots: { matched: 0, total: 0, failed: 0 }
    };

    if (!fs.existsSync(jsonPath)) {
        return { failures: [], passed, failed, stats: emptyStats };
    }

    const json = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

    const stats = {
        suites: {
            passed: json.numPassedTestSuites || 0,
            failed: json.numFailedTestSuites || 0,
            total: json.numTotalTestSuites || 0
        },
        snapshots: {
            matched: json.snapshot?.matched || 0,
            total: json.snapshot?.total || 0,
            failed: json.snapshot?.failure || 0
        }
    };

    // Count tests manually
    passed = 0;
    failed = 0;

    // Read log output
    let logContent = '';
    if (fs.existsSync(logPath)) {
        logContent = fs.readFileSync(logPath, 'utf-8');
    }

    for (const result of json.testResults || []) {
        // result.name is absolute path to test file
        const filePath = result.name.replace(PROJECT_ROOT, '').replace(/^[\\\/]/, '');

        // Check for suite-level failure (e.g. syntax error, import error)
        const suiteError = result.message || result.failureMessage;
        if (suiteError) {
            const failure: TestFailure = {
                testName: 'Suite Failure (Syntax/Import Error)',
                error: cleanStackTrace(suiteError),
                logs: [],
            };
            if (!failuresMap.has(filePath)) {
                failuresMap.set(filePath, []);
            }
            failuresMap.get(filePath)?.push(failure);
        }

        for (const assertion of result.assertionResults || []) {
            if (assertion.status === 'passed') {
                passed++;
            } else if (assertion.status === 'failed') {
                failed++;

                const testName = assertion.fullName || assertion.title;
                const testLogs = extractLogsForTest(logContent, testName);

                const failure: TestFailure = {
                    testName,
                    error: cleanStackTrace((assertion.failureMessages || []).join('\n')),
                    logs: testLogs,
                };

                if (!failuresMap.has(filePath)) {
                    failuresMap.set(filePath, []);
                }
                failuresMap.get(filePath)?.push(failure);
            }
        }
    }

    const failures: FileTestFailures[] = Array.from(failuresMap.entries()).map(([file, fails]) => ({
        file,
        failures: fails
    }));

    return { failures, passed, failed, stats };
}

/**
 * Run Jest unit tests
 */
export function runUnitTests(projectRoot: string, testFile?: string, skipCoverage: boolean = false, debug: boolean = false, skipLint: boolean = false): TestResult {
    const trace: string[] = [];

    // Validate test file exists before running Jest
    if (testFile) {
        const resolvedPath = path.resolve(projectRoot, testFile);
        if (!fs.existsSync(resolvedPath)) {
            return {
                success: false,
                phase: 'unit',
                summary: `Test file not found: ${testFile}`,
                debugTrace: debug ? [`Resolved path: ${resolvedPath}`] : undefined,
            };
        }
    }

    // ENFORCED RULE: Linting must always run and pass before executing unit tests.
    // Callers that have already validated lint can pass skipLint=true to avoid redundant runs.
    if (!skipLint) {
        const lintResult = runLint(projectRoot);
        if (!lintResult.success) {
            return {
                success: false,
                phase: 'lint',
                lintErrors: lintResult.lintErrors,
                summary: lintResult.summary || 'Lint check failed. Fix these errors before running tests.',
                debugTrace: debug ? ['Linting failed'] : undefined
            };
        }
    } else {
        trace.push('Lint skipped (already passed by caller)');
    }

    const outputDir = path.join(projectRoot, 'output');
    const resultsDir = path.join(outputDir, 'test-results', 'unit');
    const jsonOutput = path.join(resultsDir, 'results.json');
    const logsDir = path.join(outputDir, 'logs');
    const coverageDir = path.join(outputDir, 'coverage');

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

    // Clean stale coverage data to ensure fresh collection
    if (fs.existsSync(coverageDir)) {
        fs.rmSync(coverageDir, { recursive: true });
        trace.push('Removed stale coverage directory');
    }

    // Clear Jest cache to ensure test discovery is fresh
    try {
        execSync(`${getCommand('npx')} jest --clearCache`, {
            cwd: projectRoot,
            stdio: 'ignore'
        });
        trace.push('Jest cache cleared');
    } catch {
        trace.push('Jest cache clear failed (non-fatal)');
    }

    // Find the most recent log file
    let logPath = '';
    if (fs.existsSync(logsDir)) {
        const logFiles = fs.readdirSync(logsDir)
            .filter(f => f.startsWith('unit-') && f.endsWith('.log'))
            .sort()
            .reverse();
        if (logFiles.length > 0) {
            logPath = path.join(logsDir, logFiles[0]);
            trace.push(`Found recent logs: ${logPath}`);
        }
    }

    // Build command
    // Use npx jest directly to bypass npm test script restrictions
    let cmd = `${getCommand('npx')} jest --json --outputFile="${jsonOutput}"`;
    if (!skipCoverage) {
        cmd += ' --coverage';
    }
    if (testFile) {
        cmd += ` "${testFile}"`;
        if (!skipCoverage) {
            // Scope coverage collection to the source file under test,
            // preventing false 0% reports for unrelated files.
            // Derive the source file path from the test file path.
            const sourceFile = testFile
                .replace(/\.(test|spec)\./, '.')
                .replace(/\\/g, '/');
            // Use glob pattern with ** prefix for Jest compatibility
            cmd += ` --collectCoverageFrom="**/${path.basename(sourceFile)}"`;
            trace.push(`Scoped coverage to: **/${path.basename(sourceFile)}`);
        }
    }
    trace.push(`Command: ${cmd}`);

    let capturedStderr = '';

    try {
        serverLog('DEBUG', 'Running unit tests', { cmd });
        const stdout = execSync(cmd, {
            cwd: projectRoot,
            encoding: 'utf-8',
            stdio: ['ignore', 'pipe', 'pipe'],
            timeout: 120_000, // 2 minute timeout to prevent hangs
        });
        const logFilePath = path.join(logsDir, `unit-${Date.now()}.log`);
        fs.writeFileSync(logFilePath, stdout);
        trace.push('Jest execution completed success exit code');
    } catch (error: unknown) {
        const execError = error as { stdout?: Buffer | string, stderr?: Buffer | string };
        const logFilePath = path.join(logsDir, `unit-${Date.now()}.log`);
        let outStr = '';
        if (execError.stdout) outStr += execError.stdout.toString('utf-8');
        if (execError.stderr) {
            capturedStderr = execError.stderr.toString('utf-8');
            outStr += '\n' + capturedStderr;
        }
        fs.writeFileSync(logFilePath, outStr);

        trace.push('Jest execution completed with failure exit code (expected for test failures)');
    }

    // Re-read log path after test run
    if (fs.existsSync(logsDir)) {
        const logFiles = fs.readdirSync(logsDir)
            .filter(f => f.startsWith('unit-') && f.endsWith('.log'))
            .sort()
            .reverse();
        if (logFiles.length > 0) {
            logPath = path.join(logsDir, logFiles[0]);
            trace.push(`Latest log file: ${logPath}`);
        }
    }

    const { failures, passed, failed, stats } = parseJestOutput(jsonOutput, logPath);
    trace.push(`Parsed output: ${passed} passed, ${failed} failed`);

    const summaryParts: string[] = [];
    if (failed > 0) {
        summaryParts.push(`${failed} failed`);
    }
    summaryParts.push(`${passed} passed`, `${passed + failed} total`);

    // Add Suite stats
    summaryParts.push(`(Suites: ${stats.suites.failed} failed, ${stats.suites.passed} passed)`);

    // Add Snapshot stats if relevant
    if (stats.snapshots.total > 0) {
        summaryParts.push(`(Snapshots: ${stats.snapshots.failed} failed, ${stats.snapshots.matched} passed)`);
    }

    // Overall success: no test failures
    const testsPass = failed === 0;

    // Include coverage gaps in the result when coverage was collected
    let coverageGaps: TestResult['coverageGaps'] = undefined;
    let coverageSuccess = true;
    if (!skipCoverage) {
        const { gaps, totalGaps } = parseCoverageGaps(coverageDir, projectRoot, 80, testFile);
        if (totalGaps > 0) {
            coverageGaps = gaps;
            coverageSuccess = false;
            summaryParts.push(`${totalGaps} file(s) below 80% coverage threshold`);
            trace.push(`Coverage gaps found: ${totalGaps} file(s)`);
        } else {
            trace.push('All files meet the 80% coverage threshold');
        }
    }

    const overallSuccess = testsPass && coverageSuccess;

    // Include rawStderr when Jest failed without producing parseable results
    const includeStderr = (failures.length === 0 && !testsPass && capturedStderr) ||
        (!fs.existsSync(jsonOutput) && capturedStderr);

    const result: TestResult = {
        success: overallSuccess,
        phase: 'unit',
        testFailures: failures.length > 0 ? failures : undefined,
        coverageGaps,
        lintErrors: [], // Explicitly empty to show lint passed
        summary: summaryParts.join(', ') + '.',
        debugTrace: debug ? trace : undefined,
        rawStderr: includeStderr ? capturedStderr.substring(0, 5000) : undefined,
    };
    return result;
}
