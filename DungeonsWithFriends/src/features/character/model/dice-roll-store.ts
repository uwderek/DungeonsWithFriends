import { z } from 'zod';
import { Store } from 'tinybase';
import { TABLES } from '@/shared/store/local-store';
import { getCharacterSheet } from './character-sheet-store';
import { DiceNotationError, parseDiceNotation, resolveDiceRoll } from './dice-notation';

export type DiceRollStoreErrorCode = 'invalid_notation' | 'invalid_roll' | 'missing_sheet';

export class DiceRollStoreError extends Error {
    constructor(
        public readonly code: DiceRollStoreErrorCode,
        message: string,
        public readonly cause?: unknown
    ) {
        super(message);
        this.name = 'DiceRollStoreError';
    }
}

export const diceRollDetailSchema = z.object({
    rolls: z.array(z.number().int().positive()).min(1),
    modifier: z.number().int(),
});

// ADR-0063: rows persisted before this field existed default to local_rng.
export const diceRollResolutionSourceSchema = z.enum(['local_rng', 'manual_entry']);

export type DiceRollResolutionSource = z.infer<typeof diceRollResolutionSourceSchema>;

export const diceRollSchema = z.object({
    roll_id: z.uuid(),
    character_sheet_id: z.uuid(),
    notation: z.string().min(2).max(32),
    total: z.number().int(),
    detail: diceRollDetailSchema,
    resolution_source: diceRollResolutionSourceSchema.default('local_rng'),
    rolled_at: z.iso.datetime(),
}).superRefine((roll, context) => {
    try {
        const parsed = parseDiceNotation(roll.notation);
        const total = roll.detail.rolls.reduce((sum, value) => sum + value, roll.detail.modifier);

        if (roll.detail.rolls.length !== parsed.count) {
            context.addIssue({
                code: 'custom',
                message: 'Roll detail count does not match notation.',
                path: ['detail', 'rolls'],
            });
        }

        if (roll.detail.modifier !== parsed.modifier) {
            context.addIssue({
                code: 'custom',
                message: 'Roll detail modifier does not match notation.',
                path: ['detail', 'modifier'],
            });
        }

        if (roll.detail.rolls.some((value) => value > parsed.sides)) {
            context.addIssue({
                code: 'custom',
                message: 'Roll detail contains a die result above notation sides.',
                path: ['detail', 'rolls'],
            });
        }

        if (roll.total !== total) {
            context.addIssue({
                code: 'custom',
                message: 'Roll total does not match roll detail.',
                path: ['total'],
            });
        }
    } catch (error) {
        context.addIssue({
            code: 'custom',
            message: 'Roll notation is invalid.',
            path: ['notation'],
        });
    }
});

export type DiceRoll = z.infer<typeof diceRollSchema>;

type DiceRollRow = {
    character_sheet_id?: string;
    notation?: string;
    total?: number;
    detail?: string;
    resolution_source?: string;
    rolled_at?: string;
};

const parseDiceRollRow = (rollId: string, row: DiceRollRow): DiceRoll | null => {
    try {
        return diceRollSchema.parse({
            roll_id: rollId,
            character_sheet_id: row.character_sheet_id,
            notation: row.notation,
            total: row.total,
            detail: typeof row.detail === 'string' ? JSON.parse(row.detail) : row.detail,
            resolution_source: row.resolution_source,
            rolled_at: row.rolled_at,
        });
    } catch {
        return null;
    }
};

const serializeDiceRoll = (roll: DiceRoll) => ({
    character_sheet_id: roll.character_sheet_id,
    notation: roll.notation,
    total: roll.total,
    detail: JSON.stringify(roll.detail),
    resolution_source: roll.resolution_source,
    rolled_at: roll.rolled_at,
});

export const createDiceRoll = (
    store: Store,
    input: {
        character_sheet_id: string;
        notation: string;
        roll_id?: string;
        rolled_at?: string;
        random?: () => number;
    }
): DiceRoll => {
    if (!getCharacterSheet(store, input.character_sheet_id)) {
        throw new DiceRollStoreError('missing_sheet', `Character sheet ${input.character_sheet_id} was not found.`);
    }

    let result;
    try {
        result = resolveDiceRoll(input.notation, input.random);
    } catch (error) {
        const message = error instanceof DiceNotationError ? error.message : 'Dice notation is invalid.';
        throw new DiceRollStoreError('invalid_notation', message, error);
    }

    const roll = diceRollSchema.parse({
        roll_id: input.roll_id ?? crypto.randomUUID(),
        character_sheet_id: input.character_sheet_id,
        notation: result.notation,
        total: result.total,
        detail: {
            rolls: result.rolls,
            modifier: result.modifier,
        },
        resolution_source: 'local_rng',
        rolled_at: input.rolled_at ?? new Date().toISOString(),
    });

    store.setRow(TABLES.diceRolls, roll.roll_id, serializeDiceRoll(roll));

    return roll;
};

export const createManualDiceRoll = (
    store: Store,
    input: {
        character_sheet_id: string;
        notation: string;
        rolls: number[];
        roll_id?: string;
        rolled_at?: string;
    }
): DiceRoll => {
    if (!getCharacterSheet(store, input.character_sheet_id)) {
        throw new DiceRollStoreError('missing_sheet', `Character sheet ${input.character_sheet_id} was not found.`);
    }

    let parsed;
    try {
        parsed = parseDiceNotation(input.notation);
    } catch (error) {
        const message = error instanceof DiceNotationError ? error.message : 'Dice notation is invalid.';
        throw new DiceRollStoreError('invalid_notation', message, error);
    }

    let roll;
    try {
        roll = diceRollSchema.parse({
            roll_id: input.roll_id ?? crypto.randomUUID(),
            character_sheet_id: input.character_sheet_id,
            notation: parsed.normalized,
            total: input.rolls.reduce((sum, value) => sum + value, parsed.modifier),
            detail: {
                rolls: input.rolls,
                modifier: parsed.modifier,
            },
            resolution_source: 'manual_entry',
            rolled_at: input.rolled_at ?? new Date().toISOString(),
        });
    } catch (error) {
        throw new DiceRollStoreError('invalid_roll', 'Manual roll results do not match the notation.', error);
    }

    store.setRow(TABLES.diceRolls, roll.roll_id, serializeDiceRoll(roll));

    return roll;
};

export const getDiceRollsForCharacter = (store: Store, characterSheetId: string): DiceRoll[] => (
    store.getRowIds(TABLES.diceRolls)
        .map((rollId) => parseDiceRollRow(rollId, store.getRow(TABLES.diceRolls, rollId) as DiceRollRow))
        .filter((roll): roll is DiceRoll => roll !== null)
        .filter((roll) => roll.character_sheet_id === characterSheetId)
        .sort((first, second) => Date.parse(first.rolled_at) - Date.parse(second.rolled_at))
);

export const getLatestDiceRollForCharacter = (store: Store, characterSheetId: string): DiceRoll | null => {
    const rolls = getDiceRollsForCharacter(store, characterSheetId);
    return rolls[rolls.length - 1] ?? null;
};
