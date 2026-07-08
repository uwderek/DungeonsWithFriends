import React from 'react';
import { Text } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import { DashboardScreen } from './dashboard-screen';

// Mock Lucide icons
jest.mock('lucide-react-native', () => ({
    Settings: () => null,
    Swords: () => null,
    PlusCircle: () => null,
    Users: () => null,
    Sword: () => null,
    X: () => null,
    ChevronLeft: () => null,
    ChevronRight: () => null,
    Clock: () => null,
    LayoutDashboard: () => null,
    User: () => null,
    Library: () => null,
    MessageSquare: () => null,
    Map: () => null,
    CalendarDays: () => null,
    BookOpen: () => null,
    HelpCircle: () => null,
    Menu: () => null,
    Database: () => null,
    Sparkles: () => null,
}));

// Mock navigation components
jest.mock('@/shared/ui/navigation/app-sidebar', () => {
    const { TouchableOpacity } = require('react-native');
    return {
        AppSidebar: ({ isOpen, onClose }: any) => isOpen ? (
            <TouchableOpacity onPress={onClose} testID="mock-sidebar-backdrop" />
        ) : null,
        HamburgerButton: ({ onPress }: any) => (
            <TouchableOpacity onPress={onPress} testID="hamburger-button" />
        )
    };
});

describe('DashboardScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders dashboard title and sections', () => {
        const { getAllByText } = render(<DashboardScreen />);

        expect(getAllByText(/Dashboard/i).length).toBeGreaterThan(0);
        expect(getAllByText(/Campaigns/i).length).toBeGreaterThan(0);
        expect(getAllByText(/Characters/i).length).toBeGreaterThan(0);
    });

    it('renders greeting subtitle', () => {
        const { getByText, getAllByText } = render(<DashboardScreen />);
        expect(getByText(/Welcome back/i)).toBeTruthy();
        expect(getAllByText(/Curse of Strahd/i).length).toBeGreaterThan(0);
    });

    it('shows "Dashboard" in the local shell', () => {
        const { getAllByText } = render(<DashboardScreen />);
        expect(getAllByText(/Dashboard/).length).toBeGreaterThan(0);
    });

    it('renders campaign cards', () => {
        const { getAllByText } = render(<DashboardScreen />);
        expect(getAllByText(/Curse of Strahd/i).length).toBeGreaterThan(0);
        expect(getAllByText(/Tomb of the Serpent King/i).length).toBeGreaterThan(0);
    });

    it('renders character cards', () => {
        const { getAllByText } = render(<DashboardScreen />);
        expect(getAllByText(/Kaelith Darkbane/i).length).toBeGreaterThan(0);
        expect(getAllByText(/Brother Aldric/i).length).toBeGreaterThan(0);
    });

    it('calls onSettingsPress when settings button is pressed', () => {
        const onSettingsPress = jest.fn();
        const { getByTestId } = render(<DashboardScreen onSettingsPress={onSettingsPress} />);
        fireEvent.press(getByTestId('settings-button'));
        expect(onSettingsPress).toHaveBeenCalled();
    });

    it('logs to console when settings button is pressed and no handler provided', () => {
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
        const { getByTestId } = render(<DashboardScreen />);
        fireEvent.press(getByTestId('settings-button'));
        expect(consoleSpy).toHaveBeenCalledWith('Settings clicked');
        consoleSpy.mockRestore();
    });

    it('opens and closes the sidebar', () => {
        const { getByTestId, queryByTestId } = render(<DashboardScreen viewportWidth={500} />);
        
        // Initial state: Sidebar closed
        expect(queryByTestId('mock-sidebar-backdrop')).toBeNull();

        // Open
        fireEvent.press(getByTestId('hamburger-button'));
        expect(getByTestId('mock-sidebar-backdrop')).toBeTruthy();

        // Close
        fireEvent.press(getByTestId('mock-sidebar-backdrop'));
        expect(queryByTestId('mock-sidebar-backdrop')).toBeNull();
    });
});
