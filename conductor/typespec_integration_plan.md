# TypeSpec Integration Plan

## Objective
Prepare the FarmVibes.AI repository for the adoption of TypeSpec as the standard for API and data model definitions. This includes setting up the build infrastructure, documentation, and a foundational project structure.

## Key Files & Context
- `typespec/package.json`: Will host NPM scripts for TypeSpec CLI.
- `Makefile`: Will expose TypeSpec commands to the repository's standard build workflow.
- `GEMINI.md`: Will document the new standard and how to use it.
- `typespec/main.tsp`: Will be updated to reflect FarmVibes-specific models instead of the default Widget demo.

## Implementation Steps

### 1. Update `typespec/package.json`
Add standard scripts for building and formatting TypeSpec files to make local development easier:
- `"build": "tsp compile ."`
- `"format": "tsp format **/*.tsp"`

### 2. Update Root `Makefile`
Integrate TypeSpec into the project's Make-based workflow by adding the following targets:
- `typespec-install`: Runs `npm install` inside the `typespec/` directory.
- `typespec-compile`: Runs `npm run build` inside the `typespec/` directory.
- `typespec-format`: Runs `npm run format` inside the `typespec/` directory.

### 3. Update `GEMINI.md` Documentation
Document the adoption of TypeSpec to ensure the team is aware of its role:
- **Core Technologies**: Add `TypeSpec` and `Node.js` (for compilation).
- **Development Conventions**: Add a section explaining that API definitions and shared data models (like `DataVibe`) should be defined in TypeSpec and compiled to OpenAPI. Include the commands to build and format.

### 4. Setup Initial FarmVibes Models
Replace the generic "Widget Service" demo with a foundational structure suitable for FarmVibes.AI:
- Create `typespec/models/core.tsp` to define a basic `DataVibe` or `BaseVibe` model, mirroring the core concepts found in `src/vibe_core/vibe_core/data/core_types.py`.
- Update `typespec/main.tsp` to import these models and define a basic `VibeService` namespace.

## Verification
- Run `make typespec-install` successfully.
- Run `make typespec-format` and ensure files are formatted.
- Run `make typespec-compile` and verify that the OpenAPI 3 schema is generated correctly in `typespec/tsp-output/`.
- Review `GEMINI.md` to ensure the new instructions are clear.