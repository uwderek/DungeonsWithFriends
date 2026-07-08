import { CURRENT_SCHEMA_VERSION, createEmptySnapshot } from './local-store';
import { LocalStoreError, migrateSnapshot, parseSnapshotJson } from './migrations';

describe('migrations', () => {
    it('accepts the current snapshot version', () => {
        const snapshot = createEmptySnapshot('2026-07-08T00:00:00.000Z');
        expect(migrateSnapshot(snapshot).schema_version).toBe(CURRENT_SCHEMA_VERSION);
    });

    it('rejects malformed JSON', () => {
        expect(() => parseSnapshotJson('{nope')).toThrow(LocalStoreError);
    });

    it('rejects unsupported future versions', () => {
        const snapshot = {
            ...createEmptySnapshot('2026-07-08T00:00:00.000Z'),
            schema_version: CURRENT_SCHEMA_VERSION + 1,
        };

        expect(() => migrateSnapshot(snapshot)).toThrow('newer than supported');
    });
});
