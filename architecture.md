1. Backend Architecture & Libraries
The application is built around an offline-first, agentic architecture using a cross-platform React Native (Expo) frontend. The backend services prioritize local processing and persistence with seamless cloud sync.

Local Data & State Management

TinyBase (tinybase): Acts as the offline-first reactive key-value and tabular data store. It stores data locally (via SQLite on native devices) and provides fine-grained reactivity for UI components.

Expo SQLite (expo-sqlite): The underlying SQL database engine powering the local native persistence for TinyBase.

Zustand (zustand): Used for managing ephemeral, non-persisted session-level state across the UI.

Cloud Backend & Data Sync

Nhost JS SDK (@nhost/nhost-js): Serves as the primary Backend-as-a-Service (BaaS). It provides PostgreSQL for the cloud database, Hasura for GraphQL APIs, built-in Authentication, and Storage.

GraphQL Client (graphql-client): Used to securely communicate with the Nhost Hasura endpoint to sync local TinyBase data with the cloud Postgres database.

Nhost Serverless Functions: Hosts custom backend logic, such as the AI Proxy (/functions/ai-proxy) which handles billing and forwards requests to OpenRouter.

2. Testing Strategy & Libraries
The testing strategy has moved towards a structured setup orchestrated by a custom MCP (Model Context Protocol) server (test-orchestrator), dividing tests into Unit and End-to-End (E2E) layers.

Unit Testing Strategy

Jest (jest, babel-jest, jest-expo): The core unit test runner used to validate individual components, hooks, and core business logic locally.
React Native Testing Library (@testing-library/react-native): Employed alongside Jest to test the rendering, interactions, and accessibility of React Native and Gluestack UI components without requiring a physical device.

E2E Testing Strategy

Playwright (@playwright/test): Replaced Maestro/Detox (indicated by some legacy docs) as the primary End-to-End browser/web testing framework. Playwright simulates detailed user flows like authentication, task management, and project tracking in a real browser environment.

est Orchestration

MCP Test Orchestrator (mcp/test-orchestrator/dist/cli.js): A custom system designed for AI agents to precisely run tests, type-checks, and coverage reports. It replaces the traditional manual npm test scripts to provide structured, machine-readable output for continuous validation during development.