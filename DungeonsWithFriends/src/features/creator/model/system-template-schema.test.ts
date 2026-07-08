import { parseSystemTemplateJson, systemTemplateSchema } from './system-template-schema';

const validTemplate = {
    system_template_id: '11111111-1111-4111-8111-111111111111',
    system_name: 'Test System',
    system_version: '1.0.0',
    field_definitions: [
        {
            field_id: 'strength',
            field_label: 'Strength',
            data_type: 'number',
        },
    ],
    created_at: '2026-07-08T00:00:00.000Z',
    updated_at: '2026-07-08T00:00:00.000Z',
};

describe('system-template-schema', () => {
    it('validates a system template', () => {
        expect(systemTemplateSchema.parse(validTemplate).system_name).toBe('Test System');
    });

    it('rejects invalid field ids', () => {
        expect(() => systemTemplateSchema.parse({
            ...validTemplate,
            field_definitions: [{ ...validTemplate.field_definitions[0], field_id: 'Strength!' }],
        })).toThrow();
    });

    it('parses valid system template JSON', () => {
        expect(parseSystemTemplateJson(JSON.stringify(validTemplate)).field_definitions[0].field_id).toBe('strength');
    });
});
