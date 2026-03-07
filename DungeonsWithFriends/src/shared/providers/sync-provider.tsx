import React, { createContext, useContext, useEffect } from 'react';
import { Provider as TinyBaseProvider, useCreateStore } from 'tinybase/ui-react';
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

    const [isSyncing, setIsSyncing] = React.useState(false);

    useEffect(() => {
        console.log('[SyncProvider] Initializing TinyBase synchronizer layer');
        // Initialize Nhost GraphQL subscriptions and TinyBase synchronizer logic here
    }, [store]);

    const triggerManualSync = () => {
        console.log('[SyncProvider] Manual sync triggered');
        setIsSyncing(true);
        // Implementation for manual push/pull
        setTimeout(() => setIsSyncing(false), 500);
    };

    return (
        <SyncContext.Provider value={{ isSyncing, lastSyncTime: null, triggerManualSync }}>
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
