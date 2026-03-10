import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface BaseCardProps {
    children?: React.ReactNode;
    onPress?: () => void;
    className?: string; // For NativeWind
    accentColor?: string;
    style?: any;
    title?: string;
    description?: string;
    headerContent?: React.ReactNode;
    footerContent?: React.ReactNode;
}

export const BaseCard: React.FC<BaseCardProps> = ({
    children,
    onPress,
    className = "",
    accentColor,
    style,
    title,
    description,
    headerContent,
    footerContent
}) => {
    const Container = onPress ? TouchableOpacity : View;

    return (
        <Container
            onPress={onPress}
            activeOpacity={onPress ? 0.9 : 1}
            className={`bg-background-secondary border border-border-primary rounded-2xl overflow-hidden ${className}`}
            style={[
                accentColor ? { borderLeftWidth: 4, borderLeftColor: accentColor } : {},
                style
            ]}
        >
            <View className="p-5 flex-1 justify-between">
                {(title || headerContent) && (
                    <View className="mb-2">
                        <View className="flex-row justify-between items-start gap-2">
                            {title && (
                                <View className="flex-1 shrink">
                                    <Text
                                        className="text-xl text-typography-primary font-bold"
                                        style={{ fontFamily: 'Cinzel' }}
                                        numberOfLines={2}
                                    >
                                        {title}
                                    </Text>
                                </View>
                            )}
                            {headerContent}
                        </View>
                        {description && (
                            <Text className="text-typography-secondary text-sm mt-1 shrink" numberOfLines={3}>
                                {description}
                            </Text>
                        )}
                    </View>
                )}

                <View className="flex-1">
                    {children}
                </View>

                {footerContent && (
                    <View className="mt-4">
                        {footerContent}
                    </View>
                )}
            </View>
        </Container>
    );
};
