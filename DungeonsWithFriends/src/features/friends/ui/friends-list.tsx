import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import type { Friend } from '@/features/dashboard/ui/mock-data';

interface FriendsListProps {
  friends: Friend[];
  onFriendPress?: (id: string) => void;
}

export const FriendsList: React.FC<FriendsListProps> = ({ friends, onFriendPress }) => {
  const sortedFriends = [...friends].sort((a, b) => (b.online ? 1 : 0) - (a.online ? 1 : 0));

  return (
    <View className="bg-background-secondary rounded-xl p-4 border border-border-primary w-full">
      <Text
        style={{
          fontFamily: 'Cinzel',
          fontSize: 14,
          fontWeight: '600',
          color: '#FFFFFF',
          marginBottom: 16
        }}
      >
        Friends
      </Text>

      <View style={{ gap: 12 }}>
        {sortedFriends.map((friend) => (
          <TouchableOpacity
            key={friend.id}
            onPress={() => onFriendPress ? onFriendPress(friend.id) : console.log('Friend clicked:', friend.id)}
            testID={`friend-item-${friend.id}`}
            activeOpacity={0.7}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}
          >
            <View style={{ position: 'relative' }}>
              <View
                style={{
                  height: 32,
                  width: 32,
                  borderRadius: 16,
                  backgroundColor: '#312E81',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Text style={{ fontSize: 12, fontWeight: '500', color: '#D97706' }}>
                  {friend.avatar}
                </Text>
              </View>
              <View
                style={{
                  position: 'absolute',
                  bottom: -2,
                  right: -2,
                  height: 10,
                  width: 10,
                  borderRadius: 5,
                  borderWidth: 2,
                  borderColor: '#1E1B4B',
                  backgroundColor: friend.online ? '#10B981' : '#6B7280'
                }}
              />
            </View>

            <View>
              <Text style={{ fontSize: 14, color: '#FFFFFF' }}>
                {friend.name}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: friend.online ? '#10B981' : '#6B7280'
                }}
              >
                {friend.online ? 'Online' : 'Offline'}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};
