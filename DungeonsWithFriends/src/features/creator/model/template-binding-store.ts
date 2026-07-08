import { Store } from 'tinybase';
import { TABLES } from '@/shared/store/local-store';
import { ComponentDefinition } from './component-schemas';
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

const parseBindingRow = (bindingId: string, row: TemplateBindingRow): TemplateBinding => {
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
};

export const getTemplateBindings = (store: Store): TemplateBinding[] => (
    store.getRowIds(TABLES.templateBindings)
        .map((id) => parseBindingRow(id, store.getRow(TABLES.templateBindings, id) as TemplateBindingRow))
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
    const componentRow = store.getRow(TABLES.componentDefinitions, input.component_id) as Partial<ComponentDefinition>;
    if (!componentRow || Object.keys(componentRow).length === 0) {
        throw new TemplateBindingError('missing_component', `Component ${input.component_id} was not found.`);
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

    store.setRow(TABLES.templateBindings, parsed.data.binding_id, {
        component_id: parsed.data.component_id,
        system_template_id: parsed.data.system_template_id,
        field_id: parsed.data.field_id,
        transform: parsed.data.transform ? JSON.stringify(parsed.data.transform) : '',
        created_at: parsed.data.created_at,
        updated_at: parsed.data.updated_at,
    });

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
