import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { CreatorToolsScreen } from './CreatorToolsScreen';
import { useWindowDimensions } from 'react-native';
import { useComponentDefinitions, createComponentDefinition } from '../model/component-store';
import { useStore } from 'tinybase/ui-react';
import { useAuth } from '@/shared/providers/auth-provider';

jest.mock('@/shared/providers/auth-provider', () => ({
    useAuth: jest.fn(),
}));

// Mock high level components to avoid deep rendering issues
jest.mock('./ComponentListView', () => ({
    ComponentListView: ({ onCreate, onEdit }: any) => {
        const React = require('react');
        const { TouchableOpacity, Text } = require('react-native');
        return (
            <TouchableOpacity onPress={onCreate} testID="create-button">
                <Text>Create</Text>
            </TouchableOpacity>
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
    const { View } = require('react-native');
    return {
        AppSidebar: ({ children }: any) => <View testID="sidebar">{children}</View>,
        HamburgerButton: () => <View testID="hamburger" />,
    };
});

describe('CreatorToolsScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (useStore as jest.Mock).mockReturnValue({});
        (useAuth as jest.Mock).mockReturnValue({
            logout: jest.fn(),
        });
    });

    it('renders "Desktop Required" on small screens', () => {
        (useWindowDimensions as jest.Mock).mockReturnValue({ width: 375 });
        const { getByText } = render(<CreatorToolsScreen />);
        expect(getByText(/Desktop Required/i)).toBeTruthy();
    });

    it('renders split-pane on large screens', () => {
        (useWindowDimensions as jest.Mock).mockReturnValue({ width: 1200 });
        const { getByText } = render(<CreatorToolsScreen />);
        expect(getByText(/Component Architect/i)).toBeTruthy();
    });

    it('handles create and open editor', async () => {
        (useWindowDimensions as jest.Mock).mockReturnValue({ width: 1200 });
        (createComponentDefinition as jest.Mock).mockReturnValue('new-id');

        const { getByTestId, getByText } = render(<CreatorToolsScreen />);

        const createBtn = getByTestId('create-button');
        fireEvent.press(createBtn);

        await waitFor(() => {
            expect(getByText(/Editing new-id/i)).toBeTruthy();
        });
    });

    it('closes editor', async () => {
        (useWindowDimensions as jest.Mock).mockReturnValue({ width: 1200 });
        (createComponentDefinition as jest.Mock).mockReturnValue('new-id');

        const { getByTestId, queryByText } = render(<CreatorToolsScreen />);

        fireEvent.press(getByTestId('create-button'));

        await waitFor(() => expect(getByTestId('editor')).toBeTruthy());

        fireEvent.press(getByTestId('close-button'));

        await waitFor(() => {
            expect(queryByText(/Editing new-id/i)).toBeNull();
        });
    });
});
