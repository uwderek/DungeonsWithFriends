import React from 'react';
import { render, act } from '@testing-library/react-native';
import { Text } from 'react-native';
import { AuthProvider, useAuth } from './auth-provider';

// Mock @nhost/nhost-js to avoid real network initialization
jest.mock('@nhost/nhost-js', () => ({
    NhostClient: jest.fn().mockImplementation(() => ({})),
}));

// Consumer component for testing the context
function AuthConsumer() {
    const { isAuthenticated, isLoading, user } = useAuth();
    return (
        <>
            <Text testID="isAuthenticated">{String(isAuthenticated)}</Text>
            <Text testID="isLoading">{String(isLoading)}</Text>
            <Text testID="user">{user ? user.email : 'null'}</Text>
        </>
    );
}

describe('AuthProvider', () => {
    it('renders children without crashing', () => {
        const { getByText } = render(
            <AuthProvider>
                <Text>Hello</Text>
            </AuthProvider>
        );
        expect(getByText('Hello')).toBeTruthy();
    });

    it('provides initial state: not authenticated, loading, no user', async () => {
        const { getByTestId } = render(
            <AuthProvider>
                <AuthConsumer />
            </AuthProvider>
        );

        // After useEffect runs, isLoading becomes false
        await act(async () => { });

        expect(getByTestId('isAuthenticated').props.children).toBe('false');
        expect(getByTestId('isLoading').props.children).toBe('false');
        expect(getByTestId('user').props.children).toBe('null');
    });

    it('exposes login and logout functions that do not throw', async () => {
        let authCtx: ReturnType<typeof useAuth> | null = null;

        function Capture() {
            authCtx = useAuth();
            return null;
        }

        const { unmount } = render(
            <AuthProvider>
                <Capture />
            </AuthProvider>
        );

        await act(async () => { });

        expect(() => authCtx!.login()).not.toThrow();
        expect(() => authCtx!.logout()).not.toThrow();

        unmount();
    });
});

describe('useAuth', () => {
    it('throws when used outside of AuthProvider', () => {
        // Suppress the expected console.error React outputs for thrown errors in render
        const spy = jest.spyOn(console, 'error').mockImplementation(() => { });

        function BadConsumer() {
            useAuth();
            return null;
        }

        expect(() => render(<BadConsumer />)).toThrow(
            'useAuth must be used within an AuthProvider'
        );

        spy.mockRestore();
    });
});
