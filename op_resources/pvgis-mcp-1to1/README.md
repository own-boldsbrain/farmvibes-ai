# PVGIS MCP 1:1

MCP server generator for the PVGIS v6 Web API.

Design goal:

```txt
1 OpenAPI operation = 1 MCP tool
```

The package does **not** hard-code PVGIS endpoints. It loads the official OpenAPI spec from:

```txt
https://photovoltaic-geographic-information-system.ec.europa.eu/api/v6/openapi.json
```

Then it extracts all `paths.*.<method>` operations and registers them as MCP tools.

## Why this package is generator-first

The uploaded `pvgis-main.zip` contains the PVGIS Python/core project and documentation, but not a checked-in `openapi.json` snapshot. Its docs point to the live PVGIS v6 OpenAPI endpoint.

Because of that, the correct reproducible flow is:

```txt
fetch official OpenAPI -> snapshot -> generate manifest/tools -> audit -> run MCP
```

## Install

```bash
pnpm install
```

## Prepare all

```bash
pnpm prepare:all
```

This runs:

```bash
pnpm fetch:openapi
pnpm generate
pnpm audit
```

Outputs:

```txt
openapi/pvgis-v6-openapi.json
src/operations.generated.ts
manifest.operations.json
AUDIT.json
AUDIT.md
```

## Run MCP server

```bash
pnpm dev
```

The server can also fetch the OpenAPI on boot if `openapi/pvgis-v6-openapi.json` does not exist.

## MCP client config

```json
{
  "mcpServers": {
    "pvgis-1to1": {
      "command": "pnpm",
      "args": ["dev"],
      "cwd": "C:/Users/fjuni/Projects/pvgis-mcp-1to1"
    }
  }
}
```

## Environment variables

| Variable | Default | Purpose |
|---|---|---|
| `PVGIS_BASE_URL` | `https://photovoltaic-geographic-information-system.ec.europa.eu/api/v6` | PVGIS API base URL |
| `PVGIS_OPENAPI_URL` | `${PVGIS_BASE_URL}/openapi.json` | OpenAPI URL to fetch |
| `PVGIS_OPENAPI_PATH` | `openapi/pvgis-v6-openapi.json` | Local OpenAPI snapshot path |
| `PVGIS_TIMEOUT_MS` | `120000` | Request timeout |

## Tool naming

Tool names are derived from `operationId` when available. Fallback:

```txt
pvgis_<method>_<path>
```

Examples expected from current docs:

```txt
pvgis_performance_broadband
pvgis_power_broadband
pvgis_power_broadband_multiple_surfaces
pvgis_power_surface_position_optimisation
pvgis_solar_position_overview
```

The exact names depend on the live OpenAPI `operationId` values.

## Audit contract

The audit checks:

```txt
official path+method set == generated path+method set
no missing endpoints
no extra endpoints
no duplicate tool names
```

## Notes

- The sandbox used to create this package could not resolve external DNS, so the live OpenAPI snapshot was not embedded.
- Run `pnpm prepare:all` locally to fetch the authoritative current spec.
- This package targets PVGIS v6, not the legacy PVGIS 5 API.
