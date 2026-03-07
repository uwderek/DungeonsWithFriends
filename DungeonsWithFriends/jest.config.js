module.exports = {
    preset: "jest-expo",
    setupFilesAfterEnv: ["<rootDir>/jest-setup.js"],
    testPathIgnorePatterns: ["<rootDir>/e2e/"],
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1",
        "\\.css$": "<rootDir>/jest-style-mock.js"
    },
    transformIgnorePatterns: [
        "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)"
    ],
    coverageDirectory: "output/coverage",
    coverageReporters: ["lcov", "json-summary", "text"],
    collectCoverageFrom: [
        "src/**/*.{ts,tsx}",
        "!src/**/*.d.ts",
        "!src/**/__tests__/**",
        "!src/**/*.test.{ts,tsx}",
        "!src/**/*.spec.{ts,tsx}"
    ]
};
