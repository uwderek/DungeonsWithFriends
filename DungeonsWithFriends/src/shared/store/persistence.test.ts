import { createStore } from 'tinybase';
import { CURRENT_SCHEMA_VERSION, DWF_APP_ID, LOCAL_STORE_KEY, TABLES } from './local-store';
import { createMemoryStorage, hydrateStoreFromPersistence, loadPersistedSnapshot, saveStoreToPersistence } from './persistence';

describe('persistence', () => {
    it('saves and reloads a local snapshot', () => {
        const storage = createMemoryStorage();
        const store = createStore();
        store.setRow(TABLES.characterSheets, 'sheet-1', { character_name: 'Ada' });

        saveStoreToPersistence(store, storage);

        const target = createStore();
        const result = hydrateStoreFromPersistence(target, storage);

        expect(result.error).toBeNull();
        expect(target.getCell(TABLES.characterSheets, 'sheet-1', 'character_name')).toBe('Ada');
    });

    it('recovers from corrupt local data', () => {
        const storage = createMemoryStorage({ 'dwf.local-store.v1': '{bad' });
        const result = loadPersistedSnapshot(storage);

        expect(result.recovered).toBe(true);
        expect(result.error?.code).toBe('invalid_json');
    });

    it('recovers from persisted snapshots with invalid domain rows', () => {
        const storage = createMemoryStorage({
            [LOCAL_STORE_KEY]: JSON.stringify({
                app_id: DWF_APP_ID,
                schema_version: CURRENT_SCHEMA_VERSION,
                exported_at: '2026-07-08T00:00:00.000Z',
                tables: {
                    [TABLES.systemTemplates]: {
                        '11111111-1111-4111-8111-111111111111': {
                            system_name: 'Fantasy d20',
                            system_version: '1.0.0',
                            field_definitions: '{bad',
                            created_at: '2026-07-08T00:00:00.000Z',
                            updated_at: '2026-07-08T00:00:00.000Z',
                        },
                    },
                },
            }),
        });

        const result = loadPersistedSnapshot(storage);

        expect(result.recovered).toBe(true);
        expect(result.error?.code).toBe('invalid_domain_data');
        expect(result.snapshot.tables).toEqual({});
    });

    it('recovers when local storage cannot be read', () => {
        const storage = {
            getItem: () => {
                throw new Error('denied');
            },
            setItem: jest.fn(),
            removeItem: jest.fn(),
        };

        const result = loadPersistedSnapshot(storage);

        expect(result.recovered).toBe(true);
        expect(result.error?.code).toBe('storage_unavailable');
        expect(result.snapshot.tables).toEqual({});
    });
});
