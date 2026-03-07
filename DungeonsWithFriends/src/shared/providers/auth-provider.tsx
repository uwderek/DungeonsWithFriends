import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { NhostClient } from '@nhost/nhost-js';

type User = {
    id: string;
    email: string;
    displayName?: string;
};

type AuthContextType = {
    isAuthenticated: boolean;
    isLoading: boolean;
    user: User | null;
    login: () => void;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // TODO: Replace with actual Nhost config from environment variables
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore - Suppressed until @nhost/react and @nhost/nhost-js are upgraded to the urql standard
    const nhostRef = useRef(new NhostClient({ subdomain: 'local', region: 'local' }));

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        // Initial Auth check logic goes here
        setIsLoading(false);
    }, []);

    const login = () => {
        // Implementation
    };

    const logout = () => {
        // Implementation
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, isLoading, user, login, logout }}>
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
