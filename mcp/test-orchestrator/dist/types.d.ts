/**
 * Shared types for Test Orchestrator
 */
export interface LintErrorDetail {
    line: number;
    column: number;
    code: string;
    message: string;
    context: string;
}
export interface FileLintErrors {
    file: string;
    errors: LintErrorDetail[];
}
export interface FileTestFailures {
    file: string;
    failures: TestFailure[];
}
export interface TestFailure {
    testName: string;
    error: string;
    logs: string[];
    debugOutput?: string;
}
export interface MissingLineDetail {
    line: number;
    code: string;
    context: string;
}
export interface CoverageGap {
    file: string;
    statements: number;
    branches: number;
    functions: number;
    lines: number;
    missingLines: string;
    missingLineDetails?: MissingLineDetail[];
}
export interface TestResult {
    success: boolean;
    phase: 'lint' | 'unit' | 'e2e' | 'all';
    lintErrors?: FileLintErrors[];
    testFailures?: FileTestFailures[];
    coverageGaps?: CoverageGap[];
    summary?: string;
    debugTrace?: string[];
}
