import { createStore, Store, Tables } from 'tinybase';

export const DWF_APP_ID = 'dungeons_with_friends';
export const CURRENT_SCHEMA_VERSION = 1;
export const LOCAL_STORE_KEY = 'dwf.local-store.v1';

export const TABLES = {
    componentDefinitions: 'component_definitions',
    systemTemplates: 'system_templates',
    templateBindings: 'template_bindings',
    characterSheets: 'character_sheets',
    diceRolls: 'dice_rolls',
} as const;

export type DwfStoreSnapshot = {
    app_id: typeof DWF_APP_ID;
    schema_version: typeof CURRENT_SCHEMA_VERSION;
    exported_at: string;
    tables: Tables;
};

export const createEmptyTables = (): Tables => ({});

export const createEmptySnapshot = (exportedAt = new Date().toISOString()): DwfStoreSnapshot => ({
    app_id: DWF_APP_ID,
    schema_version: CURRENT_SCHEMA_VERSION,
    exported_at: exportedAt,
    tables: createEmptyTables(),
});

export const createDwfStore = (): Store => createStore();

export const snapshotStore = (store: Store, exportedAt = new Date().toISOString()): DwfStoreSnapshot => ({
    app_id: DWF_APP_ID,
    schema_version: CURRENT_SCHEMA_VERSION,
    exported_at: exportedAt,
    tables: store.getTables(),
});

export const applySnapshotToStore = (store: Store, snapshot: DwfStoreSnapshot): void => {
    store.setTables(snapshot.tables);
};
