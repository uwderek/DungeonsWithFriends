import { createStore } from 'tinybase';
import { TABLES } from './local-store';
import { exportStoreToJson, importStoreFromJson } from './export-import';

describe('export-import', () => {
    it('exports and imports a versioned local envelope', () => {
        const store = createStore();
        store.setRow(TABLES.characterSheets, 'sheet-1', { character_name: 'Ada' });

        const exported = exportStoreToJson(store);
        const target = createStore();
        importStoreFromJson(target, exported);

        expect(JSON.parse(exported).schema_version).toBe(1);
        expect(target.getCell(TABLES.characterSheets, 'sheet-1', 'character_name')).toBe('Ada');
    });

    it('does not mutate the target store on invalid import', () => {
        const target = createStore();
        target.setRow(TABLES.characterSheets, 'sheet-1', { character_name: 'Ada' });

        expect(() => importStoreFromJson(target, '{bad')).toThrow();
        expect(target.getCell(TABLES.characterSheets, 'sheet-1', 'character_name')).toBe('Ada');
    });
});
