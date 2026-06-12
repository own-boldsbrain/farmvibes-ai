# PVGIS MCP 1:1

MCP server for PVGIS with **PVGIS v6 as the default source** and **PVGIS 5.3 as fallback/legacy tools**.

## Sources

- Default OpenAPI: `openapi/pvgis-v6-openapi.json`
- Fallback OpenAPI: `openapi/pvgis-v5_3-fallback.openapi.json`

## Tool counts

- PVGIS v6 tools: 26
- PVGIS 5.3 fallback tools: 7
- Total tools: 33

## Runtime base URLs

```txt
PVGIS_V6_BASE_URL=https://photovoltaic-geographic-information-system.ec.europa.eu/api/v6
PVGIS_V5_BASE_URL=https://re.jrc.ec.europa.eu/api/v5_3
```

## Commands

```bash
npm install --ignore-scripts
npm run build
npm start
```

The built MCP server entrypoint is:

```txt
dist/src/server.js
```

## MCP config

```json
{
  "mcpServers": {
    "pvgis-1to1": {
      "command": "node",
      "args": ["C:/Users/fjuni/Projects/01-Upstream/04-YSH-Energy/farmvibes-ai/op_resources/pvgis-mcp-1to1/dist/src/server.js"]
    }
  }
}
```
