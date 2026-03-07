describe('Initialization', () => {
    beforeAll(() => {
        jest.useFakeTimers();
    });

    afterAll(() => {
        jest.useRealTimers();
    });

    it('should pass a basic sanity check', () => {
        expect(true).toBe(true);
    });
});
