import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { CampaignSection } from './campaign-section';

jest.mock('lucide-react-native', () => ({
  Clock: () => null,
  ChevronRight: () => null,
  Users: () => null,
  Database: () => null,
}));

const mockCampaigns = [
  {
    id: '1',
    name: 'Campaign 1',
    description: 'Description 1',
    system: '5e',
    dm: 'DM 1',
    status: 'active' as const,
    players: 4,
    maxPlayers: 6,
    friendsJoined: ['u1'],
  },
  {
    id: '2',
    name: 'Campaign 2',
    description: 'Description 2',
    system: 'Pathfinder',
    dm: 'DM 2',
    status: 'recruiting' as const,
    players: 2,
    maxPlayers: 5,
    friendsJoined: ['u1', 'u2'],
    nextSession: 'Tonight',
  },
];

describe('CampaignSection', () => {
  it('renders campaigns and sorts them by friends joined', () => {
    const { getByText, getAllByText } = render(
      <CampaignSection title="Test Campaigns" campaigns={mockCampaigns} friends={[]} />
    );

    expect(getByText('Test Campaigns')).toBeTruthy();
    expect(getByText('Campaign 1')).toBeTruthy();
    expect(getByText('Campaign 2')).toBeTruthy();
    expect(getByText('Tonight')).toBeTruthy();
  });

  it('renders join button when showJoinButton is true', () => {
    const { getAllByText } = render(
      <CampaignSection title="Test Campaigns" campaigns={mockCampaigns} showJoinButton={true} friends={[]} />
    );
    // Should have two join buttons
    expect(getAllByText(/Join/i).length).toBeGreaterThan(0);
  });

  it('calls onCampaignPress when campaign is clicked', () => {
    const onCampaignPress = jest.fn();
    const { getByText } = render(
      <CampaignSection 
        title="Test" 
        campaigns={mockCampaigns} 
        onCampaignPress={onCampaignPress} 
        friends={[]} 
      />
    );

    fireEvent.press(getByText('Campaign 1'));
    expect(onCampaignPress).toHaveBeenCalledWith('1');
  });

  it('calls onJoinPress when join is clicked', () => {
    const onJoinPress = jest.fn();
    const { getAllByText } = render(
      <CampaignSection 
        title="Test" 
        campaigns={mockCampaigns} 
        showJoinButton={true} 
        onJoinPress={onJoinPress} 
        friends={[]} 
      />
    );

    fireEvent.press(getAllByText(/Join/i)[0]);
    // Sorted by friends joined, so Campaign 2 (2 friends) is first
    expect(onJoinPress).toHaveBeenCalledWith('2');
  });

  it('falls back to console.log when handlers are not provided', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    const { getByText, getAllByText } = render(
      <CampaignSection 
        title="Test" 
        campaigns={mockCampaigns} 
        showJoinButton={true} 
        friends={[]} 
      />
    );

    fireEvent.press(getByText('Campaign 1'));
    expect(consoleSpy).toHaveBeenCalledWith('Campaign clicked:', '1');

    fireEvent.press(getAllByText(/Join/i)[0]);
    expect(consoleSpy).toHaveBeenCalledWith('Join clicked for campaign:', '2');

    consoleSpy.mockRestore();
  });
});
