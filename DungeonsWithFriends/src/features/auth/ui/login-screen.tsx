import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, LogIn } from 'lucide-react-native';
import { useAuth } from '@/shared/providers/auth-provider';
import { loginSchema, LoginData } from '../model/auth-schemas';

interface LoginScreenProps {
    onBack: () => void;
    onForgotPassword: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onBack, onForgotPassword }) => {
    const { login } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<Partial<Record<keyof LoginData, string>>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);

    const handleLogin = async () => {
        setErrors({});
        setServerError(null);

        const result = loginSchema.safeParse({
            email,
            password,
        });

        if (!result.success) {
            const formattedErrors: any = {};
            result.error.issues.forEach((issue) => {
                if (issue.path[0]) {
                    formattedErrors[issue.path[0]] = issue.message;
                }
            });
            setErrors(formattedErrors);
            return;
        }

        setIsSubmitting(true);
        try {
            await login(email, password);
            // On success, the AuthProvider state change will trigger App.tsx to redirect
        } catch (err: any) {
            setServerError(err.message || 'Login failed. Please check your credentials.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#000000' }}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                    <View className="px-6 pt-4">
                        <TouchableOpacity onPress={onBack} className="w-10 h-10 items-center justify-center">
                            <ChevronLeft size={28} color="#D97706" />
                        </TouchableOpacity>
                    </View>

                    <View className="flex-1 px-6 pt-8">
                        <Text className="text-3xl text-white font-bold mb-2" style={{ fontFamily: 'Cinzel' }}>
                            Welcome Back
                        </Text>
                        <Text className="text-gray-400 mb-8">
                            Ready to continue your adventure?
                        </Text>

                        <View className="space-y-6">
                            <View>
                                <Text className="text-amber-600 text-sm mb-2 font-medium">Email Address</Text>
                                <TextInput
                                    placeholder="Enter your email"
                                    placeholderTextColor="#6B7280"
                                    value={email}
                                    onChangeText={setEmail}
                                    autoCapitalize="none"
                                    keyboardType="email-address"
                                    style={{ backgroundColor: '#1E1B4B', color: '#FFFFFF', height: 56, paddingHorizontal: 16, borderRadius: 8, borderWidth: 1, borderColor: '#312E81' }}
                                />
                                {errors.email && <Text className="text-red-500 text-xs mt-1">{errors.email}</Text>}
                            </View>

                            <View>
                                <Text className="text-amber-600 text-sm mb-2 font-medium">Password</Text>
                                <TextInput
                                    placeholder="Enter your password"
                                    placeholderTextColor="#6B7280"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry
                                    style={{ backgroundColor: '#1E1B4B', color: '#FFFFFF', height: 56, paddingHorizontal: 16, borderRadius: 8, borderWidth: 1, borderColor: '#312E81' }}
                                />
                                {errors.password && <Text className="text-red-500 text-xs mt-1">{errors.password}</Text>}
                            </View>

                            <TouchableOpacity
                                onPress={onForgotPassword}
                                className="self-end"
                            >
                                <Text className="text-amber-600 text-sm font-medium">Forgot Password?</Text>
                            </TouchableOpacity>
                        </View>

                        {serverError && (
                            <View style={{ marginTop: 24, backgroundColor: 'rgba(220, 38, 38, 0.2)', borderWidth: 1, borderColor: 'rgba(220, 38, 38, 0.5)', padding: 16, borderRadius: 8 }}>
                                <Text className="text-red-400 text-sm text-center">{serverError}</Text>
                            </View>
                        )}
                    </View>

                    <View className="p-6 pb-12">
                        <TouchableOpacity
                            onPress={handleLogin}
                            disabled={isSubmitting}
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: 56,
                                borderRadius: 8,
                                backgroundColor: isSubmitting ? '#92400E' : '#D97706'
                            }}
                            activeOpacity={0.8}
                        >
                            <LogIn size={20} color="#000000" />
                            <Text className="text-black font-bold text-lg ml-2">
                                {isSubmitting ? 'Verifying...' : 'Login'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};
