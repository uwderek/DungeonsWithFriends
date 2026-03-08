import React from 'react';
import { render } from '@testing-library/react-native';
import { DashboardScreen } from './dashboard-screen';
import { AuthProvider } from '@/shared/providers/auth-provider';

// Mock Lucide icons
jest.mock('lucide-react-native', () => ({
    Settings: () => null,
    LogOut: () => null,
    Swords: () => null,
    PlusCircle: () => null,
    Users: () => null,
}));

// Mock AuthProvider
jest.mock('@/shared/providers/auth-provider', () => ({
    useAuth: jest.fn(() => ({
        user: { email: 'test@example.com' },
        logout: jest.fn(),
        offlineMode: false,
    })),
}));

// Mock feature cards
jest.mock('@/features/campaign/ui/campaign-card', () => ({
    CampaignCard: ({ title }: any) => <>{title}</>,
}));
jest.mock('@/features/character/ui/character-card', () => ({
    CharacterCard: ({ name }: any) => <>{name}</>,
}));
jest.mock('@/features/story/ui/story-card', () => ({
    StoryCard: ({ title }: any) => <>{title}</>,
}));

describe('DashboardScreen', () => {
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
});
