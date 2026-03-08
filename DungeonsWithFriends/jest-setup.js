// import '@testing-library/jest-native/extend-expect';

jest.useFakeTimers();

beforeEach(() => {
    const testName = expect.getState().currentTestName;
    if (testName) {
        // Output formatting exactly as Test Orchestrator utils.ts capture logic requires
        console.log(`[TEST START] ${testName}`);
    }
});

afterEach(() => {
    const testName = expect.getState().currentTestName;
    if (testName) {
        console.log(`[TEST END] ${testName}`);
    }
});

jest.mock('react-native-safe-area-context', () => {
    const React = require('react');
    const inset = { top: 0, right: 0, bottom: 0, left: 0 };
    return {
        SafeAreaProvider: ({ children }) => children,
        SafeAreaView: ({ children }) => children,
        useSafeAreaInsets: () => inset,
        useSafeAreaFrame: () => ({ x: 0, y: 0, width: 390, height: 844 }),
        SafeAreaConsumer: ({ children }) => children(inset),
        SafeAreaInsetsContext: {
            Consumer: ({ children }) => children(inset),
        },
    };
});
