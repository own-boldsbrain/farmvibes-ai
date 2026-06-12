# Tech Stack: Electricity Maps

## Languages
- **Python (3.8+):** Core language for data ingestion, parsers, and configuration validation.
- **TypeScript:** Primary language for the web frontend, mobile shell, and shared scripts.

## Backend & Data Ingestion
- **Poetry:** Dependency management and packaging for Python.
- **Pydantic:** Data validation and settings management using Python type annotations.
- **Pandas & Arrow:** Efficient handling and processing of electricity grid data.
- **BeautifulSoup4 & Requests:** Web scraping and HTTP client for external data fetching.

## Frontend Development
- **React (v18):** UI library for building the interactive map and dashboards.
- **Vite:** Next-generation frontend tooling for fast development and building.
- **Tailwind CSS:** Utility-first CSS framework for styling.
- **Precision Architect System:** A custom industrial design system built on 0px border-radius, tonal stepping, and kinetic energy gradients.
- **MapLibre GL:** Open-source map rendering library for visualizing geographic data.
- **TanStack Query:** Powerful asynchronous state management for fetching and caching grid data.
- **Jotai:** Atomic state management for React.

## Mobile Application
- **Capacitor:** Cross-platform app runtime for wrapping the web application as a native mobile app.

## Testing & Quality Assurance
- **Pytest:** Framework for testing Python parsers and configuration models.
- **Vitest:** Blazing fast unit test runner for the web frontend.
- **Cypress:** End-to-end testing for web and mobile interactions.
- **ESLint & Prettier:** Standardized linting and formatting across the monorepo.

## Architecture
- **Monorepo:** Centralized management of parsers, geographic configurations (`config/`), web app (`web/`), and mobile app (`mobileapp/`).
