import { createStore } from 'tinybase';
import { CURRENT_SCHEMA_VERSION, DWF_APP_ID, TABLES } from './local-store';
import { exportStoreToJson, importStoreFromJson } from './export-import';
import { LocalStoreError } from './migrations';

const exportedAt = '2026-07-08T00:00:00.000Z';
const componentId = '22222222-2222-4222-8222-222222222222';
const systemTemplateId = '11111111-1111-4111-8111-111111111111';
const bindingId = '33333333-3333-4333-8333-333333333333';

const createCreatorSnapshot = () => ({
    app_id: DWF_APP_ID,
    schema_version: CURRENT_SCHEMA_VERSION,
    exported_at: exportedAt,
    tables: {
        [TABLES.componentDefinitions]: {
            [componentId]: {
                component_id: componentId,
                component_name: 'strength_score',
                display_label: 'Strength Score',
                data_type: 'number',
                is_required: true,
                validation_rules: JSON.stringify({ min: 1, max: 30 }),
                sort_order: 1,
                created_at: exportedAt,
                updated_at: exportedAt,
            },
        },
        [TABLES.systemTemplates]: {
            [systemTemplateId]: {
                system_name: 'Fantasy d20',
                system_version: '1.0.0',
                field_definitions: JSON.stringify([
                    { field_id: 'strength', field_label: 'Strength', data_type: 'number' },
                ]),
                created_at: exportedAt,
                updated_at: exportedAt,
                is_selected: true,
            },
        },
        [TABLES.templateBindings]: {
            [bindingId]: {
                component_id: componentId,
                system_template_id: systemTemplateId,
                field_id: 'strength',
                transform: '',
                created_at: exportedAt,
                updated_at: exportedAt,
            },
        },
    },
});

const expectInvalidDomainData = (action: () => void): void => {
    let caught: unknown;

    try {
        action();
    } catch (error) {
        caught = error;
    }

    expect(caught).toBeInstanceOf(LocalStoreError);
    expect((caught as LocalStoreError).code).toBe('invalid_domain_data');
};

