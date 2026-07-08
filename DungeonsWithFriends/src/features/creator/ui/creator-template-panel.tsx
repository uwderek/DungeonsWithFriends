import React, { useMemo, useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Download, FileJson, Link, Save, Upload, Wand2 } from 'lucide-react-native';
import { useRowIds, useStore } from 'tinybase/ui-react';
import { TABLES } from '@/shared/store/local-store';
import { exportStoreToJson, importStoreFromJson } from '@/shared/store/export-import';
import { saveStoreToPersistence } from '@/shared/store/persistence';
import { useComponentDefinitions } from '../model/component-store';
import {
    FANTASY_D20_TEMPLATE,
    getSelectedSystemTemplate,
    importSystemTemplateJson,
    installBuiltInSystemTemplate,
    SystemTemplateImportError,
} from '../model/system-template-store';
import {
    createTemplateBinding,
    findStaleTemplateBindingIds,
    getBindingsForTemplate,
    TemplateBindingError,
} from '../model/template-binding-store';
import { CreatorWorkspaceEmptyState } from './creator-workspace-empty-state';

interface CreatorTemplatePanelProps {
    onSelectSystem?: () => void;
}

const getErrorMessage = (error: unknown): string => {
    if (error instanceof SystemTemplateImportError || error instanceof TemplateBindingError) {
        return error.message;
    }
    if (error instanceof Error) {
        return error.message;
    }
    return 'The local creator action failed.';
};

