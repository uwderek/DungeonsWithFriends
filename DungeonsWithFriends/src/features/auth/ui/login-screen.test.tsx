import React from 'react';
import { render, fireEvent, act, waitFor } from '@testing-library/react-native';
import { LoginScreen } from '@/features/auth/ui/login-screen';

// Module-level mock controls
const mockLogin = jest.fn().mockResolvedValue(undefined);

jest.mock('@/shared/providers/auth-provider', () => ({
    useAuth: jest.fn(() => ({
        login: mockLogin,
    })),
}));

// Mock lucide-react-native
jest.mock('lucide-react-native', () => ({
    ChevronLeft: () => 'ChevronLeftIcon',
    LogIn: () => 'LogInIcon',
}));

describe('LoginScreen', () => {
    const onBack = jest.fn();
    const onForgotPassword = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        mockLogin.mockResolvedValue(undefined);
    });

    it('renders correctly with email and password fields', () => {
        const { getByPlaceholderText, getByText } = render(
            <LoginScreen onBack={onBack} onForgotPassword={onForgotPassword} />
        );

        expect(getByPlaceholderText(/Enter your email/i)).toBeTruthy();
        expect(getByPlaceholderText(/Enter your password/i)).toBeTruthy();
        expect(getByText(/Login/i)).toBeTruthy();
    });



    it('shows validation errors for empty email', async () => {
        const { getByText, getByPlaceholderText } = render(
            <LoginScreen onBack={onBack} onForgotPassword={onForgotPassword} />
        );

        // Submit with empty fields
        await act(async () => {
            fireEvent.press(getByText(/Login/i));
        });

        // Zod validation should produce an error for email
        expect(getByText(/Invalid email/i)).toBeTruthy();
    });

    it('shows validation error for invalid email format', async () => {
        const { getByPlaceholderText, getByText } = render(
            <LoginScreen onBack={onBack} onForgotPassword={onForgotPassword} />
        );

        fireEvent.changeText(getByPlaceholderText(/Enter your email/i), 'invalid-email');

        await act(async () => {
            fireEvent.press(getByText(/Login/i));
        });

        expect(getByText(/Invalid email/i)).toBeTruthy();
    });

    it('calls login and shows submitting state on valid credentials', async () => {
        // Make login hang to test submitting state
        let resolveLogin: () => void;
        mockLogin.mockImplementation(() => new Promise<void>(r => { resolveLogin = r; }));

        const { getByPlaceholderText, getByText } = render(
            <LoginScreen onBack={onBack} onForgotPassword={onForgotPassword} />
        );

        fireEvent.changeText(getByPlaceholderText(/Enter your email/i), 'test@example.com');
        fireEvent.changeText(getByPlaceholderText(/Enter your password/i), 'password123');

        await act(async () => {
            fireEvent.press(getByText(/Login/i));
        });

        // Should show "Verifying..." while submitting
        expect(getByText(/Verifying/i)).toBeTruthy();

        // Resolve login
        await act(async () => {
            resolveLogin!();
        });

        // Should return to "Login" text
        expect(getByText(/Login/i)).toBeTruthy();
    });

    it('shows server error when login throws', async () => {
        mockLogin.mockRejectedValue(new Error('Network error'));

        const { getByPlaceholderText, getByText } = render(
            <LoginScreen onBack={onBack} onForgotPassword={onForgotPassword} />
        );

        fireEvent.changeText(getByPlaceholderText(/Enter your email/i), 'test@example.com');
        fireEvent.changeText(getByPlaceholderText(/Enter your password/i), 'password123');

        await act(async () => {
            fireEvent.press(getByText(/Login/i));
        });

        expect(getByText(/Network error/i)).toBeTruthy();
    });

    it('shows fallback error when login throws without message', async () => {
        mockLogin.mockRejectedValue({});

        const { getByPlaceholderText, getByText } = render(
            <LoginScreen onBack={onBack} onForgotPassword={onForgotPassword} />
        );

        fireEvent.changeText(getByPlaceholderText(/Enter your email/i), 'test@example.com');
        fireEvent.changeText(getByPlaceholderText(/Enter your password/i), 'password123');

        await act(async () => {
            fireEvent.press(getByText(/Login/i));
        });

        expect(getByText(/Login failed/i)).toBeTruthy();
    });

    it('calls onForgotPassword handler', () => {
        const { getByText } = render(
            <LoginScreen onBack={onBack} onForgotPassword={onForgotPassword} />
        );

        fireEvent.press(getByText(/Forgot Password/i));
        expect(onForgotPassword).toHaveBeenCalled();
    });
});
