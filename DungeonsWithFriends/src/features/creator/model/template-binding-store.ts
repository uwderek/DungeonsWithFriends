import { Store } from 'tinybase';
import { TABLES } from '@/shared/store/local-store';
import { ComponentDefinition, componentDefinitionSchema } from './component-schemas';
import { SystemTemplate } from './system-template-schema';
import { TemplateBinding, findStaleBindingIds, templateBindingSchema } from './template-binding-schema';
import { tryParseSystemTemplateRow } from './system-template-store';

export type TemplateBindingErrorCode = 'missing_component' | 'missing_template' | 'invalid_template' | 'missing_field' | 'invalid_binding';

export class TemplateBindingError extends Error {
    constructor(
        public readonly code: TemplateBindingErrorCode,
        message: string,
        public readonly cause?: unknown
    ) {
        super(message);
        this.name = 'TemplateBindingError';
    }
}

type TemplateBindingRow = {
    component_id?: string;
    system_template_id?: string;
    field_id?: string;
    transform?: string;
    created_at?: string;
    updated_at?: string;
};

type ComponentDefinitionRow = Partial<ComponentDefinition> & {
    validation_rules?: unknown;
};

const tryParseComponentDefinitionRow = (
    componentId: string,
    row: ComponentDefinitionRow
): ComponentDefinition | null => {
    try {
        const validationRules = typeof row.validation_rules === 'string'
            ? JSON.parse(row.validation_rules)
            : row.validation_rules;

        return componentDefinitionSchema.parse({
            ...row,
            component_id: componentId,
            validation_rules: validationRules,
        });
    } catch {
        return null;
    }
};

const tryParseBindingRow = (bindingId: string, row: TemplateBindingRow): TemplateBinding | null => {
    try {
        const transform = typeof row.transform === 'string' && row.transform.length > 0
            ? JSON.parse(row.transform)
            : undefined;

        return templateBindingSchema.parse({
            binding_id: bindingId,
            component_id: row.component_id,
            system_template_id: row.system_template_id,
            field_id: row.field_id,
            transform,
            created_at: row.created_at,
            updated_at: row.updated_at,
        });
    } catch {
        return null;
    }
};

const serializeBinding = (binding: TemplateBinding) => ({
    component_id: binding.component_id,
    system_template_id: binding.system_template_id,
    field_id: binding.field_id,
    transform: binding.transform ? JSON.stringify(binding.transform) : '',
    created_at: binding.created_at,
    updated_at: binding.updated_at,
});

export const getTemplateBindings = (store: Store): TemplateBinding[] => (
    store.getRowIds(TABLES.templateBindings)
        .map((id) => tryParseBindingRow(id, store.getRow(TABLES.templateBindings, id) as TemplateBindingRow))
        .filter((binding): binding is TemplateBinding => binding !== null)
);

export const getBindingsForTemplate = (
    store: Store,
    systemTemplateId: string
): TemplateBinding[] => (
    getTemplateBindings(store).filter((binding) => binding.system_template_id === systemTemplateId)
);

export const createTemplateBinding = (
    store: Store,
    input: {
        component_id: string;
        system_template_id: string;
        field_id: string;
        transform?: TemplateBinding['transform'];
    }
): TemplateBinding => {
    const componentRow = store.getRow(TABLES.componentDefinitions, input.component_id) as ComponentDefinitionRow;
    if (!componentRow || Object.keys(componentRow).length === 0) {
        throw new TemplateBindingError('missing_component', `Component ${input.component_id} was not found.`);
    }

    const component = tryParseComponentDefinitionRow(input.component_id, componentRow);
    if (!component) {
        throw new TemplateBindingError('missing_component', `Component ${input.component_id} is invalid.`);
    }

    const templateRow = store.getRow(TABLES.systemTemplates, input.system_template_id);
    if (!templateRow || Object.keys(templateRow).length === 0) {
        throw new TemplateBindingError('missing_template', `System template ${input.system_template_id} was not found.`);
    }

    const systemTemplate = tryParseSystemTemplateRow(input.system_template_id, templateRow);
    if (!systemTemplate) {
        throw new TemplateBindingError('invalid_template', `System template ${input.system_template_id} is invalid.`);
    }

    if (!systemTemplate.field_definitions.some((field) => field.field_id === input.field_id)) {
        throw new TemplateBindingError('missing_field', `Field ${input.field_id} was not found on the selected system template.`);
    }

    const now = new Date().toISOString();
    const existingBindingId = store.getRowIds(TABLES.templateBindings).find((id) => {
        const row = store.getRow(TABLES.templateBindings, id);
        return row.system_template_id === input.system_template_id && row.field_id === input.field_id;
    });
    const bindingId = existingBindingId ?? crypto.randomUUID();
    const createdAt = existingBindingId
        ? String(store.getCell(TABLES.templateBindings, existingBindingId, 'created_at') ?? now)
        : now;
    const candidate = {
        binding_id: bindingId,
        component_id: input.component_id,
        system_template_id: input.system_template_id,
        field_id: input.field_id,
        transform: input.transform,
        created_at: createdAt,
        updated_at: now,
    };

    const parsed = templateBindingSchema.safeParse(candidate);
    if (!parsed.success) {
        throw new TemplateBindingError('invalid_binding', 'Template binding is invalid.', parsed.error);
    }

    store.setRow(TABLES.templateBindings, parsed.data.binding_id, serializeBinding(parsed.data));

    return parsed.data;
};

export const findStaleTemplateBindingIds = (
    bindings: TemplateBinding[],
    systemTemplate: SystemTemplate
): string[] => (
    findStaleBindingIds(
        bindings,
        new Set(systemTemplate.field_definitions.map((field) => field.field_id))
    )
);
