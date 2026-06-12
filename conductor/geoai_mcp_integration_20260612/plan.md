# Implementation Plan: GeoAI MCP Integration

## Phase 1: Infrastructure & Backend Integration

- [x] Task: Enable GeoAI MCP Server for local persistence
    - [x] Configure `geoai-mcp-server` environment variables for shared storage.
    - [x] Verify server connectivity within the local cluster/development environment.
- [x] Task: Create MCP Bridge in `vibe_server`
    - [x] Implement MCP client module to invoke GeoAI tools programmatically.
- [x] Task: Conductor - User Manual Verification 'Phase 1: Infrastructure & Backend Integration' (Protocol in workflow.md)



## Phase 2: Batch Segmentation Foundation

- [ ] Task: Validate and prepare canonical rooftop targets
    - [ ] Create `scripts/geojson_audit.py` to audit `quod__bdgd-points...` and `BDGD Vector`.
    - [ ] Perform spatial join to create `roof_targets_canonical.parquet`.
    - [ ] Deduplicate and generate unique `roof_target_id`.
- [ ] Task: Build tile-based batch planner
    - [ ] Implement `batch_planner.py` to group targets by tile/bbox.
    - [ ] Emit `batch_jobs.jsonl` with status tracking (pending/completed).
- [ ] Task: Implement OpenGeoAI batch operator
    - [ ] Create operator to ingest `batch_jobs.jsonl`, run SAM inference via `opengeoai`, and polygonize outputs.
    - [ ] Implement checkpoint/resume logic using `batch_jobs.jsonl`.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Batch Segmentation Foundation' (Protocol in workflow.md)

## Phase 3: End-to-End Pipeline & MCP Review UI

- [ ] Task: Define ingestion workflow for curated results
    - [ ] Update FarmVibes.AI workflow to ingest outputs from artifact directory.
    - [ ] Implement curation and persistence logic into `50_curated`/`70_artifacts`.
- [ ] Task: Implement MCP Review UI
    - [ ] Refactor `geoai.js` as an inspection/review tool.
    - [ ] Implement MCP tool to expose batch results for human correction.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: End-to-End Pipeline & Storage' (Protocol in workflow.md)
