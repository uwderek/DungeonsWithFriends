import React from 'react';
import { View, Text } from 'react-native';
import { BaseCard } from '@/shared/ui/atoms/base-card';

interface CampaignCardProps {
    title: string;
    description: string;
    nextSession?: string;
    onPress?: () => void;
}

export const CampaignCard: React.FC<CampaignCardProps> = ({ title, description, nextSession, onPress }) => {
    const footer = nextSession ? (
        <View className="flex-row items-center justify-between">
            <View className="bg-accent-primary/20 px-3 py-1 rounded-full">
                <Text className="text-accent-primary text-xs font-bold uppercase tracking-widest">
                    Next Session
                </Text>
            </View>
            <Text className="text-typography-secondary text-xs">{nextSession}</Text>
        </View>
    ) : undefined;

    return (
        <BaseCard
            title={title}
            description={description}
            onPress={onPress}
            className="w-72 h-48 mr-4"
            footerContent={footer}
        >
            {/* Additional custom content could go here */}
        </BaseCard>
    );
};
