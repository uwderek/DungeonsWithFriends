/**
 * CSS Variable Token Names for the Dungeons With Friends theming system.
 * These tokens allow for system-agnostic visual styling via Tailwind/NativeWind.
 */
export const THEME_TOKENS = {
    colors: {
        background_primary: '--color-background-primary',   // Page background (e.g., OLED black)
        background_secondary: '--color-background-secondary', // Card/Surface background (e.g., Indigo-950)
        accent_primary: '--color-accent-primary',           // Primary action color (e.g., Indigo-600)
        accent_secondary: '--color-accent-secondary',       // Secondary accents (e.g., Amber-500)
        text_primary: '--color-text-primary',               // Primary text (e.g., White)
        text_secondary: '--color-text-secondary',           // Muted text (e.g., Gray-400)
        border_primary: '--color-border-primary',           // Standard borders
    },
    fonts: {
        heading: '--font-heading', // e.g., Cinzel
        body: '--font-body',       // e.g., Inter
    },
    spacing: {
        card_padding: '--spacing-card-padding',
        screen_margin: '--spacing-screen-margin',
    }
} as const;
