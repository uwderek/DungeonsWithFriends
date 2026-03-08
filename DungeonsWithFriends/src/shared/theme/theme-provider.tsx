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
                // Load fonts - safely, as we might be missing the files
                await Font.loadAsync({
                    // Use a safe check - if we can't find them, we'll just use fallbacks in CSS
                });
            } catch (e) {
                console.warn('Font loading failed, using fallbacks', e);
            } finally {
                setIsLoaded(true);
                await SplashScreen.hideAsync().catch(() => { });
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
