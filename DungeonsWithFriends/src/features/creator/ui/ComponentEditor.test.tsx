import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { ComponentEditor } from './ComponentEditor';
import { useComponentDefinition, updateComponentDefinition } from '../model/component-store';

// Mock store hooks
jest.mock('../model/component-store', () => ({
    useComponentDefinition: jest.fn(),
    updateComponentDefinition: jest.fn(),
}));

// Mock tinybase
jest.mock('tinybase/ui-react', () => ({
    useStore: jest.fn(),
}));

describe('ComponentEditor', () => {
    const mockOnClose = jest.fn();
    const componentId = '123e4567-e89b-12d3-a456-426614174000';
    const mockComponent = {
        component_id: componentId,
        component_name: 'test_component',
        display_label: 'Test Label',
        data_type: 'text' as const,
        is_required: false,
        created_at: '2026-03-08T00:00:00.000Z',
        updated_at: '2026-03-08T00:00:00.000Z',
    };

    const mockStore = {
        getRow: jest.fn(),
        getCell: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers();
        (require('tinybase/ui-react').useStore as jest.Mock).mockReturnValue(mockStore);
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('renders loading state when component not found', () => {
        (useComponentDefinition as jest.Mock).mockReturnValue(undefined);
        const { getByText } = render(
            <ComponentEditor componentId={componentId} onClose={mockOnClose} />
        );
        expect(getByText(/Loading/i)).toBeTruthy();
    });

    it('renders form with component data', () => {
        (useComponentDefinition as jest.Mock).mockReturnValue(mockComponent);

        const { getByDisplayValue } = render(
            <ComponentEditor componentId={componentId} onClose={mockOnClose} />
        );

        expect(getByDisplayValue('Test Label')).toBeTruthy();
        expect(getByDisplayValue('test_component')).toBeTruthy();
    });

    it('updates label and triggers auto-save', async () => {
        (useComponentDefinition as jest.Mock).mockReturnValue(mockComponent);

        const { getByPlaceholderText } = render(
            <ComponentEditor componentId={componentId} onClose={mockOnClose} />
        );

        const input = getByPlaceholderText(/Enter display label/i);
        fireEvent.changeText(input, 'New Label');

        act(() => {
            jest.advanceTimersByTime(600);
        });

        await waitFor(() => {
            expect(updateComponentDefinition).toHaveBeenCalledWith(
                expect.anything(),
                componentId,
                expect.objectContaining({
                    display_label: 'New Label'
                })
            );
        });
    });

    it('shows validation error for invalid component name', async () => {
        (useComponentDefinition as jest.Mock).mockReturnValue(mockComponent);

        const { getByDisplayValue, getByText } = render(
            <ComponentEditor componentId={componentId} onClose={mockOnClose} />
        );

        const input = getByDisplayValue('test_component');
        fireEvent.changeText(input, 'Invalid Name!'); // Spaces/special chars not allowed in name

        await waitFor(() => {
            expect(getByText(/Lowercase letters, numbers, and underscores only/i)).toBeTruthy();
        });
    });

    it('updates data type and shows number validation rules', async () => {
        (useComponentDefinition as jest.Mock).mockReturnValue(mockComponent);

        const { getByTestId, getByText } = render(
            <ComponentEditor componentId={componentId} onClose={mockOnClose} />
        );

        fireEvent.press(getByTestId('type-button-number'));

        await waitFor(() => {
            expect(getByText('Minimum')).toBeTruthy();
            expect(getByText('Maximum')).toBeTruthy();
        });
    });

    it('updates is_required switch', async () => {
        (useComponentDefinition as jest.Mock).mockReturnValue(mockComponent);

        const { getByTestId } = render(
            <ComponentEditor componentId={componentId} onClose={mockOnClose} />
        );

        fireEvent(getByTestId('switch-required'), 'onValueChange', true);

        act(() => {
            jest.advanceTimersByTime(600);
        });

        await waitFor(() => {
            expect(updateComponentDefinition).toHaveBeenCalledWith(
                expect.anything(),
                componentId,
                expect.objectContaining({
                    is_required: true
                })
            );
        });
    });

    it('updates text validation rules', async () => {
        (useComponentDefinition as jest.Mock).mockReturnValue(mockComponent);

        const { getByTestId } = render(
            <ComponentEditor componentId={componentId} onClose={mockOnClose} />
        );

        fireEvent.changeText(getByTestId('input-min-length'), '5');
        fireEvent.changeText(getByTestId('input-pattern'), '^[A-Z]');

        act(() => {
            jest.advanceTimersByTime(600);
        });

        await waitFor(() => {
            expect(updateComponentDefinition).toHaveBeenCalledWith(
                expect.anything(),
                componentId,
                expect.objectContaining({
                    validation_rules: expect.objectContaining({
                        min_length: 5,
                        pattern: '^[A-Z]'
                    })
                })
            );
        });
    });

    it('shows validation error for display label', async () => {
        (useComponentDefinition as jest.Mock).mockReturnValue(mockComponent);

        const { getByPlaceholderText, getByText } = render(
            <ComponentEditor componentId={componentId} onClose={mockOnClose} />
        );

        const input = getByPlaceholderText(/Enter display label/i);
        fireEvent.changeText(input, ''); // Empty label should be invalid

        await waitFor(() => {
            expect(getByText('Display label is required')).toBeTruthy();
        });
    });

    it('updates min and max validation rules', async () => {
        const numberComponent = { ...mockComponent, data_type: 'number' as const };
        (useComponentDefinition as jest.Mock).mockReturnValue(numberComponent);

        const { getByTestId } = render(
            <ComponentEditor componentId={componentId} onClose={mockOnClose} />
        );

        fireEvent.changeText(getByTestId('input-min'), '10');
        fireEvent.changeText(getByTestId('input-max'), '20');

        act(() => {
            jest.advanceTimersByTime(600);
        });

        await waitFor(() => {
            expect(updateComponentDefinition).toHaveBeenCalledWith(
                expect.anything(),
                componentId,
                expect.objectContaining({
                    validation_rules: expect.objectContaining({
                        min: 10,
                        max: 20
                    })
                })
            );
        });
    });
});
