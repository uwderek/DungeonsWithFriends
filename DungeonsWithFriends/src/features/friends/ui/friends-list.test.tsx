import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { FriendsList } from './friends-list';

describe('FriendsList', () => {
    const mockFriends = [
        { id: '1', name: 'Alice', avatar: 'A', online: false },
        { id: '2', name: 'Bob', avatar: 'B', online: true },
        { id: '3', name: 'Charlie', avatar: 'C', online: true },
    ];

    it('renders friends list and sorts online friends to top', () => {
        const { getAllByText, getByText } = render(<FriendsList friends={mockFriends} />);
        
        expect(getByText('Friends')).toBeTruthy();
        expect(getByText('Alice')).toBeTruthy();
        expect(getByText('Bob')).toBeTruthy();
        
        // Sorting check: Bob and Charlie (online) should come before Alice (offline)
        // We can check the labels
        const statusLabels = getAllByText(/(Online|Offline)/);
        expect(statusLabels[0].props.children).toBe('Online');
        expect(statusLabels[1].props.children).toBe('Online');
        expect(statusLabels[2].props.children).toBe('Offline');
    });

    it('calls onFriendPress when a friend is clicked', () => {
        const onFriendPress = jest.fn();
        const { getByTestId } = render(
            <FriendsList friends={mockFriends} onFriendPress={onFriendPress} />
        );

        fireEvent.press(getByTestId('friend-item-1'));
        expect(onFriendPress).toHaveBeenCalledWith('1');
    });

    it('logs to console when a friend is clicked and no handler provided', () => {
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
        const { getByTestId } = render(<FriendsList friends={mockFriends} />);
        
        fireEvent.press(getByTestId('friend-item-2'));
        expect(consoleSpy).toHaveBeenCalledWith('Friend clicked:', '2');
        
        consoleSpy.mockRestore();
    });
});
