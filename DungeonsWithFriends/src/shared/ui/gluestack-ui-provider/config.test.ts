import { config } from './config';

describe('gluestack-ui-provider config', () => {
    it('exports a config object', () => {
        expect(config).toBeDefined();
        expect(typeof config).toBe('object');
    });

    it('has a light mode key', () => {
        expect(config).toHaveProperty('light');
    });

    it('has a dark mode key', () => {
        expect(config).toHaveProperty('dark');
    });

    it('light config is a non-null object', () => {
        expect(typeof config.light).toBe('object');
        expect(config.light).not.toBeNull();
    });
});
