import { Store } from 'tinybase';
import { TABLES } from '@/shared/store/local-store';
import { componentDefinitionSchema } from '@/features/creator/model/component-schemas';
import { SystemFieldDefinition, SystemTemplate } from '@/features/creator/model/system-template-schema';
import { getBindingsForTemplate } from '@/features/creator/model/template-binding-store';
import { TemplateBinding } from '@/features/creator/model/template-binding-schema';
import { tryParseSystemTemplateRow } from '@/features/creator/model/system-template-store';
import { CharacterSheet } from './character-sheet-schema';
import { getCharacterSheet, updateCharacterSheetField } from './character-sheet-store';

export type PlayableSheetRuntimeErrorCode = 'missing_sheet' | 'missing_template' | 'missing_field' | 'invalid_value';

export class PlayableSheetRuntimeError extends Error {
    constructor(
        public readonly code: PlayableSheetRuntimeErrorCode,
        message: string,
        public readonly cause?: unknown
    ) {
        super(message);
        this.name = 'PlayableSheetRuntimeError';
    }
}

export type PlayableSheetField = {
    field_id: string;
    label: string;
    data_type: SystemFieldDefinition['data_type'];
    value: CharacterSheet['field_values'][string] | undefined;
    default_value: CharacterSheet['field_values'][string] | undefined;
    binding_id?: string;
    component_id?: string;
    sort_order: number;
};

export type PlayableSheetRuntime = {
    sheet: CharacterSheet;
    systemTemplate: SystemTemplate;
    fields: PlayableSheetField[];
    staleBindingIds: string[];
};

type ComponentDefinitionRow = {
    component_name?: string;
    display_label?: string;
    description?: string;
    data_type?: string;
    default_value?: string;
    is_required?: boolean;
    validation_rules?: unknown;
    sort_order?: number;
    created_at?: string;
    updated_at?: string;
};

const defaultValueForField = (field: SystemFieldDefinition): CharacterSheet['field_values'][string] | undefined => {
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

const parseComponentRow = (componentId: string, row: ComponentDefinitionRow) => {
    const validationRules = typeof row.validation_rules === 'string'
        ? JSON.parse(row.validation_rules)
        : row.validation_rules;

    return componentDefinitionSchema.parse({
        ...row,
        component_id: componentId,
        validation_rules: validationRules,
    });
};

const getSystemTemplateForSheet = (store: Store, sheet: CharacterSheet): SystemTemplate => {
    const row = store.getRow(TABLES.systemTemplates, sheet.system_template_id);
    if (!row || Object.keys(row).length === 0) {
        throw new PlayableSheetRuntimeError('missing_template', `System template ${sheet.system_template_id} was not found.`);
    }

    const template = tryParseSystemTemplateRow(sheet.system_template_id, row);
    if (!template) {
        throw new PlayableSheetRuntimeError('missing_template', `System template ${sheet.system_template_id} is invalid.`);
    }

    return template;
};

const getBindingMetadataByFieldId = (
    store: Store,
    bindings: TemplateBinding[],
    validFieldIds: Set<string>
): Map<string, { binding: TemplateBinding; label: string; sortOrder: number }> => {
    const metadata = new Map<string, { binding: TemplateBinding; label: string; sortOrder: number }>();

    bindings.forEach((binding) => {
        if (!validFieldIds.has(binding.field_id)) {
            return;
        }

        const componentRow = store.getRow(TABLES.componentDefinitions, binding.component_id) as ComponentDefinitionRow;
        if (!componentRow || Object.keys(componentRow).length === 0) {
            return;
        }

        try {
            const component = parseComponentRow(binding.component_id, componentRow);
            metadata.set(binding.field_id, {
                binding,
                label: component.display_label,
                sortOrder: component.sort_order,
            });
        } catch {
            // Invalid component rows should not prevent unbound runtime rendering.
        }
    });

    return metadata;
};

export const resolvePlayableSheet = (store: Store, characterSheetId: string): PlayableSheetRuntime => {
    const sheet = getCharacterSheet(store, characterSheetId);
    if (!sheet) {
        throw new PlayableSheetRuntimeError('missing_sheet', `Character sheet ${characterSheetId} was not found.`);
    }

    const systemTemplate = getSystemTemplateForSheet(store, sheet);
    const validFieldIds = new Set(systemTemplate.field_definitions.map((field) => field.field_id));
    const bindings = getBindingsForTemplate(store, systemTemplate.system_template_id);
    const staleBindingIds = bindings
        .filter((binding) => !validFieldIds.has(binding.field_id))
        .map((binding) => binding.binding_id);
    const bindingMetadata = getBindingMetadataByFieldId(store, bindings, validFieldIds);

    const fields = systemTemplate.field_definitions.map((field, index) => {
        const metadata = bindingMetadata.get(field.field_id);
        const defaultValue = defaultValueForField(field);

        return {
            field_id: field.field_id,
            label: metadata?.label ?? field.field_label,
            data_type: field.data_type,
            value: sheet.field_values[field.field_id] ?? defaultValue,
            default_value: defaultValue,
            binding_id: metadata?.binding.binding_id,
            component_id: metadata?.binding.component_id,
            sort_order: metadata ? metadata.sortOrder : 10000 + index,
        };
    }).sort((first, second) => first.sort_order - second.sort_order);

    return {
        sheet,
        systemTemplate,
        fields,
        staleBindingIds,
    };
};

const coerceValueForField = (
    field: SystemFieldDefinition,
    value: unknown
): CharacterSheet['field_values'][string] => {
    if (field.data_type === 'number') {
        if (typeof value === 'string' && value.trim() === '') {
            throw new PlayableSheetRuntimeError('invalid_value', `Value for ${field.field_id} does not match ${field.data_type}.`);
        }

        const numeric = typeof value === 'number' ? value : Number(value);
        if (Number.isFinite(numeric)) {
            return numeric;
        }
    }

    if (field.data_type === 'boolean') {
        if (typeof value === 'boolean') {
            return value;
        }
        if (typeof value === 'string' && value.toLowerCase() === 'true') {
            return true;
        }
        if (typeof value === 'string' && value.toLowerCase() === 'false') {
            return false;
        }
    }

    if ((field.data_type === 'text' || field.data_type === 'select' || field.data_type === 'calculated') && typeof value === 'string') {
        return value;
    }

    throw new PlayableSheetRuntimeError('invalid_value', `Value for ${field.field_id} does not match ${field.data_type}.`);
};

export const updatePlayableFieldValue = (
    store: Store,
    characterSheetId: string,
    fieldId: string,
    value: unknown,
    now = new Date().toISOString()
): CharacterSheet => {
    const sheet = getCharacterSheet(store, characterSheetId);
    if (!sheet) {
        throw new PlayableSheetRuntimeError('missing_sheet', `Character sheet ${characterSheetId} was not found.`);
    }

    const systemTemplate = getSystemTemplateForSheet(store, sheet);
    const field = systemTemplate.field_definitions.find((item) => item.field_id === fieldId);
    if (!field) {
        throw new PlayableSheetRuntimeError('missing_field', `Field ${fieldId} was not found on the character sheet template.`);
    }

    const coercedValue = coerceValueForField(field, value);

    return updateCharacterSheetField(store, characterSheetId, fieldId, coercedValue, now);
};
