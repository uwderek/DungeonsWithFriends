export declare const PROJECT_ROOT: string;
/**
 * Log to stderr with timestamp (MCP servers use stderr for logging)
 * Uses TOON tabular array format: header declared once, then rows
 */
export declare function serverLog(level: 'INFO' | 'ERROR' | 'DEBUG' | 'WARN', message: string, data?: unknown): void;
/**
 * Get the correct command for the current platform (handles Windows .cmd extension)
 */
export declare function getCommand(cmd: string): string;
/**
 * Strip ANSI escape codes from string
 */
export declare function stripAnsi(str: string): string;
/**
 * Clean stack trace to remove node_modules and internal noise, but PRESERVE code frames
 */
export declare function cleanStackTrace(stack: string): string;
/**
 * Extract log lines between TEST START and TEST END markers for a specific test
 */
export declare function extractLogsForTest(logContent: string, testName: string): string[];
/**
 * Sanitize test name to filename
 */
export declare function sanitizeFilename(name: string): string;
