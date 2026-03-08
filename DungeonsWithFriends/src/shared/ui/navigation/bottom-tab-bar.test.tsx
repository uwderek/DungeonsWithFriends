import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Platform } from 'react-native';
import { BottomTabBar } from './bottom-tab-bar';

describe('BottomTabBar', () => {
    const mockOnTabPress = jest.fn();

    beforeEach(() => {
        mockOnTabPress.mockClear();
    });

    it('renders correctly on mobile', () => {
        const { getByText, queryByText } = render(
            <BottomTabBar activeTab="home" onTabPress={mockOnTabPress} />
        );

        expect(getByText('Home')).toBeTruthy();
        expect(getByText('Campaigns')).toBeTruthy();

        // On mobile, labels are shown below icons (captured by the test query)
        // We verify it doesn't crash
    });

    it('calls onTabPress when a tab is pressed', () => {
        const { getByText } = render(
            <BottomTabBar activeTab="home" onTabPress={mockOnTabPress} />
        );

        fireEvent.press(getByText('Campaigns'));
        expect(mockOnTabPress).toHaveBeenCalledWith('campaigns');
    });

    it('renders correctly on desktop', () => {
        // Mock Platform.OS and window.innerWidth
        const originalOS = Platform.OS;
        const originalInnerWidth = global.innerWidth;

        Object.defineProperty(Platform, 'OS', { value: 'web', configurable: true });
        global.innerWidth = 1200;

        const { getByText } = render(
            <BottomTabBar activeTab="home" onTabPress={mockOnTabPress} />
        );

        expect(getByText('Home')).toBeTruthy();
        expect(getByText('Friends')).toBeTruthy();

        // Restore
        Object.defineProperty(Platform, 'OS', { value: originalOS });
        global.innerWidth = originalInnerWidth;
    });
});
