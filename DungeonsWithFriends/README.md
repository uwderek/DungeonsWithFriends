# Dungeons With Friends - Foundation (React Native Web + Nativewind v4)

This represents the foundational codebase for the Dungeons With Friends project. It is structured using Feature-Sliced Design to eventually build out complex offline-first capabilities using TinyBase and Nhost synchronization.

## 🚀 Getting Started

First, install your dependencies. 

```bash
npm install
```

### Note on Expected `npm install` Warnings
During installation, you will see a few deprecation warnings related to packages like `glob@7.2.3` and `rimraf@3.0.2`. **Do not attempt to 'fix' these**. 

These ancient utilities are deeply hardcoded into the internal build tools of React Native 0.73 and TailwindCSS/Nativewind. Attempting to force-upgrade them to modern versions will fundamentally break the Expo Metro bundler because the modern packages dropped legacy synchronous APIs. As proven by `npm audit`, they carry zero security vulnerabilities. They are simply logged by npm because their authors stopped maintaining them.

### Running the App Locally

To start the development server:

```bash
npm start
``` 

Press **`w`** in the terminal to open the web application. You can press `a` or `i` to open an Android or iOS emulator if installed.

To export the web bundle, run:

```bash
npx expo export -p web
```

## 🧪 Testing Architecture

The project contains two distinct layers of automated testing mandated by the architecture.

### 1. Unit & Component Testing (Jest / React Testing Library)
We use Jest for asserting pure JavaScript domain logic, and `@testing-library/react-native` for isolating UI components. Tests should be strictly co-located within Feature Slices (e.g., `src/features/builder/ui/button.test.tsx`).

To run the suite:
```bash
npm run test
```

To run in watch mode:
```bash
npm run test:watch
```

### 2. End-to-End Testing (Playwright)
We use Playwright strictly for full-system integration checks on the web target (simulating user browser workflows). These are located in the `/e2e` folder.

To install the Playwright browser binaries (only needed once):
```bash
npx playwright install
```

To run the Playwright suite (which will automatically spin up the `npm run web` dev server in the background):
```bash
npm run test:e2e
```