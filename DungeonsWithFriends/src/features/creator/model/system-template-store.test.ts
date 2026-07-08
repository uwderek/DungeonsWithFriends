import { createStore } from 'tinybase';
import { TABLES } from '@/shared/store/local-store';
import {
    FANTASY_D20_TEMPLATE,
    SystemTemplateImportError,
    getSelectedSystemTemplate,
    importSystemTemplateJson,
    installBuiltInSystemTemplate,
    saveSystemTemplate,
} from './system-template-store';

const customTemplate = {
    system_template_id: '22222222-2222-4222-8222-222222222222',
    system_name: 'Custom System',
    system_version: '1.0.0',
    field_definitions: [
        { field_id: 'grit', field_label: 'Grit', data_type: 'number', default_value: '1' },
    ],
    created_at: '2026-07-08T00:00:00.000Z',
    updated_at: '2026-07-08T00:00:00.000Z',
};

describe('system-template-store', () => {
    it('installs and selects the built-in system template', () => {
        const store = createStore();

        installBuiltInSystemTemplate(store);

        expect(getSelectedSystemTemplate(store)?.system_name).toBe(FANTASY_D20_TEMPLATE.system_name);
        expect(store.getCell(TABLES.systemTemplates, FANTASY_D20_TEMPLATE.system_template_id, 'is_selected')).toBe(true);
    });

    it('imports valid custom system JSON and selects it', () => {
        const store = createStore();

        const result = importSystemTemplateJson(store, JSON.stringify(customTemplate));

        expect(result.system_name).toBe('Custom System');
        expect(getSelectedSystemTemplate(store)?.system_template_id).toBe(customTemplate.system_template_id);
    });

    it('does not mutate templates when custom JSON is malformed', () => {
        const store = createStore();
        saveSystemTemplate(store, FANTASY_D20_TEMPLATE, { select: true });

        expect(() => importSystemTemplateJson(store, '{bad')).toThrow(SystemTemplateImportError);

        expect(getSelectedSystemTemplate(store)?.system_template_id).toBe(FANTASY_D20_TEMPLATE.system_template_id);
        expect(store.getRowIds(TABLES.systemTemplates)).toEqual([FANTASY_D20_TEMPLATE.system_template_id]);
    });

    it('does not mutate templates when custom JSON fails schema validation', () => {
        const store = createStore();
        saveSystemTemplate(store, FANTASY_D20_TEMPLATE, { select: true });

        expect(() => importSystemTemplateJson(store, JSON.stringify({
            ...customTemplate,
            field_definitions: [],
        }))).toThrow(SystemTemplateImportError);

        expect(getSelectedSystemTemplate(store)?.system_template_id).toBe(FANTASY_D20_TEMPLATE.system_template_id);
        expect(store.getRowIds(TABLES.systemTemplates)).toEqual([FANTASY_D20_TEMPLATE.system_template_id]);
    });

    it('ignores invalid persisted selected-template rows instead of throwing', () => {
        const store = createStore();
        store.setRow(TABLES.systemTemplates, 'bad-template', {
            system_name: 'Broken',
            system_version: '1.0.0',
            field_definitions: '{bad',
            created_at: '2026-07-08T00:00:00.000Z',
            updated_at: '2026-07-08T00:00:00.000Z',
            is_selected: true,
        });

        expect(getSelectedSystemTemplate(store)).toBeNull();
    });
});
