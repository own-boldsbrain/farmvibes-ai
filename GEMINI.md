# FarmVibes.AI Project

FarmVibes.AI is a geospatial platform for agriculture and sustainability, enabling the creation of rich insights by fusing multiple geospatial and spatiotemporal datasets (satellite imagery, drone imagery, weather data, etc.).

## Project Overview

- **Core Technologies:** Python, Docker, Kubernetes (k3d for local cluster), REST API, Jupyter Notebooks.
- **Architecture:** 
  - **Operators (ops/):** Discrete units of computation that process data.
  - **Workflows (workflows/):** Directed Acyclic Graphs (DAGs) of operators.
  - **Compute Engine:** A local cluster (managed via Docker/Kubernetes) that executes workflows.
  - **Client (src/vibe_notebook):** A Python client used to interact with the cluster and run workflows.
- **Key Components:**
  - `vibe-core`: Core platform logic and models.
  - `vibe-agent`: Orchestrates execution.
  - `vibe-server`: REST API for the cluster.
  - `vibe-lib`: Shared geospatial utilities.

## Directory Structure

- `ops/`: Implementation of individual operators (Python script + YAML definition).
- `workflows/`: YAML definitions of workflows.
- `src/`: Python source code for platform components and libraries.
- `notebooks/`: Example Jupyter notebooks for various agriculture and sustainability tasks.
- `resources/docker/`: Dockerfiles for cluster components.
- `op_resources/`: Models and data used by operators.

## Building and Running

### Local Cluster Management
The local cluster is managed via a Makefile and the `farmvibes-ai` CLI.

- **Setup local cluster:** `make local` (Requires Docker and k3d)
- **Start/Stop cluster:** `farmvibes-ai local start` / `farmvibes-ai local stop`
- **Revert to official images:** `make revert`
- **Clean cluster resources:** `make clean`

### Running Workflows
Workflows are typically executed via the Python client in a Jupyter notebook.
```python
from vibe_notebook.client import get_default_vibe_client
client = get_default_vibe_client()
run = client.run("workflow_name", "input_data")
```

## Testing

Tests are located in `src/tests` and can be run using `pytest`.

- **Run all tests:** `pytest` (Note: some tests might require a running cluster).
- **Python Path:** `src` directory is added to `PYTHONPATH` via `pytest.ini`.

## Development Conventions

- **Linting & Formatting:** The project uses `ruff` (configured in `.ruff.toml`).
- **Type Checking:** `pyright` is used for static type analysis (`pyrightconfig.json`).
- **API & Data Models:** `TypeSpec` is the standard for defining APIs and shared data models. Definitions are located in the `typespec/` directory. Use `make typespec-compile` to generate OpenAPI specs.
- **Configuration:** 
  - Operators: Defined by `name.py` and `name.yaml` in `ops/`.
  - Workflows: Defined by `name.yaml` in `workflows/`.
- **Geospatial Standards:** Heavy use of `shapely`, `geopandas`, `rasterio`, and `pystac` (STAC items).

## Design Standards (YSH: The Precision Architect & The Void)

All interfaces and visualizations must adhere to the official YSH color specification:

- **Zero-Line Integrity:** Contrast is created by tonal stacking (adjacent plans) instead of borders or shadows.
- **Tonal Scale (Zinc):** Uses Zinc 50 (#F9F9FB) through Zinc 950 (#09090B).
- **Kinetic Gradient:** Used for primary triggers and high-energy states.
  - `linear-gradient(90deg, #FFCE00 0%, #FF6600 50%, #FF0066 100%)`
- **Themes:**
  - **The Precision Architect (Light):** Focus on clarity and daylight surfaces.
  - **The Void (Dark):** High-performance terminal aesthetics using deep planes.
- **Hardware Indicators:**
  - Active/Network: #25D366 (WhatsApp Green)
  - Alert/Error: #EF4444 (Red 500)
  - Cache/Fallback: #3B82F6 (Blue 500)
