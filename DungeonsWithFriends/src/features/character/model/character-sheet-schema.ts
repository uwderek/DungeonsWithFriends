import { z } from 'zod';

const sheetValueSchema = z.union([z.string(), z.number(), z.boolean()]);

export const characterSheetSchema = z.object({
    character_sheet_id: z.uuid(),
    character_name: z.string().min(1).max(128),
    system_template_id: z.uuid(),
    template_version: z.string().min(1).max(64),
    field_values: z.record(z.string(), sheetValueSchema),
    created_at: z.iso.datetime(),
    updated_at: z.iso.datetime(),
});

export type CharacterSheet = z.infer<typeof characterSheetSchema>;

export const createEmptyCharacterSheet = (
    input: Pick<CharacterSheet, 'character_sheet_id' | 'character_name' | 'system_template_id' | 'template_version'>,
    now = new Date().toISOString()
): CharacterSheet => ({
    ...input,
    field_values: {},
    created_at: now,
    updated_at: now,
});
