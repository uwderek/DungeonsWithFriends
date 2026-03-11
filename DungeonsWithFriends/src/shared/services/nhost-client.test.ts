import { createNhostClient, NhostClientLike } from './nhost-client';

describe('nhost-client', () => {
    it('uses the provided ClientClassOverride (Dependency Injection)', () => {
        const mockConstructor = jest.fn().mockImplementation(() => ({
            auth: {
                getSession: () => ({ user: { id: 'test' } }),
                signIn: jest.fn(),
                signUp: jest.fn(),
                signOut: jest.fn(),
            }
        }));

        const config = { subdomain: 'test', region: 'us-east-1' };
        const client = createNhostClient(config, mockConstructor);

        expect(mockConstructor).toHaveBeenCalledWith(config);
        expect(client.auth.getSession()).toEqual({ user: { id: 'test' } });
    });

    it('falls back to mock client when no override and require fails', () => {
        // This still tests the fallback logic but without complex mocking of the real module
        // We'll use the existing test logic for the fallback branches
        jest.resetModules();
        jest.doMock('@nhost/nhost-js', () => {
            throw new Error('Module Not Found');
        }, { virtual: true });

        const { createNhostClient: createClient } = require('./nhost-client');
        const client = createClient({ subdomain: 'test', region: 'us-east-1' });

        expect(client.auth.getSession()).toBeNull();
    });

    it('covers mock auth methods', async () => {
        // Force fallback
        jest.resetModules();
        jest.doMock('@nhost/nhost-js', () => { throw new Error(); }, { virtual: true });
        
        const { createNhostClient: createClient } = require('./nhost-client');
        const client = createClient({ subdomain: 'test', region: 'us-east-1' });

        expect(client.auth.getSession()).toBeNull();
        expect(await client.auth.signIn({ email: 'a', password: 'b' })).toEqual({ session: null, error: null });
        expect(await client.auth.signUp({ email: 'a', password: 'b' })).toEqual({ session: null, error: null });
        await client.auth.signOut();
    });

    it('returns mock when ClientClass is not found in module', () => {
        jest.resetModules();
        jest.doMock('@nhost/nhost-js', () => ({}), { virtual: true });
        
        const { createNhostClient: createClient } = require('./nhost-client');
        const client = createClient({ subdomain: 'test', region: 'us-east-1' });
        
        expect(client.auth.getSession()).toBeNull();
    });
});
