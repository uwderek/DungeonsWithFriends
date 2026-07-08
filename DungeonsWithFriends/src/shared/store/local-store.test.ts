import { createStore } from 'tinybase';
import { applySnapshotToStore, createDwfStore, createEmptySnapshot, snapshotStore, TABLES } from './local-store';

describe('local-store', () => {
    it('creates an empty TinyBase store for local data', () => {
        const store = createDwfStore();
        expect(store.getTables()).toEqual({});
    });

    it('writes rows using the current local table contract', () => {
        const store = createDwfStore();

        store.setRow(TABLES.characterSheets, 'sheet-1', { ready: true });
        store.setRow(TABLES.componentDefinitions, 'component-1', { ready: true });
        store.setRow(TABLES.systemTemplates, 'template-1', { ready: true });
        store.setRow(TABLES.templateBindings, 'binding-1', { ready: true });
        store.setRow(TABLES.diceRolls, 'roll-1', { ready: true });

        expect(Object.keys(store.getTables()).sort()).toEqual([
            TABLES.characterSheets,
            TABLES.componentDefinitions,
            TABLES.diceRolls,
            TABLES.systemTemplates,
            TABLES.templateBindings,
        ].sort());
    });

    it('snapshots and restores TinyBase tables', () => {
        const store = createStore();
        store.setRow(TABLES.systemTemplates, 'template-1', { system_name: 'Test' });
        const snapshot = snapshotStore(store, '2026-07-08T00:00:00.000Z');

        const target = createDwfStore();
        applySnapshotToStore(target, snapshot);

        expect(target.getCell(TABLES.systemTemplates, 'template-1', 'system_name')).toBe('Test');
    });

    it('creates an empty versioned snapshot', () => {
        expect(createEmptySnapshot('2026-07-08T00:00:00.000Z')).toMatchObject({
            app_id: 'dungeons_with_friends',
            schema_version: 1,
            exported_at: '2026-07-08T00:00:00.000Z',
            tables: {},
        });
    });
});
