import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { RegisterScreen } from '@/features/auth/ui/register-screen';

const mockRegister = jest.fn().mockResolvedValue(undefined);

jest.mock('@/shared/providers/auth-provider', () => ({
    useAuth: jest.fn(() => ({
        register: mockRegister,
    })),
}));

jest.mock('lucide-react-native', () => ({
    ChevronLeft: () => 'ChevronLeftIcon',
    UserPlus: () => 'UserPlusIcon',
}));

describe('RegisterScreen', () => {
    const onBack = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        mockRegister.mockResolvedValue(undefined);
    });

    it('renders correctly with all fields', () => {
        const { getByPlaceholderText, getByText } = render(
            <RegisterScreen onBack={onBack} />
        );

        expect(getByPlaceholderText(/Enter your email/i)).toBeTruthy();
        expect(getByPlaceholderText(/Create a password/i)).toBeTruthy();
        expect(getByText(/17/i)).toBeTruthy();
    });

    it('shows error when age checkbox is not checked', async () => {
        const { getByPlaceholderText, getByText } = render(
            <RegisterScreen onBack={onBack} />
        );

        fireEvent.changeText(getByPlaceholderText(/Enter your email/i), 'test@example.com');
        fireEvent.changeText(getByPlaceholderText(/Create a password/i), 'password123');

        await act(async () => {
            fireEvent.press(getByText(/Register/i));
        });

        expect(getByText(/Must be 17\+/i)).toBeTruthy();
    });

    it('shows validation errors for invalid email', async () => {
        const { getByPlaceholderText, getByText, getByTestId } = render(
            <RegisterScreen onBack={onBack} />
        );

        fireEvent.changeText(getByPlaceholderText(/Enter your email/i), 'invalid');
        fireEvent.changeText(getByPlaceholderText(/Create a password/i), 'password123');
        fireEvent.press(getByTestId('age-checkbox'));

        await act(async () => {
            fireEvent.press(getByText(/Register/i));
        });

        expect(getByText(/Invalid email/i)).toBeTruthy();
    });

    it('shows validation error for short password', async () => {
        const { getByPlaceholderText, getByText, getByTestId } = render(
            <RegisterScreen onBack={onBack} />
        );

        fireEvent.changeText(getByPlaceholderText(/Enter your email/i), 'test@example.com');
        fireEvent.changeText(getByPlaceholderText(/Create a password/i), 'ab');
        fireEvent.press(getByTestId('age-checkbox'));

        await act(async () => {
            fireEvent.press(getByText(/Register/i));
        });

        // Zod should produce a password length error
        expect(getByText(/8 char/i)).toBeTruthy();
    });

    it('calls register and shows submitting state on valid data', async () => {
        let resolveRegister: () => void;
        mockRegister.mockImplementation(() => new Promise<void>(r => { resolveRegister = r; }));

        const { getByPlaceholderText, getByText, getByTestId } = render(
            <RegisterScreen onBack={onBack} />
        );

        fireEvent.changeText(getByPlaceholderText(/Enter your email/i), 'test@example.com');
        fireEvent.changeText(getByPlaceholderText(/Create a password/i), 'password123');
        fireEvent.press(getByTestId('age-checkbox'));

        await act(async () => {
            fireEvent.press(getByText(/Register/i));
        });

        // Should show "Creating Account..." while submitting
        expect(getByText(/Creating Account/i)).toBeTruthy();

        // Resolve register
        await act(async () => {
            resolveRegister!();
        });

        // Should return to "Register" text
        expect(getByText(/Register/i)).toBeTruthy();
    });

    it('shows server error when register throws', async () => {
        mockRegister.mockRejectedValue(new Error('Email taken'));

        const { getByPlaceholderText, getByText, getByTestId } = render(
            <RegisterScreen onBack={onBack} />
        );

        fireEvent.changeText(getByPlaceholderText(/Enter your email/i), 'test@example.com');
        fireEvent.changeText(getByPlaceholderText(/Create a password/i), 'password123');
        fireEvent.press(getByTestId('age-checkbox'));

        await act(async () => {
            fireEvent.press(getByText(/Register/i));
        });

        expect(getByText(/Email taken/i)).toBeTruthy();
    });

    it('shows fallback error when register throws without message', async () => {
        mockRegister.mockRejectedValue({});

        const { getByPlaceholderText, getByText, getByTestId } = render(
            <RegisterScreen onBack={onBack} />
        );

        fireEvent.changeText(getByPlaceholderText(/Enter your email/i), 'test@example.com');
        fireEvent.changeText(getByPlaceholderText(/Create a password/i), 'password123');
        fireEvent.press(getByTestId('age-checkbox'));

        await act(async () => {
            fireEvent.press(getByText(/Register/i));
        });

        expect(getByText(/Registration failed/i)).toBeTruthy();
    });


});
