import { z } from 'zod';

/**
 * Supported data types for custom components
 */
export const DataTypeEnum = z.enum(["text", "number", "boolean", "select", "calculated"]);
export type DataType = z.infer<typeof DataTypeEnum>;

/**
 * Validation rules for component definitions.
 * Stored as a JSON-serialized string in TinyBase.
 */
export const ValidationRulesSchema = z.object({
    min: z.number().optional(),           // For number type
    max: z.number().optional(),           // For number type
    min_length: z.number().optional(),    // For text type
    max_length: z.number().optional(),    // For text type
    pattern: z.string().optional(),       // Regex for text type
    options: z.array(z.string()).optional(), // For select type
    formula: z.string().optional(),       // For calculated type
}).optional();

export type ValidationRules = z.infer<typeof ValidationRulesSchema>;

/**
 * Schema for a single component definition.
 * Follows snake_case for compatibility with backend mapping.
 */
export const componentDefinitionSchema = z.object({
    component_id: z.uuid(),
    component_name: z.string()
        .min(1)
        .max(64)
        .regex(/^[a-z][a-z0-9_]*$/,
            "Must start with lowercase letter, only lowercase letters, numbers, underscores"),
    display_label: z.string().min(1, "Display label is required").max(128),
    description: z.string().max(512).optional(),
    data_type: DataTypeEnum,
    default_value: z.string().optional(), // Stored as string, parsed by type during usage
    is_required: z.boolean().default(false),
    validation_rules: ValidationRulesSchema,
    sort_order: z.number().int().default(0),
    created_at: z.iso.datetime(),
    updated_at: z.iso.datetime(),
});

export type ComponentDefinition = z.infer<typeof componentDefinitionSchema>;
