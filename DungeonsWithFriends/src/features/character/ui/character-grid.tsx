import React from 'react';
import { View, Text, FlatList, TouchableOpacity, useWindowDimensions } from 'react-native';
import { Shield, Heart } from 'lucide-react-native';
import { CharacterCard } from './character-card';
import type { Character } from '@/features/dashboard/ui/mock-data';

interface CharacterGridProps {
  characters: Character[];
  title?: string;
  onCharacterPress?: (id: string) => void;
}

export const CharacterGrid: React.FC<CharacterGridProps> = ({ characters, title = "Characters", onCharacterPress }) => {
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
      <View className="flex-row flex-wrap gap-4">
        {characters.map((item) => (
          <View key={item.id} className="w-full sm:w-[48%] lg:w-[31%]">
            <CharacterCard
              name={item.name}
              race={item.race}
              charClass={item.class}
              level={item.level}
              onPress={() => {
                if (onCharacterPress) {
                  onCharacterPress(item.id);
                } else {
                  console.log('Character clicked:', item.id);
                }
              }}
            />
          </View>
        ))}
      </View>
    </View>
  );
};
