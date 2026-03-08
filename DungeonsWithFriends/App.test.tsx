import React from 'react';
import { render, act } from '@testing-library/react-native';
import { Text } from 'react-native';

// Mock all native deps that the full provider tree needs
jest.mock('@nhost/nhost-js', () => ({
    NhostClient: jest.fn().mockImplementation(() => ({
        auth: {
            getSession: jest.fn(() => null),
            onAuthStateChanged: jest.fn(() => () => { }),
        },
    })),
}));

jest.mock('tinybase/ui-react', () => ({
    Provider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    useCreateStore: jest.fn(() => ({})),
    useStore: jest.fn(() => ({
        getCell: jest.fn(),
        setCell: jest.fn(),
    })),
}));

jest.mock('tinybase', () => ({
    createStore: jest.fn(() => ({})),
}));

jest.mock('@gluestack-ui/overlay', () => ({
    OverlayProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock('@gluestack-ui/toast', () => ({
    ToastProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock nativewind config vars
jest.mock('nativewind', () => ({
    vars: (input: Record<string, string>) => input,
    useColorScheme: jest.fn(() => ({ colorScheme: 'light', setColorScheme: jest.fn() })),
}));

// Mock ThemeProvider
jest.mock('@/shared/theme/theme-provider', () => ({
    ThemeProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    useTheme: () => ({ isLoaded: true }),
}));

// Mock AuthProvider and useAuth
jest.mock('@/shared/providers/auth-provider', () => {
    const React = require('react');
    const actual = jest.requireActual('@/shared/providers/auth-provider');
    return {
        ...actual,
        useAuth: jest.fn(() => ({
            isAuthenticated: false,
            isLoading: false,
            user: null,
            offlineMode: false,
            login: jest.fn(),
            logout: jest.fn(),
            continueOffline: jest.fn(),
        })),
    };
});

// Mock feature screens to avoid deep rendering in App tests
jest.mock('@/features/auth/ui/welcome-screen', () => ({
    WelcomeScreen: () => {
        const { Text } = require('react-native');
        return <Text testID="welcome-screen">Welcome Screen</Text>;
    },
}));
jest.mock('@/features/auth/ui/login-screen', () => ({
    LoginScreen: () => {
        const { Text } = require('react-native');
        return <Text testID="login-screen">Login Screen</Text>;
    },
}));
jest.mock('@/features/auth/ui/register-screen', () => ({
    RegisterScreen: () => {
        const { Text } = require('react-native');
        return <Text testID="register-screen">Register Screen</Text>;
    },
}));
jest.mock('@/features/dashboard/ui/dashboard-screen', () => ({
    DashboardScreen: () => {
        const { Text } = require('react-native');
        return <Text testID="dashboard-screen">Dashboard Screen</Text>;
    },
}));

// Import App AFTER all mocks are set up
import App from './App';
import { useAuth } from '@/shared/providers/auth-provider';

describe('App Routing', () => {
    const mockUseAuth = useAuth as jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders WelcomeScreen by default when not authenticated', () => {
        mockUseAuth.mockReturnValue({
            isAuthenticated: false,
            isLoading: false,
            offlineMode: false,
        });

        const { getByTestId } = render(<App />);
        expect(getByTestId('welcome-screen')).toBeTruthy();
    });

    it('renders DashboardScreen when authenticated', () => {
        mockUseAuth.mockReturnValue({
            isAuthenticated: true,
            isLoading: false,
            offlineMode: false,
        });

        const { getByTestId } = render(<App />);
        expect(getByTestId('dashboard-screen')).toBeTruthy();
    });

    it('renders DashboardScreen when in offline mode', () => {
        mockUseAuth.mockReturnValue({
            isAuthenticated: false,
            isLoading: false,
            offlineMode: true,
        });

        const { getByTestId } = render(<App />);
        expect(getByTestId('dashboard-screen')).toBeTruthy();
    });

    it('navigates to LoginScreen from WelcomeScreen', async () => {
        mockUseAuth.mockReturnValue({
            isAuthenticated: false,
            isLoading: false,
            offlineMode: false,
        });

        const { getByTestId } = render(<App />);
        expect(getByTestId('welcome-screen')).toBeTruthy();
    });
});
