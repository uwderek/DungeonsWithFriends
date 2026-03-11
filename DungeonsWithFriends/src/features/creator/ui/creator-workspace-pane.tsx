import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';

interface CreatorWorkspacePaneProps {
    title: string;
    width: number;
    isCollapsed: boolean;
    onToggle: () => void;
    side: 'left' | 'right';
    children: React.ReactNode;
}

export const CreatorWorkspacePane: React.FC<CreatorWorkspacePaneProps> = ({
    title,
    width,
    isCollapsed,
    onToggle,
    side,
    children
}) => {
    return (
        <View 
            style={{ width: isCollapsed ? 48 : width }}
            className={`h-full border-border-primary bg-background-secondary/30 transition-all duration-300 ${
                side === 'left' ? 'border-r' : 'border-l'
            }`}
        >
            <View className={`h-12 flex-row items-center px-3 border-b border-border-primary ${
                isCollapsed ? 'justify-center' : 'justify-between'
            }`}>
                {!isCollapsed && (
                    <Text className="text-xs font-bold text-typography-secondary uppercase tracking-widest">
                        {title}
                    </Text>
                )}
                <TouchableOpacity 
                    onPress={onToggle}
                    testID="pane-toggle-button"
                    className="p-1.5 rounded-lg bg-background-tertiary border border-border-primary"
                    accessibilityLabel={isCollapsed ? `Expand ${title}` : `Collapse ${title}`}
                    accessibilityRole="button"
                >
                    {side === 'left' ? (
                        isCollapsed ? <ChevronRight size={16} color="var(--color-typography-secondary)" /> : <ChevronLeft size={16} color="var(--color-typography-secondary)" />
                    ) : (
                        isCollapsed ? <ChevronLeft size={16} color="var(--color-typography-secondary)" /> : <ChevronRight size={16} color="var(--color-typography-secondary)" />
                    )}
                </TouchableOpacity>
            </View>
            
            {!isCollapsed && (
                <View className="flex-1">
                    {children}
                </View>
            )}
        </View>
    );
};
