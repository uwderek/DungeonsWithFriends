import React, { createContext, useContext, useEffect, useState } from 'react';
import { View, Platform } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { vars } from 'nativewind';
import { DEFAULT_THEME } from './default-theme';

// Prevent splash screen from hiding until theme is ready
SplashScreen.preventAutoHideAsync().catch(() => { });

const ThemeContext = createContext({ isLoaded: false });

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // In a real app, we'd load fonts here via Font.loadAsync
        // For this implementation, we assume system fallbacks if files are missing
        const timer = setTimeout(async () => {
            setIsLoaded(true);
            await SplashScreen.hideAsync().catch(() => { });
        }, 500); // Small delay to simulate asset loading

        return () => clearTimeout(timer);
    }, []);

    if (!isLoaded) return null;

    // Inject CSS variables for NativeWind (Native) and Web
    const themeVars = vars(DEFAULT_THEME as any);

    return (
        <ThemeContext.Provider value={{ isLoaded }}>
            <View
                style={[
                    { flex: 1 },
                    Platform.OS === 'web' ? (DEFAULT_THEME as any) : themeVars
                ]}
            >
                {children}
            </View>
        </ThemeContext.Provider>
    );
};
