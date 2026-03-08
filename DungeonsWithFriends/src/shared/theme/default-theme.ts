import { THEME_TOKENS } from './tokens';

/**
 * The "Torch-Lit Dungeon" Default Theme.
 * Aesthetic: Dark, high contrast, mysterious indigo and warm amber.
 */
export const DEFAULT_THEME = {
    [THEME_TOKENS.colors.background_primary]: '#000000',      // OLED Black
    [THEME_TOKENS.colors.background_secondary]: '#1E1B4B',    // Indigo 950
    [THEME_TOKENS.colors.accent_primary]: '#4F46E5',         // Indigo 600
    [THEME_TOKENS.colors.accent_secondary]: '#F59E0B',       // Amber 500
    [THEME_TOKENS.colors.text_primary]: '#FFFFFF',           // White
    [THEME_TOKENS.colors.text_secondary]: '#9CA3AF',         // Gray 400
    [THEME_TOKENS.colors.border_primary]: '#312E81',         // Indigo 900

    [THEME_TOKENS.colors.gold]: '#D97706',                   // Gold/Amber 600
    [THEME_TOKENS.colors.ember]: '#DC2626',                // Red 600 for health
    [THEME_TOKENS.colors.dungeon_stone]: '#312E81',          // Indigo 900 for cards
    [THEME_TOKENS.colors.dungeon_deep]: '#0F172A',           // Slate 900 for deep backgrounds

    [THEME_TOKENS.fonts.heading]: 'Cinzel',
    [THEME_TOKENS.fonts.body]: 'Inter',

    [THEME_TOKENS.spacing.card_padding]: '16px',
    [THEME_TOKENS.spacing.screen_margin]: '24px',
};
