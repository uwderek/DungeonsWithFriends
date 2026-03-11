import React, { useState } from 'react';
import { View, Text, useWindowDimensions, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Settings, LogOut } from 'lucide-react-native';
import { useAuth } from '@/shared/providers/auth-provider';
import { AppSidebar, HamburgerButton } from '@/shared/ui/navigation/app-sidebar';
import { ComponentListView } from './ComponentListView';
import { ComponentEditor } from './ComponentEditor';
import { createComponentDefinition } from '../model/component-store';
import { useStore } from 'tinybase/ui-react';
import { Database } from 'lucide-react-native';
import { CreatorWorkspaceShell } from './creator-workspace-shell';
import { CreatorWorkspaceEmptyState } from './creator-workspace-empty-state';
import { useCreatorWorkspaceState } from '../model/use-creator-workspace-state';

export const CreatorToolsScreen: React.FC<{ 
    onNavigate?: (id: string) => void;
    onSettingsPress?: () => void;
    onSelectSystem?: () => void;
    viewportWidth?: number;
}> = ({ onNavigate, onSettingsPress, onSelectSystem, viewportWidth }) => {
    const { logout } = useAuth();
    const { width: measuredWidth } = useWindowDimensions();
    const width = viewportWidth ?? measuredWidth;
    const isDesktop = width >= 768; // Use same breakpoint as other screens for sidebar logic
    const store = useStore();
    const { selectedElementId, setSelectedElementId } = useCreatorWorkspaceState();

    const [sidebarOpen, setSidebarOpen] = useState(false);

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
                                testID="settings-button"
                                accessibilityRole="button"
                                onPress={() => {
                                    if (onSettingsPress) {
                                        onSettingsPress();
                                    } else {
                                        console.log('Settings clicked');
                                    }
                                }}
                                className="h-10 w-10 rounded-full bg-indigo-950/50 items-center justify-center border border-indigo-900 shadow-sm"
                            >
                                <Settings size={20} color="#9CA3AF" />
                            </TouchableOpacity>

                            <TouchableOpacity
                                testID="logout-button"
                                accessibilityRole="button"
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
                        <Database size={48} color="var(--color-accent-primary)" />
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
            setSelectedElementId(newId);
        }
    };

    const handleDelete = (id: string) => {
        if (selectedElementId === id) {
            setSelectedElementId(null);
        }
    };

    return (
        <SidebarWrapper>
            <CreatorWorkspaceShell
                leftContent={
                    <ComponentListView
                        onCreate={handleCreate}
                        onEdit={setSelectedElementId}
                        onDelete={handleDelete}
                    />
                }
                centerContent={
                    <CreatorWorkspaceEmptyState 
                        onSelectSystem={() => {
                            if (onSelectSystem) {
                                onSelectSystem();
                            } else {
                                console.log('Select System clicked');
                            }
                        }} 
                    />
                }
                rightContent={
                    selectedElementId ? (
                        <ComponentEditor
                            componentId={selectedElementId}
                            onClose={() => setSelectedElementId(null)}
                        />
                    ) : (
                        <View className="flex-1 items-center justify-center p-6">
                            <Text className="text-typography-secondary text-center italic">
                                No element selected
                            </Text>
                        </View>
                    )
                }
            />
        </SidebarWrapper>
    );
};
