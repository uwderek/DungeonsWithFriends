import { Store } from 'tinybase';
import { applySnapshotToStore, snapshotStore } from './local-store';
import { migrateSnapshot, parseSnapshotJson } from './migrations';

export const exportStoreToJson = (store: Store): string => (
    JSON.stringify(snapshotStore(store), null, 2)
);

export const importStoreFromJson = (store: Store, raw: string): void => {
    const snapshot = migrateSnapshot(parseSnapshotJson(raw));
    applySnapshotToStore(store, snapshot);
};
