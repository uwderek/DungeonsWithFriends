import { createStore } from 'tinybase';
import { TABLES } from '@/shared/store/local-store';
import { exportStoreToJson } from '@/shared/store/export-import';
import { FANTASY_D20_TEMPLATE, saveSystemTemplate } from '@/features/creator/model/system-template-store';
import {
    CharacterSheetStoreError,
    createCharacterSheet,
    deleteCharacterSheet,
    getCharacterSheet,
    getCharacterSheets,
    updateCharacterSheetField,
} from './character-sheet-store';

const now = '2026-07-08T00:00:00.000Z';
const sheetId = '44444444-4444-4444-8444-444444444444';

describe('character-sheet-store', () => {
    it('creates a character sheet from the selected system template with default field values', () => {
        const store = createStore();
        saveSystemTemplate(store, FANTASY_D20_TEMPLATE, { select: true });

        const sheet = createCharacterSheet(store, {
            character_sheet_id: sheetId,
            character_name: 'Ada',
            now,
        });

        expect(sheet).toMatchObject({
            character_sheet_id: sheetId,
            character_name: 'Ada',
            system_template_id: FANTASY_D20_TEMPLATE.system_template_id,
            template_version: FANTASY_D20_TEMPLATE.system_version,
            created_at: now,
            updated_at: now,
        });
        expect(sheet.field_values).toMatchObject({
            strength: 10,
            dexterity: 10,
            hit_points: 1,
        });
        expect(store.getCell(TABLES.characterSheets, sheetId, 'field_values')).toBe(JSON.stringify(sheet.field_values));
    });

    it('installs the built-in template when no selected template exists', () => {
        const store = createStore();

        const sheet = createCharacterSheet(store, {
            character_sheet_id: sheetId,
            character_name: 'Ada',
            now,
        });

        expect(sheet.system_template_id).toBe(FANTASY_D20_TEMPLATE.system_template_id);
        expect(store.getCell(TABLES.systemTemplates, FANTASY_D20_TEMPLATE.system_template_id, 'is_selected')).toBe(true);
    });

    it('parses valid rows and ignores malformed persisted rows', () => {
        const store = createStore();
        saveSystemTemplate(store, FANTASY_D20_TEMPLATE, { select: true });
        createCharacterSheet(store, {
            character_sheet_id: sheetId,
            character_name: 'Ada',
            now,
        });
        store.setRow(TABLES.characterSheets, 'bad-sheet', {
            character_name: '',
            system_template_id: FANTASY_D20_TEMPLATE.system_template_id,
            template_version: '1.0.0',
            field_values: '{bad',
            created_at: now,
            updated_at: now,
        });

        expect(getCharacterSheets(store)).toHaveLength(1);
        expect(getCharacterSheet(store, sheetId)?.character_name).toBe('Ada');
        expect(getCharacterSheet(store, 'missing')).toBeNull();
    });

    it('updates and deletes character sheets', () => {
        const store = createStore();
        saveSystemTemplate(store, FANTASY_D20_TEMPLATE, { select: true });
        createCharacterSheet(store, {
            character_sheet_id: sheetId,
            character_name: 'Ada',
            now,
        });

        const updated = updateCharacterSheetField(store, sheetId, 'strength', 12, '2026-07-08T01:00:00.000Z');

        expect(updated.field_values.strength).toBe(12);
        expect(updated.updated_at).toBe('2026-07-08T01:00:00.000Z');
        expect(JSON.parse(String(store.getCell(TABLES.characterSheets, sheetId, 'field_values'))).strength).toBe(12);

        deleteCharacterSheet(store, sheetId);
        expect(getCharacterSheet(store, sheetId)).toBeNull();
    });

    it('throws a typed error when updating a missing sheet', () => {
        const store = createStore();

        expect(() => updateCharacterSheetField(store, sheetId, 'strength', 12, now)).toThrow(CharacterSheetStoreError);
    });

    it('exports character sheets in the versioned local envelope', () => {
        const store = createStore();
        saveSystemTemplate(store, FANTASY_D20_TEMPLATE, { select: true });
        createCharacterSheet(store, {
            character_sheet_id: sheetId,
            character_name: 'Ada',
            now,
        });

        const exported = JSON.parse(exportStoreToJson(store));

        expect(exported.schema_version).toBe(1);
        expect(exported.tables[TABLES.characterSheets][sheetId].character_name).toBe('Ada');
        expect(exported.tables[TABLES.characterSheets][sheetId].field_values).toContain('strength');
    });
});
