import { createStore } from 'tinybase';
import { TABLES } from '@/shared/store/local-store';
import { exportStoreToJson } from '@/shared/store/export-import';
import { createComponentDefinition } from './component-store';
import { FANTASY_D20_TEMPLATE, saveSystemTemplate } from './system-template-store';
import {
    TemplateBindingError,
    createTemplateBinding,
    findStaleTemplateBindingIds,
    getBindingsForTemplate,
} from './template-binding-store';

describe('template-binding-store', () => {
    it('creates a binding only when component, template, and field exist', () => {
        const store = createStore();
        saveSystemTemplate(store, FANTASY_D20_TEMPLATE, { select: true });
        const componentId = createComponentDefinition(store, { display_label: 'Strength Score' });

        const binding = createTemplateBinding(store, {
            component_id: componentId,
            system_template_id: FANTASY_D20_TEMPLATE.system_template_id,
            field_id: 'strength',
        });

        expect(binding.field_id).toBe('strength');
        expect(getBindingsForTemplate(store, FANTASY_D20_TEMPLATE.system_template_id)).toHaveLength(1);
    });

    it('rejects missing template fields without writing a binding', () => {
        const store = createStore();
        saveSystemTemplate(store, FANTASY_D20_TEMPLATE, { select: true });
        const componentId = createComponentDefinition(store, { display_label: 'Luck' });

        expect(() => createTemplateBinding(store, {
            component_id: componentId,
            system_template_id: FANTASY_D20_TEMPLATE.system_template_id,
            field_id: 'luck',
        })).toThrow(TemplateBindingError);

        expect(store.getRowIds(TABLES.templateBindings)).toEqual([]);
    });

    it('reports stale binding ids without deleting user work', () => {
        const store = createStore();
        saveSystemTemplate(store, FANTASY_D20_TEMPLATE, { select: true });
        const componentId = createComponentDefinition(store, { display_label: 'Strength Score' });
        const binding = createTemplateBinding(store, {
            component_id: componentId,
            system_template_id: FANTASY_D20_TEMPLATE.system_template_id,
            field_id: 'strength',
        });

        const staleTemplate = {
            ...FANTASY_D20_TEMPLATE,
            field_definitions: FANTASY_D20_TEMPLATE.field_definitions.filter((field) => field.field_id !== 'strength'),
        };

        expect(findStaleTemplateBindingIds([binding], staleTemplate)).toEqual([binding.binding_id]);
        expect(store.getRowIds(TABLES.templateBindings)).toEqual([binding.binding_id]);
    });

    it('updates the existing field binding instead of creating duplicates', () => {
        const store = createStore();
        saveSystemTemplate(store, FANTASY_D20_TEMPLATE, { select: true });
        const firstComponentId = createComponentDefinition(store, { display_label: 'Strength Score' });
        const secondComponentId = createComponentDefinition(store, { display_label: 'Strength Bonus' });
        const firstBinding = createTemplateBinding(store, {
            component_id: firstComponentId,
            system_template_id: FANTASY_D20_TEMPLATE.system_template_id,
            field_id: 'strength',
        });

        const secondBinding = createTemplateBinding(store, {
            component_id: secondComponentId,
            system_template_id: FANTASY_D20_TEMPLATE.system_template_id,
            field_id: 'strength',
        });

        expect(secondBinding.binding_id).toBe(firstBinding.binding_id);
        expect(store.getRowIds(TABLES.templateBindings)).toEqual([firstBinding.binding_id]);
        expect(store.getCell(TABLES.templateBindings, firstBinding.binding_id, 'component_id')).toBe(secondComponentId);
    });

    it('includes bindings in the versioned local export envelope', () => {
        const store = createStore();
        saveSystemTemplate(store, FANTASY_D20_TEMPLATE, { select: true });
        const componentId = createComponentDefinition(store, { display_label: 'Strength Score' });
        const binding = createTemplateBinding(store, {
            component_id: componentId,
            system_template_id: FANTASY_D20_TEMPLATE.system_template_id,
            field_id: 'strength',
        });

        const exported = JSON.parse(exportStoreToJson(store));

        expect(exported.schema_version).toBe(1);
        expect(exported.tables[TABLES.templateBindings][binding.binding_id].field_id).toBe('strength');
    });
});
