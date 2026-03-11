import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { CreatorToolsScreen } from './CreatorToolsScreen';
import { useWindowDimensions } from 'react-native';
import { createComponentDefinition } from '../model/component-store';
import { useStore } from 'tinybase/ui-react';
import { useAuth } from '@/shared/providers/auth-provider';

jest.mock('@/shared/providers/auth-provider', () => ({
    useAuth: jest.fn(),
}));

// Mock high level components to avoid deep rendering issues
jest.mock('./ComponentListView', () => ({
    ComponentListView: ({ onCreate, onEdit, onDelete }: any) => {
        const React = require('react');
        const { TouchableOpacity, Text, View } = require('react-native');
        return (
            <View>
                <TouchableOpacity onPress={onCreate} testID="create-button">
                    <Text>Create</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onDelete('some-id')} testID="delete-button">
                    <Text>Delete</Text>
                </TouchableOpacity>
            </View>
        );
    }
}));

jest.mock('./ComponentEditor', () => ({
    ComponentEditor: ({ componentId, onClose }: any) => {
        const React = require('react');
        const { TouchableOpacity, Text, View } = require('react-native');
        return (
            <View testID="editor">
                <Text>Editing {componentId}</Text>
                <TouchableOpacity onPress={onClose} testID="close-button">
                    <Text>Close</Text>
                </TouchableOpacity>
            </View>
        );
    }
}));

jest.mock('../model/component-store', () => ({
    useComponentDefinitions: jest.fn(),
    createComponentDefinition: jest.fn(),
}));

jest.mock('tinybase/ui-react', () => ({
    useStore: jest.fn(),
}));

jest.mock('react-native/Libraries/Utilities/useWindowDimensions', () => ({
    default: jest.fn(),
}));

jest.mock('@/shared/ui/navigation/app-sidebar', () => {
    const React = require('react');
    const { View, TouchableOpacity } = require('react-native');
    return {
        AppSidebar: ({ isOpen, onClose }: any) => (
            <View testID="sidebar">
                {isOpen && (
                    <TouchableOpacity testID="sidebar-close" onPress={onClose}>
                        <View />
                    </TouchableOpacity>
                )}
            </View>
        ),
        HamburgerButton: ({ onPress }: any) => (
            <TouchableOpacity onPress={onPress} testID="hamburger">
                <View />
            </TouchableOpacity>
        ),
    };
});

jest.mock('./creator-workspace-empty-state', () => {
    const React = require('react');
    const { TouchableOpacity, Text } = require('react-native');
    return {
        CreatorWorkspaceEmptyState: ({ onSelectSystem }: any) => (
            <TouchableOpacity onPress={onSelectSystem} testID="select-system-button">
                <Text>Select System</Text>
            </TouchableOpacity>
        )
    };
});

describe('CreatorToolsScreen', () => {
    const mockLogout = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (useStore as jest.Mock).mockReturnValue({});
        (useAuth as jest.Mock).mockReturnValue({
            logout: mockLogout,
        });
        // Default mock for useWindowDimensions just in case though we mostly use props
        (useWindowDimensions as jest.Mock).mockReturnValue({ width: 1200, height: 800 });
    });

    it('renders "Desktop Required" on small screens', () => {
        const { getByText } = render(<CreatorToolsScreen viewportWidth={375} />);
        expect(getByText(/Desktop Required/i)).toBeTruthy();
    });

    it('renders workspace shell on large screens', () => {
        const { getByText } = render(<CreatorToolsScreen viewportWidth={1200} />);
        expect(getByText(/Creator Tools/i)).toBeTruthy();
    });

    it('handles settings and logout', () => {
        const onSettingsPress = jest.fn();
        const { getByTestId } = render(
            <CreatorToolsScreen viewportWidth={1200} onSettingsPress={onSettingsPress} />
        );

        fireEvent.press(getByTestId('settings-button'));
        expect(onSettingsPress).toHaveBeenCalled();

        fireEvent.press(getByTestId('logout-button'));
        expect(mockLogout).toHaveBeenCalled();
    });

    it('handles onSelectSystem', () => {
        const onSelectSystem = jest.fn();
        const { getByTestId } = render(
            <CreatorToolsScreen viewportWidth={1200} onSelectSystem={onSelectSystem} />
        );

        fireEvent.press(getByTestId('select-system-button'));
        expect(onSelectSystem).toHaveBeenCalled();
    });

    it('falls back to console.log when handlers are not provided', () => {
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
        const { getByTestId } = render(<CreatorToolsScreen viewportWidth={1200} />);

        fireEvent.press(getByTestId('settings-button'));
        expect(consoleSpy).toHaveBeenCalledWith('Settings clicked');

        fireEvent.press(getByTestId('select-system-button'));
        expect(consoleSpy).toHaveBeenCalledWith('Select System clicked');

        consoleSpy.mockRestore();
    });

    it('handles create and open editor in properties pane', async () => {
        (createComponentDefinition as jest.Mock).mockReturnValue('new-id');

        const { getByTestId, getByText } = render(<CreatorToolsScreen viewportWidth={1200} />);

        const createBtn = getByTestId('create-button');
        fireEvent.press(createBtn);

        await waitFor(() => {
            expect(getByText(/Editing new-id/i)).toBeTruthy();
        });
    });

    it('closes editor in properties pane', async () => {
        (createComponentDefinition as jest.Mock).mockReturnValue('new-id');

        const { getByTestId, queryByText, getByText } = render(<CreatorToolsScreen viewportWidth={1200} />);

        fireEvent.press(getByTestId('create-button'));

        await waitFor(() => expect(getByTestId('editor')).toBeTruthy());

        fireEvent.press(getByTestId('close-button'));

        await waitFor(() => {
            expect(queryByText(/Editing new-id/i)).toBeNull();
            expect(getByText(/No element selected/i)).toBeTruthy();
        });
    });

    it('handles handleDelete', async () => {
        (createComponentDefinition as jest.Mock).mockReturnValue('some-id');
        const { getByTestId, queryByText, getByText } = render(<CreatorToolsScreen viewportWidth={1200} />);

        // Select the element first
        fireEvent.press(getByTestId('create-button'));
        await waitFor(() => expect(getByText(/Editing some-id/i)).toBeTruthy());

        // Delete it
        fireEvent.press(getByTestId('delete-button'));
        
        // Should be deselected
        await waitFor(() => {
            expect(queryByText(/Editing some-id/i)).toBeNull();
            expect(getByText(/No element selected/i)).toBeTruthy();
        });
    });

    it('handles sidebar toggle and close on mobile', () => {
        const { getByTestId, queryByTestId } = render(<CreatorToolsScreen viewportWidth={375} />);
        
        // Open sidebar
        fireEvent.press(getByTestId('hamburger'));
        expect(getByTestId('sidebar-close')).toBeTruthy();
        
        // Close sidebar
        fireEvent.press(getByTestId('sidebar-close'));
        expect(queryByTestId('sidebar-close')).toBeNull();
    });

    it('uses measured width when viewportWidth is not provided', () => {
        (useWindowDimensions as jest.Mock).mockReturnValue({ width: 500 });
        const { getByText } = render(<CreatorToolsScreen />);
        expect(getByText(/Desktop Required/i)).toBeTruthy();
    });
});
