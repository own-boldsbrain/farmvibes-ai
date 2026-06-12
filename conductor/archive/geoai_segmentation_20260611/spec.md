# Specification: GeoAI Interactive Segmentation Integration

## Overview
This track focuses on integrating advanced geospatial AI capabilities into FarmVibes.AI to enable general interactive segmentation. The goal is to build an end-to-end pipeline that leverages both backend Python operators (using OpenGeoAI/SAM) and frontend execution (using geoai.js) for real-time interaction.

## Functional Requirements
- **Backend Operators (OpenGeoAI):** Implement new FarmVibes.AI operators using the OpenGeoAI library to process heavy segmentation tasks (e.g., generating SAM embeddings) on the cluster.
- **Frontend Integration (geoai.js):** Integrate `geoai.js` into the client/UI to allow users to interactively segment objects (buildings, solar panels, fields) using zero-shot capabilities.
- **End-to-End Pipeline:** Orchestrate the flow of data from ingestion to visualization.
- **Data Integration:** 
  - Read input imagery from the local data infrastructure (e.g., `20_raw`, `60_geospatial`).
  - Use reference data (like the `quod__bdgd-points` GeoJSON) to automatically prompt the SAM model.
  - Store generated masks and polygons back into the structured data folders (e.g., `50_curated`, `70_artifacts`).

## Non-Functional Requirements
- **Performance:** Frontend segmentation must run fluidly using WebGL/WebGPU via Transformers.js.
- **Design Alignment:** The frontend interface must adhere to the YSH "Precision Architect" / "The Void" design themes.

## Acceptance Criteria
- [ ] Backend operators successfully run OpenGeoAI SAM models on provided raster inputs.
- [ ] Frontend successfully loads `geoai.js` and can perform interactive mask generation on tile data.
- [ ] A complete workflow can be triggered that reads from the local data folders, processes the imagery, and saves the output polygons.
- [ ] The pipeline can accept point prompts from the `bdgd-points` GeoJSON to segment specific targets.

## Out of Scope
- Training or fine-tuning custom segmentation models from scratch.
- Real-time video stream segmentation.