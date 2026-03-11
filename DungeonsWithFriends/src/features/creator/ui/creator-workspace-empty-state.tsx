import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Database, Plus } from 'lucide-react-native';

interface CreatorWorkspaceEmptyStateProps {
    onSelectSystem: () => void;
}

export const CreatorWorkspaceEmptyState: React.FC<CreatorWorkspaceEmptyStateProps> = ({
    onSelectSystem
}) => {
    return (
        <View className="flex-1 items-center justify-center p-20">
            <View className="items-center max-w-sm">
                <View className="mb-8 w-20 h-20 items-center justify-center bg-background-tertiary rounded-3xl border border-border-primary rotate-3">
                    <Database size={40} color="var(--color-typography-tertiary)" />
                </View>
                <Text className="text-2xl text-typography-primary font-bold mb-3 text-center" style={{ fontFamily: 'Cinzel' }}>
                    Sheet Authoring Canvas
                </Text>
                <Text className="text-typography-secondary text-center mb-10">
                    Before you can place elements, you must bind this sheet to a game system or upload a custom JSON schema.
                </Text>

                <TouchableOpacity
                    onPress={onSelectSystem}
                    testID="select-system-button"
                    className="flex-row items-center gap-3 bg-accent-primary px-8 py-4 rounded-2xl shadow-lg shadow-accent-primary/20"
                    accessibilityRole="button"
                    accessibilityLabel="Select Game System"
                >
                    <Plus size={20} color="white" strokeWidth={2.5} />
                    <Text className="text-white font-bold text-lg">Select Game System</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};
