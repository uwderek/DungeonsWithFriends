import { z } from 'zod';
import {
    CURRENT_SCHEMA_VERSION,
    DWF_APP_ID,
    DwfStoreSnapshot,
    createEmptySnapshot,
} from './local-store';

const tinyBaseCellSchema = z.union([z.string(), z.number(), z.boolean()]);
const tinyBaseTablesSchema = z.record(
    z.string(),
    z.record(z.string(), z.record(z.string(), tinyBaseCellSchema))
);

const snapshotEnvelopeSchema = z.object({
    app_id: z.literal(DWF_APP_ID),
    schema_version: z.number().int().positive(),
    exported_at: z.iso.datetime(),
    tables: tinyBaseTablesSchema,
});

export type LocalStoreErrorCode =
    | 'invalid_json'
    | 'invalid_envelope'
    | 'invalid_domain_data'
    | 'storage_unavailable'
    | 'unsupported_version'
    | 'migration_failed';

export class LocalStoreError extends Error {
    constructor(
        public readonly code: LocalStoreErrorCode,
        message: string,
        public readonly cause?: unknown
    ) {
        super(message);
        this.name = 'LocalStoreError';
    }
}

export const parseSnapshotJson = (raw: string): unknown => {
    try {
        return JSON.parse(raw);
    } catch (error) {
        throw new LocalStoreError('invalid_json', 'Local store payload is not valid JSON.', error);
    }
};

export const migrateSnapshot = (input: unknown): DwfStoreSnapshot => {
    const base = snapshotEnvelopeSchema.safeParse(input);

    if (!base.success) {
        const candidateVersion = typeof input === 'object' && input !== null
            ? (input as { schema_version?: unknown }).schema_version
            : undefined;

        if (typeof candidateVersion === 'number' && candidateVersion > CURRENT_SCHEMA_VERSION) {
            throw new LocalStoreError(
                'unsupported_version',
                `Snapshot version ${candidateVersion} is newer than supported version ${CURRENT_SCHEMA_VERSION}.`,
                base.error
            );
        }

        throw new LocalStoreError('invalid_envelope', 'Local store snapshot envelope is invalid.', base.error);
    }

    if (base.data.schema_version > CURRENT_SCHEMA_VERSION) {
        throw new LocalStoreError(
            'unsupported_version',
            `Snapshot version ${base.data.schema_version} is newer than supported version ${CURRENT_SCHEMA_VERSION}.`
        );
    }

    if (base.data.schema_version === CURRENT_SCHEMA_VERSION) {
        return base.data as DwfStoreSnapshot;
    }

    throw new LocalStoreError('migration_failed', `No migration is available for version ${base.data.schema_version}.`);
};

export const recoverEmptySnapshot = (): DwfStoreSnapshot => createEmptySnapshot();
