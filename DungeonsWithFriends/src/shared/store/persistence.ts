import { Store } from 'tinybase';
import {
    LOCAL_STORE_KEY,
    applySnapshotToStore,
    createEmptySnapshot,
    snapshotStore,
} from './local-store';
import { LocalStoreError, migrateSnapshot, parseSnapshotJson } from './migrations';
import { validateSnapshotDomainData } from './domain-validation';

export type LocalStoreStorage = {
    getItem: (key: string) => string | null;
    setItem: (key: string, value: string) => void;
    removeItem: (key: string) => void;
};

export type LocalStoreLoadResult = {
    recovered: boolean;
    snapshotVersion: number;
    error: LocalStoreError | null;
};

export const createMemoryStorage = (initial: Record<string, string> = {}): LocalStoreStorage => {
    const values = { ...initial };
    return {
        getItem: (key) => values[key] ?? null,
        setItem: (key, value) => {
            values[key] = value;
        },
        removeItem: (key) => {
            delete values[key];
        },
    };
};

const memoryStorage = createMemoryStorage();

export const getDefaultLocalStoreStorage = (): LocalStoreStorage => {
    const candidate = (globalThis as { localStorage?: LocalStoreStorage }).localStorage;
    return candidate ?? memoryStorage;
};

export const loadPersistedSnapshot = (
    storage: LocalStoreStorage = getDefaultLocalStoreStorage(),
    key = LOCAL_STORE_KEY
) => {
    let raw: string | null;
    try {
        raw = storage.getItem(key);
    } catch (error) {
        return {
            snapshot: createEmptySnapshot(),
            recovered: true,
            error: new LocalStoreError(
                'storage_unavailable',
                'Local store persistence is unavailable.',
                error
            ),
        };
    }

    if (raw === null) {
        return { snapshot: createEmptySnapshot(), recovered: false, error: null };
    }

    try {
        const snapshot = migrateSnapshot(parseSnapshotJson(raw));
        validateSnapshotDomainData(snapshot);
        return { snapshot, recovered: false, error: null };
    } catch (error) {
        const localError = error instanceof LocalStoreError
            ? error
            : new LocalStoreError('invalid_envelope', 'Local store snapshot could not be loaded.', error);
        return { snapshot: createEmptySnapshot(), recovered: true, error: localError };
    }
};

export const hydrateStoreFromPersistence = (
    store: Store,
    storage: LocalStoreStorage = getDefaultLocalStoreStorage(),
    key = LOCAL_STORE_KEY
): LocalStoreLoadResult => {
    const result = loadPersistedSnapshot(storage, key);
    applySnapshotToStore(store, result.snapshot);
    return {
        recovered: result.recovered,
        snapshotVersion: result.snapshot.schema_version,
        error: result.error,
    };
};

export const saveStoreToPersistence = (
    store: Store,
    storage: LocalStoreStorage = getDefaultLocalStoreStorage(),
    key = LOCAL_STORE_KEY
) => {
    const snapshot = snapshotStore(store);
    storage.setItem(key, JSON.stringify(snapshot));
    return snapshot;
};
