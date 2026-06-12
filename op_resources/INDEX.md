# Index of Operator Resources (op_resources)

This directory contains models, metadata, SDKs, and scripts used by the FarmVibes.AI operators and workflows.

## 🧠 AI Models (ONNX)
Models used for geospatial analysis, computer vision, and data processing.

- [average_model](./average_model/): Simple pixel average model (`pixel_average_model.onnx`).
- [cloud_models](./cloud_models/): Models for cloud detection in satellite imagery.
- [conservation_practices_models](./conservation_practices_models/): AI models for identifying agricultural conservation practices.
- [driveways_models](./driveways_models/): Models for driveway detection and segmentation.
- [shadow_models](./shadow_models/): Models for cloud shadow detection.
- [spaceeye_models](./spaceeye_models/): Models for the SpaceEye cloud-removal workflow.
- [spectral_extension_model](./spectral_extension_model/): Models for spectral band extension.

## 🔌 MCP Servers (Model Context Protocol)
Servers that expose external APIs as tools for LLMs/Agents.

- [nasa-power-mcp-1to1](./nasa-power-mcp-1to1/): MCP server for NASA POWER meteorological and solar datasets.
- [pvgis-mcp-1to1](./pvgis-mcp-1to1/): MCP server for PVGIS (Photovoltaic Geographical Information System) tools.

## 📊 Data & Metadata
Geospatial metadata, tile geometries, and environmental datasets.

- [cdl_metadata](./cdl_metadata/): USDA Cropland Data Layer (CDL) codes, names, and color mappings.
- [glad_tile_geometry](./glad_tile_geometry/): GLAD (Global Land Analysis and Discovery) forest alert tile definitions.
- [sentinel_tile_geometry](./sentinel_tile_geometry/): Sentinel-2 tile geometry metadata.
- [electricitymaps-contrib](./electricitymaps-contrib/): Parsers and data for global electricity CO2 intensity.
- [electricitymaps-contrib-rewrite-master](./electricitymaps-contrib-rewrite-master/): Refactored version of Electricity Maps contribution tools.

## 📚 SDKs & Libraries
Source code and documentation for integrated third-party libraries.

- [carbon-aware-sdk](./carbon-aware-sdk/): SDK for building carbon-aware software (Green Software Foundation).
- [geoai.js](./geoai.js/): JavaScript library for geospatial AI tasks.
- [mapbox-gl-js](./mapbox-gl-js/): Mapbox GL JS library for interactive map rendering.

## 🛠️ Tools & Utilities
Specialized tools for scheduling, vector tiles, and geographic lookup.

- [carbon-aware-scheduler](./carbon-aware-scheduler/): Scheduler for carbon-aware task execution.
- [tippecanoe](./tippecanoe/): Tool for building vector tiles from large collections of GeoJSON features.
- [zone-finder](./zone-finder/): Geographic zone identification tool.

## 📜 Pipelines & Scripts
Executable scripts for data processing and pipeline automation.

- [foss-pipeline.sh](./foss-pipeline.sh): FOSS pipeline for 3D geospatial maps (OpenDroneMap, Entwine, 3D Tiles).
- [solar-detection-pipeline.py](./solar-detection-pipeline.py): Python pipeline for automatic solar panel detection and irradiance modeling.
- [pvgis-mcp-1to1-fixed.zip](./pvgis-mcp-1to1-fixed.zip): Archived fixed build of the PVGIS MCP server.

## 📖 Documentation
- [co2signal-docs](./co2signal-docs/): API documentation for CO2Signal (carbon intensity data).
