import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ComponentListView } from './ComponentListView';
import { useComponentDefinitions, deleteComponentDefinition } from '../model/component-store';
import { useStore } from 'tinybase/ui-react';

// Mock store hooks
jest.mock('../model/component-store', () => ({
    useComponentDefinitions: jest.fn(),
    deleteComponentDefinition: jest.fn(),
}));

jest.mock('tinybase/ui-react', () => ({
    useStore: jest.fn(),
}));

describe('ComponentListView', () => {
    const mockOnCreate = jest.fn();
    const mockOnEdit = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders empty state when no components exist', () => {
        (useComponentDefinitions as jest.Mock).mockReturnValue([]);
        const { getByText } = render(
            <ComponentListView onCreate={mockOnCreate} onEdit={mockOnEdit} />
        );

        expect(getByText(/No components defined/i)).toBeTruthy();
        expect(getByText(/Start by creating your first custom data component/i)).toBeTruthy();
    });

    it('renders list of components', () => {
        (useComponentDefinitions as jest.Mock).mockReturnValue([
            {
                component_id: '1',
                display_label: 'Test Component',
                data_type: 'text',
                component_name: 'test_comp'
            }
        ]);

        const { getByText } = render(
            <ComponentListView onCreate={mockOnCreate} onEdit={mockOnEdit} />
        );

        expect(getByText('Test Component')).toBeTruthy();
        expect(getByText('test_comp')).toBeTruthy();
    });

    it('calls onCreate when create button is pressed', () => {
        (useComponentDefinitions as jest.Mock).mockReturnValue([]);
        const { getByText } = render(
            <ComponentListView onCreate={mockOnCreate} onEdit={mockOnEdit} />
        );

        fireEvent.press(getByText(/Create Component/i));
        expect(mockOnCreate).toHaveBeenCalled();
    });

    it('calls onEdit when a component is pressed', () => {
        (useComponentDefinitions as jest.Mock).mockReturnValue([
            {
                component_id: '1',
                display_label: 'Test Component',
                data_type: 'text',
                component_name: 'test_comp'
            }
        ]);

        const { getByText } = render(
            <ComponentListView onCreate={mockOnCreate} onEdit={mockOnEdit} />
        );

        fireEvent.press(getByText('Test Component'));
        expect(mockOnEdit).toHaveBeenCalledWith('1');
    });
});
