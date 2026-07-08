import { createStore } from 'tinybase';
import { TABLES } from '@/shared/store/local-store';
import { exportStoreToJson } from '@/shared/store/export-import';
import { FANTASY_D20_TEMPLATE, saveSystemTemplate } from '@/features/creator/model/system-template-store';
import { createCharacterSheet } from './character-sheet-store';
import {
    DiceRollStoreError,
    createDiceRoll,
    createManualDiceRoll,
    getDiceRollsForCharacter,
    getLatestDiceRollForCharacter,
} from './dice-roll-store';

const now = '2026-07-08T00:00:00.000Z';
const sheetId = '44444444-4444-4444-8444-444444444444';
const rollId = '55555555-5555-4555-8555-555555555555';

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

describe('dice-roll-store', () => {
    it('creates and reads a local dice roll record for a character sheet', () => {
        const store = setupSheet();

        const roll = createDiceRoll(store, {
            roll_id: rollId,
            character_sheet_id: sheetId,
            notation: '2d6+3',
            rolled_at: now,
            random: () => 0,
        });

        expect(roll).toMatchObject({
            roll_id: rollId,
            character_sheet_id: sheetId,
            notation: '2d6+3',
            total: 5,
            rolled_at: now,
        });
        expect(roll.detail.rolls).toEqual([1, 1]);
        expect(roll.resolution_source).toBe('local_rng');
        expect(getDiceRollsForCharacter(store, sheetId)).toHaveLength(1);
        expect(getLatestDiceRollForCharacter(store, sheetId)?.roll_id).toBe(rollId);
        expect(store.getCell(TABLES.diceRolls, rollId, 'detail')).toContain('"rolls":[1,1]');
        expect(store.getCell(TABLES.diceRolls, rollId, 'resolution_source')).toBe('local_rng');
    });

    it('creates a validated manual roll with manual_entry provenance', () => {
        const store = setupSheet();

        const roll = createManualDiceRoll(store, {
            roll_id: rollId,
            character_sheet_id: sheetId,
            notation: '2d6+3',
            rolls: [4, 6],
            rolled_at: now,
        });

        expect(roll).toMatchObject({
            notation: '2d6+3',
            total: 13,
            resolution_source: 'manual_entry',
        });
        expect(store.getCell(TABLES.diceRolls, rollId, 'resolution_source')).toBe('manual_entry');
    });

    it('rejects manual rolls that do not match the notation', () => {
        const store = setupSheet();

        expect(() => createManualDiceRoll(store, {
            character_sheet_id: sheetId,
            notation: '2d6+3',
            rolls: [4],
        })).toThrow(DiceRollStoreError);

        expect(() => createManualDiceRoll(store, {
            character_sheet_id: sheetId,
            notation: '2d6+3',
            rolls: [4, 7],
        })).toThrow(DiceRollStoreError);

        expect(store.getRowIds(TABLES.diceRolls)).toEqual([]);
    });

    it('defaults resolution_source to local_rng for rows persisted before ADR-0063', () => {
        const store = setupSheet();
        createDiceRoll(store, {
            roll_id: rollId,
            character_sheet_id: sheetId,
            notation: '2d6+3',
            rolled_at: now,
            random: () => 0,
        });
        store.delCell(TABLES.diceRolls, rollId, 'resolution_source');

        const rolls = getDiceRollsForCharacter(store, sheetId);

        expect(rolls).toHaveLength(1);
        expect(rolls[0].resolution_source).toBe('local_rng');
    });

    it('does not create a row for invalid notation', () => {
        const store = setupSheet();

        expect(() => createDiceRoll(store, {
            character_sheet_id: sheetId,
            notation: '0d6',
        })).toThrow(DiceRollStoreError);

        expect(store.getRowIds(TABLES.diceRolls)).toEqual([]);
    });

    it('exports dice roll records in the versioned local envelope', () => {
        const store = setupSheet();
        createDiceRoll(store, {
            roll_id: rollId,
            character_sheet_id: sheetId,
            notation: 'd20',
            rolled_at: now,
            random: () => 0.999,
        });

        const exported = JSON.parse(exportStoreToJson(store));

        expect(exported.tables[TABLES.diceRolls][rollId].notation).toBe('1d20');
        expect(exported.tables[TABLES.diceRolls][rollId].total).toBe(20);
    });
});
