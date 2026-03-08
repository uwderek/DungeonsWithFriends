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
        <SafeAreaView className="flex-1 bg-background-primary">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                    <View className="px-6 pt-4">
                        <TouchableOpacity onPress={onBack} className="w-10 h-10 items-center justify-center">
                            {React.createElement(ChevronLeft as any, { size: 28, color: "var(--color-accent-primary)" })}
                        </TouchableOpacity>
                    </View>

                    <View className="flex-1 px-6 pt-8">
                        <Text className="text-3xl text-typography-primary font-bold mb-2" style={{ fontFamily: 'Cinzel' }}>
                            Welcome Back
                        </Text>
                        <Text className="text-typography-secondary mb-8">
                            Ready to continue your adventure?
                        </Text>

                        <View className="space-y-6">
                            <View>
                                <Text className="text-accent-primary text-sm mb-2 font-medium">Email Address</Text>
                                <TextInput
                                    placeholder="Enter your email"
                                    placeholderTextColor="var(--color-text-secondary)"
                                    value={email}
                                    onChangeText={setEmail}
                                    autoCapitalize="none"
                                    keyboardType="email-address"
                                    className="bg-background-secondary text-typography-primary h-14 px-4 rounded-xl border border-border-primary"
                                />
                                {errors.email && <Text className="text-red-500 text-xs mt-1">{errors.email}</Text>}
                            </View>

                            <View>
                                <Text className="text-accent-primary text-sm mb-2 font-medium">Password</Text>
                                <TextInput
                                    placeholder="Enter your password"
                                    placeholderTextColor="var(--color-text-secondary)"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry
                                    className="bg-background-secondary text-typography-primary h-14 px-4 rounded-xl border border-border-primary"
                                />
                                {errors.password && <Text className="text-red-500 text-xs mt-1">{errors.password}</Text>}
                            </View>

                            <TouchableOpacity
                                onPress={onForgotPassword}
                                className="self-end"
                            >
                                <Text className="text-accent-primary text-sm font-medium">Forgot Password?</Text>
                            </TouchableOpacity>
                        </View>

                        {serverError && (
                            <View className="mt-6 bg-red-900/30 border border-red-500/50 p-4 rounded-xl">
                                <Text className="text-red-200 text-sm text-center">{serverError}</Text>
                            </View>
                        )}
                    </View>

                    <View className="p-6 pb-12">
                        <TouchableOpacity
                            onPress={handleLogin}
                            disabled={isSubmitting}
                            className={`flex-row items-center justify-center h-14 rounded-xl ${isSubmitting ? 'bg-indigo-800' : 'bg-accent-primary'}`}
                            activeOpacity={0.8}
                        >
                            {React.createElement(LogIn as any, { size: 20, color: "white", className: "mr-2" })}
                            <Text className="text-typography-primary font-bold text-lg">
                                {isSubmitting ? 'Verifying...' : 'Login'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};
