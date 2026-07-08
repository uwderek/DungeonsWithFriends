import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { createStore, Store } from 'tinybase';
import { useRowIds, useStore } from 'tinybase/ui-react';
import { TABLES } from '@/shared/store/local-store';
import { CreatorTemplatePanel } from './creator-template-panel';
import { FANTASY_D20_TEMPLATE, installBuiltInSystemTemplate } from '../model/system-template-store';

jest.mock('tinybase/ui-react', () => ({
    useStore: jest.fn(),
    useRowIds: jest.fn(),
}));

jest.mock('../model/component-store', () => ({
    useComponentDefinitions: jest.fn(() => []),
}));

const mockedUseStore = useStore as jest.Mock;
const mockedUseRowIds = useRowIds as jest.Mock;
const mockedComponentStore = require('../model/component-store');

const component = {
    component_id: '33333333-3333-4333-8333-333333333333',
    component_name: 'strength_score',
    display_label: 'Strength Score',
    data_type: 'number',
    is_required: false,
    sort_order: 0,
    created_at: '2026-07-08T00:00:00.000Z',
    updated_at: '2026-07-08T00:00:00.000Z',
};

describe('CreatorTemplatePanel', () => {
    let store: Store;

    beforeEach(() => {
        store = createStore();
        mockedUseStore.mockReturnValue(store);
        mockedUseRowIds.mockImplementation((table: string, targetStore?: Store) => (
            (targetStore ?? store).getRowIds(table)
        ));
        mockedComponentStore.useComponentDefinitions.mockReturnValue([]);
        jest.clearAllMocks();
        mockedUseStore.mockReturnValue(store);
        mockedUseRowIds.mockImplementation((table: string, targetStore?: Store) => (
            (targetStore ?? store).getRowIds(table)
        ));
    });

    it('selects the built-in template from the empty state', () => {
        const onSelectSystem = jest.fn();
        const { getByTestId, getByText } = render(<CreatorTemplatePanel onSelectSystem={onSelectSystem} />);

        fireEvent.press(getByTestId('select-system-button'));

        expect(onSelectSystem).toHaveBeenCalled();
        expect(store.getRowIds(TABLES.systemTemplates)).toEqual([FANTASY_D20_TEMPLATE.system_template_id]);
        expect(getByText(/Fantasy d20 selected locally/i)).toBeTruthy();
    });

    it('shows recoverable import errors without mutating templates', () => {
        const { getByTestId } = render(<CreatorTemplatePanel />);

        fireEvent.changeText(getByTestId('custom-system-json-input'), '{bad');
        fireEvent.press(getByTestId('import-system-json-button'));

        expect(getByTestId('template-error-message').props.children).toBe('Custom system JSON is not valid JSON.');
        expect(store.getRowIds(TABLES.systemTemplates)).toEqual([]);
    });

    it('binds the first component to a selected template field', () => {
        installBuiltInSystemTemplate(store);
        store.setRow(TABLES.componentDefinitions, component.component_id, component);
        mockedComponentStore.useComponentDefinitions.mockReturnValue([component]);

        const { getByTestId } = render(<CreatorTemplatePanel />);

        fireEvent.press(getByTestId('bind-field-strength'));

        expect(getByTestId('binding-summary-strength').props.children).toBe('Bound to Strength Score');
        expect(store.getRowIds(TABLES.templateBindings)).toHaveLength(1);
    });

    it('exports and rejects malformed snapshot imports without clearing current rows', () => {
        installBuiltInSystemTemplate(store);
        const { getByTestId } = render(<CreatorTemplatePanel />);

        fireEvent.press(getByTestId('export-button'));
        expect(getByTestId('snapshot-json-input').props.value).toContain('"schema_version": 1');

        fireEvent.changeText(getByTestId('snapshot-json-input'), '{bad');
        fireEvent.press(getByTestId('import-snapshot-button'));

        expect(getByTestId('template-error-message').props.children).toBe('Local store payload is not valid JSON.');
        expect(store.getRowIds(TABLES.systemTemplates)).toEqual([FANTASY_D20_TEMPLATE.system_template_id]);
    });
});
