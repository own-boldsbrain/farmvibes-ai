# Implementation Plan: GeoAI MCP Integration

## Phase 1: Infrastructure & Backend Integration

- [x] Task: Enable GeoAI MCP Server for local persistence
    - [x] Configure `geoai-mcp-server` environment variables for shared storage.
    - [x] Verify server connectivity within the local cluster/development environment.
- [x] Task: Create MCP Bridge in `vibe_server`
    - [x] Implement MCP client module to invoke GeoAI tools programmatically.
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Infrastructure & Backend Integration' (Protocol in workflow.md)

## Phase 2: Frontend Refactoring

- [ ] Task: Refactor `geoai.js` to Proxy MCP requests
    - [ ] Implement MCP client logic within the browser context.
    - [ ] Map UI segmentation actions to GeoAI MCP Tool calls.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Frontend Refactoring' (Protocol in workflow.md)

## Phase 3: End-to-End Pipeline

- [ ] Task: Define ingestion workflow for curated results
    - [ ] Update FarmVibes.AI workflow to ingest outputs from MCP directory.
    - [ ] Implement curation and persistence logic into `50_curated`/`70_artifacts`.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: End-to-End Pipeline & Storage' (Protocol in workflow.md)
