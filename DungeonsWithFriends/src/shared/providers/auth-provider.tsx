import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { NhostClient } from '@nhost/nhost-js';
import { useStore } from 'tinybase/ui-react';

type User = {
    id: string;
    email: string;
    displayName?: string;
};

type AuthContextType = {
    isAuthenticated: boolean;
    isLoading: boolean;
    user: User | null;
    offlineMode: boolean;
    login: (email?: string, password?: string) => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    continueOffline: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // TODO: Replace with actual Nhost config from environment variables
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore - Suppressed until @nhost/react and @nhost/nhost-js are upgraded to the urql standard
    const nhostRef = useRef(new NhostClient({ subdomain: 'local', region: 'local' }));
    const store = useStore();

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const [offlineMode, setOfflineMode] = useState(false);

    // Persistence logic using TinyBase
    useEffect(() => {
        if (!store) return;

        const savedMode = store.getCell('settings', 'auth', 'offline_mode');
        if (savedMode === true) {
            setOfflineMode(true);
        }
    }, [store]);

    useEffect(() => {
        // Initial Auth check logic
        const checkAuth = async () => {
            const auth = (nhostRef.current as any).auth;
            const session = auth.getSession();
            if (session) {
                setIsAuthenticated(true);
                setUser(session.user as any);
            }
            setIsLoading(false);
        };
        checkAuth();
    }, []);

    const login = async (email?: string, password?: string) => {
        if (!email || !password) return;
        const auth = (nhostRef.current as any).auth;
        const { session, error } = await auth.signIn({ email, password });
        if (error) throw error;
        if (session) {
            setIsAuthenticated(true);
            setUser(session.user as any);
            setOfflineMode(false);
            store?.setCell('settings', 'auth', 'offline_mode', false);
        }
    };

    const register = async (email: string, password: string) => {
        const auth = (nhostRef.current as any).auth;
        const { session, error } = await auth.signUp({ email, password });
        if (error) throw error;
        if (session) {
            setIsAuthenticated(true);
            setUser(session.user as any);
            setOfflineMode(false);
            store?.setCell('settings', 'auth', 'offline_mode', false);
        }
    };

    const logout = async () => {
        const auth = (nhostRef.current as any).auth;
        await auth.signOut();
        setIsAuthenticated(false);
        setUser(null);
        setOfflineMode(false);
        store?.setCell('settings', 'auth', 'offline_mode', false);
    };

    const continueOffline = () => {
        setIsAuthenticated(false);
        setOfflineMode(true);
        store?.setCell('settings', 'auth', 'offline_mode', true);
    };

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            isLoading,
            user,
            offlineMode,
            login,
            register,
            logout,
            continueOffline
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
