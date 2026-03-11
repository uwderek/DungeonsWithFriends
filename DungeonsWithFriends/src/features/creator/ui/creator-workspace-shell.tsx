import React from 'react';
import { View } from 'react-native';
import { useCreatorWorkspaceState } from '../model/use-creator-workspace-state';
import { CreatorWorkspacePane } from './creator-workspace-pane';

interface CreatorWorkspaceShellProps {
    leftContent: React.ReactNode;
    centerContent: React.ReactNode;
    rightContent: React.ReactNode;
}

export const CreatorWorkspaceShell: React.FC<CreatorWorkspaceShellProps> = ({
    leftContent,
    centerContent,
    rightContent
}) => {
    const { 
        leftPaneWidth, 
        rightPaneWidth, 
        leftPaneCollapsed, 
        rightPaneCollapsed,
        toggleLeftPane,
        toggleRightPane
    } = useCreatorWorkspaceState();

    return (
        <View className="flex-1 flex-row bg-background-primary overflow-hidden">
            {/* Left Palette */}
            <CreatorWorkspacePane
                title="Palette"
                width={leftPaneWidth}
                isCollapsed={leftPaneCollapsed}
                onToggle={toggleLeftPane}
                side="left"
            >
                {leftContent}
            </CreatorWorkspacePane>

            {/* Center Canvas */}
            <View className="flex-1 bg-background-primary border-border-primary">
                {centerContent}
            </View>

            {/* Right Properties */}
            <CreatorWorkspacePane
                title="Properties"
                width={rightPaneWidth}
                isCollapsed={rightPaneCollapsed}
                onToggle={toggleRightPane}
                side="right"
            >
                {rightContent}
            </CreatorWorkspacePane>
        </View>
    );
};
