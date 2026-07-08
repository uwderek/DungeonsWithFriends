import { Store } from 'tinybase';
import { TABLES } from '@/shared/store/local-store';
import { getSelectedSystemTemplate, installBuiltInSystemTemplate } from '@/features/creator/model/system-template-store';
import { SystemTemplate } from '@/features/creator/model/system-template-schema';
import { CharacterSheet, characterSheetSchema, createEmptyCharacterSheet } from './character-sheet-schema';

export type CharacterSheetStoreErrorCode = 'missing_sheet' | 'invalid_sheet' | 'invalid_field_values';

export class CharacterSheetStoreError extends Error {
    constructor(
        public readonly code: CharacterSheetStoreErrorCode,
        message: string,
        public readonly cause?: unknown
    ) {
        super(message);
        this.name = 'CharacterSheetStoreError';
    }
}

type CharacterSheetRow = {
    character_name?: string;
    system_template_id?: string;
    template_version?: string;
    field_values?: string;
    created_at?: string;
    updated_at?: string;
};

const parseFieldValues = (value: unknown): CharacterSheet['field_values'] => {
    try {
        const parsed = typeof value === 'string' ? JSON.parse(value) : value ?? {};
        return characterSheetSchema.shape.field_values.parse(parsed);
    } catch (error) {
        throw new CharacterSheetStoreError('invalid_field_values', 'Character sheet field values are invalid.', error);
    }
};

export const parseCharacterSheetRow = (
    characterSheetId: string,
    row: CharacterSheetRow
): CharacterSheet => {
    try {
        return characterSheetSchema.parse({
            character_sheet_id: characterSheetId,
            character_name: row.character_name,
            system_template_id: row.system_template_id,
            template_version: row.template_version,
            field_values: parseFieldValues(row.field_values),
            created_at: row.created_at,
            updated_at: row.updated_at,
        });
    } catch (error) {
        if (error instanceof CharacterSheetStoreError) {
            throw error;
        }

        throw new CharacterSheetStoreError('invalid_sheet', `Character sheet ${characterSheetId} is invalid.`, error);
    }
};

const tryParseCharacterSheetRow = (
    characterSheetId: string,
    row: CharacterSheetRow
): CharacterSheet | null => {
    try {
        return parseCharacterSheetRow(characterSheetId, row);
    } catch {
        return null;
    }
};

const serializeCharacterSheet = (sheet: CharacterSheet) => ({
    character_name: sheet.character_name,
    system_template_id: sheet.system_template_id,
    template_version: sheet.template_version,
    field_values: JSON.stringify(sheet.field_values),
    created_at: sheet.created_at,
    updated_at: sheet.updated_at,
});

const defaultValueForField = (field: SystemTemplate['field_definitions'][number]): CharacterSheet['field_values'][string] | undefined => {
    if (field.default_value === undefined) {
        return undefined;
    }

    if (field.data_type === 'number') {
        const numeric = Number(field.default_value);
        return Number.isFinite(numeric) ? numeric : undefined;
    }

    if (field.data_type === 'boolean') {
        if (field.default_value.toLowerCase() === 'true') {
            return true;
        }
        if (field.default_value.toLowerCase() === 'false') {
            return false;
        }
        return undefined;
    }

    return field.default_value;
};

const createDefaultFieldValues = (template: SystemTemplate): CharacterSheet['field_values'] => (
    template.field_definitions.reduce<CharacterSheet['field_values']>((values, field) => {
        const defaultValue = defaultValueForField(field);
        if (defaultValue !== undefined) {
            values[field.field_id] = defaultValue;
        }
        return values;
    }, {})
);

export const getCharacterSheets = (store: Store): CharacterSheet[] => (
    store.getRowIds(TABLES.characterSheets)
        .map((id) => tryParseCharacterSheetRow(id, store.getRow(TABLES.characterSheets, id) as CharacterSheetRow))
        .filter((sheet): sheet is CharacterSheet => sheet !== null)
);

export const getCharacterSheet = (store: Store, characterSheetId: string): CharacterSheet | null => {
    const row = store.getRow(TABLES.characterSheets, characterSheetId) as CharacterSheetRow;
    if (!row || Object.keys(row).length === 0) {
        return null;
    }

    return tryParseCharacterSheetRow(characterSheetId, row);
};

export const createCharacterSheet = (
    store: Store,
    input: {
        character_name: string;
        character_sheet_id?: string;
        systemTemplate?: SystemTemplate;
        now?: string;
    }
): CharacterSheet => {
    const now = input.now ?? new Date().toISOString();
    const template = input.systemTemplate ?? getSelectedSystemTemplate(store) ?? installBuiltInSystemTemplate(store);
    const sheet = {
        ...createEmptyCharacterSheet({
            character_sheet_id: input.character_sheet_id ?? crypto.randomUUID(),
            character_name: input.character_name,
            system_template_id: template.system_template_id,
            template_version: template.system_version,
        }, now),
        field_values: createDefaultFieldValues(template),
    };
    const parsed = characterSheetSchema.parse(sheet);

    store.setRow(TABLES.characterSheets, parsed.character_sheet_id, serializeCharacterSheet(parsed));

    return parsed;
};

export const updateCharacterSheetField = (
    store: Store,
    characterSheetId: string,
    fieldId: string,
    value: CharacterSheet['field_values'][string],
    now = new Date().toISOString()
): CharacterSheet => {
    const current = getCharacterSheet(store, characterSheetId);
    if (!current) {
        throw new CharacterSheetStoreError('missing_sheet', `Character sheet ${characterSheetId} was not found.`);
    }

    const updated = characterSheetSchema.parse({
        ...current,
        field_values: {
            ...current.field_values,
            [fieldId]: value,
        },
        updated_at: now,
    });

    store.setRow(TABLES.characterSheets, updated.character_sheet_id, serializeCharacterSheet(updated));

    return updated;
};

export const deleteCharacterSheet = (store: Store, characterSheetId: string): void => {
    store.delRow(TABLES.characterSheets, characterSheetId);
};
