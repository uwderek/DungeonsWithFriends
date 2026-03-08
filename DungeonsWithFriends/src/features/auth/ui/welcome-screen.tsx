import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LogIn, UserPlus, WifiOff, Sword } from 'lucide-react-native';

interface WelcomeScreenProps {
    onLogin: () => void;
    onRegister: () => void;
    onContinueOffline: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onLogin, onRegister, onContinueOffline }) => {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#000000' }}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 }}>
                {/* Brand / Logo */}
                <View style={{ alignItems: 'center', marginBottom: 48 }}>
                    <View
                        style={{
                            height: 64,
                            width: 64,
                            borderRadius: 16,
                            backgroundColor: '#D97706',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: 24
                        }}
                    >
                        <Sword size={32} color="#FFFFFF" />
                    </View>
                    <Text
                        style={{
                            fontFamily: 'Cinzel',
                            fontSize: 36,
                            fontWeight: '700',
                            color: '#FFFFFF',
                            letterSpacing: 2
                        }}
                    >
                        DUNGEONS
                    </Text>
                    <Text
                        style={{
                            fontFamily: 'Cinzel',
                            fontSize: 18,
                            color: '#D97706',
                            letterSpacing: 4,
                            textTransform: 'uppercase'
                        }}
                    >
                        With Friends
                    </Text>
                </View>

                {/* Narrative Subtitle */}
                <Text
                    style={{
                        textAlign: 'center',
                        color: '#9CA3AF',
                        fontSize: 16,
                        marginBottom: 48,
                        paddingHorizontal: 16,
                        fontStyle: 'italic'
                    }}
                >
                    Your adventure begins here. Gather your companions and delve into the depths.
                </Text>
            </View>

            {/* Actions Section - Bottom Anchored */}
            <View style={{ paddingHorizontal: 24, paddingBottom: 48, gap: 12 }}>
                <TouchableOpacity
                    onPress={onLogin}
                    activeOpacity={0.7}
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#D97706',
                        height: 56,
                        borderRadius: 8,
                        gap: 8
                    }}
                >
                    <LogIn size={20} color="#000000" />
                    <Text
                        style={{
                            color: '#000000',
                            fontWeight: '600',
                            fontSize: 16
                        }}
                    >
                        Login
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={onRegister}
                    activeOpacity={0.7}
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderWidth: 1,
                        borderColor: '#D97706',
                        height: 56,
                        borderRadius: 8,
                        gap: 8
                    }}
                >
                    <UserPlus size={20} color="#D97706" />
                    <Text
                        style={{
                            color: '#D97706',
                            fontWeight: '600',
                            fontSize: 16
                        }}
                    >
                        Register
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={onContinueOffline}
                    activeOpacity={0.7}
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: 48,
                        gap: 8
                    }}
                >
                    <WifiOff size={18} color="#6B7280" />
                    <Text
                        style={{
                            color: '#6B7280',
                            fontWeight: '500',
                            fontSize: 14
                        }}
                    >
                        Continue Offline
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};
