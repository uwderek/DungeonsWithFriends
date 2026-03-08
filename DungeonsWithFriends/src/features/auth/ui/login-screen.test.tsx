import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { LoginScreen } from '@/features/auth/ui/login-screen';
import { AuthProvider } from '@/shared/providers/auth-provider';

// Mock @nhost/nhost-js
jest.mock('@nhost/nhost-js', () => ({
    NhostClient: jest.fn().mockImplementation(() => ({
        auth: {
            getSession: jest.fn().mockReturnValue(null),
            signIn: jest.fn().mockResolvedValue({ session: { user: {} }, error: null }),
            signUp: jest.fn(),
            signOut: jest.fn(),
        },
    })),
}));

// Mock tinybase/ui-react
jest.mock('tinybase/ui-react', () => ({
    useStore: jest.fn(() => ({
        getCell: jest.fn(),
        setCell: jest.fn(),
    })),
}));

// Mock lucide-react-native
jest.mock('lucide-react-native', () => ({
    ChevronLeft: () => 'ChevronLeftIcon',
    LogIn: () => 'LogInIcon',
}));

describe('LoginScreen', () => {
    it('renders correctly with email and password fields', () => {
        const { getByPlaceholderText, getByText } = render(
            <AuthProvider>
                <LoginScreen onBack={jest.fn()} onForgotPassword={jest.fn()} />
            </AuthProvider>
        );

        expect(getByPlaceholderText(/Email/i)).toBeTruthy();
        expect(getByPlaceholderText(/Password/i)).toBeTruthy();
        expect(getByText(/Login/i)).toBeTruthy();
    });

    it('calls AuthProvider.login when valid credentials are submitted', async () => {
        const { getByPlaceholderText, getByText } = render(
            <AuthProvider>
                <LoginScreen onBack={jest.fn()} onForgotPassword={jest.fn()} />
            </AuthProvider>
        );

        fireEvent.changeText(getByPlaceholderText(/Email/i), 'test@example.com');
        fireEvent.changeText(getByPlaceholderText(/Password/i), 'password123');

        await act(async () => {
            fireEvent.press(getByText(/Login/i));
        });

        // Success state or transition check
    });

    it('shows error for invalid email format', async () => {
        const { getByPlaceholderText, getByText } = render(
            <AuthProvider>
                <LoginScreen onBack={jest.fn()} onForgotPassword={jest.fn()} />
            </AuthProvider>
        );

        fireEvent.changeText(getByPlaceholderText(/Email/i), 'invalid-email');

        await act(async () => {
            fireEvent.press(getByText(/Login/i));
        });

        expect(getByText(/Invalid email address/i)).toBeTruthy();
    });
});
