import { findStaleBindingIds, templateBindingSchema } from './template-binding-schema';

const binding = {
    binding_id: '22222222-2222-4222-8222-222222222222',
    component_id: '33333333-3333-4333-8333-333333333333',
    system_template_id: '11111111-1111-4111-8111-111111111111',
    field_id: 'strength',
    created_at: '2026-07-08T00:00:00.000Z',
    updated_at: '2026-07-08T00:00:00.000Z',
};

describe('template-binding-schema', () => {
    it('validates a template binding', () => {
        expect(templateBindingSchema.parse(binding).field_id).toBe('strength');
    });

    it('reports stale bindings without mutating them', () => {
        expect(findStaleBindingIds([templateBindingSchema.parse(binding)], new Set(['dexterity']))).toEqual([
            binding.binding_id,
        ]);
    });
});
