import React from 'react';
import { renderHook, act } from '@testing-library/react-native';
import { useComponentDefinitions, useComponentDefinition, createComponentDefinition, updateComponentDefinition, deleteComponentDefinition } from '@/features/creator/model/component-store';
import { useStore, useRowIds, useRow } from 'tinybase/ui-react';

// Mock TinyBase hooks
jest.mock('tinybase/ui-react', () => ({
    useStore: jest.fn(),
    useRowIds: jest.fn(),
    useRow: jest.fn(),
}));

describe('component-store', () => {
    let mockStore: any;
    let rows: Record<string, any>;

    beforeEach(() => {
        rows = {};
        mockStore = {
            getRowIds: jest.fn().mockImplementation(() => Object.keys(rows)),
            getRow: jest.fn().mockImplementation((table, id) => rows[id]),
            setRow: jest.fn().mockImplementation((table, id, row) => { rows[id] = row; }),
            delRow: jest.fn().mockImplementation((table, id) => { delete rows[id]; }),
            addTableListener: jest.fn().mockReturnValue('listener-id'),
            removeListener: jest.fn(),
        };
        (useStore as jest.Mock).mockReturnValue(mockStore);
        (useRowIds as jest.Mock).mockImplementation(() => Object.keys(rows));
        (useRow as jest.Mock).mockImplementation((table, id) => rows[id] || {});
    });

    it('useComponentDefinitions returns an empty list initially', () => {
        const { result } = renderHook(() => useComponentDefinitions());
        expect(result.current).toEqual([]);
    });

    it('createComponentDefinition adds a new row to TinyBase', () => {
        const newComponent = {
            component_name: 'test_comp',
            display_label: 'Test Component',
            data_type: 'text' as const,
        };

        let id: string = '';
        act(() => {
            id = createComponentDefinition(mockStore, newComponent);
        });

        expect(id).toBeTruthy();
        expect(mockStore.setRow).toHaveBeenCalledWith('component_definitions', id, expect.objectContaining({
            component_name: 'test_comp',
            display_label: 'Test Component',
        }));
    });

    it('useComponentDefinition returns undefined for non-existent ID', () => {
        const { result } = renderHook(() => useComponentDefinition('non-existent'));
        expect(result.current).toBeUndefined();
    });

    it('updateComponentDefinition updates existing row', () => {
        const id = '550e8400-e29b-41d4-a716-446655440000';
        const now = new Date().toISOString();
        rows[id] = {
            component_id: id,
            component_name: 'old_comp',
            display_label: 'Old',
            data_type: 'text',
            created_at: now,
            updated_at: now,
            is_required: false,
            sort_order: 0
        };

        act(() => {
            updateComponentDefinition(mockStore, id, { display_label: 'Updated' });
        });

        expect(mockStore.setRow).toHaveBeenCalledWith('component_definitions', id, expect.objectContaining({
            display_label: 'Updated',
        }));
    });

    it('useComponentDefinitions returns list with items', () => {
        const id = '550e8400-e29b-41d4-a716-446655440002';
        rows[id] = {
            component_id: id,
            component_name: 'comp1',
            display_label: 'Comp 1',
            data_type: 'text',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            is_required: false,
            sort_order: 0,
            validation_rules: '{}'
        };

        const { result } = renderHook(() => useComponentDefinitions());
        expect(result.current).toHaveLength(1);
        expect(result.current[0].component_name).toBe('comp1');
    });

    it('useComponentDefinition returns data for existing ID', () => {
        const id = '550e8400-e29b-41d4-a716-446655440003';
        rows[id] = {
            component_id: id,
            component_name: 'comp1',
            display_label: 'Comp 1',
            data_type: 'text',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            is_required: false,
            sort_order: 0,
            validation_rules: JSON.stringify({ min: 1 })
        };

        const { result } = renderHook(() => useComponentDefinition(id));
        expect(result.current).toBeDefined();
        expect(result.current?.validation_rules).toEqual({ min: 1 });
    });

    it('updateComponentDefinition throws if not found', () => {
        expect(() => updateComponentDefinition(mockStore, 'non-existent', {}))
            .toThrow('Component non-existent not found');
    });

    it('deleteComponentDefinition removes row', () => {
        const id = '550e8400-e29b-41d4-a716-446655440001';
        const now = new Date().toISOString();
        rows[id] = {
            component_id: id,
            component_name: 'test_comp_to_delete',
            display_label: 'Test Component to Delete',
            data_type: 'text',
            created_at: now,
            updated_at: now,
            is_required: false,
            sort_order: 0
        };

        act(() => {
            deleteComponentDefinition(mockStore, id);
        });

        expect(mockStore.delRow).toHaveBeenCalledWith('component_definitions', id);
    });

    it('uses default values if not provided', () => {
        let id: string = '';
        act(() => {
            id = createComponentDefinition(mockStore, {});
        });

        expect(mockStore.setRow).toHaveBeenCalledWith('component_definitions', id, expect.objectContaining({
            display_label: 'New Component',
            data_type: 'text',
        }));
        expect(mockStore.setRow.mock.calls[0][2].component_name).toMatch(/^component_/);
    });

    it('handles JSON string validation_rules from TinyBase', () => {
        const id = 'json-test-id';
        rows[id] = {
            component_id: id,
            component_name: 'comp1',
            display_label: 'Comp 1',
            data_type: 'text',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            is_required: false,
            sort_order: 0,
            validation_rules: JSON.stringify({ min: 5 })
        };

        const { result } = renderHook(() => useComponentDefinition(id));
        expect(result.current?.validation_rules).toEqual({ min: 5 });
    });
});
