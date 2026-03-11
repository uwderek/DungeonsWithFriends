import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Users, Clock } from 'lucide-react-native';
import type { Campaign, Friend } from '@/features/dashboard/ui/mock-data';
import { StatusBadge } from '@/shared/ui/atoms/status-badge';
import { FriendAvatars } from '@/shared/ui/molecules/friend-avatars';

interface CampaignSectionProps {
  title: string;
  campaigns: Campaign[];
  friends: Friend[];
  showJoinButton?: boolean;
  onCampaignPress?: (campaignId: string) => void;
  onJoinPress?: (campaignId: string) => void;
}

export const CampaignSection: React.FC<CampaignSectionProps> = ({
  title,
  campaigns,
  friends,
  showJoinButton = false,
  onCampaignPress,
  onJoinPress
}) => {
  const sorted = [...campaigns].sort((a, b) => b.friendsJoined.length - a.friendsJoined.length);

  return (
    <View>
      <Text
        style={{
          fontFamily: 'Cinzel',
          fontSize: 20,
          fontWeight: '600',
          color: '#FFFFFF',
          marginBottom: 16
        }}
      >
        {title}
      </Text>

      <View className="gap-4">
        {sorted.map((campaign) => (
          <TouchableOpacity
            key={campaign.id}
            onPress={() => {
              if (onCampaignPress) {
                onCampaignPress(campaign.id);
              } else {
                console.log('Campaign clicked:', campaign.id);
              }
            }}
            activeOpacity={0.7}
            className={`bg-background-secondary rounded-xl p-4 border border-border-primary`}
          >
            <View className="flex-col sm:flex-row justify-between items-start gap-4">
              <View className="flex-1 shrink">
                <View className="flex-row items-center gap-2 flex-wrap mb-1">
                  <Text
                    style={{
                      fontFamily: 'Cinzel',
                      fontSize: 16,
                      fontWeight: '700',
                      color: '#FFFFFF'
                    }}
                    className="shrink"
                    numberOfLines={1}
                  >
                    {campaign.name}
                  </Text>
                  <StatusBadge status={campaign.status} />
                </View>

                <Text className="text-sm text-typography-secondary mb-3 shrink" numberOfLines={2}>
                  {campaign.description}
                </Text>

                <View className="flex-row items-center gap-4 flex-wrap">
                  <View className="flex-row items-center gap-1">
                    <Users size={12} color="#6B7280" />
                    <Text className="text-xs text-typography-secondary">
                      {campaign.players}/{campaign.maxPlayers}
                    </Text>
                  </View>

                  <Text className="text-xs text-typography-secondary font-medium">
                    {campaign.system}
                  </Text>

                  {campaign.nextSession && (
                    <View className="flex-row items-center gap-1">
                      <Clock size={12} color="#6B7280" />
                      <Text className="text-xs text-typography-secondary" numberOfLines={1}>
                        {campaign.nextSession}
                      </Text>
                    </View>
                  )}
                </View>

                <View className="mt-3">
                  <FriendAvatars friendIds={campaign.friendsJoined} friends={friends} />
                </View>
              </View>

              {showJoinButton && (
                <TouchableOpacity
                  onPress={() => {
                    if (onJoinPress) {
                      onJoinPress(campaign.id);
                    } else {
                      console.log('Join clicked for campaign:', campaign.id);
                    }
                  }}
                  activeOpacity={0.7}
                  className="px-4 py-2 rounded-lg border border-accent-secondary self-start sm:self-center"
                >
                  <Text className="text-xs color-accent-secondary font-bold uppercase tracking-wider">
                    Join
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};
