import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, UserPlus } from 'lucide-react-native';
import { useAuth } from '@/shared/providers/auth-provider';
import { registrationSchema, RegistrationData } from '../model/auth-schemas';

interface RegisterScreenProps {
    onBack: () => void;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({ onBack }) => {
    const { register } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isAgeVerified, setIsAgeVerified] = useState(false);
    const [errors, setErrors] = useState<Partial<Record<keyof RegistrationData, string>>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);

    const handleRegister = async () => {
        setErrors({});
        setServerError(null);

        const result = registrationSchema.safeParse({
            email,
            password,
            is_age_verified: isAgeVerified,
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
            await register(email, password);
        } catch (err: any) {
            setServerError(err.message || 'Registration failed. Please try again.');
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
                            Join the Party
                        </Text>
                        <Text className="text-typography-secondary mb-8">
                            Create your account to start your journey.
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
                                    placeholder="Create a password"
                                    placeholderTextColor="var(--color-text-secondary)"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry
                                    className="bg-background-secondary text-typography-primary h-14 px-4 rounded-xl border border-border-primary"
                                />
                                {errors.password && <Text className="text-red-500 text-xs mt-1">{errors.password}</Text>}
                            </View>

                            <TouchableOpacity
                                onPress={() => setIsAgeVerified(!isAgeVerified)}
                                className="flex-row items-center space-x-3 py-2"
                                activeOpacity={0.7}
                            >
                                <View
                                    testID="age-checkbox"
                                    className={`w-6 h-6 rounded border items-center justify-center ${isAgeVerified ? 'bg-accent-primary border-accent-primary' : 'border-border-primary'}`}
                                >
                                    {isAgeVerified && <Text className="text-typography-primary text-xs">✓</Text>}
                                </View>
                                <Text className="text-typography-secondary flex-1">
                                    I verify that I am <Text className="text-accent-primary font-bold">17 years of age or older</Text>.
                                </Text>
                            </TouchableOpacity>
                            {errors.is_age_verified && <Text className="text-red-500 text-xs">{errors.is_age_verified}</Text>}
                        </View>

                        {serverError && (
                            <View className="mt-6 bg-red-900/30 border border-red-500/50 p-4 rounded-xl">
                                <Text className="text-red-200 text-sm text-center">{serverError}</Text>
                            </View>
                        )}
                    </View>

                    <View className="p-6 pb-12">
                        <TouchableOpacity
                            onPress={handleRegister}
                            disabled={isSubmitting}
                            className={`flex-row items-center justify-center h-14 rounded-xl ${isSubmitting ? 'bg-indigo-800' : 'bg-accent-primary'}`}
                            activeOpacity={0.8}
                        >
                            {React.createElement(UserPlus as any, { size: 20, color: "white", className: "mr-2" })}
                            <Text className="text-typography-primary font-bold text-lg">
                                {isSubmitting ? 'Creating Account...' : 'Register'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};
