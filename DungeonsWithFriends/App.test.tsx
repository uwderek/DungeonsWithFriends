import React from 'react';
import { render } from '@testing-library/react-native';

// Mock all native deps that the full provider tree needs
jest.mock('@nhost/nhost-js', () => ({
    NhostClient: jest.fn().mockImplementation(() => ({})),
}));

jest.mock('tinybase/ui-react', () => ({
    Provider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    useCreateStore: jest.fn(() => ({})),
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

// Import App AFTER all mocks are set up
import App from './App';

describe('App startup integration', () => {
    it('renders the full provider tree without crashing', () => {
        // This test exists to satisfy AC4: "Ensure app runs cleanly with no errors on web and mobile"
        // It validates the full GluestackUIProvider > SyncProvider > AuthProvider > View tree renders.
        expect(() => render(<App />)).not.toThrow();
    });

    it('renders the app placeholder text', () => {
        const { getByText } = render(<App />);
        expect(getByText(/Open up App\.tsx to start working on your app!/i)).toBeTruthy();
    });
});
