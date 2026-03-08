import React from 'react';
import { render, act } from '@testing-library/react-native';
import { Text, Platform } from 'react-native';

// Mock expo-splash-screen
jest.mock('expo-splash-screen', () => ({
    preventAutoHideAsync: jest.fn().mockResolvedValue(undefined),
    hideAsync: jest.fn().mockResolvedValue(undefined),
}));

// Mock nativewind
jest.mock('nativewind', () => ({
    vars: jest.fn((theme: any) => theme),
}));

// Mock the default theme
jest.mock('./default-theme', () => ({
    DEFAULT_THEME: {
        '--color-background-primary': '#000000',
        '--color-text-primary': '#FFFFFF',
    },
}));

import { ThemeProvider, useTheme } from './theme-provider';

describe('ThemeProvider', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('returns null before theme is loaded', () => {
        const { toJSON } = render(
            <ThemeProvider>
                <Text>Child</Text>
            </ThemeProvider>
        );
        expect(toJSON()).toBeNull();
    });

    it('renders children after theme loading completes', async () => {
        const { getByText, toJSON } = render(
            <ThemeProvider>
                <Text>Loaded</Text>
            </ThemeProvider>
        );

        // Initially null
        expect(toJSON()).toBeNull();

        // Advance past the 500ms timer
        await act(async () => {
            jest.advanceTimersByTime(600);
        });

        expect(getByText('Loaded')).toBeTruthy();
    });

    it('hides splash screen after loading', async () => {
        const SplashScreen = require('expo-splash-screen');

        render(
            <ThemeProvider>
                <Text>Child</Text>
            </ThemeProvider>
        );

        await act(async () => {
            jest.advanceTimersByTime(600);
        });

        expect(SplashScreen.hideAsync).toHaveBeenCalled();
    });

    it('provides isLoaded=true via useTheme after loading', async () => {
        let themeCtx: any = null;

        function Consumer() {
            themeCtx = useTheme();
            return <Text>ok</Text>;
        }

        render(
            <ThemeProvider>
                <Consumer />
            </ThemeProvider>
        );

        await act(async () => {
            jest.advanceTimersByTime(600);
        });

        expect(themeCtx.isLoaded).toBe(true);
    });

    it('applies web theme style on web platform', async () => {
        const originalOS = Platform.OS;
        Object.defineProperty(Platform, 'OS', { value: 'web', configurable: true });

        const { toJSON } = render(
            <ThemeProvider>
                <Text>Web</Text>
            </ThemeProvider>
        );

        await act(async () => {
            jest.advanceTimersByTime(600);
        });

        expect(toJSON()).not.toBeNull();

        Object.defineProperty(Platform, 'OS', { value: originalOS });
    });

    it('cleans up timer on unmount', async () => {
        const { unmount } = render(
            <ThemeProvider>
                <Text>Child</Text>
            </ThemeProvider>
        );

        // Unmount before timer fires
        unmount();

        // Timer should have been cleared, no errors
        await act(async () => {
            jest.advanceTimersByTime(600);
        });
    });
    it('handles preventAutoHideAsync rejection gracefully', async () => {
        const SplashScreen = require('expo-splash-screen');
        SplashScreen.preventAutoHideAsync.mockRejectedValueOnce(new Error('Not supported'));

        const { toJSON } = render(
            <ThemeProvider>
                <Text>Child</Text>
            </ThemeProvider>
        );

        await act(async () => {
            jest.advanceTimersByTime(600);
        });

        // Use toJSON() check as signal that it eventually loaded despite module-level rejection
        expect(toJSON()).not.toBeNull();
    });

    it('handles hideAsync rejection gracefully', async () => {
        const SplashScreen = require('expo-splash-screen');
        SplashScreen.hideAsync.mockRejectedValueOnce(new Error('Not supported'));

        render(
            <ThemeProvider>
                <Text>Child</Text>
            </ThemeProvider>
        );

        await act(async () => {
            jest.advanceTimersByTime(600);
        });

        // Should not throw - the .catch() suppresses the error
        expect(SplashScreen.hideAsync).toHaveBeenCalled();
    });
});

describe('useTheme', () => {
    it('returns isLoaded false when outside loaded provider', () => {
        let ctx: any = null;
        function Consumer() {
            ctx = useTheme();
            return null;
        }

        // useTheme without ThemeProvider uses default context
        render(<Consumer />);
        expect(ctx.isLoaded).toBe(false);
    });
});
