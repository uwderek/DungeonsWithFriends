import { createStore } from 'tinybase';
import { TABLES } from './local-store';
import { createMemoryStorage, hydrateStoreFromPersistence, loadPersistedSnapshot, saveStoreToPersistence } from './persistence';

describe('persistence', () => {
    it('saves and reloads a local snapshot', () => {
        const storage = createMemoryStorage();
        const store = createStore();
        store.setRow(TABLES.componentDefinitions, 'component-1', { display_label: 'Name' });

        saveStoreToPersistence(store, storage);

        const target = createStore();
        const result = hydrateStoreFromPersistence(target, storage);

        expect(result.error).toBeNull();
        expect(target.getCell(TABLES.componentDefinitions, 'component-1', 'display_label')).toBe('Name');
    });

    it('recovers from corrupt local data', () => {
        const storage = createMemoryStorage({ 'dwf.local-store.v1': '{bad' });
        const result = loadPersistedSnapshot(storage);

        expect(result.recovered).toBe(true);
        expect(result.error?.code).toBe('invalid_json');
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
