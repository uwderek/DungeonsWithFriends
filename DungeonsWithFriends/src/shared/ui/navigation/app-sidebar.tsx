import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Animated, useWindowDimensions } from 'react-native';
import { Sword, Map, CalendarDays, BookOpen, Users, HelpCircle, Menu, X, User, Database } from 'lucide-react-native';

const navItems = [
  { id: "home", title: "Dashboard", icon: Sword, url: "/" },
  { id: "characters", title: "Characters", icon: User, url: "/characters" },
  { id: "campaigns", title: "Campaigns", icon: Map, url: "/campaigns" },
  { id: "schedule", title: "Schedule", icon: CalendarDays, url: "/schedule" },
  { id: "adventures", title: "New Adventure", icon: BookOpen, url: "/adventures" },
  { id: "friends", title: "Friends", icon: Users, url: "/friends" },
  { id: "creator", title: "Creator", icon: Database, url: "/creator" },
  { id: "rules", title: "Rules Help", icon: HelpCircle, url: "/rules" }
];

interface Friend {
  name: string;
  avatar: string;
  online: boolean;
}

interface NavItem {
  id: string;
  title: string;
  icon: any;
  url: string;
}

interface AppSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeId?: string;
  onNavigate?: (id: string) => void;
  friends?: Friend[];
  items?: NavItem[];
  viewportWidth?: number;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({ 
  isOpen, 
  onClose, 
  activeId, 
  onNavigate,
  friends = [
    { name: 'Ravenna', avatar: 'R', online: true },
    { name: 'Thorin', avatar: 'T', online: true },
    { name: 'Lyria', avatar: 'L', online: false },
    { name: 'Gareth', avatar: 'G', online: true }
  ],
  items = navItems,
  viewportWidth
}) => {
  const { width: measuredWidth } = useWindowDimensions();
  const width = viewportWidth ?? measuredWidth;
  const isDesktop = width >= 768;

  // Mobile animation hooks - must be called before any conditional returns
  const slideAnim = React.useRef(new Animated.Value(isOpen ? 0 : -240)).current;

  React.useEffect(() => {
    if (!isDesktop) {
      Animated.timing(slideAnim, {
        toValue: isOpen ? 0 : -240,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [isOpen, isDesktop]);

  const SidebarContent = () => (
    <View
      style={{
        backgroundColor: '#0F172A',
        borderRightWidth: 1,
        borderRightColor: '#312E81',
        width: 240,
        height: '100%'
      }}
    >
      {/* Header */}
      <View style={{ padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <View
          style={{
            height: 32,
            width: 32,
            borderRadius: 8,
            backgroundColor: '#D97706',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Sword size={20} color="#FFFFFF" />
        </View>
        <Text
          style={{
            fontFamily: 'Cinzel',
            fontSize: 14,
            fontWeight: '700',
            color: '#D97706',
            letterSpacing: 0.5
          }}
        >
          Dungeons with Friends
        </Text>
        {!isDesktop && (
          <TouchableOpacity
            onPress={onClose}
            style={{ marginLeft: 'auto' }}
          >
            <X size={24} color="#9CA3AF" />
          </TouchableOpacity>
        )}
      </View>

      {/* Navigation */}
      <ScrollView style={{ flex: 1, paddingHorizontal: 12, paddingTop: 16 }}>
        {items.map((item) => {
          const isActive = activeId === item.id;
          return (
            <TouchableOpacity
              key={item.id}
              testID={`nav-item-${item.id}`}
              onPress={() => {
                if (onNavigate) {
                  onNavigate(item.id);
                } else {
                  console.log('Navigate to:', item.url);
                }
                if (!isDesktop) onClose();
              }}
              activeOpacity={0.7}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
                paddingVertical: 12,
                paddingHorizontal: 12,
                borderRadius: 6,
                marginBottom: 4,
                backgroundColor: isActive ? '#1E1B4B' : 'transparent'
              }}
            >
              <item.icon size={18} color={isActive ? "#D97706" : "#9CA3AF"} />
              <Text style={{ fontSize: 14, color: isActive ? "#FFFFFF" : '#9CA3AF', fontWeight: isActive ? '600' : '400' }}>
                {item.title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Friends Section */}
      <View style={{ paddingHorizontal: 16, paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#312E81' }}>
        <Text style={{ fontFamily: 'Cinzel', fontSize: 12, fontWeight: '600', color: '#6B7280', marginBottom: 12 }}>
          Friends
        </Text>
        <View style={{ gap: 8 }}>
          {friends.map((friend) => (
            <TouchableOpacity
              key={friend.name}
              onPress={() => console.log('Friend clicked:', friend.name)}
              activeOpacity={0.7}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
            >
              <View style={{ position: 'relative' }}>
                <View
                  style={{
                    height: 24,
                    width: 24,
                    borderRadius: 12,
                    backgroundColor: '#312E81',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Text style={{ fontSize: 10, fontWeight: '500', color: '#D97706' }}>
                    {friend.avatar}
                  </Text>
                </View>
                <View
                  style={{
                    position: 'absolute',
                    bottom: -1,
                    right: -1,
                    height: 8,
                    width: 8,
                    borderRadius: 4,
                    borderWidth: 1,
                    borderColor: '#0F172A',
                    backgroundColor: friend.online ? '#10B981' : '#6B7280'
                  }}
                />
              </View>
              <Text style={{ fontSize: 12, color: '#FFFFFF' }}>{friend.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Footer */}
      <View
        style={{
          padding: 16,
          borderTopWidth: 1,
          borderTopColor: '#312E81',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12
        }}
      >
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
          <Text style={{ fontSize: 14, fontWeight: '600', color: '#D97706' }}>
            K
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 14, fontWeight: '500', color: '#FFFFFF' }}>
            Kaelith
          </Text>
          <Text style={{ fontSize: 12, color: '#6B7280' }}>
            Online
          </Text>
        </View>
        <View
          style={{
            height: 8,
            width: 8,
            borderRadius: 4,
            backgroundColor: '#10B981'
          }}
        />
      </View>
    </View>
  );

  if (isDesktop) {
    return <SidebarContent />;
  }

  // Mobile: render with animation
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <TouchableOpacity
          testID="sidebar-backdrop"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1
          }}
          onPress={onClose}
          activeOpacity={1}
        />
      )}
      {/* Sliding Sidebar */}
      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          width: 240,
          zIndex: 2,
          transform: [{ translateX: slideAnim }]
        }}
      >
        <SidebarContent />
      </Animated.View>
    </>
  );
};

export const HamburgerButton: React.FC<{ onPress: () => void }> = ({ onPress }) => (
  <TouchableOpacity 
    onPress={onPress} 
    style={{ padding: 8 }}
    accessibilityRole="button"
    testID="hamburger-button"
  >
    <Menu size={24} color="#FFFFFF" />
  </TouchableOpacity>
);
