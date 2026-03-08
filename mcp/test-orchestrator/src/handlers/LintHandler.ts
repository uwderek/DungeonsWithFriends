import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { FileLintErrors, LintErrorDetail, TestResult } from '../types.js';
import { getCommand, serverLog } from '../utils.js';
import { runCSSLint } from './CSSLintHandler.js';

/**
 * Parse TypeScript compiler output for errors
 */
function parseLintOutput(output: string): { file: string; line: number; column: number; code: string; message: string }[] {
    const rawErrors: { file: string; line: number; column: number; code: string; message: string }[] = [];

    // Regex matches: file(line,col): error TSxxxx: message
    // Handles multi-line or standard stdout lines matching standard tsc formatting
    const regex = /([^\s]+)\((\d+),(\d+)\):\s+error\s+(TS\d+):\s+(.+)/g;

    let match;
    while ((match = regex.exec(output)) !== null) {
        rawErrors.push({
            file: match[1].trim(),
            line: parseInt(match[2], 10),
            column: parseInt(match[3], 10),
            code: match[4],
            message: match[5].trim(),
        });
    }
    return rawErrors;
}

/**
 * Group errors by file and add code context
 */
function enrichAndGroupErrors(rawErrors: { file: string; line: number; column: number; code: string; message: string }[], projectRoot: string): FileLintErrors[] {
    const groups = new Map<string, LintErrorDetail[]>();

    for (const error of rawErrors) {
        if (!groups.has(error.file)) {
            groups.set(error.file, []);
        }

        let context = '';
        try {
            const filePath = path.resolve(projectRoot, error.file);
            if (fs.existsSync(filePath)) {
                const content = fs.readFileSync(filePath, 'utf-8');
                const lines = content.split('\n');
                // Lines are 1-indexed in error, 0-indexed in array
                if (lines[error.line - 1] !== undefined) {
                    context = lines[error.line - 1].trim();
                }
            }
        } catch {
            // Ignore file read errors
        }

        groups.get(error.file)?.push({
            line: error.line,
            column: error.column,
            code: error.code,
            message: error.message,
            context
        });
    }

    // Convert map to array
    return Array.from(groups.entries()).map(([file, errors]) => ({
        file,
        errors
    }));
}

/**
 * Run TypeScript type checking and CSS linting
 */
export function runLint(projectRoot: string): TestResult {
    let tsLintErrors: FileLintErrors[] = [];
    let tsRawStderr: string | undefined;

    // Step 1: TypeScript type checking
    try {
        // Add --pretty false to prevent color codes and formatting issues
        const cmd = `${getCommand('npx')} tsc --noEmit --pretty false`;
        serverLog('DEBUG', 'Running lint command', { cmd, cwd: projectRoot });

        execSync(cmd, {
            cwd: projectRoot,
            encoding: 'utf-8',
            stdio: ['ignore', 'pipe', 'pipe'], // Ignore stdin, pipe stdout/stderr
        });
    } catch (error: unknown) {
        const execError = error as { stdout?: string; stderr?: string };
        const output = (execError.stdout || '') + (execError.stderr || '');

        // Log output length debug info
        if (output.length > 0) {
            serverLog('DEBUG', 'Lint command failed with output', {
                length: output.length,
            });
        }

        const rawErrors = parseLintOutput(output);
        tsLintErrors = enrichAndGroupErrors(rawErrors, projectRoot);

        // If tsc failed but we couldn't parse any errors, include raw stderr
        if (tsLintErrors.length === 0 && output.length > 0) {
            tsRawStderr = output.substring(0, 5000); // Cap at 5KB
        }

        if (tsLintErrors.length > 0) {
            const totalErrors = tsLintErrors.reduce((acc, curr) => acc + curr.errors.length, 0);
            return {
                success: false,
                phase: 'lint',
                lintErrors: tsLintErrors,
                rawStderr: tsRawStderr,
                summary: `Found ${totalErrors} TypeScript lint error(s) across ${tsLintErrors.length} file(s). CSS lint skipped.`,
            };
        }

        // tsc failed but no parseable errors — return the raw output
        if (tsRawStderr) {
            return {
                success: false,
                phase: 'lint',
                rawStderr: tsRawStderr,
                summary: 'TypeScript type check failed with unparseable output. CSS lint skipped. Check rawStderr for details.',
            };
        }
    }

    // Step 2: CSS linting via Stylelint
    const cssResult = runCSSLint(projectRoot);
    if (!cssResult.success) {
        // Merge any CSS errors into the response
        return {
            success: false,
            phase: 'lint',
            lintErrors: cssResult.lintErrors,
            rawStderr: cssResult.rawStderr,
            summary: cssResult.summary || 'CSS lint check failed.',
        };
    }

    return { success: true, phase: 'lint', summary: 'No lint errors found (TypeScript + CSS).' };
}
