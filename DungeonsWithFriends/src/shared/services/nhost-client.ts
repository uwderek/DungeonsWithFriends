/**
 * Nhost Client Factory
 *
 * @nhost/nhost-js has ESM/CJS interop issues when bundled for Expo Web.
 * This module centralizes the resolution logic and provides a typed mock fallback,
 * so no other file in the codebase needs to worry about it.
 */

export interface NhostAuthClient {
    getSession(): { user: unknown } | null;
    signIn(opts: { email: string; password: string }): Promise<{ session: { user: unknown } | null; error: unknown }>;
    signUp(opts: { email: string; password: string }): Promise<{ session: { user: unknown } | null; error: unknown }>;
    signOut(): Promise<void>;
}

export interface NhostClientLike {
    auth: NhostAuthClient;
}

/** Minimal offline/mock auth client used when real Nhost can't be instantiated. */
const mockAuth: NhostAuthClient = {
    getSession: () => null,
    signIn: async () => ({ session: null, error: null }),
    signUp: async () => ({ session: null, error: null }),
    signOut: async () => { },
};

const mockNhostClient: NhostClientLike = { auth: mockAuth };

/**
 * Creates a NhostClient instance, safely handling ESM/CJS interop issues
 * in Expo Web bundles. Falls back to a typed mock if the real client
 * cannot be instantiated, rather than crashing the app.
 *
 * @param config Subdomain and region for Nhost
 * @param ClientClassOverride Optional constructor override for dependency injection in tests
 */
export function createNhostClient(
    config: { subdomain: string; region: string },
    ClientClassOverride?: new (config: any) => NhostClientLike
): NhostClientLike {
    if (ClientClassOverride) {
        return new ClientClassOverride(config);
    }

    try {
        // Dynamic require avoids build-time errors while still working in Metro
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const NhostModule = require('@nhost/nhost-js');
        const ClientClass = NhostModule?.NhostClient ?? NhostModule?.default?.NhostClient ?? NhostModule?.default;

        if (typeof ClientClass === 'function') {
            return new ClientClass(config) as NhostClientLike;
        }
        console.warn('[nhost-client] NhostClient constructor not found — using mock. Module keys:', Object.keys(NhostModule ?? {}));
    } catch (e) {
        console.warn('[nhost-client] Failed to load @nhost/nhost-js — using mock:', e);
    }
    return mockNhostClient;
}
