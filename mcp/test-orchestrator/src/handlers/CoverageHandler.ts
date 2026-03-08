import * as fs from 'fs';
import * as path from 'path';
import { CoverageGap, TestResult } from '../types.js';

/**
 * Compress line numbers into ranges
 */
function compressLineNumbers(lines: number[]): string {
    if (lines.length === 0) return '';

    const sorted = [...lines].sort((a, b) => a - b);
    const ranges: string[] = [];
    let start = sorted[0];
    let end = sorted[0];

    for (let i = 1; i <= sorted.length; i++) {
        if (i < sorted.length && sorted[i] === end + 1) {
            end = sorted[i];
        } else {
            if (start === end) {
                ranges.push(String(start));
            } else {
                ranges.push(`${start}-${end}`);
            }
            if (i < sorted.length) {
                start = sorted[i];
                end = sorted[i];
            }
        }
    }

    return ranges.join(', ');
}

/**
 * Get raw array of uncovered line numbers
 */
function getRawUncoveredLines(coverageDir: string, filePath: string): number[] {
    const lcovPath = path.join(coverageDir, 'lcov.info');
    if (!fs.existsSync(lcovPath)) {
        return [];
    }

    const lcov = fs.readFileSync(lcovPath, 'utf-8');
    const lines = lcov.split('\n');

    let inFile = false;
    const uncoveredLines: number[] = [];
    const functionMap = new Map<string, number>();

    for (const line of lines) {
        if (line.startsWith('SF:') && line.includes(path.basename(filePath))) {
            inFile = true;
        }

        if (inFile) {
            if (line.startsWith('DA:')) {
                const parts = line.substring(3).split(',');
                const lineNum = parseInt(parts[0], 10);
                const hits = parseInt(parts[1], 10);
                if (hits === 0) {
                    uncoveredLines.push(lineNum);
                }
            }
            if (line.startsWith('FN:')) {
                const parts = line.substring(3).split(',');
                const lineNum = parseInt(parts[0], 10);
                const name = parts[1];
                functionMap.set(name, lineNum);
            }
            if (line.startsWith('FNDA:')) {
                const parts = line.substring(5).split(',');
                const hits = parseInt(parts[0], 10);
                const name = parts[1];
                if (hits === 0) {
                    const lineNum = functionMap.get(name);
                    if (lineNum !== undefined) {
                        uncoveredLines.push(lineNum);
                    }
                }
            }
            if (line.startsWith('BRDA:')) {
                const parts = line.substring(5).split(',');
                const lineNum = parseInt(parts[0], 10);
                const taken = parts[3] === '-' ? 0 : parseInt(parts[3], 10);
                if (taken === 0) {
                    uncoveredLines.push(lineNum);
                }
            }
            if (line.startsWith('end_of_record')) {
                inFile = false;
            }
        }
    }

    // Dedup and sort
    const uniqueLines = Array.from(new Set(uncoveredLines));
    return uniqueLines.sort((a, b) => a - b);
}

/**
 * Find context (function/class) for a specific line
 */
