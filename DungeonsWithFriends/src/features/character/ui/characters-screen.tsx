import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Settings, LogOut } from 'lucide-react-native';
import { useAuth } from '@/shared/providers/auth-provider';
import { AppSidebar, HamburgerButton } from '@/shared/ui/navigation/app-sidebar';
import { CharacterGrid } from './character-grid';
import { FriendsList } from '@/features/friends/ui/friends-list';
import { characters, friends } from '@/features/dashboard/ui/mock-data';

export const CharactersScreen: React.FC<{ 
  onNavigate?: (id: string) => void;
  onSettingsPress?: () => void;
  viewportWidth?: number;
}> = ({ onNavigate, onSettingsPress, viewportWidth }) => {
  const { logout } = useAuth();
  const { width: measuredWidth } = useWindowDimensions();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const width = viewportWidth ?? measuredWidth;
  const isDesktop = width >= 768;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000000' }}>
      <View style={{ flex: 1, flexDirection: 'row' }}>
        {/* Sidebar - Desktop always visible, Mobile in modal */}
        <AppSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          activeId="characters"
          onNavigate={onNavigate}
        />

        {/* Main Content */}
        <View style={{ flex: 1 }}>
          {/* Header */}
          <View
            style={{
              height: 56,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: 16,
              borderBottomWidth: 1,
              borderBottomColor: '#312E81'
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              {!isDesktop && (
                <HamburgerButton onPress={() => setSidebarOpen(true)} />
              )}
              <Text style={{ fontSize: 14, color: '#6B7280', letterSpacing: 0.5 }}>
                Characters
              </Text>
            </View>

            <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity
                testID="settings-button"
                accessibilityRole="button"
                onPress={() => {
                  if (onSettingsPress) {
                    onSettingsPress();
                  } else {
                    console.log('Settings clicked');
                  }
                }}
                style={{
                  height: 40,
                  width: 40,
                  borderRadius: 20,
                  backgroundColor: '#1E1B4B',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 1,
                  borderColor: '#312E81'
                }}
              >
                <Settings size={20} color="#9CA3AF" />
              </TouchableOpacity>

              <TouchableOpacity
                testID="logout-button"
                accessibilityRole="button"
                onPress={logout}
                style={{
                  height: 40,
                  width: 40,
                  borderRadius: 20,
                  backgroundColor: '#1E1B4B',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 1,
                  borderColor: '#312E81'
                }}
              >
                <LogOut size={18} color="#DC2626" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Scrollable Content */}
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ padding: 24 }}
            showsVerticalScrollIndicator={false}
          >
            <View style={{ maxWidth: 1200, alignSelf: 'center', width: '100%' }}>
              {/* Page Title */}
              <Text
                style={{
                  fontFamily: 'Cinzel',
                  fontSize: 28,
                  fontWeight: '700',
                  color: '#D97706',
                  marginBottom: 24
                }}
              >
                All Characters
              </Text>

              {/* Main Content Layout */}
              <View style={{ flexDirection: isDesktop ? 'row' : 'column', gap: 32 }}>
                {/* Left Column - All Characters */}
                <View style={{ flex: 1 }}>
                  <CharacterGrid characters={characters} title="Characters" />
                </View>

                {/* Right Column - Friends (Desktop only) */}
                {isDesktop && (
                  <View style={{ width: 256 }}>
                    <FriendsList friends={friends} />
                  </View>
                )}
              </View>

              {/* Friends List (Mobile - at bottom) */}
              {!isDesktop && (
                <View style={{ marginTop: 32 }}>
                  <FriendsList friends={friends} />
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};
