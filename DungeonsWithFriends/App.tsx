import "./global.css";
import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { AuthProvider, useAuth } from "@/shared/providers/auth-provider";
import { SyncProvider } from "@/shared/providers/sync-provider";
import { ThemeProvider } from "@/shared/theme/theme-provider";
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Features
import { WelcomeScreen } from "@/features/auth/ui/welcome-screen";
import { LoginScreen } from "@/features/auth/ui/login-screen";
import { RegisterScreen } from "@/features/auth/ui/register-screen";
import { DashboardScreen } from "@/features/dashboard/ui/dashboard-screen";

// Shared UI
import { BottomTabBar } from "@/shared/ui/navigation/bottom-tab-bar";

function AppContent() {
  const { isAuthenticated, offlineMode, isLoading } = useAuth();
  const [authScreen, setAuthScreen] = useState<'welcome' | 'login' | 'register'>('welcome');
  const [activeTab, setActiveTab] = useState<'home' | 'campaigns' | 'characters' | 'friends' | 'settings'>('home');

  if (isLoading) {
    return (
      <View className="flex-1 bg-background-primary items-center justify-center" />
    );
  }

  // authenticated or offline-first access
  if (isAuthenticated || offlineMode) {
    return (
      <View className="flex-1">
        <View className="flex-1 pb-20 lg:pb-0 lg:pl-64">
          <DashboardScreen />
        </View>
        <BottomTabBar
          activeTab={activeTab}
          onTabPress={setActiveTab}
        />
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
        />
      );
  }
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <SyncProvider>
          <AuthProvider>
            <AppContent />
            <StatusBar style="light" />
          </AuthProvider>
        </SyncProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
