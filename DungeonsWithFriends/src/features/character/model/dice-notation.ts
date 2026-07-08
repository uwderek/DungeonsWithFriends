export type ParsedDiceNotation = {
    count: number;
    sides: number;
    modifier: number;
    normalized: string;
};

export type DiceRollResult = {
    notation: string;
    rolls: number[];
    modifier: number;
    total: number;
};

export type DiceNotationErrorCode = 'invalid_notation' | 'dice_limit_exceeded';

export class DiceNotationError extends Error {
    constructor(
        public readonly code: DiceNotationErrorCode,
        message: string
    ) {
        super(message);
        this.name = 'DiceNotationError';
    }
}

export const MAX_DICE_COUNT = 100;
export const MAX_DICE_SIDES = 1000;

const notationPattern = /^\s*(?:(\d+)\s*)?d\s*(\d+)\s*([+-]\s*\d+)?\s*$/i;

export const parseDiceNotation = (raw: string): ParsedDiceNotation => {
    const match = notationPattern.exec(raw);
    if (!match) {
        throw new DiceNotationError('invalid_notation', 'Dice notation is invalid.');
    }

    const count = match[1] ? Number(match[1]) : 1;
    const sides = Number(match[2]);
    const modifier = match[3] ? Number(match[3].replace(/\s+/g, '')) : 0;

    if (!Number.isInteger(count) || !Number.isInteger(sides) || count < 1 || sides < 1) {
        throw new DiceNotationError('invalid_notation', 'Dice notation must include positive dice and sides.');
    }

    if (count > MAX_DICE_COUNT || sides > MAX_DICE_SIDES) {
        throw new DiceNotationError('dice_limit_exceeded', 'Dice notation exceeds local roll limits.');
    }

    return {
        count,
        sides,
        modifier,
        normalized: `${count}d${sides}${modifier > 0 ? `+${modifier}` : modifier < 0 ? String(modifier) : ''}`,
    };
};

export const resolveDiceRoll = (
    raw: string | ParsedDiceNotation,
    random: () => number = Math.random
): DiceRollResult => {
    const parsed = typeof raw === 'string' ? parseDiceNotation(raw) : raw;
    const rolls = Array.from({ length: parsed.count }, () => {
        const boundedRandom = Math.min(0.999999999, Math.max(0, random()));
        return Math.floor(boundedRandom * parsed.sides) + 1;
    });
    const total = rolls.reduce((sum, roll) => sum + roll, parsed.modifier);

    return {
        notation: parsed.normalized,
        rolls,
        modifier: parsed.modifier,
        total,
    };
};
