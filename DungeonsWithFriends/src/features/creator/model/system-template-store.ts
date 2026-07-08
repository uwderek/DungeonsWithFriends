import { Store } from 'tinybase';
import { TABLES } from '@/shared/store/local-store';
import { SystemTemplate, systemTemplateSchema, parseSystemTemplateJson } from './system-template-schema';

export type SystemTemplateImportErrorCode = 'invalid_json' | 'invalid_template' | 'missing_template';

export class SystemTemplateImportError extends Error {
    constructor(
        public readonly code: SystemTemplateImportErrorCode,
        message: string,
        public readonly cause?: unknown
    ) {
        super(message);
        this.name = 'SystemTemplateImportError';
    }
}

export const FANTASY_D20_TEMPLATE: SystemTemplate = {
    system_template_id: '11111111-1111-4111-8111-111111111111',
    system_name: 'Fantasy d20',
    system_version: '1.0.0',
    field_definitions: [
        { field_id: 'strength', field_label: 'Strength', data_type: 'number', default_value: '10' },
        { field_id: 'dexterity', field_label: 'Dexterity', data_type: 'number', default_value: '10' },
        { field_id: 'constitution', field_label: 'Constitution', data_type: 'number', default_value: '10' },
        { field_id: 'intelligence', field_label: 'Intelligence', data_type: 'number', default_value: '10' },
        { field_id: 'wisdom', field_label: 'Wisdom', data_type: 'number', default_value: '10' },
        { field_id: 'charisma', field_label: 'Charisma', data_type: 'number', default_value: '10' },
        { field_id: 'armor_class', field_label: 'Armor Class', data_type: 'number', default_value: '10' },
        { field_id: 'hit_points', field_label: 'Hit Points', data_type: 'number', default_value: '1' },
    ],
    created_at: '2026-07-08T00:00:00.000Z',
    updated_at: '2026-07-08T00:00:00.000Z',
};

type SystemTemplateRow = {
    system_name?: string;
    system_version?: string;
    field_definitions?: string;
    created_at?: string;
    updated_at?: string;
    is_selected?: boolean;
};

const serializeSystemTemplate = (template: SystemTemplate, selected: boolean) => ({
    system_name: template.system_name,
    system_version: template.system_version,
    field_definitions: JSON.stringify(template.field_definitions),
    created_at: template.created_at,
    updated_at: template.updated_at,
    is_selected: selected,
});

export const parseSystemTemplateRow = (
    systemTemplateId: string,
    row: SystemTemplateRow
): SystemTemplate => {
    const fieldDefinitions = typeof row.field_definitions === 'string'
        ? JSON.parse(row.field_definitions)
        : [];

    return systemTemplateSchema.parse({
        system_template_id: systemTemplateId,
        system_name: row.system_name,
        system_version: row.system_version,
        field_definitions: fieldDefinitions,
        created_at: row.created_at,
        updated_at: row.updated_at,
    });
};

export const tryParseSystemTemplateRow = (
    systemTemplateId: string,
    row: SystemTemplateRow
): SystemTemplate | null => {
    try {
        return parseSystemTemplateRow(systemTemplateId, row);
    } catch {
        return null;
    }
};

export const getSystemTemplates = (store: Store): SystemTemplate[] => (
    store.getRowIds(TABLES.systemTemplates)
        .map((id) => tryParseSystemTemplateRow(id, store.getRow(TABLES.systemTemplates, id) as SystemTemplateRow))
        .filter((template): template is SystemTemplate => template !== null)
);

export const getSelectedSystemTemplate = (store: Store): SystemTemplate | null => {
    const selectedId = store.getRowIds(TABLES.systemTemplates)
        .find((id) => store.getCell(TABLES.systemTemplates, id, 'is_selected') === true);

    if (!selectedId) {
        return null;
    }

    return tryParseSystemTemplateRow(selectedId, store.getRow(TABLES.systemTemplates, selectedId) as SystemTemplateRow);
};

export const saveSystemTemplate = (
    store: Store,
    template: SystemTemplate,
    options: { select?: boolean } = {}
): SystemTemplate => {
    const parsed = systemTemplateSchema.parse(template);
    const shouldSelect = options.select ?? false;

    if (shouldSelect) {
        store.getRowIds(TABLES.systemTemplates).forEach((id) => {
            store.setCell(TABLES.systemTemplates, id, 'is_selected', false);
        });
    }

    store.setRow(
        TABLES.systemTemplates,
        parsed.system_template_id,
        serializeSystemTemplate(parsed, shouldSelect)
    );

    return parsed;
};

export const selectSystemTemplate = (store: Store, systemTemplateId: string): SystemTemplate => {
    const row = store.getRow(TABLES.systemTemplates, systemTemplateId);
    if (!row || Object.keys(row).length === 0) {
        throw new SystemTemplateImportError('missing_template', `System template ${systemTemplateId} was not found.`);
    }

    store.getRowIds(TABLES.systemTemplates).forEach((id) => {
        store.setCell(TABLES.systemTemplates, id, 'is_selected', id === systemTemplateId);
    });

    const parsed = tryParseSystemTemplateRow(systemTemplateId, row as SystemTemplateRow);
    if (!parsed) {
        throw new SystemTemplateImportError('invalid_template', `System template ${systemTemplateId} is invalid.`);
    }

    return parsed;
};

export const installBuiltInSystemTemplate = (
    store: Store,
    template: SystemTemplate = FANTASY_D20_TEMPLATE
): SystemTemplate => saveSystemTemplate(store, template, { select: true });

export const importSystemTemplateJson = (store: Store, raw: string): SystemTemplate => {
    let parsed: SystemTemplate;

    try {
        parsed = parseSystemTemplateJson(raw);
    } catch (error) {
        const code = error instanceof SyntaxError ? 'invalid_json' : 'invalid_template';
        const message = code === 'invalid_json'
            ? 'Custom system JSON is not valid JSON.'
            : 'Custom system JSON does not match the system template schema.';
        throw new SystemTemplateImportError(code, message, error);
    }

    return saveSystemTemplate(store, parsed, { select: true });
};
