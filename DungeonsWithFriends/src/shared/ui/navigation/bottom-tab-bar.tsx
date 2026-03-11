import React from 'react';
import { View, Text, TouchableOpacity, Platform, useWindowDimensions } from 'react-native';
import { Home, Swords, Users, Users2, Database, Settings } from 'lucide-react-native';

interface BottomTabBarProps {
    activeTab: 'home' | 'campaigns' | 'characters' | 'friends' | 'creator' | 'settings';
    onTabPress: (tab: any) => void;
    viewportWidth?: number;
    platformOverride?: typeof Platform.OS;
}

const DESKTOP_BREAKPOINT = 1024;

export const BottomTabBar: React.FC<BottomTabBarProps> = ({ 
    activeTab, 
    onTabPress,
    viewportWidth,
    platformOverride
}) => {
    const tabs = [
        { id: 'home', label: 'Home', Icon: Home },
        { id: 'campaigns', label: 'Campaigns', Icon: Swords },
        { id: 'characters', label: 'Characters', Icon: Users },
        { id: 'friends', label: 'Friends', Icon: Users2 },
        { id: 'creator', label: 'Creator', Icon: Database },
        { id: 'settings', label: 'Settings', Icon: Settings },
    ] as const;

    const { width: measuredWidth } = useWindowDimensions();
    const width = viewportWidth ?? measuredWidth;
    const platform = platformOverride ?? Platform.OS;
    const isDesktop = platform === 'web' && width >= DESKTOP_BREAKPOINT;

    const containerStyle = isDesktop
        ? "absolute left-0 top-0 bottom-0 w-64 bg-background-tertiary border-r border-border-primary pt-8 flex-col"
        : "absolute bottom-0 left-0 right-0 h-20 bg-background-secondary/80 border-t border-border-primary flex-row items-center justify-around px-2 pb-2";

    return (
        <View className={containerStyle} style={!isDesktop ? { backdropFilter: 'blur(12px)' } as any : {}}>
            {isDesktop && (
                <View className="px-6 mb-12">
                    <Text className="text-2xl text-accent-primary font-bold tracking-widest" style={{ fontFamily: 'Cinzel' }}>
                        Dungeons
                    </Text>
                    <Text className="text-sm text-typography-tertiary uppercase tracking-[0.2em] -mt-1">
                        With Friends
                    </Text>
                    <View className="h-[2px] w-12 bg-accent-primary mt-4 opacity-50" />
                </View>
            )}
            <View className={isDesktop ? "flex-1 space-y-2" : "flex-row flex-1 items-center justify-around"}>
                {tabs.map(({ id, label, Icon }) => {
                    const isActive = activeTab === id;
                    return (
                        <TouchableOpacity
                            key={id}
                            onPress={() => onTabPress(id)}
                            testID={`tab-item-${id}`}
                            className={`items-center justify-center ${isDesktop ? 'flex-row justify-start px-6 py-4 mx-2 rounded-2xl' : 'flex-1 h-full'}`}
                            activeOpacity={0.7}
                            style={isDesktop && isActive ? { backgroundColor: 'var(--color-background-secondary)' } : {}}
                        >
                            <View className={isActive ? "text-accent-primary" : "text-typography-secondary"}>
                                {React.createElement(Icon as any, {
                                    size: 24,
                                    color: isActive ? "var(--color-accent-primary)" : "var(--color-text-secondary)",
                                    strokeWidth: isActive ? 2.5 : 2
                                })}
                            </View>
                            {isDesktop && (
                                <Text className={`ml-4 font-bold ${isActive ? 'text-typography-primary' : 'text-typography-secondary'}`}>
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

            {isDesktop && (
                <View className="p-6 border-t border-border-primary/30">
                    <View className="flex-row items-center space-x-3">
                        <View className="w-8 h-8 rounded-full bg-background-tertiary items-center justify-center border border-accent-primary/20">
                            <Text className="text-[10px] text-accent-primary font-bold">DM</Text>
                        </View>
                        <View>
                            <Text className="text-xs text-typography-primary font-medium">Dungeon Master</Text>
                            <Text className="text-[10px] text-typography-tertiary">Pro Account</Text>
                        </View>
                    </View>
                </View>
            )}
        </View>
    );
};
