import React from 'react';
import { render, act } from '@testing-library/react-native';
import { Text } from 'react-native';
import { AuthProvider, useAuth } from './auth-provider';

// We need per-test mock control, so we use module-level mocks with overrides
const mockGetSession = jest.fn().mockReturnValue(null);
const mockSignIn = jest.fn().mockResolvedValue({ session: null, error: null });
const mockSignUp = jest.fn().mockResolvedValue({ session: null, error: null });
const mockSignOut = jest.fn().mockResolvedValue(undefined);

jest.mock('@nhost/nhost-js', () => ({
    NhostClient: jest.fn().mockImplementation(() => ({
        auth: {
            getSession: mockGetSession,
            signIn: mockSignIn,
            signUp: mockSignUp,
            signOut: mockSignOut,
        },
    })),
}));

const mockGetCell = jest.fn().mockReturnValue(undefined);
const mockSetCell = jest.fn();
const mockStore = { getCell: mockGetCell, setCell: mockSetCell };

jest.mock('tinybase/ui-react', () => ({
    useStore: jest.fn(() => mockStore),
}));

// Helper to capture auth context
function AuthCapture({ onCapture }: { onCapture: (ctx: any) => void }) {
    const ctx = useAuth();
    onCapture(ctx);
    return <Text testID="ready">ready</Text>;
}

describe('AuthProvider', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockGetSession.mockReturnValue(null);
        mockSignIn.mockResolvedValue({ session: null, error: null });
        mockSignUp.mockResolvedValue({ session: null, error: null });
        mockGetCell.mockReturnValue(undefined);
    });

    it('renders children', () => {
        const { getByText } = render(
            <AuthProvider><Text>Hello</Text></AuthProvider>
        );
        expect(getByText('Hello')).toBeTruthy();
    });

    it('restores offline mode from TinyBase store', async () => {
        mockGetCell.mockReturnValue(true);

        let ctx: any;
        render(
            <AuthProvider>
                <AuthCapture onCapture={c => { ctx = c; }} />
            </AuthProvider>
        );
        await act(async () => { });

        expect(ctx.offlineMode).toBe(true);
    });

    it('does not restore offline if store returns falsy', async () => {
        mockGetCell.mockReturnValue(false);

        let ctx: any;
        render(
            <AuthProvider>
                <AuthCapture onCapture={c => { ctx = c; }} />
            </AuthProvider>
        );
        await act(async () => { });

        expect(ctx.offlineMode).toBe(false);
    });

    it('handles store being null gracefully', async () => {
        const { useStore } = require('tinybase/ui-react');
        useStore.mockReturnValueOnce(null);

        let ctx: any;
        render(
            <AuthProvider>
                <AuthCapture onCapture={c => { ctx = c; }} />
            </AuthProvider>
        );
        await act(async () => { });

        expect(ctx.offlineMode).toBe(false);
    });

    it('sets authenticated state when session exists at mount', async () => {
        mockGetSession.mockReturnValue({
            user: { id: '1', email: 'user@test.com' },
        });

        let ctx: any;
        render(
            <AuthProvider>
                <AuthCapture onCapture={c => { ctx = c; }} />
            </AuthProvider>
        );
        await act(async () => { });

        expect(ctx.isAuthenticated).toBe(true);
        expect(ctx.user).toEqual({ id: '1', email: 'user@test.com' });
    });

    it('login with valid credentials sets authenticated state', async () => {
        mockSignIn.mockResolvedValue({
            session: { user: { id: '2', email: 'logged@test.com' } },
            error: null,
        });

        let ctx: any;
        render(
            <AuthProvider>
                <AuthCapture onCapture={c => { ctx = c; }} />
            </AuthProvider>
        );
        await act(async () => { });

        await act(async () => {
            await ctx.login('logged@test.com', 'pass123');
        });

        expect(ctx.isAuthenticated).toBe(true);
        expect(ctx.user.email).toBe('logged@test.com');
    });

    it('login throws when signIn returns error', async () => {
        mockSignIn.mockResolvedValue({
            session: null,
            error: new Error('Invalid credentials'),
        });

        let ctx: any;
        render(
            <AuthProvider>
                <AuthCapture onCapture={c => { ctx = c; }} />
            </AuthProvider>
        );
        await act(async () => { });

        await expect(ctx.login('bad@test.com', 'wrong')).rejects.toThrow('Invalid credentials');
    });

    it('login without credentials is a no-op', async () => {
        let ctx: any;
        render(
            <AuthProvider>
                <AuthCapture onCapture={c => { ctx = c; }} />
            </AuthProvider>
        );
        await act(async () => { });

        await act(async () => {
            await ctx.login();
        });

        expect(mockSignIn).not.toHaveBeenCalled();
    });

    it('register with valid credentials sets authenticated state', async () => {
        mockSignUp.mockResolvedValue({
            session: { user: { id: '3', email: 'new@test.com' } },
            error: null,
        });

        let ctx: any;
        render(
            <AuthProvider>
                <AuthCapture onCapture={c => { ctx = c; }} />
            </AuthProvider>
        );
        await act(async () => { });

        await act(async () => {
            await ctx.register('new@test.com', 'pass123');
        });

        expect(ctx.isAuthenticated).toBe(true);
        expect(ctx.user.email).toBe('new@test.com');
    });

    it('register throws when signUp returns error', async () => {
        mockSignUp.mockResolvedValue({
            session: null,
            error: new Error('Email already exists'),
        });

        let ctx: any;
        render(
            <AuthProvider>
                <AuthCapture onCapture={c => { ctx = c; }} />
            </AuthProvider>
        );
        await act(async () => { });

        await expect(ctx.register('dup@test.com', 'pass')).rejects.toThrow('Email already exists');
    });

    it('continueOffline sets offline mode and persists to store', async () => {
        let ctx: any;
        render(
            <AuthProvider>
                <AuthCapture onCapture={c => { ctx = c; }} />
            </AuthProvider>
        );
        await act(async () => { });

        await act(async () => {
            ctx.continueOffline();
        });

        expect(ctx.offlineMode).toBe(true);
        expect(mockSetCell).toHaveBeenCalledWith('settings', 'auth', 'offline_mode', true);
    });

    it('logout clears state and persists', async () => {
        // Start authenticated
        mockGetSession.mockReturnValue({
            user: { id: '1', email: 'user@test.com' },
        });

        let ctx: any;
        render(
            <AuthProvider>
                <AuthCapture onCapture={c => { ctx = c; }} />
            </AuthProvider>
        );
        await act(async () => { });
        expect(ctx.isAuthenticated).toBe(true);

        await act(async () => {
            await ctx.logout();
        });

        expect(ctx.isAuthenticated).toBe(false);
        expect(ctx.user).toBeNull();
    });
});

describe('useAuth', () => {
    it('throws when used outside of AuthProvider', () => {
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
