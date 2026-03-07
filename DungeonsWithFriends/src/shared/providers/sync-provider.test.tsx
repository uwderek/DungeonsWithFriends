import React from 'react';
import { render, act } from '@testing-library/react-native';
import { Text } from 'react-native';
import { SyncProvider, useSync } from './sync-provider';

// Mock tinybase to avoid real store initialization complexity in tests
jest.mock('tinybase/ui-react', () => ({
    Provider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    useCreateStore: jest.fn(() => ({})),
}));

jest.mock('tinybase', () => ({
    createStore: jest.fn(() => ({})),
}));

function SyncConsumer() {
    const { isSyncing, lastSyncTime, triggerManualSync } = useSync();
    return (
        <>
            <Text testID="isSyncing">{String(isSyncing)}</Text>
            <Text testID="lastSyncTime">{lastSyncTime === null ? 'null' : String(lastSyncTime)}</Text>
            <Text testID="trigger" onPress={triggerManualSync}>trigger</Text>
        </>
    );
}

describe('SyncProvider', () => {
    it('renders children without crashing', () => {
        const { getByText } = render(
            <SyncProvider>
                <Text>Hello Sync</Text>
            </SyncProvider>
        );
        expect(getByText('Hello Sync')).toBeTruthy();
    });

    it('provides initial state: not syncing, no last sync time', async () => {
        const { getByTestId } = render(
            <SyncProvider>
                <SyncConsumer />
            </SyncProvider>
        );

        await act(async () => { });

        expect(getByTestId('isSyncing').props.children).toBe('false');
        expect(getByTestId('lastSyncTime').props.children).toBe('null');
    });

    it('triggerManualSync sets isSyncing to true then resets', async () => {
        jest.useFakeTimers();

        const { getByTestId } = render(
            <SyncProvider>
                <SyncConsumer />
            </SyncProvider>
        );

        await act(async () => { });

        // Trigger sync
        await act(async () => {
            getByTestId('trigger').props.onPress();
        });

        expect(getByTestId('isSyncing').props.children).toBe('true');

        // Advance timers so the setTimeout callback fires
        await act(async () => {
            jest.advanceTimersByTime(600);
        });

        expect(getByTestId('isSyncing').props.children).toBe('false');

        jest.useRealTimers();
    });
});

describe('useSync', () => {
    it('throws when used outside of SyncProvider', () => {
        const spy = jest.spyOn(console, 'error').mockImplementation(() => { });

        function BadConsumer() {
            useSync();
            return null;
        }

        expect(() => render(<BadConsumer />)).toThrow(
            'useSync must be used within a SyncProvider'
        );

        spy.mockRestore();
    });
});
