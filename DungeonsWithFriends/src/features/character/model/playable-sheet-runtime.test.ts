import { createStore } from 'tinybase';
import { TABLES } from '@/shared/store/local-store';
import { createComponentDefinition } from '@/features/creator/model/component-store';
import { createTemplateBinding } from '@/features/creator/model/template-binding-store';
import {
    FANTASY_D20_TEMPLATE,
    saveSystemTemplate,
} from '@/features/creator/model/system-template-store';
import { createCharacterSheet, getCharacterSheet } from './character-sheet-store';
import {
    PlayableSheetRuntimeError,
    resolvePlayableSheet,
    updatePlayableFieldValue,
} from './playable-sheet-runtime';

const now = '2026-07-08T00:00:00.000Z';
const sheetId = '44444444-4444-4444-8444-444444444444';

const setupSheet = () => {
    const store = createStore();
    saveSystemTemplate(store, FANTASY_D20_TEMPLATE, { select: true });
    createCharacterSheet(store, {
        character_sheet_id: sheetId,
        character_name: 'Ada',
        now,
    });
    return store;
};

describe('playable-sheet-runtime', () => {
    it('resolves unbound system fields with current values and default fallbacks', () => {
        const store = setupSheet();
        updatePlayableFieldValue(store, sheetId, 'strength', 12, '2026-07-08T01:00:00.000Z');

        const runtime = resolvePlayableSheet(store, sheetId);

        expect(runtime.sheet.character_name).toBe('Ada');
        expect(runtime.staleBindingIds).toEqual([]);
        expect(runtime.fields[0]).toMatchObject({
            field_id: 'strength',
            label: 'Strength',
            data_type: 'number',
            value: 12,
            default_value: 10,
        });
        expect(runtime.fields.find((field) => field.field_id === 'dexterity')?.value).toBe(10);
    });

    it('uses bound component labels and sort order when bindings exist', () => {
        const store = setupSheet();
        const dexterityComponentId = createComponentDefinition(store, {
            component_name: 'dexterity_bonus',
            display_label: 'Dexterity Bonus',
            data_type: 'number',
            sort_order: 1,
        });
        const strengthComponentId = createComponentDefinition(store, {
            component_name: 'strength_score',
            display_label: 'Strength Score',
            data_type: 'number',
            sort_order: 2,
        });
        createTemplateBinding(store, {
            component_id: strengthComponentId,
            system_template_id: FANTASY_D20_TEMPLATE.system_template_id,
            field_id: 'strength',
        });
        createTemplateBinding(store, {
            component_id: dexterityComponentId,
            system_template_id: FANTASY_D20_TEMPLATE.system_template_id,
            field_id: 'dexterity',
        });

        const runtime = resolvePlayableSheet(store, sheetId);

        expect(runtime.fields.slice(0, 2).map((field) => field.label)).toEqual([
            'Dexterity Bonus',
            'Strength Score',
        ]);
    });

    it('updates typed field values without dropping other field values', () => {
        const store = setupSheet();

        const updated = updatePlayableFieldValue(store, sheetId, 'strength', 14, '2026-07-08T01:00:00.000Z');

        expect(updated.field_values.strength).toBe(14);
        expect(updated.field_values.dexterity).toBe(10);
        expect(updated.updated_at).toBe('2026-07-08T01:00:00.000Z');
    });

    it('rejects incompatible values without mutating the row', () => {
        const store = setupSheet();

        expect(() => updatePlayableFieldValue(store, sheetId, 'strength', 'not-a-number', now)).toThrow(PlayableSheetRuntimeError);
        expect(() => updatePlayableFieldValue(store, sheetId, 'strength', '', now)).toThrow(PlayableSheetRuntimeError);

        expect(getCharacterSheet(store, sheetId)?.field_values.strength).toBe(10);
    });

    it('reports stale bindings without deleting them or sheet data', () => {
        const store = setupSheet();
        const componentId = createComponentDefinition(store, {
            component_name: 'strength_score',
            display_label: 'Strength Score',
            data_type: 'number',
        });
        const binding = createTemplateBinding(store, {
            component_id: componentId,
            system_template_id: FANTASY_D20_TEMPLATE.system_template_id,
            field_id: 'strength',
        });
        saveSystemTemplate(store, {
            ...FANTASY_D20_TEMPLATE,
            field_definitions: FANTASY_D20_TEMPLATE.field_definitions.filter((field) => field.field_id !== 'strength'),
        }, { select: true });

        const runtime = resolvePlayableSheet(store, sheetId);

        expect(runtime.staleBindingIds).toEqual([binding.binding_id]);
        expect(store.getRowIds(TABLES.templateBindings)).toEqual([binding.binding_id]);
        expect(getCharacterSheet(store, sheetId)?.field_values.strength).toBe(10);
    });
});
