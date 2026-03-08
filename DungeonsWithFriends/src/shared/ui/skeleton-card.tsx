import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';

export const SkeletonCard: React.FC = () => {
    const shimmerAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(shimmerAnim, {
                    toValue: 1,
                    duration: 1500,
                    useNativeDriver: true,
                }),
                Animated.timing(shimmerAnim, {
                    toValue: 0,
                    duration: 0,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, [shimmerAnim]);

    const translateX = shimmerAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [-200, 200],
    });

    return (
        <View className="w-48 h-48 rounded-2xl bg-background-secondary border border-border-primary overflow-hidden mr-6">
            <Animated.View
                style={{
                    transform: [{ translateX }],
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                }}
            />
            <View className="absolute bottom-4 left-4 right-4">
                <View className="h-4 w-2/3 bg-background-primary/50 rounded mb-2" />
                <View className="h-3 w-1/2 bg-background-primary/50 rounded" />
            </View>
        </View>
    );
};
