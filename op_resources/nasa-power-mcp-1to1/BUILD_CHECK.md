# Build check

Patch target: `nasa-power-mcp-1to1@0.1.1`

Validated in sandbox with Node.js `v22.16.0` and npm `10.9.2`:

```bash
npm install --ignore-scripts
npm run build
```

Result:

```txt
> nasa-power-mcp-1to1@0.1.1 build
> tsc -p tsconfig.json
```

Exit status: `0`.

Notes:

- The package was patched from `@modelcontextprotocol/server` to the stable v1 SDK package `@modelcontextprotocol/sdk`.
- The dynamic OpenAPI operation registry is now cast to a runtime operation shape to avoid over-narrowing from `as const`.
- `operation.path` is explicitly widened to `string` before path-param replacement.
- MCP input schema generation now emits the v1-compatible Zod raw shape.
