import { registrationSchema, loginSchema } from '@/features/auth/model/auth-schemas';

describe('registrationSchema', () => {
    it('validates a correct registration object', () => {
        const validData = {
            email: 'test@example.com',
            password: 'password123',
            is_age_verified: true,
        };
        expect(registrationSchema.safeParse(validData).success).toBe(true);
    });

    it('fails when age is not verified', () => {
        const invalidData = {
            email: 'test@example.com',
            password: 'password123',
            is_age_verified: false,
        };
        const result = registrationSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].message).toBe('Must be 17+ to proceed');
        }
    });

    it('fails with invalid email', () => {
        const invalidData = {
            email: 'not-an-email',
            password: 'password123',
            is_age_verified: true,
        };
        expect(registrationSchema.safeParse(invalidData).success).toBe(false);
    });

    it('fails with short password', () => {
        const invalidData = {
            email: 'test@example.com',
            password: 'short',
            is_age_verified: true,
        };
        expect(registrationSchema.safeParse(invalidData).success).toBe(false);
    });
});

describe('loginSchema', () => {
    it('validates a correct login payload', () => {
        const valid = {
            email: 'test@example.com',
            password: 'password123'
        };
        const result = loginSchema.safeParse(valid);
        expect(result.success).toBe(true);
    });

    it('rejects empty password', () => {
        const invalid = {
            email: 'test@example.com',
            password: ''
        };
        const result = loginSchema.safeParse(invalid);
        expect(result.success).toBe(false);
    });

    it('rejects invalid email', () => {
        const invalid = {
            email: 'not-an-email',
            password: 'password123'
        };
        const result = loginSchema.safeParse(invalid);
        expect(result.success).toBe(false);
    });
});
