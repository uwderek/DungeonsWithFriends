import React, { createContext, useContext, useEffect, useState } from 'react';
import { NhostClient } from '@nhost/nhost-js';

// TODO: Replace with actual Nhost config from environment variables
// @ts-ignore - Supressed until @nhost/react and @nhost/nhost-js are upgraded to the urql standard
const nhost = new NhostClient({
    subdomain: 'local', // Replace with your Nhost subdomain
    region: 'local' // Replace with your Nhost region
});

type AuthContextType = {
    isAuthenticated: boolean;
    isLoading: boolean;
    user: any | null; // Replace any with strict User type when model is defined
    login: () => void; // Define strict signature later
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<any | null>(null);

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
