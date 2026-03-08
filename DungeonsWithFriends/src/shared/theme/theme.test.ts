import { THEME_TOKENS } from './tokens';
import { DEFAULT_THEME } from './default-theme';

describe('THEME_TOKENS', () => {
    it('exports color tokens', () => {
        expect(THEME_TOKENS.colors.background_primary).toBe('--color-background-primary');
        expect(THEME_TOKENS.colors.accent_primary).toBe('--color-accent-primary');
        expect(THEME_TOKENS.colors.text_primary).toBe('--color-text-primary');
    });

    it('exports font tokens', () => {
        expect(THEME_TOKENS.fonts.heading).toBe('--font-heading');
        expect(THEME_TOKENS.fonts.body).toBe('--font-body');
    });

    it('exports spacing tokens', () => {
        expect(THEME_TOKENS.spacing.card_padding).toBe('--spacing-card-padding');
        expect(THEME_TOKENS.spacing.screen_margin).toBe('--spacing-screen-margin');
    });
});

describe('DEFAULT_THEME', () => {
    it('maps token keys to CSS values', () => {
        expect(DEFAULT_THEME[THEME_TOKENS.colors.background_primary]).toBe('#000000');
        expect(DEFAULT_THEME[THEME_TOKENS.colors.accent_primary]).toBe('#4F46E5');
        expect(DEFAULT_THEME[THEME_TOKENS.colors.text_primary]).toBe('#FFFFFF');
    });

    it('includes font and spacing values', () => {
        expect(DEFAULT_THEME[THEME_TOKENS.fonts.heading]).toBe('Cinzel');
        expect(DEFAULT_THEME[THEME_TOKENS.fonts.body]).toBe('Inter');
        expect(DEFAULT_THEME[THEME_TOKENS.spacing.card_padding]).toBe('16px');
    });
});
