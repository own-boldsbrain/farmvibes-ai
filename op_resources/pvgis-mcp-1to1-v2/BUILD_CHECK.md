# Build check

Validated in sandbox:

```bash
npm install --ignore-scripts
npm run build
npm run audit
npm start
```

Results:

- `npm run build`: PASS
- `npm run audit`: PASS
- `npm start`: launches MCP stdio server; timeout used for smoke test.
- Generated tools: 33 total = 26 PVGIS v6 + 7 PVGIS 5.3 fallback.
- Entrypoint: `dist/src/server.js`