function findContext(lines: string[], targetLineIndex: number): string {
    // Scan backwards from the target line

    // Naive heuristic: scan up for line ending in { or starting with export/class/func
    for (let i = targetLineIndex; i >= 0; i--) {
        const line = lines[i];
        const trim = line.trim();
        if (!trim) continue;

        // Check for common definition patterns
        if (trim.match(/^(export\s+)?(default\s+)?(class|interface|type|function|const|let|var|async)\s+/)) {
            return trim.replace(/\{$/, '').trim();
        }

        // Also catch method definitions in classes: "name(args) {"
        if (trim.match(/^[a-zA-Z0-9_$]+\s*\(.*\)\s*\{?$/)) {
            return trim.replace(/\{$/, '').trim();
        }
    }

    return 'root';
}

/**
 * Parse coverage report and find files below threshold
 */
export function parseCoverageGaps(coverageDir: string, projectRoot: string, threshold: number = 80, filterFile?: string): {
    gaps: CoverageGap[];
    totalGaps: number;
    allGapFiles: string[];
} {
    const gaps: CoverageGap[] = [];
    const allGapFiles: string[] = [];
    const summaryPath = path.join(coverageDir, 'coverage-summary.json');

    if (!fs.existsSync(summaryPath)) {
        return { gaps: [], totalGaps: 0, allGapFiles: [] };
    }

    const summary = JSON.parse(fs.readFileSync(summaryPath, 'utf-8'));

    // Prepare filter if provided
    let filterBase: string | null = null;
    if (filterFile) {
        // Remove extension and common test suffixes
        const basename = path.basename(filterFile);
        // Remove .test.ts, .spec.tsx, .ts, .js etc.
        filterBase = basename
            .replace(/\.(test|spec)/, '')
            .replace(/\.[jt]sx?$/, '');
    }

    for (const [filePath, data] of Object.entries(summary)) {
        if (filePath === 'total') continue;

        const coverage = data as {
            lines: { pct: number };
            statements: { pct: number };
            branches: { pct: number };
            functions: { pct: number };
        };

        const isGap = coverage.lines.pct < threshold ||
            coverage.statements.pct < threshold ||
            coverage.branches.pct < threshold ||
            coverage.functions.pct < threshold;

        if (isGap) {
            allGapFiles.push(filePath);

            // Determine if we should include details for this file
            let includeDetails = true;
            if (filterBase && filterFile) {
                // Use full path comparison when possible to avoid collisions
                // with common filenames (e.g., index.tsx)
                const normalizedFilter = filterFile
                    .replace(/\.(test|spec)\./, '.')
                    .replace(/\\/g, '/');
                const normalizedCoverage = filePath.replace(/\\/g, '/');
                if (!normalizedCoverage.endsWith(normalizedFilter) &&
                    !normalizedCoverage.includes(filterBase)) {
                    includeDetails = false;
                }
            }

            if (includeDetails) {
                // Get uncovered lines (raw array) - This is the expensive part (reading lcov.info and source files)
                const rawMissingLines = getRawUncoveredLines(coverageDir, filePath);
                // Format for summary
                const missingLinesStr = compressLineNumbers(rawMissingLines);

                // Generate details
                const missingLineDetails: any[] = [];

                if (rawMissingLines.length > 0) {
                    try {
                        const absFilePath = path.resolve(projectRoot, filePath);
                        if (fs.existsSync(absFilePath)) {
                            const fileContent = fs.readFileSync(absFilePath, 'utf-8');
                            const lines = fileContent.split('\n');

                            // Limit details to first 20 lines to avoid massive output
                            const detailsToShow = rawMissingLines.slice(0, 20);

                            for (const lineNum of detailsToShow) {
                                // lineNum is 1-indexed
                                const lineIndex = lineNum - 1;
                                if (lines[lineIndex] !== undefined) {
                                    missingLineDetails.push({
                                        line: lineNum,
                                        code: lines[lineIndex].trim(),
                                        context: findContext(lines, lineIndex)
                                    });
                                }
                            }
                        }
                    } catch {
                        // Ignore file read errors
                    }
                }

                gaps.push({
                    file: filePath,
                    statements: coverage.statements.pct,
                    branches: coverage.branches.pct,
                    functions: coverage.functions.pct,
                    lines: coverage.lines.pct,
                    missingLines: missingLinesStr,
                    missingLineDetails
                });
            }
        }
    }

    gaps.sort((a, b) => a.lines - b.lines);
    return {
        gaps,
        totalGaps: allGapFiles.length,
        allGapFiles
    };
}

/**
 * Get coverage gaps without running tests
 */
export function getCoverageGaps(projectRoot: string): TestResult {
    const coverageDir = path.join(projectRoot, 'output', 'coverage');
    const { gaps, totalGaps } = parseCoverageGaps(coverageDir, projectRoot);

    if (totalGaps === 0) {
        return {
            success: true,
            phase: 'unit',
            summary: 'All files meet the 80% coverage threshold.',
        };
    }

    return {
        success: false,
        phase: 'unit',
        coverageGaps: gaps,
        summary: `${totalGaps} file(s) below 80% coverage threshold.  You must review the coverage gaps and implement tests to increase coverage (and refactor where needed) to succeed test run.`,
    };
}
