import { encode } from '@toon-format/toon';
import * as path from 'path';
import { fileURLToPath } from 'url';
// Get the directory where this script is located
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Project root defaults to the DungeonsWithFriends application root directory (../../DungeonsWithFriends).
// It can be overridden via the PROJECT_ROOT environment variable.
const defaultProjectRoot = path.resolve(__dirname, '..', '..', '..', 'DungeonsWithFriends');
export const PROJECT_ROOT = process.env.PROJECT_ROOT || defaultProjectRoot;
// Track if header has been emitted
let headerEmitted = false;
/**
 * Log to stderr with timestamp (MCP servers use stderr for logging)
 * Uses TOON tabular array format: header declared once, then rows
 */
export function serverLog(level, message, data) {
    if (!headerEmitted) {
        console.error('logs{timestamp,level,message,data}:');
        headerEmitted = true;
    }
    const timestamp = new Date().toISOString();
    // Use encode for data to keep it TOON-compliant, but replace newlines for row format
    const dataStr = data !== undefined ? encode(data).replace(/\n/g, ' ').replace(/\s+/g, ' ') : 'null';
    // Output as row: timestamp,level,message,data
    console.error(`${timestamp},${level},${JSON.stringify(message)},${dataStr}`);
}
/**
 * Get the correct command for the current platform (handles Windows .cmd extension)
 */
export function getCommand(cmd) {
    const isWindows = process.platform === 'win32';
    if (isWindows && (cmd === 'npm' || cmd === 'npx')) {
        return `${cmd}.cmd`;
    }
    return cmd;
}
/**
 * Strip ANSI escape codes from string
 */
export function stripAnsi(str) {
    // eslint-disable-next-line no-control-regex
    return str.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');
}
/**
 * Clean output strings (strip ANSI and timing/noisy metadata)
 */
export function cleanOutput(str) {
    if (!str)
        return '';
    return stripAnsi(str)
        .replace(/Duration: \s*\d+(\.\d+)?ms/g, '')
        .replace(/\d+\s*passed.*?\(\d+(\.\d+)?s\)/g, '')
        .trim();
}
/**
 * Clean stack trace to remove node_modules and internal noise, but PRESERVE code frames
 */
export function cleanStackTrace(stack) {
    return stripAnsi(stack)
        .split('\n')
        .filter(line => {
        // Always keep lines that don't look like stack frames (e.g. code frame, error message)
        if (!line.trim().startsWith('at '))
            return true;
        // For stack frames, filter out noise
        if (line.includes('node_modules'))
            return false;
        if (line.includes('internal/process'))
            return false;
        if (line.includes('Generator.next'))
            return false;
        if (line.includes('__awaiter'))
            return false;
        return true;
    })
        .slice(0, 30) // Keep top 30 relevant lines to allow for snapshot diffs
        .join('\n');
}
/**
 * Extract log lines between TEST START and TEST END markers for a specific test
 */
export function extractLogsForTest(logContent, testName) {
    const logs = [];
    const lines = logContent.split('\n');
    let capturing = false;
    // Normalize test name for stricter matching
    const normalizedTarget = testName.trim();
    for (const line of lines) {
        if (line.includes('[TEST START]')) {
            if (line.includes(normalizedTarget)) {
                capturing = true;
            }
            else {
                capturing = false;
            }
            continue;
        }
        if (line.includes('[TEST END]')) {
            if (line.includes(normalizedTarget)) {
                capturing = false;
            }
            continue;
        }
        if (capturing && line.trim()) {
            logs.push(line.trim());
        }
    }
    return logs;
}
/**
 * Sanitize test name to filename
 */
export function sanitizeFilename(name) {
    return name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
}
