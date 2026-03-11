import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Settings, LogOut } from 'lucide-react-native';
import { useAuth } from '@/shared/providers/auth-provider';
import { AppSidebar, HamburgerButton } from '@/shared/ui/navigation/app-sidebar';
import { HeroBanner } from './hero-banner';
import { CharacterGrid } from '@/features/character/ui/character-grid';
import { CampaignSection } from '@/features/campaign/ui/campaign-section';
import { FriendsList } from '@/features/friends/ui/friends-list';
import { heroData, characters, myCampaigns, recruitingCampaigns, friends } from './mock-data';

// Filter characters in active campaigns only for dashboard
const activeCampaignNames = myCampaigns
  .filter(c => c.status === 'active')
  .map(c => c.name);
const activeCharacters = characters.filter(c => activeCampaignNames.includes(c.campaignName));

export const DashboardScreen: React.FC<{ 
  onNavigate?: (id: string) => void;
  onSettingsPress?: () => void;
  viewportWidth?: number;
}> = ({ onNavigate, onSettingsPress, viewportWidth }) => {
  const { logout } = useAuth();
  const { width: measuredWidth } = useWindowDimensions();
  const width = viewportWidth ?? measuredWidth;
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isDesktop = width >= 768;

  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="flex-1 flex-row">
        {/* Sidebar - Desktop always visible, Mobile in modal */}
        <AppSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          activeId="home"
          onNavigate={onNavigate}
        />

        {/* Main Content */}
        <View className="flex-1">
          {/* Header */}
          <View className="h-14 flex-row items-center justify-between px-4 border-b border-indigo-900 bg-black/50 backdrop-blur-md">
            <View className="flex-row items-center gap-3">
              {!isDesktop && (
                <HamburgerButton onPress={() => setSidebarOpen(true)} />
              )}
              <Text className="text-sm text-typography-secondary uppercase tracking-widest font-medium">
                Dashboard
              </Text>
            </View>

            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => onSettingsPress ? onSettingsPress() : console.log('Settings clicked')}
                testID="settings-button"
                accessibilityLabel="Open settings"
                accessibilityRole="button"
                className="h-10 w-10 rounded-full bg-indigo-950/50 items-center justify-center border border-indigo-900 shadow-sm"
              >
                <Settings size={20} color="#9CA3AF" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={logout}
                testID="logout-button"
                accessibilityLabel="Log out"
                accessibilityRole="button"
                className="h-10 w-10 rounded-full bg-indigo-950/50 items-center justify-center border border-indigo-900 shadow-sm"
              >
                <LogOut size={18} color="#DC2626" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Scrollable Content */}
          <ScrollView
            className="flex-1"
            contentContainerStyle={{ padding: width < 640 ? 16 : 24 }}
            showsVerticalScrollIndicator={false}
          >
            <View className="max-w-[1200px] self-center w-full">
              {/* Hero Banner */}
              <HeroBanner data={heroData} />

              {/* Main Content Layout */}
              <View className="mt-8 flex-col md:flex-row gap-8 items-start">
                {/* Left Column - Character & Campaigns */}
                <View className="w-full md:flex-[3] gap-8">
                  {/* Active Characters */}
                  <CharacterGrid characters={activeCharacters} title="Characters" />

                  {/* Campaigns */}
                  <CampaignSection
                    title="Campaigns"
                    campaigns={myCampaigns}
                    friends={friends}
                  />

                  {/* Recruiting Campaigns */}
                  <CampaignSection
                    title="Recruiting"
                    campaigns={recruitingCampaigns}
                    friends={friends}
                    showJoinButton
                  />
                </View>

                {/* Right Column - Friends (Always rendered, responsive position) */}
                <View className="w-full md:w-64 lg:w-80 md:sticky md:top-8">
                  <FriendsList friends={friends} />
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};
