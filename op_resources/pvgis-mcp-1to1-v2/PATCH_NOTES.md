# Patch notes 0.2.0

- Added PVGIS v6 OpenAPI as default: `openapi/pvgis-v6-openapi.json`.
- Kept PVGIS 5.3 fallback OpenAPI: `openapi/pvgis-v5_3-fallback.openapi.json`.
- Regenerated operations with both v6 and v5.3 tools.
- Added source routing per operation: `sourceVersion: "v6" | "v5_3"`.
- Default v6 base URL: `https://photovoltaic-geographic-information-system.ec.europa.eu/api/v6`.
- Fallback v5.3 base URL: `https://re.jrc.ec.europa.eu/api/v5_3`.
- Added basic multipart form support for v6 POST endpoints that accept horizon profile uploads.
- Total tools: 33 (26 v6 + 7 v5.3 fallback).
