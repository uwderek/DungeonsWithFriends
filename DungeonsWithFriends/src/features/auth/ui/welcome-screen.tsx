import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LogIn, UserPlus, WifiOff } from 'lucide-react-native';
import { useAuth } from '@/shared/providers/auth-provider';

interface WelcomeScreenProps {
    onLogin: () => void;
    onRegister: () => void;
    onContinueOffline: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onLogin, onRegister, onContinueOffline }) => {
    const { login } = useAuth(); // We'll keep this if we need other auth info, though login is a method

    return (
        <SafeAreaView className="flex-1 bg-background-primary">
            <View className="flex-1 px-6 justify-center items-center">
                {/* Brand / Logo Placeholder */}
                <View className="mb-12 items-center">
                    <Text className="text-4xl text-typography-primary font-bold tracking-tighter" style={{ fontFamily: 'Cinzel' }}>
                        DUNGEONS
                    </Text>
                    <Text className="text-lg text-accent-primary tracking-widest uppercase" style={{ fontFamily: 'Cinzel' }}>
                        With Friends
                    </Text>
                </View>

                {/* Narrative Subtitle */}
                <Text className="text-center text-typography-secondary mb-12 px-4 italic">
                    Your adventure begins here. Gather your companions and delve into the depths.
                </Text>
            </View>

            {/* Actions Section - Bottom Anchored */}
            <View className="px-6 pb-12 space-y-4">
                <TouchableOpacity
                    onPress={onLogin}
                    className="flex-row items-center justify-center bg-indigo-600 h-14 rounded-xl"
                    activeOpacity={0.7}
                >
                    {React.createElement(LogIn as any, { size: 20, color: "var(--color-typography-primary)", className: "mr-2" })}
                    <Text className="text-typography-primary font-semibold text-lg">Login</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={onRegister}
                    className="flex-row items-center justify-center border border-accent-primary/50 h-14 rounded-xl"
                    activeOpacity={0.7}
                >
                    {React.createElement(UserPlus as any, { size: 20, color: "var(--color-accent-primary)", className: "mr-2" })}
                    <Text className="text-accent-primary font-semibold text-lg">Register</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={onContinueOffline}
                    className="flex-row items-center justify-center h-14"
                    activeOpacity={0.7}
                >
                    {React.createElement(WifiOff as any, { size: 18, color: "var(--color-text-secondary)", className: "mr-2" })}
                    <Text className="text-typography-secondary font-medium">Continue Offline</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};
