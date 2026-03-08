import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { X, Save, AlertCircle, Info } from 'lucide-react-native';
import { useComponentDefinition, updateComponentDefinition } from '../model/component-store';
import { useStore } from 'tinybase/ui-react';
import { componentDefinitionSchema, ComponentDefinition } from '../model/component-schemas';

interface ComponentEditorProps {
    componentId: string;
    onClose: () => void;
}

export const ComponentEditor: React.FC<ComponentEditorProps> = ({ componentId, onClose }) => {
    const store = useStore();
    const component = useComponentDefinition(componentId);

    // Form state
    const [formData, setFormData] = useState<ComponentDefinition | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);

    // Auto-save debounce ref
    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isMountedRef = useRef(true);

    // Track mounted state
    useEffect(() => {
        isMountedRef.current = true;
        return () => {
            isMountedRef.current = false;
        };
    }, []);

    // Initialize form data when component is loaded
    useEffect(() => {
        if (component && !formData) {
            setFormData(component);
        }
    }, [component]);

    // Debounced auto-save
    useEffect(() => {
        if (!formData) return;

        // Validation
        const result = componentDefinitionSchema.safeParse(formData);
        if (!result.success) {
            const newErrors: Record<string, string> = {};
            result.error.issues.forEach((issue: any) => {
                const path = issue.path.join('.');
                newErrors[path] = issue.message;
            });
            setErrors(newErrors);
            return;
        }

        setErrors({});

        // Debounce actual save
        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

        saveTimeoutRef.current = setTimeout(async () => {
            setIsSaving(true);
            try {
                if (store) {
                    await updateComponentDefinition(store, componentId, result.data);
                }
            } catch (err) {
                console.error("Auto-save failed:", err);
            } finally {
                if (isMountedRef.current) {
                    setIsSaving(false);
                    setLastSaved(new Date());
                }
            }
        }, 300);

        return () => {
            if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
        };
    }, [formData, componentId]);

    if (!formData) {
        return (
            <View className="flex-1 items-center justify-center bg-background-primary">
                <Text className="text-typography-secondary">Loading component definition...</Text>
            </View>
        );
    }

    const updateField = <K extends keyof ComponentDefinition>(field: K, value: ComponentDefinition[K]) => {
        setFormData((prev: ComponentDefinition | null) => prev ? { ...prev, [field]: value } : null);
    };

    const updateValidationRule = (rule: string, value: unknown) => {
        setFormData((prev: ComponentDefinition | null) => {
            if (!prev) return null;
            return {
                ...prev,
                validation_rules: {
                    ...(prev.validation_rules || {}),
                    [rule]: value
                }
            };
        });
    };

    return (
        <View className="flex-1 bg-background-primary">
            <View className="flex-row justify-between items-center p-6 border-b border-border-primary">
                <View className="flex-row items-center space-x-3">
                    <TouchableOpacity onPress={onClose} className="p-2 bg-background-secondary rounded-lg">
                        {React.createElement(X as any, { size: 20, color: "var(--color-typography-primary)" })}
                    </TouchableOpacity>
                    <Text className="text-xl text-typography-primary font-bold" style={{ fontFamily: 'Cinzel' }}>
                        Edit Component
                    </Text>
                </View>
                <View className="flex-row items-center space-x-2">
                    {isSaving && (
                        <Text className="text-typography-secondary text-xs italic">Saving...</Text>
                    )}
                    <View className={`w-2 h-2 rounded-full ${isSaving ? 'bg-accent-primary' : lastSaved ? 'bg-success-500' : 'bg-typography-tertiary'}`} />
                    {lastSaved && !isSaving && (
                        <Text className="text-success-500 text-xs">Saved</Text>
                    )}
                </View>
            </View>

            <ScrollView className="flex-1 p-6">
                <View className="mb-8 p-4 bg-background-tertiary rounded-2xl border border-border-primary">
                    <View className="flex-row items-center mb-4 space-x-2">
                        {React.createElement(Info as any, { size: 16, color: "var(--color-accent-primary)" })}
                        <Text className="text-accent-primary font-bold text-sm uppercase tracking-wider">Basic configuration</Text>
                    </View>

                    <View className="space-y-4">
                        <View>
                            <Text className="text-typography-secondary text-sm mb-1 ml-1 font-medium">Display Label</Text>
                            <TextInput
                                className="bg-background-secondary text-typography-primary h-12 px-4 rounded-xl border border-border-primary"
                                value={formData.display_label}
                                onChangeText={(v) => updateField('display_label', v)}
                                placeholder="Enter display label (e.g. Strength)"
                                placeholderTextColor="var(--color-text-secondary)"
                            />
                            {errors.display_label && (
                                <View className="flex-row items-center mt-1 ml-1 space-x-1">
                                    {React.createElement(AlertCircle as any, { size: 12, color: "var(--color-red-500)" })}
                                    <Text className="text-red-500 text-xs">{errors.display_label}</Text>
                                </View>
                            )}
                        </View>

                        <View>
                            <Text className="text-typography-secondary text-sm mb-1 ml-1 font-medium">Internal Name</Text>
                            <TextInput
                                className="bg-background-secondary text-typography-primary font-mono h-12 px-4 rounded-xl border border-border-primary"
                                value={formData.component_name}
                                onChangeText={(v) => updateField('component_name', v)}
                                placeholder="snake_case_name"
                                placeholderTextColor="var(--color-text-secondary)"
                                autoCapitalize="none"
                            />
                            {errors.component_name ? (
                                <View className="flex-row items-center mt-1 ml-1 space-x-1">
                                    {React.createElement(AlertCircle as any, { size: 12, color: "var(--color-red-500)" })}
                                    <Text className="text-red-500 text-xs">Lowercase letters, numbers, and underscores only</Text>
                                </View>
                            ) : (
                                <Text className="text-typography-tertiary text-[10px] mt-1 ml-1">Used as a key in databases and scripts.</Text>
                            )}
                        </View>

                        {/* Description Field */}
                        <View>
                            <Text className="text-typography-secondary text-sm mb-1 ml-1 font-medium">Description</Text>
                            <TextInput
                                className="bg-background-secondary text-typography-primary h-12 px-4 rounded-xl border border-border-primary"
                                value={formData.description || ''}
                                onChangeText={(v) => updateField('description', v || undefined)}
                                placeholder="Optional description"
                                placeholderTextColor="var(--color-text-secondary)"
                            />
                        </View>

                        <View>
                            <Text className="text-typography-secondary text-sm mb-1 ml-1 font-medium">Data Type</Text>
                            <View className="flex-row flex-wrap -m-1">
                                {["text", "number", "boolean", "select", "calculated"].map((type) => (
                                    <TouchableOpacity
                                        key={type}
                                        onPress={() => updateField('data_type', type as ComponentDefinition['data_type'])}
                                        testID={`type-button-${type}`}
                                        className={`m-1 px-4 py-2 rounded-lg border ${formData.data_type === type ? 'bg-accent-primary/20 border-accent-primary' : 'bg-background-secondary border-border-primary'}`}
                                    >
                                        <Text className={`text-xs capitalize ${formData.data_type === type ? 'text-accent-primary font-bold' : 'text-typography-secondary'}`}>
                                            {type}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        <View className="flex-row items-center justify-between py-2 px-1">
                            <View>
                                <Text className="text-typography-primary font-medium">Required Field</Text>
                                <Text className="text-typography-tertiary text-xs">Users must provide a value</Text>
                            </View>
                            <Switch
                                value={formData.is_required}
                                onValueChange={(v) => updateField('is_required', v)}
                                testID="switch-required"
                                trackColor={{ false: 'var(--color-background-tertiary)', true: 'var(--color-accent-primary)' }}
                                thumbColor="white"
                            />
                        </View>
                    </View>
                </View>

                {/* Conditional Validation Rules */}
                <View className="mb-20 p-4 bg-background-tertiary rounded-2xl border border-border-primary">
                    <View className="flex-row items-center mb-4 space-x-2">
                        {React.createElement(Save as any, { size: 16, color: "var(--color-accent-primary)" })}
                        <Text className="text-accent-primary font-bold text-sm uppercase tracking-wider">Validation Rules</Text>
                    </View>

                    {formData.data_type === 'number' && (
                        <View className="flex-row space-x-4">
                            <View className="flex-1">
                                <Text className="text-typography-secondary text-xs mb-1 ml-1">Minimum</Text>
                                <TextInput
                                    className="bg-background-secondary text-typography-primary h-12 px-4 rounded-xl border border-border-primary"
                                    value={formData.validation_rules?.min?.toString()}
                                    onChangeText={(v) => updateValidationRule('min', v === '' ? undefined : Number(v))}
                                    testID="input-min"
                                    keyboardType="numeric"
                                />
                            </View>
                            <View className="flex-1">
                                <Text className="text-typography-secondary text-xs mb-1 ml-1">Maximum</Text>
                                <TextInput
                                    className="bg-background-secondary text-typography-primary h-12 px-4 rounded-xl border border-border-primary"
                                    value={formData.validation_rules?.max?.toString()}
                                    onChangeText={(v) => updateValidationRule('max', v === '' ? undefined : Number(v))}
                                    testID="input-max"
                                    keyboardType="numeric"
                                />
                            </View>
                        </View>
                    )}

                    {formData.data_type === 'text' && (
                        <View className="space-y-4">
                            <View className="flex-row space-x-4">
                                <View className="flex-1">
                                    <Text className="text-typography-secondary text-xs mb-1 ml-1">Min Length</Text>
                                    <TextInput
                                        className="bg-background-secondary text-typography-primary h-12 px-4 rounded-xl border border-border-primary"
                                        value={formData.validation_rules?.min_length?.toString()}
                                        onChangeText={(v) => updateValidationRule('min_length', v === '' ? undefined : Number(v))}
                                        testID="input-min-length"
                                        keyboardType="numeric"
                                    />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-typography-secondary text-xs mb-1 ml-1">Max Length</Text>
                                    <TextInput
                                        className="bg-background-secondary text-typography-primary h-12 px-4 rounded-xl border border-border-primary"
                                        value={formData.validation_rules?.max_length?.toString()}
                                        onChangeText={(v) => updateValidationRule('max_length', v === '' ? undefined : Number(v))}
                                        testID="input-max-length"
                                        keyboardType="numeric"
                                    />
                                </View>
                            </View>
                            <View>
                                <Text className="text-typography-secondary text-xs mb-1 ml-1">Regex Pattern</Text>
                                <TextInput
                                    className="bg-background-secondary text-typography-primary font-mono h-12 px-4 rounded-xl border border-border-primary"
                                    value={formData.validation_rules?.pattern}
                                    onChangeText={(v) => updateValidationRule('pattern', v)}
                                    testID="input-pattern"
                                    placeholder="^[A-Z].*$"
                                    autoCapitalize="none"
                                />
                            </View>
                        </View>
                    )}
                    {formData.data_type === 'select' && (
                        <View className="space-y-4">
                            <View>
                                <Text className="text-typography-secondary text-xs mb-1 ml-1">Options (comma-separated)</Text>
                                <TextInput
                                    className="bg-background-secondary text-typography-primary h-12 px-4 rounded-xl border border-border-primary"
                                    value={(formData.validation_rules?.options || []).join(', ')}
                                    onChangeText={(v) => updateValidationRule('options', v.split(',').map(s => s.trim()).filter(Boolean))}
                                    testID="input-options"
                                    placeholder="Option 1, Option 2, Option 3"
                                />
                            </View>
                        </View>
                    )}

                    {formData.data_type === 'calculated' && (
                        <View className="space-y-4">
                            <View>
                                <Text className="text-typography-secondary text-xs mb-1 ml-1">Formula</Text>
                                <TextInput
                                    className="bg-background-secondary text-typography-primary font-mono h-12 px-4 rounded-xl border border-border-primary"
                                    value={formData.validation_rules?.formula || ''}
                                    onChangeText={(v) => updateValidationRule('formula', v || undefined)}
                                    testID="input-formula"
                                    placeholder="floor((strength_score - 10) / 2)"
                                    autoCapitalize="none"
                                />
                                <Text className="text-typography-tertiary text-[10px] mt-1 ml-1">Use component names as variables</Text>
                            </View>
                        </View>
                    )}

                    {/* Default Value - shown for all types */}
                    <View className="mt-4 pt-4 border-t border-border-primary">
                        <Text className="text-typography-secondary text-xs mb-1 ml-1">Default Value</Text>
                        <TextInput
                            className="bg-background-secondary text-typography-primary h-12 px-4 rounded-xl border border-border-primary"
                            value={formData.default_value || ''}
                            onChangeText={(v) => updateField('default_value', v || undefined)}
                            testID="input-default-value"
                            placeholder={formData.data_type === 'number' ? '0' : 'Default value'}
                            keyboardType={formData.data_type === 'number' ? 'numeric' : 'default'}
                        />
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};
