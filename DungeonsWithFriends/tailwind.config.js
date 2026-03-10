/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  // NOTE: Update this to include the paths to all of your component files.
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: {
          primary: 'var(--color-background-primary)',
          secondary: 'var(--color-background-secondary)',
          error: "var(--color-background-error)",
          warning: "var(--color-background-warning)",
          muted: "var(--color-background-muted)",
          success: "var(--color-background-success)",
          info: "var(--color-background-info)",
          light: "#FBFBFB",
          dark: "#181719",
        },
        border: {
          primary: 'var(--color-border-primary)',
        },
        gold: 'var(--color-gold)',
        ember: 'var(--color-ember)',
        accent: {
          primary: 'var(--color-accent-primary)',
          secondary: 'var(--color-accent-secondary)',
        },
        typography: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
        },
        dungeon: {
          stone: 'var(--color-dungeon-stone)',
          deep: 'var(--color-dungeon-deep)',
        },
      },
      fontFamily: {
        heading: ["var(--font-heading)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      fontWeight: {
        hairline: "100",
        extraBlack: "950",
      },
      fontSize: {
        "2xs": "10px",
      },
    },
    plugins: [],
  },
  plugins: [],
};
