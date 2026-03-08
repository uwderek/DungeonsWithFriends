import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { createNhostClient, NhostClientLike } from '../services/nhost-client';
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

// TODO: Replace with config from environment variables
const nhostConfig = { subdomain: 'local', region: 'local' };

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const nhostRef = useRef<NhostClientLike>(createNhostClient(nhostConfig));
    const store = useStore();

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const [offlineMode, setOfflineMode] = useState(false);

    // Structured diagnostic logging
    useEffect(() => {
        console.info('[Auth] State Update:', { isAuthenticated, isLoading, offlineMode, hasUser: !!user });
    }, [isAuthenticated, isLoading, offlineMode, user]);

    // Persistence logic using TinyBase
    useEffect(() => {
        if (!store) return;
        try {
            const savedMode = store.getCell('settings', 'auth', 'offline_mode');
            if (savedMode === true) {
                setOfflineMode(true);
            }
        } catch (e) {
            console.warn('[AuthProvider] Failed to read from store:', e);
        }
    }, [store]);

    useEffect(() => {
        const checkAuth = async () => {
            const { auth } = nhostRef.current;
            try {
                const session = auth.getSession();
                if (session) {
                    setIsAuthenticated(true);
                    setUser(session.user as any);
                }
            } catch (e) {
                console.warn('[AuthProvider] Session check failed:', e);
            }
            setIsLoading(false);
        };
        checkAuth();
    }, []);

    const login = async (email?: string, password?: string) => {
        if (!email || !password) return;
        const { session, error } = await nhostRef.current.auth.signIn({ email, password });
        if (error) throw error;
        if (session) {
            setIsAuthenticated(true);
            setUser(session.user as any);
            setOfflineMode(false);
            store?.setCell('settings', 'auth', 'offline_mode', false);
        }
    };

    const register = async (email: string, password: string) => {
        const { session, error } = await nhostRef.current.auth.signUp({ email, password });
        if (error) throw error;
        if (session) {
            setIsAuthenticated(true);
            setUser(session.user as any);
            setOfflineMode(false);
            store?.setCell('settings', 'auth', 'offline_mode', false);
        }
    };

    const logout = async () => {
        await nhostRef.current.auth.signOut();
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
