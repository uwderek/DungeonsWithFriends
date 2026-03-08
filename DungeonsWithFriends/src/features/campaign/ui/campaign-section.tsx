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
}

export const CampaignSection: React.FC<CampaignSectionProps> = ({
  title,
  campaigns,
  friends,
  showJoinButton = false
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

      <View style={{ gap: 12 }}>
        {sorted.map((campaign, index) => (
          <TouchableOpacity
            key={campaign.id}
            onPress={() => console.log('Campaign clicked:', campaign.id)}
            activeOpacity={0.7}
            style={{
              backgroundColor: '#1E1B4B',
              borderRadius: 8,
              padding: 16,
              borderWidth: 1,
              borderColor: campaign.friendsJoined.length > 0 ? 'rgba(217, 119, 6, 0.2)' : '#312E81'
            }}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <Text
                    style={{
                      fontFamily: 'Cinzel',
                      fontSize: 16,
                      fontWeight: '600',
                      color: '#FFFFFF'
                    }}
                  >
                    {campaign.name}
                  </Text>
                  <StatusBadge status={campaign.status} />
                </View>

                <Text style={{ fontSize: 14, color: '#9CA3AF', marginBottom: 8 }}>
                  {campaign.description}
                </Text>

                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Users size={12} color="#6B7280" />
                    <Text style={{ fontSize: 12, color: '#6B7280' }}>
                      {campaign.players}/{campaign.maxPlayers} players
                    </Text>
                  </View>

                  <Text style={{ fontSize: 12, color: '#6B7280' }}>
                    {campaign.system}
                  </Text>

                  <Text style={{ fontSize: 12, color: '#6B7280' }}>
                    DM: {campaign.dm}
                  </Text>

                  {campaign.nextSession && (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                      <Clock size={12} color="#6B7280" />
                      <Text style={{ fontSize: 12, color: '#6B7280' }}>
                        {campaign.nextSession}
                      </Text>
                    </View>
                  )}
                </View>

                <FriendAvatars friendIds={campaign.friendsJoined} friends={friends} />
              </View>

              {showJoinButton && (
                <TouchableOpacity
                  onPress={() => console.log('Join clicked for campaign:', campaign.id)}
                  activeOpacity={0.7}
                  style={{
                    marginLeft: 12,
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 4,
                    borderWidth: 1,
                    borderColor: '#D97706',
                    backgroundColor: 'transparent'
                  }}
                >
                  <Text style={{ fontSize: 12, color: '#D97706', fontWeight: '500' }}>
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
