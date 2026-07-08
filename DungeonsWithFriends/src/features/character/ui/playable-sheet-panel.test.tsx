import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { createDwfStore } from '@/shared/store/local-store';
import { FANTASY_D20_TEMPLATE, saveSystemTemplate } from '@/features/creator/model/system-template-store';
import { createCharacterSheet, getCharacterSheet } from '@/features/character/model/character-sheet-store';
import { PlayableSheetPanel } from './playable-sheet-panel';

const now = '2026-07-08T00:00:00.000Z';
const sheetId = '44444444-4444-4444-8444-444444444444';

const setupSheet = () => {
    const store = createDwfStore();
    saveSystemTemplate(store, FANTASY_D20_TEMPLATE, { select: true });
    createCharacterSheet(store, {
        character_sheet_id: sheetId,
        character_name: 'Ada',
        now,
    });
    return store;
};

describe('PlayableSheetPanel', () => {
    it('renders playable fields for a local character sheet', () => {
        const store = setupSheet();

        const { getByText, getByTestId } = render(
            <PlayableSheetPanel store={store} characterSheetId={sheetId} />
        );

        expect(getByText('Playable Sheet')).toBeTruthy();
        expect(getByText('Strength')).toBeTruthy();
        expect(getByTestId('field-input-strength').props.value).toBe('10');
    });

    it('updates field values locally', () => {
        const store = setupSheet();
        const onChange = jest.fn();
        const { getByTestId } = render(
            <PlayableSheetPanel store={store} characterSheetId={sheetId} onChange={onChange} />
        );

        fireEvent.changeText(getByTestId('field-input-strength'), '12');

        expect(getCharacterSheet(store, sheetId)?.field_values.strength).toBe(12);
        expect(onChange).toHaveBeenCalled();
    });

    it('shows validation feedback without mutating invalid values', () => {
        const store = setupSheet();
        const { getByTestId, getByText } = render(
            <PlayableSheetPanel store={store} characterSheetId={sheetId} />
        );

        fireEvent.changeText(getByTestId('field-input-strength'), 'nope');

        expect(getByText('Value does not match field type.')).toBeTruthy();
        expect(getCharacterSheet(store, sheetId)?.field_values.strength).toBe(10);
    });

    it('resolves local dice notation and displays the latest result', () => {
        const store = setupSheet();
        const { getByTestId, getByText } = render(
            <PlayableSheetPanel store={store} characterSheetId={sheetId} rollRandom={() => 0.999} />
        );

        fireEvent.changeText(getByTestId('dice-notation-input'), 'd20');
        fireEvent.press(getByTestId('roll-dice-button'));

        expect(getByText('Rolled 1d20: 20')).toBeTruthy();
    });

    it('shows invalid dice notation feedback without creating a roll', () => {
        const store = setupSheet();
        const { getByTestId, getByText, queryByText } = render(
            <PlayableSheetPanel store={store} characterSheetId={sheetId} />
        );

        fireEvent.changeText(getByTestId('dice-notation-input'), '0d6');
        fireEvent.press(getByTestId('roll-dice-button'));

        expect(getByText('Dice notation is invalid.')).toBeTruthy();
        expect(queryByText(/Rolled/)).toBeNull();
    });
});
