import "./global.css";
import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { View, Text } from "react-native";
import { AuthProvider, useAuth } from "@/shared/providers/auth-provider";
import { SyncProvider } from "@/shared/providers/sync-provider";
import { ThemeProvider } from "@/shared/theme/theme-provider";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Platform } from 'react-native';

// Global error handling for Web
const setupGlobalErrorHandlers = () => {
  const errorHandler = (event: ErrorEvent) => {
    console.error('[GLOBAL WEB ERROR]', event.error);
  };
  const rejectionHandler = (event: PromiseRejectionEvent) => {
    console.error('[UNHANDLED PROMISE REJECTION]', event.reason);
  };

  window.addEventListener('error', errorHandler);
  window.addEventListener('unhandledrejection', rejectionHandler);

  // Return cleanup function
  return () => {
    window.removeEventListener('error', errorHandler);
    window.removeEventListener('unhandledrejection', rejectionHandler);
  };
};

// Initialize global error handlers on web
if (Platform.OS === 'web') {
  setupGlobalErrorHandlers();
}

import { useWindowDimensions } from 'react-native';

// Features
import { WelcomeScreen } from "@/features/auth/ui/welcome-screen";
import { LoginScreen } from "@/features/auth/ui/login-screen";
import { RegisterScreen } from "@/features/auth/ui/register-screen";
import { DashboardScreen } from "@/features/dashboard/ui/dashboard-screen";
import { CharactersScreen } from "@/features/character/ui/characters-screen";
import { CreatorToolsScreen } from "@/features/creator/ui/CreatorToolsScreen";

// Shared UI
import { BottomTabBar } from "@/shared/ui/navigation/bottom-tab-bar";

function AppContent() {
  const { isAuthenticated, offlineMode, isLoading, continueOffline } = useAuth();
  const [authScreen, setAuthScreen] = useState<'welcome' | 'login' | 'register'>('welcome');
  const [activeTab, setActiveTab] = useState<'home' | 'campaigns' | 'characters' | 'friends' | 'creator' | 'settings'>('home');
  const handleNavigate = (id: string) => {
    setActiveTab(id as any);
  };
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  if (isLoading) {
    return (
      <View className="flex-1 bg-background-primary items-center justify-center" />
    );
  }

  // authenticated or offline-first access
  if (isAuthenticated || offlineMode) {
    return (
      <View className="flex-1">
        <View className="flex-1">
          {activeTab === 'home' && <DashboardScreen onNavigate={handleNavigate} />}
          {activeTab === 'characters' && <CharactersScreen onNavigate={handleNavigate} />}
          {activeTab === 'creator' && <CreatorToolsScreen onNavigate={handleNavigate} />}
          {/* Other screens for campaigns, characters, etc. would go here */}
          {(activeTab !== 'home' && activeTab !== 'characters' && activeTab !== 'creator') && (
            <View className="flex-1 items-center justify-center bg-background-primary p-8">
              <Text className="text-2xl text-typography-primary font-bold mb-2" style={{ fontFamily: 'Cinzel' }}>
                Coming Soon
              </Text>
              <Text className="text-typography-secondary text-center">
                This feature is under development. Check back in a future update!
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  }

  // Auth Stack
  switch (authScreen) {
    case 'login':
      return (
        <LoginScreen
          onBack={() => setAuthScreen('welcome')}
          onForgotPassword={() => console.log('Forgot password')}
        />
      );
    case 'register':
      return (
        <RegisterScreen
          onBack={() => setAuthScreen('welcome')}
        />
      );
    case 'welcome':
    default:
      return (
        <WelcomeScreen
          onLogin={() => setAuthScreen('login')}
          onRegister={() => setAuthScreen('register')}
          onContinueOffline={continueOffline}
        />
      );
  }
}

class GlobalErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean, error: any }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }
  componentDidCatch(error: any, errorInfo: any) {
    console.error('GLOBAL CRASH:', error);
    console.error('Component Stack:', errorInfo.componentStack);
  }
  render() {
    if (this.state.hasError) {
      return (
        <View className="flex-1 items-center justify-center bg-background-primary p-10">
          <Text className="text-red-500 text-xl font-bold mb-4">Application Crash</Text>
          <Text className="text-typography-secondary text-center">
            {String(this.state.error)}
          </Text>
        </View>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <SafeAreaProvider>
      <GlobalErrorBoundary>
        <SyncProvider>
          <ThemeProvider>
            <AuthProvider>
              <AppContent />
              <StatusBar style="light" />
            </AuthProvider>
          </ThemeProvider>
        </SyncProvider>
      </GlobalErrorBoundary>
    </SafeAreaProvider>
  );
}
