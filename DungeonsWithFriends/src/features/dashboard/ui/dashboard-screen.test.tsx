import React from 'react';
import { Text } from 'react-native';
import { render } from '@testing-library/react-native';
import { DashboardScreen } from './dashboard-screen';

// Mock Lucide icons
jest.mock('lucide-react-native', () => ({
    Settings: () => null,
    LogOut: () => null,
    Swords: () => null,
    PlusCircle: () => null,
    Users: () => null,
}));

const mockUseAuth = jest.fn();

// Mock AuthProvider
jest.mock('@/shared/providers/auth-provider', () => ({
    useAuth: () => mockUseAuth(),
}));

// Mock feature cards
jest.mock('@/features/campaign/ui/campaign-card', () => {
    const { Text } = require('react-native');
    return { CampaignCard: ({ title }: any) => <Text>{title}</Text> };
});
jest.mock('@/features/character/ui/character-card', () => {
    const { Text } = require('react-native');
    return { CharacterCard: ({ name }: any) => <Text>{name}</Text> };
});
jest.mock('@/features/story/ui/story-card', () => {
    const { Text } = require('react-native');
    return { StoryCard: ({ title }: any) => <Text>{title}</Text> };
});

describe('DashboardScreen', () => {
    beforeEach(() => {
        mockUseAuth.mockReturnValue({
            user: { email: 'test@example.com' },
            logout: jest.fn(),
            offlineMode: false,
        });
    });

    it('renders dashboard title and sections', () => {
        const { getByText } = render(<DashboardScreen />);

        expect(getByText(/Dashboard/i)).toBeTruthy();
        expect(getByText(/Active Campaigns/i)).toBeTruthy();
        expect(getByText(/Your Heroes/i)).toBeTruthy();
        expect(getByText(/The Chronicle/i)).toBeTruthy();
    });

    it('renders greeting subtitle', () => {
        const { getByText } = render(<DashboardScreen />);
        expect(getByText(/Adventure Awaits/i)).toBeTruthy();
    });

    it('shows "Local Vault" in offline mode', () => {
        mockUseAuth.mockReturnValue({
            user: null,
            logout: jest.fn(),
            offlineMode: true,
        });

        const { getByText } = render(<DashboardScreen />);
        expect(getByText(/Local Vault/i)).toBeTruthy();
    });

    it('shows "Dashboard" when not in offline mode', () => {
        const { getByText } = render(<DashboardScreen />);
        expect(getByText(/Dashboard/)).toBeTruthy();
    });

    it('renders campaign cards', () => {
        const { getByText } = render(<DashboardScreen />);
        expect(getByText(/The Frozen Reach/i)).toBeTruthy();
        expect(getByText(/Shadows over Oakhaven/i)).toBeTruthy();
    });

    it('renders character cards', () => {
        const { getByText } = render(<DashboardScreen />);
        expect(getByText(/Thrain Ironfoot/i)).toBeTruthy();
        expect(getByText(/Elowen Swiftwind/i)).toBeTruthy();
    });

    it('renders story cards', () => {
        const { getByText } = render(<DashboardScreen />);
        expect(getByText(/The Bridge of Khazad-dûm/i)).toBeTruthy();
    });
});
