import React from 'react';
import { View, Text } from 'react-native';
import { CharacterCard } from './character-card';

export interface CharacterGridItem {
  id: string;
  name: string;
  race?: string;
  class?: string;
  level?: number;
  subtitle?: string;
  detail?: string;
}

interface CharacterGridProps {
  characters: CharacterGridItem[];
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
              subtitle={item.subtitle}
              detail={item.detail}
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
