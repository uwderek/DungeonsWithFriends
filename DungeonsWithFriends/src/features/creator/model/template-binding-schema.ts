import { z } from 'zod';

export const bindingTransformSchema = z.object({
    transform_type: z.enum(['none', 'format', 'formula']).default('none'),
    expression: z.string().max(512).optional(),
}).optional();

export const templateBindingSchema = z.object({
    binding_id: z.uuid(),
    component_id: z.uuid(),
    system_template_id: z.uuid(),
    field_id: z.string().min(1).max(96),
    transform: bindingTransformSchema,
    created_at: z.iso.datetime(),
    updated_at: z.iso.datetime(),
});

export type TemplateBinding = z.infer<typeof templateBindingSchema>;

export const findStaleBindingIds = (
    bindings: TemplateBinding[],
    validFieldIds: Set<string>
): string[] => (
    bindings
        .filter((binding) => !validFieldIds.has(binding.field_id))
        .map((binding) => binding.binding_id)
);
