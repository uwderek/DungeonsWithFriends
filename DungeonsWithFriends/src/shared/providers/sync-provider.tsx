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
    const [lastSyncTime, setLastSyncTime] = React.useState<number | null>(null);
    const syncTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        console.log('[SyncProvider] Initializing local TinyBase store');
    }, [store]);

    useEffect(() => {
        return () => {
            if (syncTimerRef.current !== null) {
                clearTimeout(syncTimerRef.current);
            }
        };
    }, []);

    const triggerManualSync = () => {
        console.log('[SyncProvider] Manual local persistence checkpoint triggered');
        if (syncTimerRef.current !== null) {
            clearTimeout(syncTimerRef.current);
        }
        setIsSyncing(true);
        syncTimerRef.current = setTimeout(() => {
            setLastSyncTime(Date.now());
            setIsSyncing(false);
            syncTimerRef.current = null;
        }, 500);
    };

    return (
        <TinyBaseProvider store={store}>
            <SyncContext.Provider value={{
                isSyncing,
                lastSyncTime,
                triggerManualSync
            }}>
                {children}
            </SyncContext.Provider>
        </TinyBaseProvider>
    );
};

export const useSync = () => {
    const context = useContext(SyncContext);
    if (context === undefined) {
        throw new Error('useSync must be used within a SyncProvider');
    }
    return context;
};
