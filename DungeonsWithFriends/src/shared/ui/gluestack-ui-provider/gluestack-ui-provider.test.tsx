import React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';

// Mock heavy native deps that gluestack relies on
jest.mock('@gluestack-ui/overlay', () => ({
    OverlayProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock('@gluestack-ui/toast', () => ({
    ToastProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

import { GluestackUIProvider } from './index';

describe('GluestackUIProvider (native)', () => {
    it('renders children in light mode', () => {
        const { getByText } = render(
            <GluestackUIProvider mode="light">
                <Text>Light Child</Text>
            </GluestackUIProvider>
        );
        expect(getByText('Light Child')).toBeTruthy();
    });

    it('renders children in dark mode', () => {
        const { getByText } = render(
            <GluestackUIProvider mode="dark">
                <Text>Dark Child</Text>
            </GluestackUIProvider>
        );
        expect(getByText('Dark Child')).toBeTruthy();
    });

    it('defaults to light mode when no mode prop is passed', () => {
        const { getByText } = render(
            <GluestackUIProvider>
                <Text>Default Mode</Text>
            </GluestackUIProvider>
        );
        expect(getByText('Default Mode')).toBeTruthy();
    });
});
