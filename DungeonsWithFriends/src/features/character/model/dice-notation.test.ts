import {
    DiceNotationError,
    parseDiceNotation,
    resolveDiceRoll,
} from './dice-notation';

describe('dice-notation', () => {
    it('parses common dice notation into normalized parts', () => {
        expect(parseDiceNotation('d20')).toEqual({
            count: 1,
            sides: 20,
            modifier: 0,
            normalized: '1d20',
        });
        expect(parseDiceNotation('2d6+3')).toEqual({
            count: 2,
            sides: 6,
            modifier: 3,
            normalized: '2d6+3',
        });
        expect(parseDiceNotation('4d8 - 2')).toEqual({
            count: 4,
            sides: 8,
            modifier: -2,
            normalized: '4d8-2',
        });
    });

    it('rejects invalid, zero, and excessive notation', () => {
        expect(() => parseDiceNotation('not dice')).toThrow(DiceNotationError);
        expect(() => parseDiceNotation('0d6')).toThrow(DiceNotationError);
        expect(() => parseDiceNotation('2d0')).toThrow(DiceNotationError);
        expect(() => parseDiceNotation('101d6')).toThrow(DiceNotationError);
        expect(() => parseDiceNotation('1d1001')).toThrow(DiceNotationError);
    });

    it('resolves rolls deterministically with an injected random source', () => {
        const values = [0, 0.999];
        const result = resolveDiceRoll('2d6+3', () => values.shift() ?? 0);

        expect(result).toEqual({
            notation: '2d6+3',
            rolls: [1, 6],
            modifier: 3,
            total: 10,
        });
    });
});
