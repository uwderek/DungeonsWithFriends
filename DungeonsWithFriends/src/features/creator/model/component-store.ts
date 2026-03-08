import { useStore, useRow, useRowIds } from 'tinybase/ui-react';
import { Store } from 'tinybase';
import { ComponentDefinition, componentDefinitionSchema, DataType } from './component-schemas';

const TABLE_NAME = 'component_definitions';

/**
 * Hook to get all component definitions from the store
 */
export const useComponentDefinitions = (): ComponentDefinition[] => {
    const store = useStore();
    const rowIds = useRowIds(TABLE_NAME, store);

    return rowIds.map(id => {
        const row = store?.getRow(TABLE_NAME, id);
        if (!row) return null;

        // Parse validation_rules if it's a string
        let validation_rules;
        if (typeof row.validation_rules === 'string') {
            try {
                validation_rules = JSON.parse(row.validation_rules);
            } catch (e) {
                console.warn('Failed to parse validation_rules for component:', id, e);
                validation_rules = {};
            }
        } else {
            validation_rules = row.validation_rules;
        }

        return {
            ...row,
            validation_rules,
            component_id: id,
        } as ComponentDefinition;
    }).filter((c): c is ComponentDefinition => c !== null);
};

/**
 * Hook to get a single component definition by ID
 */
export const useComponentDefinition = (id: string): ComponentDefinition | undefined => {
    const store = useStore();
    const row = useRow(TABLE_NAME, id, store);

    if (!row || Object.keys(row).length === 0) return undefined;

    let validation_rules;
    if (typeof row.validation_rules === 'string') {
        try {
            validation_rules = JSON.parse(row.validation_rules);
        } catch (e) {
            console.warn('Failed to parse validation_rules for component:', id, e);
            validation_rules = {};
        }
    } else {
        validation_rules = row.validation_rules;
    }

    return {
        ...row,
        validation_rules,
        component_id: id,
    } as ComponentDefinition;
};

/**
 * Create a new component definition
 */
export const createComponentDefinition = (
    store: Store,
    data: Partial<Omit<ComponentDefinition, 'component_id'>>
): string => {
    const component_id = crypto.randomUUID();
    const now = new Date().toISOString();

    const newComponent: ComponentDefinition = {
        component_id,
        component_name: data.component_name || `component_${Date.now()}`,
        display_label: data.display_label || 'New Component',
        data_type: data.data_type || 'text',
        is_required: data.is_required ?? false,
        sort_order: data.sort_order || 0,
        created_at: now,
        updated_at: now,
        ...data,
    };

    // Validate before saving
    componentDefinitionSchema.parse(newComponent);

    // TinyBase rows must be flat (serialize JSON fields)
    const row = {
        ...newComponent,
        validation_rules: JSON.stringify(newComponent.validation_rules || {}),
    };

    store.setRow(TABLE_NAME, component_id, row);
    return component_id;
};

/**
 * Update an existing component definition
 */
export const updateComponentDefinition = (
    store: Store,
    id: string,
    data: Partial<ComponentDefinition>
): void => {
    const currentRow = store.getRow(TABLE_NAME, id);
    if (!currentRow) throw new Error(`Component ${id} not found`);

    const now = new Date().toISOString();

    // Parse current validation rules for deep merge if needed, or just let data override
    const currentValidationRules = typeof currentRow.validation_rules === 'string'
        ? JSON.parse(currentRow.validation_rules)
        : currentRow.validation_rules;

    const updatedComponent = {
        ...currentRow,
        ...data,
        validation_rules: data.validation_rules !== undefined
            ? data.validation_rules
            : currentValidationRules,
        updated_at: now,
        component_id: id,
    };

    // Validate
    componentDefinitionSchema.parse(updatedComponent);

    const row = {
        ...updatedComponent,
        validation_rules: JSON.stringify(updatedComponent.validation_rules || {}),
    };

    store.setRow(TABLE_NAME, id, row);
};

/**
 * Delete a component definition
 */
export const deleteComponentDefinition = (
    store: Store,
    id: string
): void => {
    store.delRow(TABLE_NAME, id);
};
