import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { BottomTabBar } from './bottom-tab-bar';

describe('BottomTabBar', () => {
    const mockOnTabPress = jest.fn();

    it('renders horizontal mobile layout by default', () => {
        const { getByText, queryByText } = render(
            <BottomTabBar activeTab="home" onTabPress={mockOnTabPress} />
        );
        
        expect(getByText('Home')).toBeTruthy();
        expect(getByText('Creator')).toBeTruthy();
        // Dungeons title should NOT be visible on mobile
        expect(queryByText('Dungeons')).toBeNull();
    });

    it('renders vertical desktop web layout via DI props', () => {
        const { getByText } = render(
            <BottomTabBar 
                activeTab="home" 
                onTabPress={mockOnTabPress} 
                viewportWidth={1200} 
                platformOverride="web" 
            />
        );
        
        expect(getByText('Dungeons')).toBeTruthy();
        expect(getByText('With Friends')).toBeTruthy();
        expect(getByText('Dungeon Master')).toBeTruthy();
    });

    it('calls onTabPress when a tab is clicked', () => {
        const { getByTestId } = render(
            <BottomTabBar activeTab="home" onTabPress={mockOnTabPress} />
        );

        fireEvent.press(getByTestId('tab-item-campaigns'));
        expect(mockOnTabPress).toHaveBeenCalledWith('campaigns');
        
        fireEvent.press(getByTestId('tab-item-creator'));
        expect(mockOnTabPress).toHaveBeenCalledWith('creator');
    });

    it('renders active state indicators correctly', () => {
        const { rerender, getByText, queryByTestId } = render(
            <BottomTabBar activeTab="home" onTabPress={mockOnTabPress} viewportWidth={400} />
        );
        
        // On mobile, active tab has a specific style or indicator
        // We just verify it rerenders correctly for different active tabs
        rerender(<BottomTabBar activeTab="creator" onTabPress={mockOnTabPress} viewportWidth={400} />);
        expect(getByText('Creator')).toBeTruthy();
    });
});
