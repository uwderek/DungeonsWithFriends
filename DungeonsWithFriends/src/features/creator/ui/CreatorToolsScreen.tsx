import React, { useState } from 'react';
import { View, Text, useWindowDimensions, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Settings, LogOut } from 'lucide-react-native';
import { useAuth } from '@/shared/providers/auth-provider';
import { AppSidebar, HamburgerButton } from '@/shared/ui/navigation/app-sidebar';
import { ComponentListView } from './ComponentListView';
import { ComponentEditor } from './ComponentEditor';
import { createComponentDefinition } from '../model/component-store';
import { useStore } from 'tinybase/ui-react';
import { Database, Plus } from 'lucide-react-native';

export const CreatorToolsScreen: React.FC<{ onNavigate?: (id: string) => void }> = ({ onNavigate }) => {
    const { logout } = useAuth();
    const { width } = useWindowDimensions();
    const isDesktop = width >= 768; // Use same breakpoint as other screens for sidebar logic
    const store = useStore();

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [editingComponentId, setEditingComponentId] = useState<string | null>(null);

    const isLargeScreen = width >= 1024; // Original check for creator tools density

    const SidebarWrapper = ({ children }: { children: React.ReactNode }) => (
        <SafeAreaView className="flex-1 bg-black">
            <View className="flex-1 flex-row">
                <AppSidebar
                    isOpen={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                    activeId="creator"
                    onNavigate={onNavigate}
                />
                <View className="flex-1">
                    {/* Header */}
                    <View className="h-14 flex-row items-center justify-between px-4 border-b border-indigo-900 bg-black/50 backdrop-blur-md">
                        <View className="flex-row items-center gap-3">
                            {!isDesktop && (
                                <HamburgerButton onPress={() => setSidebarOpen(true)} />
                            )}
                            <Text className="text-sm text-typography-secondary uppercase tracking-widest font-medium">
                                Creator Tools
                            </Text>
                        </View>

                        <View className="flex-row gap-3">
                            <TouchableOpacity
                                onPress={() => console.log('Settings clicked')}
                                className="h-10 w-10 rounded-full bg-indigo-950/50 items-center justify-center border border-indigo-900 shadow-sm"
                            >
                                <Settings size={20} color="#9CA3AF" />
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={logout}
                                className="h-10 w-10 rounded-full bg-indigo-950/50 items-center justify-center border border-indigo-900 shadow-sm"
                            >
                                <LogOut size={18} color="#DC2626" />
                            </TouchableOpacity>
                        </View>
                    </View>
                    {children}
                </View>
            </View>
        </SafeAreaView>
    );

    if (!isLargeScreen) {
        return (
            <SidebarWrapper>
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
            </SidebarWrapper>
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
        <SidebarWrapper>
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
        </SidebarWrapper>
    );
};
