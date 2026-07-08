import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';

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

// Mock feature screens to avoid deep rendering in App tests
jest.mock('@/features/dashboard/ui/dashboard-screen', () => ({
    DashboardScreen: ({ onNavigate }: { onNavigate?: (id: string) => void }) => {
        const { Text, TouchableOpacity, View } = require('react-native');
        return (
            <View>
                <Text testID="dashboard-screen">Dashboard Screen</Text>
                <TouchableOpacity testID="go-characters" onPress={() => onNavigate?.('characters')}>
                    <Text>Go Characters</Text>
                </TouchableOpacity>
                <TouchableOpacity testID="go-creator" onPress={() => onNavigate?.('creator')}>
                    <Text>Go Creator</Text>
                </TouchableOpacity>
            </View>
        );
    },
}));
jest.mock('@/features/character/ui/characters-screen', () => ({
    CharactersScreen: () => {
        const { Text } = require('react-native');
        return <Text testID="characters-screen">Characters Screen</Text>;
    },
}));
jest.mock('@/features/creator/ui/CreatorToolsScreen', () => ({
    CreatorToolsScreen: () => {
        const { Text } = require('react-native');
        return <Text testID="creator-screen">Creator Screen</Text>;
    },
}));

// Import App AFTER all mocks are set up
import App from './App';

describe('App Routing', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders the local dashboard by default', () => {
        const { getByTestId } = render(<App />);
        expect(getByTestId('dashboard-screen')).toBeTruthy();
    });

    it('navigates to the local characters screen', () => {
        const { getByTestId } = render(<App />);
        fireEvent.press(getByTestId('go-characters'));
        expect(getByTestId('characters-screen')).toBeTruthy();
    });

    it('navigates to the local creator screen', () => {
        const { getByTestId } = render(<App />);
        fireEvent.press(getByTestId('go-creator'));
        expect(getByTestId('creator-screen')).toBeTruthy();
    });
});
