import { z } from 'zod';
import { DataTypeEnum, ValidationRulesSchema } from './component-schemas';

export const systemFieldDefinitionSchema = z.object({
    field_id: z.string()
        .min(1)
        .max(96)
        .regex(/^[a-z][a-z0-9_]*$/),
    field_label: z.string().min(1).max(128),
    data_type: DataTypeEnum,
    default_value: z.string().optional(),
    validation_rules: ValidationRulesSchema,
});

export const systemTemplateSchema = z.object({
    system_template_id: z.uuid(),
    system_name: z.string().min(1).max(128),
    system_version: z.string().min(1).max(64),
    field_definitions: z.array(systemFieldDefinitionSchema).min(1),
    created_at: z.iso.datetime(),
    updated_at: z.iso.datetime(),
});

export type SystemFieldDefinition = z.infer<typeof systemFieldDefinitionSchema>;
export type SystemTemplate = z.infer<typeof systemTemplateSchema>;

export const parseSystemTemplateJson = (raw: string): SystemTemplate => (
    systemTemplateSchema.parse(JSON.parse(raw))
);
