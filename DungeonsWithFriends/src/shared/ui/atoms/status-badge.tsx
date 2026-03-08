import React from 'react';
import { View, Text } from 'react-native';

export type StatusType = 'active' | 'upcoming' | 'recruiting';

interface StatusBadgeProps {
  status: StatusType;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStyles = () => {
    switch (status) {
      case 'active':
        return {
          backgroundColor: 'rgba(16, 185, 129, 0.15)',
          color: '#10B981',
          borderColor: 'rgba(16, 185, 129, 0.3)'
        };
      case 'upcoming':
        return {
          backgroundColor: 'rgba(217, 119, 6, 0.15)',
          color: '#D97706',
          borderColor: 'rgba(217, 119, 6, 0.3)'
        };
      case 'recruiting':
        return {
          backgroundColor: 'rgba(217, 119, 6, 0.15)',
          color: '#D97706',
          borderColor: 'rgba(217, 119, 6, 0.3)'
        };
      default:
        return {
          backgroundColor: 'rgba(156, 163, 175, 0.15)',
          color: '#9CA3AF',
          borderColor: 'rgba(156, 163, 175, 0.3)'
        };
    }
  };

  const getLabel = () => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'upcoming':
        return 'Upcoming';
      case 'recruiting':
        return 'Recruiting';
      default:
        return status;
    }
  };

  const styles = getStyles();

  return (
    <View
      style={{
        backgroundColor: styles.backgroundColor,
        borderColor: styles.borderColor,
        borderWidth: 1,
        borderRadius: 4,
        paddingHorizontal: 8,
        paddingVertical: 2,
        alignSelf: 'flex-start'
      }}
    >
      <Text
        style={{
          color: styles.color,
          fontSize: 12,
          fontWeight: '500',
          textTransform: 'capitalize'
        }}
      >
        {getLabel()}
      </Text>
    </View>
  );
};
