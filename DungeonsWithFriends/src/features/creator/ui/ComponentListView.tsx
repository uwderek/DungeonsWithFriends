import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Plus, Database, FileCode, Trash2 } from 'lucide-react-native';
import { useComponentDefinitions } from '../model/component-store';
import { BaseCard } from '../../../shared/ui/atoms/base-card';

interface ComponentListViewProps {
    onCreate: () => void;
    onEdit: (id: string) => void;
}

export const ComponentListView: React.FC<ComponentListViewProps> = ({ onCreate, onEdit }) => {
    const components = useComponentDefinitions();

    return (
        <ScrollView className="flex-1 bg-background-primary p-6">
            <View className="flex-row justify-between items-center mb-6">
                <View>
                    <Text className="text-3xl text-typography-primary font-bold" style={{ fontFamily: 'Cinzel' }}>
                        Component Vault
                    </Text>
                    <Text className="text-typography-secondary text-sm">
                        Define custom data structures for your campaigns
                    </Text>
                </View>
                <TouchableOpacity
                    onPress={onCreate}
                    className="bg-accent-primary p-3 rounded-full flex-row items-center space-x-2"
                >
                    {React.createElement(Plus as any, { size: 24, color: "var(--color-background-primary)" })}
                    <Text className="text-background-primary font-bold mr-1">Create Component</Text>
                </TouchableOpacity>
            </View>

            {components.length === 0 ? (
                <View className="mt-20 items-center justify-center p-8 border-2 border-dashed border-border-primary rounded-3xl opacity-60">
                    {React.createElement(Database as any, { size: 64, color: "var(--color-typography-secondary)", strokeWidth: 1 })}
                    <Text className="text-typography-primary text-xl font-bold mt-4">No components defined</Text>
                    <Text className="text-typography-secondary text-center mt-2 mb-6">
                        Start by creating your first custom data component to use in character sheets and stories.
                    </Text>
                    <TouchableOpacity
                        onPress={onCreate}
                        className="bg-background-secondary border border-accent-primary px-6 py-3 rounded-xl"
                    >
                        <Text className="text-accent-primary font-bold">Create First Component</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View className="flex-row flex-wrap -m-2">
                    {components.map((comp) => (
                        <View key={comp.component_id} className="w-full md:w-1/2 lg:w-1/3 p-2">
                            <BaseCard
                                title={comp.display_label}
                                description={comp.component_name}
                                onPress={() => onEdit(comp.component_id)}
                                accentColor="var(--color-accent-primary)"
                                headerContent={
                                    <View className="bg-background-tertiary p-2 rounded-lg">
                                        {React.createElement(FileCode as any, { size: 18, color: "var(--color-accent-primary)" })}
                                    </View>
                                }
                            >
                                <View className="mt-2 py-1 px-3 bg-background-tertiary rounded-full self-start">
                                    <Text className="text-typography-secondary text-xs font-mono uppercase">
                                        {comp.data_type}
                                    </Text>
                                </View>
                            </BaseCard>
                        </View>
                    ))}
                </View>
            )}
        </ScrollView>
    );
};
