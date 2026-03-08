import React from 'react';
import { View, Text } from 'react-native';
import { Sparkles } from 'lucide-react-native';
import type { Friend } from '@/features/dashboard/ui/mock-data';

interface FriendAvatarsProps {
  friendIds: string[];
  friends: Friend[];
}

export const FriendAvatars: React.FC<FriendAvatarsProps> = ({ friendIds, friends }) => {
  const matched = friends.filter((f) => friendIds.includes(f.id));

  if (matched.length === 0) return null;

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 6 }}>
      <Sparkles size={12} color="#D97706" />

      <View style={{ flexDirection: 'row', marginLeft: 2 }}>
        {matched.map((f, index) => (
          <View
            key={f.id}
            style={{
              height: 20,
              width: 20,
              borderRadius: 10,
              backgroundColor: '#312E81',
              borderWidth: 1,
              borderColor: '#1E1B4B',
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: index > 0 ? -6 : 0,
              zIndex: matched.length - index
            }}
          >
            <Text style={{ fontSize: 10, fontWeight: '500', color: '#D97706' }}>
              {f.avatar}
            </Text>
          </View>
        ))}
      </View>

      <Text style={{ fontSize: 12, color: '#6B7280', marginLeft: 4 }}>
        {matched.map((f) => f.name).join(', ')}
      </Text>
    </View>
  );
};
