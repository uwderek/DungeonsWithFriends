import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';

// Mock all native/external deps BEFORE any imports that use them
jest.mock('@nhost/nhost-js', () => ({
    NhostClient: jest.fn().mockImplementation(() => ({
        auth: {
            getSession: jest.fn().mockReturnValue(null),
            signIn: jest.fn(),
            signUp: jest.fn(),
            signOut: jest.fn(),
        },
    })),
}));

jest.mock('lucide-react-native', () => ({
    LogIn: jest.fn(() => null),
    UserPlus: jest.fn(() => null),
    WifiOff: jest.fn(() => null),
}));

jest.mock('@/shared/providers/auth-provider', () => ({
    useAuth: jest.fn(() => ({
        login: jest.fn(),
        logout: jest.fn(),
    })),
}));

import { WelcomeScreen } from './welcome-screen';

describe('WelcomeScreen', () => {
    const mockOnLogin = jest.fn();
    const mockOnRegister = jest.fn();
    const mockOnContinueOffline = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders all three authentication options', () => {
        const { getByText } = render(
            <WelcomeScreen onLogin={mockOnLogin} onRegister={mockOnRegister} onContinueOffline={mockOnContinueOffline} />
        );

        expect(getByText(/Login/i)).toBeTruthy();
        expect(getByText(/Register/i)).toBeTruthy();
        expect(getByText(/Continue Offline/i)).toBeTruthy();
    });

    it('calls onLogin on Login click', () => {
        const { getByText } = render(
            <WelcomeScreen onLogin={mockOnLogin} onRegister={mockOnRegister} onContinueOffline={mockOnContinueOffline} />
        );

        fireEvent.press(getByText(/Login/i));
        expect(mockOnLogin).toHaveBeenCalled();
    });

    it('calls onRegister on Register click', () => {
        const { getByText } = render(
            <WelcomeScreen onLogin={mockOnLogin} onRegister={mockOnRegister} onContinueOffline={mockOnContinueOffline} />
        );

        fireEvent.press(getByText(/Register/i));
        expect(mockOnRegister).toHaveBeenCalled();
    });

    it('calls onContinueOffline when Continue Offline is clicked', () => {
        const { getByText } = render(
            <WelcomeScreen onLogin={mockOnLogin} onRegister={mockOnRegister} onContinueOffline={mockOnContinueOffline} />
        );

        fireEvent.press(getByText(/Continue Offline/i));
        expect(mockOnContinueOffline).toHaveBeenCalled();
    });
});
