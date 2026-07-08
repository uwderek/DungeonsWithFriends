import React, { createContext, useContext, useEffect } from 'react';
import { Provider as TinyBaseProvider, useCreateStore } from 'tinybase/ui-react';
import { createDwfStore } from '@/shared/store/local-store';
import {
    LocalStoreStorage,
    getDefaultLocalStoreStorage,
    hydrateStoreFromPersistence,
    saveStoreToPersistence,
} from '@/shared/store/persistence';

type SyncContextType = {
    isSyncing: boolean;
    lastSyncTime: number | null;
    lastPersistenceError: string | null;
    triggerManualSync: () => void;
};

const SyncContext = createContext<SyncContextType | undefined>(undefined);

export const SyncProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Initialize local TinyBase store
    const store = useCreateStore(() => createDwfStore());

    const [isSyncing, setIsSyncing] = React.useState(false);
    const [lastSyncTime, setLastSyncTime] = React.useState<number | null>(null);
    const [lastPersistenceError, setLastPersistenceError] = React.useState<string | null>(null);
    const syncTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
    const storageRef = React.useRef<LocalStoreStorage>(getDefaultLocalStoreStorage());

    useEffect(() => {
        console.log('[SyncProvider] Initializing local TinyBase store');
        const result = hydrateStoreFromPersistence(store, storageRef.current);
        if (result.error) {
            console.warn('[SyncProvider] Recovered local TinyBase store after persistence error:', result.error.message);
            setLastPersistenceError(result.error.message);
        } else {
            setLastPersistenceError(null);
        }
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
            try {
                const snapshot = saveStoreToPersistence(store, storageRef.current);
                setLastSyncTime(Date.parse(snapshot.exported_at));
                setLastPersistenceError(null);
            } catch (error) {
                const message = error instanceof Error ? error.message : 'Local persistence failed.';
                console.warn('[SyncProvider] Local persistence checkpoint failed:', message);
                setLastPersistenceError(message);
            }
            setIsSyncing(false);
            syncTimerRef.current = null;
        }, 500);
    };

    return (
        <TinyBaseProvider store={store}>
            <SyncContext.Provider value={{
                isSyncing,
                lastSyncTime,
                lastPersistenceError,
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
