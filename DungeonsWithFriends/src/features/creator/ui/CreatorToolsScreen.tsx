import React, { useState } from 'react';
import { View, Text, useWindowDimensions, TouchableOpacity } from 'react-native';
import { ComponentListView } from './ComponentListView';
import { ComponentEditor } from './ComponentEditor';
import { createComponentDefinition } from '../model/component-store';
import { useStore } from 'tinybase/ui-react';
import { Database, Plus } from 'lucide-react-native';

export const CreatorToolsScreen: React.FC = () => {
    const { width } = useWindowDimensions();
    const isDesktop = width >= 1024;
    const store = useStore();

    const [editingComponentId, setEditingComponentId] = useState<string | null>(null);

    if (!isDesktop) {
        return (
            <View className="flex-1 items-center justify-center p-12 bg-background-primary">
                <View className="mb-6 p-4 bg-background-secondary rounded-full">
                    {React.createElement(Database as any, { size: 48, color: "var(--color-accent-primary)" })}
                </View>
                <Text className="text-2xl text-typography-primary font-bold mb-4 text-center" style={{ fontFamily: 'Cinzel' }}>
                    Desktop Required
                </Text>
                <Text className="text-typography-secondary text-center max-w-md">
                    Creator Tools require a larger screen for the high-density editor.
                    Please switch to a tablet or desktop device to define custom components.
                </Text>
            </View>
        );
    }

    const handleCreate = () => {
        if (store) {
            const newId = createComponentDefinition(store, {});
            setEditingComponentId(newId);
        }
    };

    const handleDelete = (id: string) => {
        if (editingComponentId === id) {
            setEditingComponentId(null);
        }
    };

    return (
        <View className="flex-1 flex-row bg-background-primary">
            {/* Sidebar / List */}
            <View className="w-[400px] border-r border-border-primary bg-background-secondary/30">
                <ComponentListView
                    onCreate={handleCreate}
                    onEdit={setEditingComponentId}
                    onDelete={handleDelete}
                />
            </View>

            {/* Editor Area */}
            <View className="flex-1 bg-background-primary">
                {editingComponentId ? (
                    <ComponentEditor
                        componentId={editingComponentId}
                        onClose={() => setEditingComponentId(null)}
                    />
                ) : (
                    <View className="flex-1 items-center justify-center p-20">
                        <View className="items-center max-w-sm">
                            <View className="mb-8 w-20 h-20 items-center justify-center bg-background-tertiary rounded-3xl border border-border-primary rotate-3">
                                {React.createElement(Database as any, { size: 40, color: "var(--color-typography-tertiary)" })}
                            </View>
                            <Text className="text-2xl text-typography-primary font-bold mb-3 text-center" style={{ fontFamily: 'Cinzel' }}>
                                Component Architect
                            </Text>
                            <Text className="text-typography-secondary text-center mb-10">
                                Select a component from the library to refine its properties,
                                or create a new definition from scratch.
                            </Text>

                            <TouchableOpacity
                                onPress={handleCreate}
                                className="flex-row items-center space-x-3 bg-accent-primary px-8 py-4 rounded-2xl shadow-lg shadow-accent-primary/20"
                            >
                                {React.createElement(Plus as any, { size: 20, color: "white", strokeWidth: 2.5 })}
                                <Text className="text-white font-bold text-lg">Create New Component</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </View>
        </View>
    );
};
