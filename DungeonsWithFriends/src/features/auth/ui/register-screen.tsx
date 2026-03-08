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
                            Join the Party
                        </Text>
                        <Text className="text-gray-400 mb-8">
                            Create your account to start your journey.
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
                                    placeholder="Create a password"
                                    placeholderTextColor="#6B7280"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry
                                    style={{ backgroundColor: '#1E1B4B', color: '#FFFFFF', height: 56, paddingHorizontal: 16, borderRadius: 8, borderWidth: 1, borderColor: '#312E81' }}
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
                                    style={{
                                        width: 24,
                                        height: 24,
                                        borderRadius: 4,
                                        borderWidth: 1,
                                        borderColor: isAgeVerified ? '#D97706' : '#312E81',
                                        backgroundColor: isAgeVerified ? '#D97706' : 'transparent',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    {isAgeVerified && <Text className="text-black text-xs">✓</Text>}
                                </View>
                                <Text className="text-gray-400 flex-1">
                                    I verify that I am <Text className="text-amber-600 font-bold">17 years of age or older</Text>.
                                </Text>
                            </TouchableOpacity>
                            {errors.is_age_verified && <Text className="text-red-500 text-xs">{errors.is_age_verified}</Text>}
                        </View>

                        {serverError && (
                            <View style={{ marginTop: 24, backgroundColor: 'rgba(220, 38, 38, 0.2)', borderWidth: 1, borderColor: 'rgba(220, 38, 38, 0.5)', padding: 16, borderRadius: 8 }}>
                                <Text className="text-red-400 text-sm text-center">{serverError}</Text>
                            </View>
                        )}
                    </View>

                    <View className="p-6 pb-12">
                        <TouchableOpacity
                            onPress={handleRegister}
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
                            <UserPlus size={20} color="#000000" />
                            <Text className="text-black font-bold text-lg ml-2">
                                {isSubmitting ? 'Creating Account...' : 'Register'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};
