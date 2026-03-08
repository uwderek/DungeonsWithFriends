import React from 'react';
import { View, Text, useWindowDimensions } from 'react-native';
import type { HeroData } from './mock-data';

interface HeroBannerProps {
  data: HeroData;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ data }) => {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  return (
    <View
      style={{
        height: isDesktop ? 256 : 200,
        width: '100%',
        borderRadius: 8,
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: '#0F172A'
      }}
    >
      {/* Gradient background simulating the dungeon hero image effect */}
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: '#0F172A',
          opacity: 0.6
        }}
      />
      
      {/* Left gradient overlay */}
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: '#000000',
          opacity: 0.4
        }}
      />

      {/* Content */}
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          paddingHorizontal: 32,
          zIndex: 1
        }}
      >
        <Text
          style={{
            fontFamily: 'Cinzel',
            fontSize: isDesktop ? 36 : 28,
            fontWeight: '700',
            color: '#D97706',
            marginBottom: 8
          }}
        >
          Welcome back, {data.userName}
        </Text>
        <Text
          style={{
            fontSize: 16,
            color: 'rgba(255, 255, 255, 0.7)',
            maxWidth: 500
          }}
        >
          Your next session of{' '}
          <Text style={{ color: '#D97706', fontWeight: '500' }}>
            {data.campaignName}
          </Text>
          {' '}begins {data.nextSession}. The party awaits.
        </Text>
      </View>
    </View>
  );
};
