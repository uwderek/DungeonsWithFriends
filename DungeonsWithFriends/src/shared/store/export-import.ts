import { Store } from 'tinybase';
import { applySnapshotToStore, snapshotStore } from './local-store';
import { migrateSnapshot, parseSnapshotJson } from './migrations';
import { validateSnapshotDomainData } from './domain-validation';

export const exportStoreToJson = (store: Store): string => (
    JSON.stringify(snapshotStore(store), null, 2)
);

export const importStoreFromJson = (store: Store, raw: string): void => {
    const snapshot = migrateSnapshot(parseSnapshotJson(raw));
    validateSnapshotDomainData(snapshot);
    applySnapshotToStore(store, snapshot);
};
