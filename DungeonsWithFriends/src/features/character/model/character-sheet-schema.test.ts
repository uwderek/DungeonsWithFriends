import { characterSheetSchema, createEmptyCharacterSheet } from './character-sheet-schema';

describe('character-sheet-schema', () => {
    it('creates a valid empty character sheet', () => {
        const sheet = createEmptyCharacterSheet({
            character_sheet_id: '44444444-4444-4444-8444-444444444444',
            character_name: 'Ada',
            system_template_id: '11111111-1111-4111-8111-111111111111',
            template_version: '1.0.0',
        }, '2026-07-08T00:00:00.000Z');

        expect(characterSheetSchema.parse(sheet).field_values).toEqual({});
    });

    it('rejects missing character names', () => {
        expect(() => characterSheetSchema.parse({
            character_sheet_id: '44444444-4444-4444-8444-444444444444',
            character_name: '',
            system_template_id: '11111111-1111-4111-8111-111111111111',
            template_version: '1.0.0',
            field_values: {},
            created_at: '2026-07-08T00:00:00.000Z',
            updated_at: '2026-07-08T00:00:00.000Z',
        })).toThrow();
    });
});
