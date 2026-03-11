import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { AppSidebar } from './app-sidebar';

describe('AppSidebar', () => {
    const defaultProps = {
        isOpen: true,
        onClose: jest.fn(),
        onNavigate: jest.fn(),
        activeId: 'home',
    };

    it('renders desktop version when viewportWidth >= 768', () => {
        const { getByText, queryByTestId } = render(
            <AppSidebar {...defaultProps} viewportWidth={1024} />
        );

        expect(getByText('Dungeons with Friends')).toBeTruthy();
        expect(getByText('Dashboard')).toBeTruthy();
        // Desktop shouldn't have a close button in header (X icon)
        // Note: Lucide icons are mocked, we can check for their presence via name or specific testID if added
    });

    it('renders mobile version with backdrop when isOpen is true and viewportWidth < 768', () => {
        const { getByText, getByRole } = render(
            <AppSidebar {...defaultProps} viewportWidth={375} />
        );

        expect(getByText('Dashboard')).toBeTruthy();
    });

    it('calls onNavigate and onClose when a nav item is clicked in mobile', () => {
        const onNavigate = jest.fn();
        const onClose = jest.fn();
        const { getByText } = render(
            <AppSidebar 
                {...defaultProps} 
                onNavigate={onNavigate} 
                onClose={onClose} 
                viewportWidth={375} 
            />
        );

        fireEvent.press(getByText('Characters'));
        expect(onNavigate).toHaveBeenCalledWith('characters');
        expect(onClose).toHaveBeenCalled();
    });

    it('calls onNavigate but NOT onClose when a nav item is clicked in desktop', () => {
        const onNavigate = jest.fn();
        const onClose = jest.fn();
        const { getByText } = render(
            <AppSidebar 
                {...defaultProps} 
                onNavigate={onNavigate} 
                onClose={onClose} 
                viewportWidth={1024} 
            />
        );

        fireEvent.press(getByText('Characters'));
        expect(onNavigate).toHaveBeenCalledWith('characters');
        expect(onClose).not.toHaveBeenCalled();
    });

    it('calls onClose when backdrop is pressed in mobile', () => {
        const onClose = jest.fn();
        const { getByTestId } = render(
            <AppSidebar {...defaultProps} onClose={onClose} viewportWidth={375} />
        );

        fireEvent.press(getByTestId('sidebar-backdrop'));
        expect(onClose).toHaveBeenCalled();
    });

    it('logs to console when onNavigate is not provided', () => {
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
        const { getByText } = render(
            <AppSidebar isOpen={true} onClose={jest.fn()} viewportWidth={1024} />
        );

        fireEvent.press(getByText('Characters'));
        expect(consoleSpy).toHaveBeenCalledWith('Navigate to:', '/characters');
        consoleSpy.mockRestore();
    });

    it('logs to console when a friend is clicked', () => {
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
        const { getByText } = render(
            <AppSidebar {...defaultProps} viewportWidth={1024} />
        );

        fireEvent.press(getByText('Ravenna'));
        expect(consoleSpy).toHaveBeenCalledWith('Friend clicked:', 'Ravenna');
        consoleSpy.mockRestore();
    });

    it('uses measured width when viewportWidth is not provided', () => {
        const { getByText } = render(
            <AppSidebar {...defaultProps} />
        );
        expect(getByText('Dashboard')).toBeTruthy();
    });
});

import { HamburgerButton } from './app-sidebar';

describe('HamburgerButton', () => {
    it('calls onPress when clicked', () => {
        const onPress = jest.fn();
        const { getByRole } = render(<HamburgerButton onPress={onPress} />);
        fireEvent.press(getByRole('button'));
        expect(onPress).toHaveBeenCalled();
    });
});
