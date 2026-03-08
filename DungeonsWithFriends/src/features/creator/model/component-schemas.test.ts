import { componentDefinitionSchema } from '@/features/creator/model/component-schemas';

describe('componentDefinitionSchema', () => {
    const validBase = {
        component_id: '550e8400-e29b-41d4-a716-446655440000',
        component_name: 'strength_score',
        display_label: 'Strength',
        data_type: 'number',
        default_value: '10',
        is_required: true,
        sort_order: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        validation_rules: {
            min: 0,
            max: 30
        }
    };

    it('validates a correct number component', () => {
        const result = componentDefinitionSchema.safeParse(validBase);
        expect(result.success).toBe(true);
    });

    it('validates a correct text component', () => {
        const textComponent = {
            ...validBase,
            component_name: 'character_name',
            data_type: 'text',
            default_value: '',
            validation_rules: {
                min_length: 1,
                max_length: 100
            }
        };
        const result = componentDefinitionSchema.safeParse(textComponent);
        expect(result.success).toBe(true);
    });

    it('rejects invalid component_name (starts with number)', () => {
        const invalid = { ...validBase, component_name: '1_strength' };
        const result = componentDefinitionSchema.safeParse(invalid);
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].message).toContain('Must start with lowercase letter');
        }
    });

    it('rejects invalid component_name (uppercase)', () => {
        const invalid = { ...validBase, component_name: 'Strength' };
        const result = componentDefinitionSchema.safeParse(invalid);
        expect(result.success).toBe(false);
    });

    it('rejects invalid data_type', () => {
        const invalid = { ...validBase, data_type: 'invalid' };
        const result = componentDefinitionSchema.safeParse(invalid);
        expect(result.success).toBe(false);
    });

    it('validates select type with options', () => {
        const selectComponent = {
            ...validBase,
            component_name: 'alignment',
            data_type: 'select',
            validation_rules: {
                options: ['LG', 'NG', 'CG', 'LN', 'N', 'CN', 'LE', 'NE', 'CE']
            }
        };
        const result = componentDefinitionSchema.safeParse(selectComponent);
        expect(result.success).toBe(true);
    });

    it('validates calculated type with formula', () => {
        const calculatedComponent = {
            ...validBase,
            component_name: 'strength_mod',
            data_type: 'calculated',
            validation_rules: {
                formula: 'floor((strength_score - 10) / 2)'
            }
        };
        const result = componentDefinitionSchema.safeParse(calculatedComponent);
        expect(result.success).toBe(true);
    });
});
