import React from 'react';
import { View, Text } from 'react-native';
import { BaseCard } from '@/shared/ui/atoms/base-card';

interface StoryCardProps {
    title: string;
    excerpt: string;
    date: string;
    onPress?: () => void;
}

export const StoryCard: React.FC<StoryCardProps> = ({ title, excerpt, date, onPress }) => {
    return (
        <BaseCard
            onPress={onPress}
            title={title}
            className="mb-4"
            accentColor="var(--color-accent-secondary)"
            headerContent={<Text className="text-typography-secondary text-xs">{date}</Text>}
        >
            <Text className="text-typography-secondary text-sm italic" numberOfLines={2}>
                "{excerpt}"
            </Text>
        </BaseCard>
    );
};