describe('export-import', () => {
    it('exports and imports a versioned local envelope', () => {
        const store = createStore();
        store.setRow(TABLES.systemTemplates, systemTemplateId, {
            system_name: 'Fantasy d20',
            system_version: '1.0.0',
            field_definitions: JSON.stringify([
                { field_id: 'strength', field_label: 'Strength', data_type: 'number' },
            ]),
            created_at: exportedAt,
            updated_at: exportedAt,
            is_selected: true,
        });
        store.setRow(TABLES.characterSheets, '44444444-4444-4444-8444-444444444444', {
            character_name: 'Ada',
            system_template_id: systemTemplateId,
            template_version: '1.0.0',
            field_values: JSON.stringify({ strength: 10 }),
            created_at: exportedAt,
            updated_at: exportedAt,
        });

        const exported = exportStoreToJson(store);
        const target = createStore();
        importStoreFromJson(target, exported);

        expect(JSON.parse(exported).schema_version).toBe(1);
        expect(target.getCell(TABLES.characterSheets, '44444444-4444-4444-8444-444444444444', 'character_name')).toBe('Ada');
    });

    it('does not mutate the target store on invalid import', () => {
        const target = createStore();
        target.setRow(TABLES.characterSheets, 'sheet-1', { character_name: 'Ada' });

        expect(() => importStoreFromJson(target, '{bad')).toThrow();
        expect(target.getCell(TABLES.characterSheets, 'sheet-1', 'character_name')).toBe('Ada');
    });

    it('imports valid creator domain rows after domain validation', () => {
        const target = createStore();
        importStoreFromJson(target, JSON.stringify(createCreatorSnapshot()));

        expect(target.getCell(TABLES.componentDefinitions, componentId, 'display_label')).toBe('Strength Score');
        expect(target.getCell(TABLES.systemTemplates, systemTemplateId, 'system_name')).toBe('Fantasy d20');
        expect(target.getCell(TABLES.templateBindings, bindingId, 'field_id')).toBe('strength');
    });

    it('rejects malformed serialized domain rows without mutating the target store', () => {
        const target = createStore();
        target.setRow(TABLES.characterSheets, 'sheet-1', { character_name: 'Ada' });
        const snapshot = createCreatorSnapshot() as any;
        snapshot.tables[TABLES.systemTemplates][systemTemplateId].field_definitions = '{bad';

        expectInvalidDomainData(() => importStoreFromJson(target, JSON.stringify(snapshot)));

        expect(target.getCell(TABLES.characterSheets, 'sheet-1', 'character_name')).toBe('Ada');
        expect(target.getRowIds(TABLES.systemTemplates)).toEqual([]);
    });

    it('rejects bindings that reference missing template fields before mutating the target store', () => {
        const target = createStore();
        target.setRow(TABLES.characterSheets, 'sheet-1', { character_name: 'Ada' });
        const snapshot = createCreatorSnapshot() as any;
        snapshot.tables[TABLES.templateBindings][bindingId].field_id = 'dexterity';

        expectInvalidDomainData(() => importStoreFromJson(target, JSON.stringify(snapshot)));

        expect(target.getCell(TABLES.characterSheets, 'sheet-1', 'character_name')).toBe('Ada');
        expect(target.getRowIds(TABLES.templateBindings)).toEqual([]);
    });

    it('rejects malformed character sheet rows before mutating the target store', () => {
        const target = createStore();
        target.setRow(TABLES.characterSheets, 'existing-sheet', { character_name: 'Ada' });
        const snapshot = {
            ...createCreatorSnapshot(),
            tables: {
                ...createCreatorSnapshot().tables,
                [TABLES.characterSheets]: {
                    '44444444-4444-4444-8444-444444444444': {
                        character_name: 'Ada',
                        system_template_id: systemTemplateId,
                        template_version: '1.0.0',
                        field_values: '{bad',
                        created_at: exportedAt,
                        updated_at: exportedAt,
                    },
                },
            },
        };

        expectInvalidDomainData(() => importStoreFromJson(target, JSON.stringify(snapshot)));

        expect(target.getCell(TABLES.characterSheets, 'existing-sheet', 'character_name')).toBe('Ada');
        expect(target.getRowIds(TABLES.systemTemplates)).toEqual([]);
    });

    it('rejects malformed dice roll rows before mutating the target store', () => {
        const target = createStore();
        target.setRow(TABLES.characterSheets, 'existing-sheet', { character_name: 'Ada' });
        const characterSheetId = '44444444-4444-4444-8444-444444444444';
        const rollId = '55555555-5555-4555-8555-555555555555';
        const snapshot = createCreatorSnapshot() as any;
        snapshot.tables[TABLES.characterSheets] = {
            [characterSheetId]: {
                character_name: 'Ada',
                system_template_id: systemTemplateId,
                template_version: '1.0.0',
                field_values: JSON.stringify({ strength: 10 }),
                created_at: exportedAt,
                updated_at: exportedAt,
            },
        };
        snapshot.tables[TABLES.diceRolls] = {
            [rollId]: {
                character_sheet_id: characterSheetId,
                notation: '1d20',
                total: 20,
                detail: '{bad',
                rolled_at: exportedAt,
            },
        };

        expectInvalidDomainData(() => importStoreFromJson(target, JSON.stringify(snapshot)));

        expect(target.getCell(TABLES.characterSheets, 'existing-sheet', 'character_name')).toBe('Ada');
        expect(target.getRowIds(TABLES.diceRolls)).toEqual([]);
    });

    it('rejects internally inconsistent dice roll rows before mutating the target store', () => {
        const target = createStore();
        target.setRow(TABLES.characterSheets, 'existing-sheet', { character_name: 'Ada' });
        const characterSheetId = '44444444-4444-4444-8444-444444444444';
        const rollId = '55555555-5555-4555-8555-555555555555';
        const snapshot = createCreatorSnapshot() as any;
        snapshot.tables[TABLES.characterSheets] = {
            [characterSheetId]: {
                character_name: 'Ada',
                system_template_id: systemTemplateId,
                template_version: '1.0.0',
                field_values: JSON.stringify({ strength: 10 }),
                created_at: exportedAt,
                updated_at: exportedAt,
            },
        };
        snapshot.tables[TABLES.diceRolls] = {
            [rollId]: {
                character_sheet_id: characterSheetId,
                notation: '2d6+3',
                total: 999,
                detail: JSON.stringify({ rolls: [1, 1], modifier: 3 }),
                rolled_at: exportedAt,
            },
        };

        expectInvalidDomainData(() => importStoreFromJson(target, JSON.stringify(snapshot)));

        expect(target.getCell(TABLES.characterSheets, 'existing-sheet', 'character_name')).toBe('Ada');
        expect(target.getRowIds(TABLES.diceRolls)).toEqual([]);
    });
});
