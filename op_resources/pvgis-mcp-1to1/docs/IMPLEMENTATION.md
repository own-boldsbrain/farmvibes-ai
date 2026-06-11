# Implementation Notes

## Input schema generation

Each OpenAPI parameter is converted into a Zod field:

```txt
OpenAPI string  -> z.string()
OpenAPI number  -> z.number()
OpenAPI integer -> z.number().int()
OpenAPI boolean -> z.boolean()
OpenAPI array   -> z.array(...)
OpenAPI enum    -> z.enum(...)
```

Optional OpenAPI parameters become optional Zod fields unless a default is present.

## Request execution

The MCP tool handler:

1. Builds the URL from the operation path.
2. Substitutes path parameters.
3. Adds query parameters.
4. Adds header parameters.
5. Sends JSON body if `requestBody` is defined and `body` is provided.
6. Returns JSON, text, CSV, HTML or image content depending on the response content type.

## Path joining

PVGIS OpenAPI paths may be either:

```txt
/performance/broadband
/api/v6/performance/broadband
```

The server handles both against `PVGIS_BASE_URL`.
