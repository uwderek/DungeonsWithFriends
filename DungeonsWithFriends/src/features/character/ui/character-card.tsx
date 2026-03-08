import React from 'react';
import { View, Text } from 'react-native';
import { BaseCard } from '@/shared/ui/atoms/base-card';

interface CharacterCardProps {
    name: string;
    race: string;
    charClass: string;
    level: number;
    onPress?: () => void;
}

export const CharacterCard: React.FC<CharacterCardProps> = ({ name, race, charClass, level, onPress }) => {
    return (
        <BaseCard
            onPress={onPress}
            className="w-40 mr-3"
            style={{ padding: 0 }} // Override default padding if needed, but BaseCard uses p-5
        >
            <View className="w-full aspect-square bg-black/40 rounded-lg mb-3 items-center justify-center">
                <Text className="text-accent-primary text-2xl font-bold" style={{ fontFamily: 'Cinzel' }}>
                    {name.charAt(0)}
                </Text>
            </View>
            <Text className="text-sm text-typography-primary font-bold" numberOfLines={1}>
                {name}
            </Text>
            <Text className="text-xs text-typography-secondary">
                Level {level} {race} {charClass}
            </Text>
        </BaseCard>
    );
};
