import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { CreatorWorkspacePane } from './creator-workspace-pane';
import { View, Text } from 'react-native';

describe('CreatorWorkspacePane', () => {
    const mockOnToggle = jest.fn();
    const title = 'Test Pane';
    const width = 300;

    it('renders correctly when expanded', () => {
        const { getByText, queryByText } = render(
            <CreatorWorkspacePane
                title={title}
                width={width}
                isCollapsed={false}
                onToggle={mockOnToggle}
                side="left"
            >
                <Text>Child Content</Text>
            </CreatorWorkspacePane>
        );

        expect(getByText(title)).toBeTruthy();
        expect(getByText('Child Content')).toBeTruthy();
    });

    it('renders correctly when collapsed', () => {
        const { queryByText } = render(
            <CreatorWorkspacePane
                title={title}
                width={width}
                isCollapsed={true}
                onToggle={mockOnToggle}
                side="left"
            >
                <Text>Child Content</Text>
            </CreatorWorkspacePane>
        );

        expect(queryByText(title)).toBeNull();
        expect(queryByText('Child Content')).toBeNull();
    });

    it('calls onToggle when toggle button is pressed', () => {
        const { getByTestId } = render(
            <CreatorWorkspacePane
                title={title}
                width={width}
                isCollapsed={false}
                onToggle={mockOnToggle}
                side="left"
            >
                <View />
            </CreatorWorkspacePane>
        );

        fireEvent.press(getByTestId('pane-toggle-button'));
        expect(mockOnToggle).toHaveBeenCalled();
    });

    it('renders correct icons based on side and collision state', () => {
        const { rerender, getByTestId } = render(
            <CreatorWorkspacePane
                title={title}
                width={width}
                isCollapsed={false}
                onToggle={mockOnToggle}
                side="left"
            >
                <View />
            </CreatorWorkspacePane>
        );
        // We can't easily check the Lucide icons inside without more complex mocking,
        // but we can verify the render doesn't crash for all combinations.
        
        const combinations: Array<{ side: 'left' | 'right', collapsed: boolean }> = [
            { side: 'left', collapsed: false },
            { side: 'left', collapsed: true },
            { side: 'right', collapsed: false },
            { side: 'right', collapsed: true },
        ];

        combinations.forEach(({ side, collapsed }) => {
            rerender(
                <CreatorWorkspacePane
                    title={title}
                    width={width}
                    isCollapsed={collapsed}
                    onToggle={mockOnToggle}
                    side={side}
                >
                    <View />
                </CreatorWorkspacePane>
            );
            expect(getByTestId('pane-toggle-button')).toBeTruthy();
        });
    });
});
