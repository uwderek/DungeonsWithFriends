import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Database, FileJson, Plus } from 'lucide-react-native';

interface CreatorWorkspaceEmptyStateProps {
    onSelectSystem: () => void;
    customSystemJson?: string;
    errorMessage?: string | null;
    successMessage?: string | null;
    onCustomSystemJsonChange?: (value: string) => void;
    onImportSystemJson?: () => void;
}

export const CreatorWorkspaceEmptyState: React.FC<CreatorWorkspaceEmptyStateProps> = ({
    onSelectSystem,
    customSystemJson,
    errorMessage,
    successMessage,
    onCustomSystemJsonChange,
    onImportSystemJson
}) => {
    const canImport = onCustomSystemJsonChange && onImportSystemJson;

    return (
        <View className="flex-1 items-center justify-center p-12">
            <View className="items-center w-full max-w-xl">
                <View className="mb-6 w-20 h-20 items-center justify-center bg-background-tertiary rounded-3xl border border-border-primary rotate-3">
                    <Database size={40} color="var(--color-typography-tertiary)" />
                </View>
                <Text className="text-2xl text-typography-primary font-bold mb-3 text-center" style={{ fontFamily: 'Cinzel' }}>
                    Sheet Authoring Canvas
                </Text>
                <Text className="text-typography-secondary text-center mb-8">
                    Before you can place elements, you must bind this sheet to a game system or upload a custom JSON schema.
                </Text>

                <View className="w-full flex-row flex-wrap items-center justify-center gap-3 mb-5">
                    <TouchableOpacity
                        onPress={onSelectSystem}
                        testID="select-system-button"
                        className="flex-row items-center gap-3 bg-accent-primary px-6 py-4 rounded-xl shadow-lg shadow-accent-primary/20"
                        accessibilityRole="button"
                        accessibilityLabel="Use built-in fantasy d20 system"
                    >
                        <Plus size={20} color="white" strokeWidth={2.5} />
                        <Text className="text-white font-bold text-base">Use Fantasy d20</Text>
                    </TouchableOpacity>
                </View>

                {canImport && (
                    <View className="w-full bg-background-tertiary border border-border-primary rounded-2xl p-4">
                        <View className="flex-row items-center gap-2 mb-3">
                            <FileJson size={18} color="var(--color-accent-primary)" />
                            <Text className="text-accent-primary font-bold uppercase text-xs tracking-wider">
                                Custom system JSON
                            </Text>
                        </View>
                        <TextInput
                            testID="custom-system-json-input"
                            className="min-h-[132px] bg-background-secondary border border-border-primary rounded-xl p-3 text-typography-primary font-mono text-xs"
                            multiline
                            textAlignVertical="top"
                            value={customSystemJson}
                            onChangeText={onCustomSystemJsonChange}
                            placeholder="Paste a system template JSON envelope here"
                            placeholderTextColor="var(--color-typography-tertiary)"
                            autoCapitalize="none"
                        />
                        {errorMessage && (
                            <Text className="text-error-500 mt-2 text-sm" testID="template-error-message">
                                {errorMessage}
                            </Text>
                        )}
                        {successMessage && (
                            <Text className="text-success-500 mt-2 text-sm" testID="template-success-message">
                                {successMessage}
                            </Text>
                        )}
                        <TouchableOpacity
                            onPress={onImportSystemJson}
                            testID="import-system-json-button"
                            className="mt-3 self-start bg-background-secondary border border-accent-primary px-4 py-3 rounded-xl"
                            accessibilityRole="button"
                            accessibilityLabel="Import custom system JSON"
                        >
                            <Text className="text-accent-primary font-bold">Import JSON</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </View>
    );
};
