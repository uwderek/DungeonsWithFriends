import { CoverageGap, TestResult } from '../types.js';
/**
 * Parse coverage report and find files below threshold
 */
export declare function parseCoverageGaps(coverageDir: string, projectRoot: string, threshold?: number, filterFile?: string): {
    gaps: CoverageGap[];
    totalGaps: number;
    allGapFiles: string[];
};
/**
 * Get coverage gaps without running tests
 */
export declare function getCoverageGaps(projectRoot: string): TestResult;
