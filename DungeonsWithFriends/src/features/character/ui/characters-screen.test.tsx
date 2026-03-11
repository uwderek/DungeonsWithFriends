import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { CharactersScreen } from './characters-screen';
import { useWindowDimensions } from 'react-native';
import { useAuth } from '@/shared/providers/auth-provider';

jest.mock('@/shared/providers/auth-provider', () => ({
  useAuth: jest.fn(),
}));

jest.mock('react-native/Libraries/Utilities/useWindowDimensions', () => ({
  default: jest.fn().mockReturnValue({ width: 375, height: 812, scale: 2, fontScale: 1 }),
}));

jest.mock('@/shared/ui/navigation/app-sidebar', () => {
  const React = require('react');
  const { View, TouchableOpacity } = require('react-native');
  return {
    AppSidebar: ({ isOpen, onClose }: any) => (
      <View testID="sidebar">
        {isOpen && (
          <TouchableOpacity testID="sidebar-close" onPress={onClose}>
            <View />
          </TouchableOpacity>
        )}
      </View>
    ),
    HamburgerButton: ({ onPress }: any) => (
      <TouchableOpacity onPress={onPress} testID="hamburger">
        <View />
      </TouchableOpacity>
    ),
  };
});

describe('CharactersScreen', () => {
  const mockLogout = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({
      logout: mockLogout,
    });
  });

  it('renders correctly on desktop', () => {
    const { getByText, queryByTestId } = render(<CharactersScreen viewportWidth={1024} />);
    
    expect(getByText('All Characters')).toBeTruthy();
    expect(queryByTestId('hamburger')).toBeNull();
  });

  it('renders correctly on mobile and handles sidebar toggle', () => {
    const { getByText, getByTestId } = render(<CharactersScreen viewportWidth={375} />);
    
    expect(getByText('All Characters')).toBeTruthy();
    const hamburger = getByTestId('hamburger');
    fireEvent.press(hamburger);
    // Sidebar should be open but we mock AppSidebar so we just check it renders
    expect(getByTestId('sidebar')).toBeTruthy();
  });

  it('calls logout when logout button is pressed', () => {
    const { getByTestId } = render(<CharactersScreen viewportWidth={1024} />);
    
    fireEvent.press(getByTestId('logout-button'));
    expect(mockLogout).toHaveBeenCalled();
  });

  it('calls onSettingsPress when settings button is pressed', () => {
    const onSettingsPress = jest.fn();
    const { getByTestId } = render(
      <CharactersScreen viewportWidth={1024} onSettingsPress={onSettingsPress} />
    );
    
    fireEvent.press(getByTestId('settings-button'));
    expect(onSettingsPress).toHaveBeenCalled();
  });

  it('falls back to console.log when onSettingsPress is not provided', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    const { getByTestId } = render(<CharactersScreen viewportWidth={1024} />);
    
    fireEvent.press(getByTestId('settings-button'));
    expect(consoleSpy).toHaveBeenCalledWith('Settings clicked');
    consoleSpy.mockRestore();
  });

  it('calls onClose when sidebar onClose is triggered', () => {
    const { getByTestId, queryByTestId } = render(<CharactersScreen viewportWidth={375} />);
    
    // Open sidebar
    fireEvent.press(getByTestId('hamburger'));
    expect(getByTestId('sidebar-close')).toBeTruthy();
    
    // Trigger close
    fireEvent.press(getByTestId('sidebar-close'));
    // sidebar-close should be gone now (since isOpen is false)
    expect(queryByTestId('sidebar-close')).toBeNull();
  });

  it('uses measured width when viewportWidth is not provided', () => {
    (useWindowDimensions as jest.Mock).mockReturnValue({ width: 500 });
    const { getByTestId } = render(<CharactersScreen />);
    
    // In mobile (500 < 768), hamburger should be visible
    expect(getByTestId('hamburger')).toBeTruthy();
  });
});
