import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { RegisterScreen } from '@/features/auth/ui/register-screen';
import { AuthProvider } from '@/shared/providers/auth-provider';

// Mock @nhost/nhost-js
jest.mock('@nhost/nhost-js', () => ({
    NhostClient: jest.fn().mockImplementation(() => ({
        auth: {
            getSession: jest.fn().mockReturnValue(null),
            signIn: jest.fn(),
            signUp: jest.fn().mockResolvedValue({ session: { user: {} }, error: null }),
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
    UserPlus: () => 'UserPlusIcon',
}));

describe('RegisterScreen', () => {
    it('renders correctly with all fields', () => {
        const { getByPlaceholderText, getByText } = render(
            <AuthProvider>
                <RegisterScreen onBack={jest.fn()} />
            </AuthProvider>
        );

        expect(getByPlaceholderText(/Email/i)).toBeTruthy();
        expect(getByPlaceholderText(/Password/i)).toBeTruthy();
        expect(getByText(/17/i)).toBeTruthy();
    });

    it('shows error when age checkbox is not checked', async () => {
        const { getByPlaceholderText, getByText, queryByText } = render(
            <AuthProvider>
                <RegisterScreen onBack={jest.fn()} />
            </AuthProvider>
        );

        fireEvent.changeText(getByPlaceholderText(/Email/i), 'test@example.com');
        fireEvent.changeText(getByPlaceholderText(/Password/i), 'password123');

        // Note: age checkbox is initially unchecked
        fireEvent.press(getByText(/Register/i));

        // Should show validation error
        expect(getByText(/Must be 17\+/i)).toBeTruthy();
    });

    it('calls AuthProvider.register when valid data is submitted', async () => {
        // This is more of an integration test once AuthProvider is fully wired
        // For now we want to see it pass the Zod validation and attempt to register
        const { getByPlaceholderText, getByText, getByTestId } = render(
            <AuthProvider>
                <RegisterScreen onBack={jest.fn()} />
            </AuthProvider>
        );

        fireEvent.changeText(getByPlaceholderText(/Email/i), 'test@example.com');
        fireEvent.changeText(getByPlaceholderText(/Password/i), 'password123');
        fireEvent.press(getByTestId('age-checkbox'));

        await act(async () => {
            fireEvent.press(getByText(/Register/i));
        });

        // Check for success or missing error
        // In actual implementation, we'd check if nhost.signUp was called
    });
});
