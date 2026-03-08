import React, { createContext, useContext, useEffect, useState } from 'react';
import { View, Platform } from 'react-native';
import * as Font from 'expo-font';
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
        async function loadResourcesAndDataAsync() {
            try {
                // Load fonts
                await Font.loadAsync({
                    'Cinzel': require('../../../assets/fonts/Cinzel-Bold.ttf'),
                    'Inter': require('../../../assets/fonts/Inter-Regular.ttf'),
                });
            } catch (e) {
                // We might want to provide this error information to an error reporting service
                console.warn('Font loading failed, using fallbacks', e);
            } finally {
                // Small delay to ensure tests can catch the "null" state if needed
                setTimeout(async () => {
                    setIsLoaded(true);
                    await SplashScreen.hideAsync().catch(() => { });
                }, 100);
            }
        }

        loadResourcesAndDataAsync();
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
