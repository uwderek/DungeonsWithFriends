import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';

// Simple synchronous storage for web-first creator tool
export const createCreatorSessionStorage = (win: any = typeof window !== 'undefined' ? window : undefined): StateStorage => ({
    getItem: (name: string) => {
        if (win && win.localStorage) {
            return win.localStorage.getItem(name);
        }
        return null;
    },
    setItem: (name: string, value: string) => {
        if (win && win.localStorage) {
            win.localStorage.setItem(name, value);
        }
    },
    removeItem: (name: string) => {
        if (win && win.localStorage) {
            win.localStorage.removeItem(name);
        }
    }
});

export const creatorSessionStorage = createCreatorSessionStorage();

interface CreatorWorkspaceState {
    leftPaneWidth: number;
    rightPaneWidth: number;
    leftPaneCollapsed: boolean;
    rightPaneCollapsed: boolean;
    selectedElementId: string | null;
    
    // Actions
    setLeftPaneWidth: (width: number) => void;
    setRightPaneWidth: (width: number) => void;
    toggleLeftPane: () => void;
    toggleRightPane: () => void;
    setSelectedElementId: (id: string | null) => void;
}

export const createCreatorWorkspaceStore = (storage: StateStorage = creatorSessionStorage) => create<CreatorWorkspaceState>()(
    persist(
        (set) => ({
            leftPaneWidth: 300,
            rightPaneWidth: 300,
            leftPaneCollapsed: false,
            rightPaneCollapsed: false,
            selectedElementId: null,

            setLeftPaneWidth: (width) => set({ leftPaneWidth: width }),
            setRightPaneWidth: (width) => set({ rightPaneWidth: width }),
            toggleLeftPane: () => set((state) => ({ leftPaneCollapsed: !state.leftPaneCollapsed })),
            toggleRightPane: () => set((state) => ({ rightPaneCollapsed: !state.rightPaneCollapsed })),
            setSelectedElementId: (id) => set({ selectedElementId: id }),
        }),
        {
            name: 'creator-workspace-session-state',
            storage: createJSONStorage(() => storage),
            partialize: (state) => ({
                leftPaneCollapsed: state.leftPaneCollapsed,
                rightPaneCollapsed: state.rightPaneCollapsed,
                leftPaneWidth: state.leftPaneWidth,
                rightPaneWidth: state.rightPaneWidth,
            }),
        }
    )
);

export const useCreatorWorkspaceState = createCreatorWorkspaceStore();
