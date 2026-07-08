import React from 'react';
import { View, Text } from 'react-native';
import { BaseCard } from '@/shared/ui/atoms/base-card';

interface CharacterCardProps {
    name: string;
    race?: string;
    charClass?: string;
    level?: number;
    subtitle?: string;
    detail?: string;
    onPress?: () => void;
}

export const CharacterCard: React.FC<CharacterCardProps> = ({ name, race, charClass, level, subtitle, detail, onPress }) => {
    const summary = subtitle ?? (
        level !== undefined && race && charClass
            ? `Level ${level} ${race} ${charClass}`
            : 'Local character'
    );

    return (
        <BaseCard
            onPress={onPress}
            className="w-full flex-1"
            style={{ padding: 0 }} // Override default padding if needed, but BaseCard uses p-5
        >
            <View className="w-full aspect-square bg-black/40 rounded-lg mb-3 items-center justify-center">
                <Text className="text-accent-primary text-2xl font-bold" style={{ fontFamily: 'Cinzel' }}>
                    {name.charAt(0)}
                </Text>
            </View>
            <View className="flex-1 shrink">
                <Text className="text-sm text-typography-primary font-bold" numberOfLines={1}>
                    {name}
                </Text>
                <Text className="text-xs text-typography-secondary" numberOfLines={2}>
                    {summary}
                </Text>
                {detail && (
                    <Text className="text-xs text-typography-secondary mt-1" numberOfLines={1}>
                        {detail}
                    </Text>
                )}
            </View>
        </BaseCard>
    );
};
