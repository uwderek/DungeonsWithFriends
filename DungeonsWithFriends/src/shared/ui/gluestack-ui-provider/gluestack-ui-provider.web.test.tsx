import React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';

// Mock nativewind vars() to return a plain object so config[mode] is truthy in tests
jest.mock('nativewind', () => ({
    vars: (input: Record<string, string>) => input,
    useColorScheme: jest.fn(() => ({ colorScheme: 'light', setColorScheme: jest.fn() })),
}));

// Mock heavy overlay/toast deps
jest.mock('@gluestack-ui/overlay', () => ({
    OverlayProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock('@gluestack-ui/toast', () => ({
    ToastProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Import the web variant explicitly
import { GluestackUIProvider } from './index.web';

// Provide a minimal global document mock so the DOM injection branch is exercised.
// The React Native test environment doesn't have document by default.
const mockStyle = { innerHTML: '', id: '' };
const mockHead = { appendChild: jest.fn() };
const mockElement = {
    querySelector: jest.fn(() => mockHead),
};

beforeAll(() => {
    (global as any).document = {
        documentElement: mockElement,
        // getElementById returns null on first render (no existing style tag)
        getElementById: jest.fn(() => null),
        createElement: jest.fn(() => mockStyle),
    };
});

afterAll(() => {
    delete (global as any).document;
});

describe('GluestackUIProvider (web)', () => {
    it('renders children in light mode', () => {
        const { getByText } = render(
            <GluestackUIProvider mode="light">
                <Text>Web Light</Text>
            </GluestackUIProvider>
        );
        expect(getByText('Web Light')).toBeTruthy();
    });

    it('renders children in dark mode', () => {
        const { getByText } = render(
            <GluestackUIProvider mode="dark">
                <Text>Web Dark</Text>
            </GluestackUIProvider>
        );
        expect(getByText('Web Dark')).toBeTruthy();
    });

    it('renders using default light mode', () => {
        const { getByText } = render(
            <GluestackUIProvider>
                <Text>Default Web</Text>
            </GluestackUIProvider>
        );
        expect(getByText('Default Web')).toBeTruthy();
    });
});

describe('GluestackUIProvider (web) - style deduplication', () => {
    it('reuses existing style element on re-render instead of appending a new one', () => {
        const existingStyle = { innerHTML: '', id: 'gluestack-theme-vars' };
        const appendSpy = jest.fn();

        (global as any).document = {
            documentElement: { querySelector: jest.fn(() => ({ appendChild: appendSpy })) },
            // First call: no existing element; second call: element exists
            getElementById: jest.fn()
                .mockReturnValueOnce(null)
                .mockReturnValue(existingStyle),
            createElement: jest.fn(() => ({ innerHTML: '', id: '' })),
        };

        const { rerender } = render(
            <GluestackUIProvider mode="light">
                <Text>First Render</Text>
            </GluestackUIProvider>
        );
        // First render appends a new element
        expect(appendSpy).toHaveBeenCalledTimes(1);

        rerender(
            <GluestackUIProvider mode="dark">
                <Text>Second Render</Text>
            </GluestackUIProvider>
        );
        // Second render should NOT append again — reuses existingStyle
        expect(appendSpy).toHaveBeenCalledTimes(1);

        // Restore global document mock
        (global as any).document = {
            documentElement: mockElement,
            getElementById: jest.fn(() => null),
            createElement: jest.fn(() => mockStyle),
        };
    });
});

describe('GluestackUIProvider (web) - branch guards', () => {
    it('renders and skips DOM injection when document is undefined (line 14 false branch)', () => {
        const saved = (global as any).document;
        delete (global as any).document;

        const { getByText } = render(
            <GluestackUIProvider mode="light">
                <Text>No Document</Text>
            </GluestackUIProvider>
        );
        expect(getByText('No Document')).toBeTruthy();

        (global as any).document = saved;
    });

    it('renders safely when documentElement is null (line 16 false branch)', () => {
        const saved = (global as any).document;
        (global as any).document = {
            documentElement: null,
            getElementById: jest.fn(),
            createElement: jest.fn(),
        };

        const { getByText } = render(
            <GluestackUIProvider mode="light">
                <Text>Null Element</Text>
            </GluestackUIProvider>
        );
        expect(getByText('Null Element')).toBeTruthy();

        (global as any).document = saved;
    });

    it('renders safely when head is null (line 24 false branch)', () => {
        const saved = (global as any).document;
        const mockStyleObj = { innerHTML: '' };
        (global as any).document = {
            documentElement: { querySelector: jest.fn(() => null) },
            getElementById: jest.fn(),
            createElement: jest.fn(() => mockStyleObj),
        };

        const { getByText } = render(
            <GluestackUIProvider mode="light">
                <Text>Null Head</Text>
            </GluestackUIProvider>
        );
        expect(getByText('Null Head')).toBeTruthy();

        (global as any).document = saved;
    });
});

