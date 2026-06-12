# AGENTS

Quick-start guide for AI coding agents working in this repository.

## 1) Repository Overview

- Python backend and parser ecosystem: [README.md](README.md), [parsers/README.md](parsers/README.md)
- Parser implementations: [parsers](parsers)
- Shared Python package code: [electricitymap](electricitymap)
- Zone and exchange config source of truth: [config](config)
- Python tests: [tests](tests), [parsers/test](parsers/test), parser CLI smoke tool [test_parser.py](test_parser.py)
- Web app (Vite + React): [web](web), docs in [web/README.md](web/README.md)
- Mobile app (Capacitor wrapper around web build): [mobileapp](mobileapp), docs in [mobileapp/README.md](mobileapp/README.md)
- Mock API server for local frontend work: [mockserver](mockserver), docs in [mockserver/README.md](mockserver/README.md)

## 2) Setup, Build, and Test Commands

### Python root

- Install dependencies (including parser extras): `poetry install -E parsers`
- Lint: `poetry run lint`
- Format: `poetry run format`
- Test suite: `poetry run test`
- Full check: `poetry run check`
- Run one parser manually: `poetry run test_parser FR production`

### Web

- Install: `cd web && pnpm install`
- Dev: `cd web && pnpm dev`
- Build: `cd web && pnpm build`
- Test: `cd web && pnpm test`
- Lint: `cd web && pnpm lint`

### Mobile app

- Install: `cd mobileapp && pnpm install`
- Build web assets for mobile: `cd mobileapp && pnpm build-web`
- Run iOS dev: `cd mobileapp && pnpm dev-ios`
- Run Android dev: `cd mobileapp && pnpm dev-android`

### Mockserver

- Install: `cd mockserver && pnpm install`
- Start: `cd mockserver && pnpm start`

## 3) Repo Conventions and Guardrails

- Parser contract is enforced by tests in [tests/test_parser_interface.py](tests/test_parser_interface.py); parser function signatures and return types must stay compatible.
- Parser runtime quality checks are in [test_parser.py](test_parser.py) and validation helpers under [parsers/lib](parsers/lib).
- Zone and exchange definitions are config-driven; update [config/zones](config/zones) and [config/exchanges](config/exchanges) consistently with parser changes.
- Keep Python tooling aligned with [scripts/tooling.py](scripts/tooling.py) and [pyproject.toml](pyproject.toml) scripts instead of inventing one-off commands.
- Add or update tests close to the changed area: [tests](tests) for config/core behavior, [parsers/test](parsers/test) for parser-specific behavior.

## 4) Safe Edit Boundaries and Source of Truth

- Safe default scope for parser work: [parsers](parsers), matching config in [config/zones](config/zones) or [config/exchanges](config/exchanges), plus related tests.
- Avoid broad refactors across web, mobile, and Python in one change unless explicitly requested.
- Data source references and methodology docs: [DATA_SOURCES.md](DATA_SOURCES.md), [EMISSION_FACTORS_SOURCES.md](EMISSION_FACTORS_SOURCES.md).
- Main contributor entry points: [README.md](README.md), [parsers/README.md](parsers/README.md), [web/README.md](web/README.md), [mobileapp/README.md](mobileapp/README.md).

## 5) Common Pitfalls

- Package manager mismatch: some docs mention yarn commands, but this repo uses pnpm in subprojects. Prefer `pnpm` based on package scripts.
- Python version: constrained by [pyproject.toml](pyproject.toml) to >=3.8 and <4.0.
- Node version expectations differ by area: web declares >=14.15 in [web/package.json](web/package.json), while mobile docs mention Node 18+ in [mobileapp/README.md](mobileapp/README.md). If uncertain, use a modern LTS that satisfies both.
- Mobile app depends on web build artifacts; run mobile commands that call `build-web` before expecting native changes to reflect.
