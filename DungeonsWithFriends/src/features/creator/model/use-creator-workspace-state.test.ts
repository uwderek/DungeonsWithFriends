import { renderHook, act } from '@testing-library/react-native';
import { useCreatorWorkspaceState } from './use-creator-workspace-state';

describe('useCreatorWorkspaceState', () => {
    it('initializes with default values', () => {
        const { result } = renderHook(() => useCreatorWorkspaceState());
        expect(result.current.leftPaneWidth).toBe(300);
        expect(result.current.rightPaneWidth).toBe(300);
        expect(result.current.leftPaneCollapsed).toBe(false);
        expect(result.current.rightPaneCollapsed).toBe(false);
        expect(result.current.selectedElementId).toBeNull();
    });

    it('toggles left pane collapse state', () => {
        const { result } = renderHook(() => useCreatorWorkspaceState());
        act(() => {
            result.current.toggleLeftPane();
        });
        expect(result.current.leftPaneCollapsed).toBe(true);
        act(() => {
            result.current.toggleLeftPane();
        });
        expect(result.current.leftPaneCollapsed).toBe(false);
    });

    it('toggles right pane collapse state', () => {
        const { result } = renderHook(() => useCreatorWorkspaceState());
        act(() => {
            result.current.toggleRightPane();
        });
        expect(result.current.rightPaneCollapsed).toBe(true);
        act(() => {
            result.current.toggleRightPane();
        });
        expect(result.current.rightPaneCollapsed).toBe(false);
    });

    it('sets selected element ID', () => {
        const { result } = renderHook(() => useCreatorWorkspaceState());
        act(() => {
            result.current.setSelectedElementId('test-id');
        });
        expect(result.current.selectedElementId).toBe('test-id');
        act(() => {
            result.current.setSelectedElementId(null);
        });
        expect(result.current.selectedElementId).toBeNull();
    });
    it('updates left pane width', () => {
        const { result } = renderHook(() => useCreatorWorkspaceState());
        act(() => {
            result.current.setLeftPaneWidth(350);
        });
        expect(result.current.leftPaneWidth).toBe(350);
    });

    it('updates right pane width', () => {
        const { result } = renderHook(() => useCreatorWorkspaceState());
        act(() => {
            result.current.setRightPaneWidth(400);
        });
        expect(result.current.rightPaneWidth).toBe(400);
    });

    describe('creatorSessionStorage', () => {
        const { createCreatorSessionStorage } = require('./use-creator-workspace-state');

        it('handles window defined in creatorSessionStorage', () => {
            const storage = createCreatorSessionStorage(window);
            expect(storage.getItem('test')).toBeNull();
            storage.setItem('test', 'value');
            expect(storage.getItem('test')).toBe('value');
            storage.removeItem('test');
            expect(storage.getItem('test')).toBeNull();
        });

        it('handles window undefined in creatorSessionStorage', () => {
            const storage = createCreatorSessionStorage(undefined);
            expect(storage.getItem('test')).toBeNull();
            storage.setItem('test', 'value'); // should not crash
            storage.removeItem('test'); // should not crash
        });

        it('handles localStorage undefined in creatorSessionStorage', () => {
            const storage = createCreatorSessionStorage({ localStorage: undefined });
            expect(storage.getItem('test')).toBeNull();
            storage.setItem('test', 'value'); // should not crash
        });
    });

    describe('createCreatorWorkspaceStore', () => {
        const { createCreatorWorkspaceStore } = require('./use-creator-workspace-state');

        it('uses custom storage when provided', () => {
            const mockStorage = {
                getItem: jest.fn().mockReturnValue(null),
                setItem: jest.fn(),
                removeItem: jest.fn(),
            };
            const customHook = createCreatorWorkspaceStore(mockStorage);
            renderHook(() => customHook());
            
            // Zustand's persist calls getItem on init
            expect(mockStorage.getItem).toHaveBeenCalled();
        });
    });
});
