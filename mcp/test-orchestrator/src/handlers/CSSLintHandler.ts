import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { FileLintErrors, LintErrorDetail, TestResult } from '../types.js';
import { getCommand, serverLog } from '../utils.js';

/**
 * Parse Stylelint JSON output into structured lint errors
 */
function parseStylelintOutput(jsonOutput: string, projectRoot: string): FileLintErrors[] {
    const groups: FileLintErrors[] = [];

    let results: any[];
    try {
        results = JSON.parse(jsonOutput);
    } catch {
        serverLog('WARN', 'Failed to parse Stylelint JSON output');
        return [];
    }

    for (const result of results) {
        if (!result.warnings || result.warnings.length === 0) continue;

        // Make file path relative to project root
        let filePath = result.source || '';
        if (filePath.startsWith(projectRoot)) {
            filePath = filePath.substring(projectRoot.length).replace(/^[\\/]/, '');
        }

        const errors: LintErrorDetail[] = [];
        for (const warning of result.warnings) {
            let context = '';
            try {
                const absPath = path.resolve(projectRoot, filePath);
                if (fs.existsSync(absPath)) {
                    const content = fs.readFileSync(absPath, 'utf-8');
                    const lines = content.split('\n');
                    if (lines[warning.line - 1] !== undefined) {
                        context = lines[warning.line - 1].trim();
                    }
                }
            } catch {
                // Ignore file read errors
            }

            errors.push({
                line: warning.line,
                column: warning.column,
                code: warning.rule || 'css-lint',
                message: warning.text || 'Unknown CSS error',
                context,
            });
        }

        if (errors.length > 0) {
            groups.push({ file: filePath, errors });
        }
    }

    return groups;
}

/**
 * Run CSS linting via Stylelint
 */
export function runCSSLint(projectRoot: string): TestResult {
    // Check if .stylelintrc.json exists
    const configPath = path.join(projectRoot, '.stylelintrc.json');
    if (!fs.existsSync(configPath)) {
        serverLog('DEBUG', 'No .stylelintrc.json found, skipping CSS lint');
        return { success: true, phase: 'lint', summary: 'CSS lint skipped (no .stylelintrc.json).' };
    }

    // Use simple glob — exclusions are handled by .stylelintignore in the project root
    const cmd = `${getCommand('npx')} stylelint "**/*.css" --formatter json --allow-empty-input`;

    try {
        serverLog('DEBUG', 'Running CSS lint command', { cmd, cwd: projectRoot });

        const stdout = execSync(cmd, {
            cwd: projectRoot,
            encoding: 'utf-8',
            stdio: ['ignore', 'pipe', 'pipe'],
        });

        // Parse output even on success (stylelint may return warnings)
        const lintErrors = parseStylelintOutput(stdout, projectRoot);
        if (lintErrors.length > 0) {
            const totalErrors = lintErrors.reduce((acc, curr) => acc + curr.errors.length, 0);
            return {
                success: false,
                phase: 'lint',
                lintErrors,
                summary: `Found ${totalErrors} CSS lint error(s) across ${lintErrors.length} file(s).`,
            };
        }

        return { success: true, phase: 'lint', summary: 'No CSS lint errors found.' };
    } catch (error: unknown) {
        const execError = error as { stdout?: string; stderr?: string; status?: number };
        const stdout = execError.stdout || '';
        const stderr = execError.stderr || '';

        serverLog('DEBUG', 'Stylelint exited with error', {
            hasStdout: stdout.length > 0,
            hasStderr: stderr.length > 0,
            stdoutPreview: stdout.substring(0, 200),
        });

        // Stylelint exits with code 2 when it finds lint errors but still outputs JSON to stdout
        if (stdout) {
            const lintErrors = parseStylelintOutput(stdout, projectRoot);
            if (lintErrors.length > 0) {
                const totalErrors = lintErrors.reduce((acc, curr) => acc + curr.errors.length, 0);
                return {
                    success: false,
                    phase: 'lint',
                    lintErrors,
                    summary: `Found ${totalErrors} CSS lint error(s) across ${lintErrors.length} file(s).`,
                };
            }
        }

        // If we can't parse errors but the process failed, include raw output for debugging
        return {
            success: false,
            phase: 'lint',
            rawStderr: (stderr || stdout || 'Stylelint exited with an error but produced no parseable output.').substring(0, 5000),
            summary: 'CSS lint failed with unparseable output.',
        };
    }
}
