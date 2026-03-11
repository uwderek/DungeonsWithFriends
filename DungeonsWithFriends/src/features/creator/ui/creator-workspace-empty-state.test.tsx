import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { CreatorWorkspaceEmptyState } from './creator-workspace-empty-state';

describe('CreatorWorkspaceEmptyState', () => {
    it('renders empty state messages', () => {
        const { getByText } = render(
            <CreatorWorkspaceEmptyState onSelectSystem={jest.fn()} />
        );
        
        expect(getByText(/Sheet Authoring Canvas/i)).toBeTruthy();
        expect(getByText(/Before you can place elements/i)).toBeTruthy();
    });

    it('calls onSelectSystem when the button is pressed', () => {
        const onSelectSystem = jest.fn();
        const { getByTestId } = render(
            <CreatorWorkspaceEmptyState onSelectSystem={onSelectSystem} />
        );

        fireEvent.press(getByTestId('select-system-button'));
        expect(onSelectSystem).toHaveBeenCalled();
    });
});
