import { Tables } from 'tinybase';
import { componentDefinitionSchema } from '../../features/creator/model/component-schemas';
import { characterSheetSchema } from '../../features/character/model/character-sheet-schema';
import { diceRollSchema } from '../../features/character/model/dice-roll-store';
import { systemTemplateSchema, SystemTemplate } from '../../features/creator/model/system-template-schema';
import { templateBindingSchema } from '../../features/creator/model/template-binding-schema';
import { DwfStoreSnapshot, TABLES } from './local-store';
import { LocalStoreError } from './migrations';

type DomainRow = Record<string, unknown>;
type DomainTable = Record<string, DomainRow>;

const allowedTableNames = new Set<string>(Object.values(TABLES));

const getTable = (tables: Tables, tableName: string): DomainTable => (
    (tables[tableName] ?? {}) as DomainTable
);

const parseJsonCell = (
    value: unknown,
    options: { allowEmpty?: boolean } = {}
): unknown => {
    if (value === undefined || (options.allowEmpty && value === '')) {
        return undefined;
    }

    return typeof value === 'string' ? JSON.parse(value) : value;
};

const assertMatchingRowId = (
    row: DomainRow,
    rowId: string,
    idCell: string,
    tableName: string
): void => {
    const cellValue = row[idCell];
    if (typeof cellValue === 'string' && cellValue !== rowId) {
        throw new Error(`${tableName}.${rowId} has mismatched ${idCell}.`);
    }
};

const validateKnownTableNames = (tables: Tables): void => {
    Object.keys(tables).forEach((tableName) => {
        if (!allowedTableNames.has(tableName)) {
            throw new Error(`Unknown local store table: ${tableName}.`);
        }
    });
};

export const validateSnapshotDomainData = (snapshot: DwfStoreSnapshot): void => {
    try {
        validateKnownTableNames(snapshot.tables);

        const components = new Set<string>();
        Object.entries(getTable(snapshot.tables, TABLES.componentDefinitions)).forEach(([componentId, row]) => {
            assertMatchingRowId(row, componentId, 'component_id', TABLES.componentDefinitions);
            componentDefinitionSchema.parse({
                ...row,
                component_id: componentId,
                validation_rules: parseJsonCell(row.validation_rules, { allowEmpty: true }),
            });
            components.add(componentId);
        });

        const templates = new Map<string, SystemTemplate>();
        Object.entries(getTable(snapshot.tables, TABLES.systemTemplates)).forEach(([systemTemplateId, row]) => {
            assertMatchingRowId(row, systemTemplateId, 'system_template_id', TABLES.systemTemplates);
            const template = systemTemplateSchema.parse({
                ...row,
                system_template_id: systemTemplateId,
                field_definitions: parseJsonCell(row.field_definitions),
            });
            templates.set(systemTemplateId, template);
        });

        Object.entries(getTable(snapshot.tables, TABLES.templateBindings)).forEach(([bindingId, row]) => {
            assertMatchingRowId(row, bindingId, 'binding_id', TABLES.templateBindings);
            const binding = templateBindingSchema.parse({
                ...row,
                binding_id: bindingId,
                transform: parseJsonCell(row.transform, { allowEmpty: true }),
            });

            if (!components.has(binding.component_id)) {
                throw new Error(`Binding ${bindingId} references missing component ${binding.component_id}.`);
            }

            const template = templates.get(binding.system_template_id);
            if (!template) {
                throw new Error(`Binding ${bindingId} references missing system template ${binding.system_template_id}.`);
            }

            if (!template.field_definitions.some((field) => field.field_id === binding.field_id)) {
                throw new Error(`Binding ${bindingId} references missing field ${binding.field_id}.`);
            }
        });

        const characterSheets = new Set<string>();
        Object.entries(getTable(snapshot.tables, TABLES.characterSheets)).forEach(([characterSheetId, row]) => {
            assertMatchingRowId(row, characterSheetId, 'character_sheet_id', TABLES.characterSheets);
            const sheet = characterSheetSchema.parse({
                ...row,
                character_sheet_id: characterSheetId,
                field_values: parseJsonCell(row.field_values),
            });

            if (!templates.has(sheet.system_template_id)) {
                throw new Error(`Character sheet ${characterSheetId} references missing system template ${sheet.system_template_id}.`);
            }

            characterSheets.add(characterSheetId);
        });

        Object.entries(getTable(snapshot.tables, TABLES.diceRolls)).forEach(([rollId, row]) => {
            assertMatchingRowId(row, rollId, 'roll_id', TABLES.diceRolls);
            const roll = diceRollSchema.parse({
                ...row,
                roll_id: rollId,
                detail: parseJsonCell(row.detail),
            });

            if (!characterSheets.has(roll.character_sheet_id)) {
                throw new Error(`Dice roll ${rollId} references missing character sheet ${roll.character_sheet_id}.`);
            }
        });
    } catch (error) {
        throw new LocalStoreError(
            'invalid_domain_data',
            'Local store snapshot contains invalid domain data.',
            error
        );
    }
};
