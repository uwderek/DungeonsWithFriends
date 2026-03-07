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