export const CreatorTemplatePanel: React.FC<CreatorTemplatePanelProps> = ({ onSelectSystem }) => {
    const store = useStore();
    useRowIds(TABLES.systemTemplates, store);
    useRowIds(TABLES.templateBindings, store);
    useRowIds(TABLES.componentDefinitions, store);

    const components = useComponentDefinitions();
    const [customSystemJson, setCustomSystemJson] = useState('');
    const [snapshotJson, setSnapshotJson] = useState('');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const selectedTemplate = store ? getSelectedSystemTemplate(store) : null;
    const bindings = selectedTemplate && store
        ? getBindingsForTemplate(store, selectedTemplate.system_template_id)
        : [];
    const staleBindingIds = selectedTemplate
        ? findStaleTemplateBindingIds(bindings, selectedTemplate)
        : [];

    const bindingByField = useMemo(() => (
        new Map(bindings.map((binding) => [binding.field_id, binding]))
    ), [bindings]);

    const firstComponent = components[0];

    const clearMessages = () => {
        setErrorMessage(null);
        setSuccessMessage(null);
    };

    const handleUseBuiltInSystem = () => {
        if (!store) return;
        clearMessages();
        try {
            const template = installBuiltInSystemTemplate(store);
            onSelectSystem?.();
            setSuccessMessage(`${template.system_name} selected locally.`);
        } catch (error) {
            setErrorMessage(getErrorMessage(error));
        }
    };

    const handleImportSystemJson = () => {
        if (!store) return;
        clearMessages();
        try {
            const template = importSystemTemplateJson(store, customSystemJson);
            setCustomSystemJson('');
            setSuccessMessage(`${template.system_name} imported locally.`);
        } catch (error) {
            setErrorMessage(getErrorMessage(error));
        }
    };

    const handleBindField = (fieldId: string) => {
        if (!store || !selectedTemplate) return;
        clearMessages();
        if (!firstComponent) {
            setErrorMessage('Create a component before binding fields.');
            return;
        }

        try {
            const binding = createTemplateBinding(store, {
                component_id: firstComponent.component_id,
                system_template_id: selectedTemplate.system_template_id,
                field_id: fieldId,
            });
            setSuccessMessage(`Bound ${firstComponent.display_label} to ${binding.field_id}.`);
        } catch (error) {
            setErrorMessage(getErrorMessage(error));
        }
    };

    const handleCheckpoint = () => {
        if (!store) return;
        clearMessages();
        try {
            const snapshot = saveStoreToPersistence(store);
            setSuccessMessage(`Local checkpoint saved at ${snapshot.exported_at}.`);
        } catch (error) {
            setErrorMessage(getErrorMessage(error));
        }
    };

    const handleExport = () => {
        if (!store) return;
        clearMessages();
        try {
            const exported = exportStoreToJson(store);
            setSnapshotJson(exported);
            setSuccessMessage('Local snapshot exported.');
        } catch (error) {
            setErrorMessage(getErrorMessage(error));
        }
    };

    const handleImportSnapshot = () => {
        if (!store) return;
        clearMessages();
        try {
            importStoreFromJson(store, snapshotJson);
            setSuccessMessage('Local snapshot imported.');
        } catch (error) {
            setErrorMessage(getErrorMessage(error));
        }
    };

    if (!selectedTemplate) {
        return (
            <CreatorWorkspaceEmptyState
                onSelectSystem={handleUseBuiltInSystem}
                customSystemJson={customSystemJson}
                errorMessage={errorMessage}
                successMessage={successMessage}
                onCustomSystemJsonChange={setCustomSystemJson}
                onImportSystemJson={handleImportSystemJson}
            />
        );
    }

    return (
        <ScrollView className="flex-1 bg-background-primary p-6">
            <View className="mb-5">
                <Text className="text-xs uppercase tracking-widest text-accent-primary font-bold">
                    Selected system
                </Text>
                <Text className="text-3xl text-typography-primary font-bold mt-1" style={{ fontFamily: 'Cinzel' }}>
                    {selectedTemplate.system_name}
                </Text>
                <Text className="text-typography-secondary mt-1">
                    Version {selectedTemplate.system_version} - {selectedTemplate.field_definitions.length} fields - {bindings.length} bindings
                </Text>
            </View>

            {(errorMessage || successMessage) && (
                <View className="mb-4">
                    {errorMessage && (
                        <Text className="text-error-500" testID="template-error-message">{errorMessage}</Text>
                    )}
                    {successMessage && (
                        <Text className="text-success-500" testID="template-success-message">{successMessage}</Text>
                    )}
                </View>
            )}

            <View className="flex-row flex-wrap gap-3 mb-6">
                <TouchableOpacity
                    testID="checkpoint-button"
                    onPress={handleCheckpoint}
                    className="flex-row items-center gap-2 bg-background-secondary border border-border-primary px-4 py-3 rounded-xl"
                    accessibilityRole="button"
                >
                    <Save size={16} color="var(--color-accent-primary)" />
                    <Text className="text-typography-primary font-bold">Checkpoint</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    testID="export-button"
                    onPress={handleExport}
                    className="flex-row items-center gap-2 bg-background-secondary border border-border-primary px-4 py-3 rounded-xl"
                    accessibilityRole="button"
                >
                    <Download size={16} color="var(--color-accent-primary)" />
                    <Text className="text-typography-primary font-bold">Export</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    testID="reset-built-in-button"
                    onPress={handleUseBuiltInSystem}
                    className="flex-row items-center gap-2 bg-background-secondary border border-border-primary px-4 py-3 rounded-xl"
                    accessibilityRole="button"
                >
                    <Wand2 size={16} color="var(--color-accent-primary)" />
                    <Text className="text-typography-primary font-bold">{FANTASY_D20_TEMPLATE.system_name}</Text>
                </TouchableOpacity>
            </View>

            {staleBindingIds.length > 0 && (
                <View className="mb-6 bg-background-tertiary border border-error-500 rounded-xl p-4">
                    <Text className="text-error-500 font-bold">Stale bindings need review</Text>
                    <Text className="text-typography-secondary mt-1" testID="stale-binding-warning">
                        {staleBindingIds.join(', ')}
                    </Text>
                </View>
            )}

            <View className="mb-6">
                <View className="flex-row items-center gap-2 mb-3">
                    <Link size={18} color="var(--color-accent-primary)" />
                    <Text className="text-accent-primary font-bold uppercase text-xs tracking-wider">
                        Template fields
                    </Text>
                </View>
                <View className="gap-3">
                    {selectedTemplate.field_definitions.map((field) => {
                        const binding = bindingByField.get(field.field_id);
                        const component = binding
                            ? components.find((item) => item.component_id === binding.component_id)
                            : undefined;

                        return (
                            <View
                                key={field.field_id}
                                className="bg-background-tertiary border border-border-primary rounded-xl p-4"
                            >
                                <View className="flex-row items-center justify-between gap-3">
                                    <View className="flex-1">
                                        <Text className="text-typography-primary font-bold">{field.field_label}</Text>
                                        <Text className="text-typography-secondary text-xs font-mono">{field.field_id} - {field.data_type}</Text>
                                        <Text className="text-typography-secondary mt-1" testID={`binding-summary-${field.field_id}`}>
                                            {component ? `Bound to ${component.display_label}` : 'No component binding yet'}
                                        </Text>
                                    </View>
                                    <TouchableOpacity
                                        testID={`bind-field-${field.field_id}`}
                                        onPress={() => handleBindField(field.field_id)}
                                        className="bg-accent-primary px-4 py-3 rounded-xl"
                                        accessibilityRole="button"
                                    >
                                        <Text className="text-white font-bold">Bind first</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        );
                    })}
                </View>
            </View>

            <View className="mb-6 bg-background-tertiary border border-border-primary rounded-xl p-4">
                <View className="flex-row items-center gap-2 mb-3">
                    <FileJson size={18} color="var(--color-accent-primary)" />
                    <Text className="text-accent-primary font-bold uppercase text-xs tracking-wider">
                        Local snapshot
                    </Text>
                </View>
                <TextInput
                    testID="snapshot-json-input"
                    className="min-h-[150px] bg-background-secondary border border-border-primary rounded-xl p-3 text-typography-primary font-mono text-xs"
                    multiline
                    textAlignVertical="top"
                    value={snapshotJson}
                    onChangeText={setSnapshotJson}
                    placeholder="Exported local JSON appears here. Paste compatible JSON here to import."
                    placeholderTextColor="var(--color-typography-tertiary)"
                    autoCapitalize="none"
                />
                <TouchableOpacity
                    testID="import-snapshot-button"
                    onPress={handleImportSnapshot}
                    className="mt-3 self-start flex-row items-center gap-2 bg-background-secondary border border-accent-primary px-4 py-3 rounded-xl"
                    accessibilityRole="button"
                >
                    <Upload size={16} color="var(--color-accent-primary)" />
                    <Text className="text-accent-primary font-bold">Import Snapshot</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};
