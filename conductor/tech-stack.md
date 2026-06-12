# Tech Stack: FarmVibes.AI

## Languages
- **Python:** Primary language for operators, workflows, and machine learning models.

## Frameworks & Libraries
- **PyTorch / Pandas:** Core libraries for data manipulation, geospatial analysis, and deep learning.
- **Sphinx:** Used for generating technical documentation.
- **TypeSpec:** Used for defining APIs and shared data models.

## GeoAI & Edge ML
- **OpenGeoAI:** Backend Python library providing foundation models (e.g., SAM) for geospatial analysis.
- **GeoAI.js & Transformers.js:** Frontend WebGL/WebGPU inferencing and map interaction.

## Infrastructure & Compute
- **Docker:** Containerization of all core components (server, agent, operators).
- **Kubernetes (k3d):** Orchestration of the local compute engine to execute geospatial DAG workflows.

## Tooling
- **Jupyter Notebooks:** Interactive environments for data scientists to prototype and use the FarmVibes.AI client.
- **Makefile:** Primary task runner for building images, starting/stopping the cluster, and generating specs.
- **Testing & Linting:** `pytest` for unit/integration testing, `ruff` for linting, and `pyright` for static type checking.