# Electricity Maps Contrib

Electricity Maps is a real-time visualization of the Greenhouse Gas footprint (in CO₂ equivalent) of electricity consumption worldwide. This project manages the data ingestion (parsers), configuration (zones and exchanges), and the frontend applications (web and mobile).

## Project Structure

- **`parsers/`**: Python scripts responsible for fetching real-time and historical electricity data from various regional sources.
- **`config/`**: Contains configuration files for geographic zones (`config/zones/`) and exchanges between zones (`config/exchanges/`).
- **`electricitymap/contrib/`**: Core Python package containing configuration models, constants, and shared utilities.
- **`web/`**: The web application frontend built with React, Vite, and Tailwind CSS.
- **`mobileapp/`**: Mobile application shell built using Capacitor.
- **`mockserver/`**: A Node.js server for local development and testing with mock data.
- **`scripts/`**: Utility scripts for configuration validation, data source updates, and other maintenance tasks.
- **`tests/`**: Suite of tests for configuration, data models, and parser interfaces.

## Technology Stack

- **Backend/Data Ingestion**: Python 3.8+, Poetry (dependency management), Pydantic (data validation).
- **Web Frontend**: React, TypeScript, Vite, pnpm, Tailwind CSS, MapLibre GL, TanStack Query.
- **Mobile**: Capacitor, TypeScript.
- **Testing**: Pytest (Python), Vitest & Cypress (Web).
- **CI/CD**: GitHub Actions, Earthly.

## Getting Started

### Python Development (Parsers & Core)

The project uses **Poetry** for dependency management.

```bash
# Install dependencies
poetry install

# Run a parser for a specific zone (e.g., France)
poetry run test-parser FR production

# Run all Python tests
poetry run pytest

# Lint and Format
poetry run lint
poetry run format
```

### Web Development

The web project uses **pnpm**.

```bash
cd web

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Run unit tests
pnpm test
```

## Development Conventions

### Parsers
- **Return Type**: Parsers must return a list of dictionaries (or a single dictionary) containing a `datetime` key.
- **Datetime**: The `datetime` must be a native `datetime.datetime` object and **must be timezone-aware**.
- **Template**: Refer to `parsers/example.py` when creating a new parser.
- **Testing**: Use `test_parser.py` to verify individual parsers during development.

### Code Quality
- **Formatting**:
    - Python: **Black** and **isort**.
    - Frontend: **Prettier**.
- **Linting**:
    - Python: **pylint** and **flake8**.
    - Frontend: **ESLint**.

## Key Files
- `pyproject.toml`: Root Python project configuration.
- `web/package.json`: Frontend project configuration.
- `config/zones/*.yaml`: Geographic zone definitions and data source mapping.
- `DATA_SOURCES.md`: Documentation of where the electricity data comes from.
- `EMISSION_FACTORS_SOURCES.md`: Sources for the lifecycle CO₂ emission factors used in calculations.
