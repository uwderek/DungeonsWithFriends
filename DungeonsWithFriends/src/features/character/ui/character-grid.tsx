import React from 'react';
import { View, Text, FlatList, TouchableOpacity, useWindowDimensions } from 'react-native';
import { Shield, Heart } from 'lucide-react-native';
import type { Character } from '@/features/dashboard/ui/mock-data';

interface CharacterGridProps {
  characters: Character[];
  title?: string;
}

export const CharacterGrid: React.FC<CharacterGridProps> = ({ characters, title = "Characters" }) => {
  const { width } = useWindowDimensions();

  const getNumColumns = () => {
    if (width < 400) return 1;
    if (width < 800) return 2;
    return 3;
  };

  const numColumns = getNumColumns();
  const cardWidth = (width - 48 - (numColumns - 1) * 16) / numColumns;

  const renderItem = ({ item, index }: { item: Character; index: number }) => {
    const hpPercentage = (item.hp / item.maxHp) * 100;

    return (
      <TouchableOpacity
        onPress={() => console.log('Character clicked:', item.id)}
        activeOpacity={0.7}
        style={{
          width: numColumns === 1 ? '100%' : cardWidth,
          backgroundColor: '#1E1B4B',
          borderRadius: 8,
          padding: 16,
          borderWidth: 1,
          borderColor: '#312E81',
          marginBottom: 16,
          marginRight: (index + 1) % numColumns !== 0 ? 16 : 0
        }}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontFamily: 'Cinzel',
                fontSize: 16,
                fontWeight: '600',
                color: '#D97706',
                marginBottom: 4
              }}
            >
              {item.name}
            </Text>
            <Text style={{ fontSize: 14, color: '#9CA3AF' }}>
              {item.race} {item.class} · Lvl {item.level}
            </Text>
          </View>
          <Shield size={20} color="#9CA3AF" />
        </View>

        <Text style={{ fontSize: 12, color: '#6B7280', marginTop: 12 }}>
          {item.campaignName}
        </Text>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12, gap: 8 }}>
          <Heart size={14} color="#DC2626" />
          <View
            style={{
              flex: 1,
              height: 6,
              backgroundColor: '#312E81',
              borderRadius: 3,
              overflow: 'hidden'
            }}
          >
            <View
              style={{
                height: '100%',
                width: `${hpPercentage}%`,
                backgroundColor: '#DC2626',
                borderRadius: 3
              }}
            />
          </View>
          <Text style={{ fontSize: 12, color: '#9CA3AF' }}>
            {item.hp}/{item.maxHp}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

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
      <FlatList
        data={characters}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        key={numColumns}
        scrollEnabled={false}
        contentContainerStyle={{ paddingBottom: 8 }}
      />
    </View>
  );
};
