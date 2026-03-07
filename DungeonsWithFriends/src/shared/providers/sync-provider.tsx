import React, { createContext, useContext, useEffect } from 'react';
import { Provider as TinyBaseProvider, useCreateStore } from '@tinybase/ui-react';
import { createStore } from 'tinybase';

type SyncContextType = {
    isSyncing: boolean;
    lastSyncTime: number | null;
    triggerManualSync: () => void;
};

const SyncContext = createContext<SyncContextType | undefined>(undefined);

export const SyncProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Initialize local TinyBase store
    const store = useCreateStore(() => createStore());

    useEffect(() => {
        // Initialize Nhost GraphQL subscriptions and TinyBase synchronizer logic here
    }, [store]);

    const triggerManualSync = () => {
        // Implementation for manual push/pull
    };

    return (
        <SyncContext.Provider value={{ isSyncing: false, lastSyncTime: null, triggerManualSync }}>
            <TinyBaseProvider store={store}>
                {children}
            </TinyBaseProvider>
        </SyncContext.Provider>
    );
};

export const useSync = () => {
    const context = useContext(SyncContext);
    if (context === undefined) {
        throw new Error('useSync must be used within a SyncProvider');
    }
    return context;
};
