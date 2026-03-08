import React from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { Home, Swords, Users, Users2, Settings } from 'lucide-react-native';

interface BottomTabBarProps {
    activeTab: 'home' | 'campaigns' | 'characters' | 'friends' | 'settings';
    onTabPress: (tab: any) => void;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({ activeTab, onTabPress }) => {
    const tabs = [
        { id: 'home', label: 'Home', Icon: Home },
        { id: 'campaigns', label: 'Campaigns', Icon: Swords },
        { id: 'characters', label: 'Characters', Icon: Users },
        { id: 'friends', label: 'Friends', Icon: Users2 },
        { id: 'settings', label: 'Settings', Icon: Settings },
    ] as const;

    const isDesktop = Platform.OS === 'web' && typeof window !== 'undefined' && window.innerWidth > 1024;

    const containerStyle = isDesktop
        ? "absolute left-0 top-0 bottom-0 w-64 bg-background-secondary border-r border-border-primary pt-10"
        : "absolute bottom-0 left-0 right-0 h-20 bg-background-secondary/80 border-t border-border-primary flex-row items-center justify-around px-2 pb-2";

    return (
        <View className={containerStyle} style={!isDesktop ? { backdropFilter: 'blur(12px)' } as any : {}}>
            {tabs.map(({ id, label, Icon }) => {
                const isActive = activeTab === id;
                return (
                    <TouchableOpacity
                        key={id}
                        onPress={() => onTabPress(id)}
                        className={`items-center justify-center ${isDesktop ? 'flex-row justify-start px-6 py-4 space-x-4' : 'flex-1 h-full'}`}
                        activeOpacity={0.7}
                    >
                        <View className={isActive ? "text-accent-primary" : "text-typography-secondary"}>
                            {React.createElement(Icon as any, {
                                size: 24,
                                color: isActive ? "var(--color-accent-primary)" : "var(--color-text-secondary)",
                                strokeWidth: isActive ? 2.5 : 2
                            })}
                        </View>
                        {isDesktop && (
                            <Text className={`font-bold ${isActive ? 'text-typography-primary' : 'text-typography-secondary'}`}>
                                {label}
                            </Text>
                        )}
                        {!isDesktop && (
                            <Text className={`text-[10px] mt-1 ${isActive ? 'text-accent-primary font-bold' : 'text-typography-secondary'}`}>
                                {label}
                            </Text>
                        )}
                        {isActive && !isDesktop && (
                            <View className="absolute bottom-1 w-1 h-1 rounded-full bg-accent-primary" />
                        )}
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};
