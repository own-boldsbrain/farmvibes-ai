# PVGIS MCP 1:1 — fixed build

Build-safe MCP server for PVGIS tools.

## Fixes applied

- Replaced old MCP imports with `@modelcontextprotocol/sdk` imports.
- Added `@types/node` and `types: ["node"]` in `tsconfig.json`.
- Fixed OpenAPI parser so path-level `parameters` are not treated as HTTP operations.
- Removed `.npmrc` settings that produce npm warnings such as `recursive-install` and `node-linker`.
- Added explicit handler input typing to satisfy `strict: true`.

## Commands

```powershell
npm install --ignore-scripts
npm run build
npm run dev
```

## MCP config

```json
{
  "mcpServers": {
    "pvgis-1to1": {
      "command": "node",
      "args": [
        "C:/Users/fjuni/Projects/01-Upstream/04-YSH-Energy/farmvibes-ai/op_resources/pvgis-mcp-1to1/dist/src/server.js"
      ]
    }
  }
}
```

## Runtime base URL

Default:

```txt
https://re.jrc.ec.europa.eu/api/v5_3
```

Override:

```powershell
$env:PVGIS_BASE_URL="https://re.jrc.ec.europa.eu/api/v5_3"
```

## Included tools

- `pvgis_v5_3_pvcalc_get`
- `pvgis_v5_3_seriescalc_get`
- `pvgis_v5_3_tmy_get`
- `pvgis_v5_3_mrcalc_get`
- `pvgis_v5_3_drcalc_get`
- `pvgis_v5_3_shscalc_get`
- `pvgis_v5_3_printhorizon_get`
