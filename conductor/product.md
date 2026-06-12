# Product Guide: FarmVibes.AI

## Initial Concept
FarmVibes.AI is a geospatial ML platform designed to develop rich insights for agriculture and sustainability by fusing multi-modal datasets (e.g., satellite imagery, drone imagery, weather data).

## Target Audience
- Data Scientists and ML Engineers working in agriculture technology.
- Sustainability researchers and analysts evaluating environmental impacts.
- Software Developers building applications for farmers and agricultural consultants.

## Core Value Proposition
- **Multi-Modal Data Fusion:** Combine RGB, SAR, multispectral, and weather data into robust models.
- **Interactive GeoAI:** WebGL/WebGPU-powered zero-shot interactive segmentation using GeoAI.js and OpenGeoAI for real-time mask generation.
- **Workflow Automation:** Use Directed Acyclic Graphs (DAGs) to easily pre-process data and orchestrate workflows.
- **Ready-To-Use Workflows:** Access pre-built pipelines for tasks like carbon footprint estimation, crop segmentation, and growth rate analysis.
- **Scalability:** Leverage Kubernetes and Docker to run workflows efficiently locally or in the cloud.

## Key Features
- **Extensible Operator Library:** Pluggable units of computation (`ops/`) that perform distinct data processing tasks (e.g., clipping rasters, computing indices).
- **Interactive Notebooks:** Pre-configured Jupyter notebooks for training models and exploring the API without deep infrastructure knowledge.
- **Local Compute Engine:** FarmVibes.AI provides a CLI and a managed local cluster (via k3d) that simplifies testing and execution of complex workflows.