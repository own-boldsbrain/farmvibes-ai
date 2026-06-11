# Source Audit

## Uploaded package

Input file inspected:

```txt
/mnt/data/pvgis-main.zip
```

Findings:

- The archive contains the PVGIS Python/core project, CLI documentation and web API documentation.
- No checked-in `openapi.json` or Swagger snapshot was found inside the archive.
- The local documentation points to the production PVGIS v6 OpenAPI endpoint:

```txt
https://photovoltaic-geographic-information-system.ec.europa.eu/api/v6/openapi.json
```

Relevant local files observed:

```txt
docs/web_api/resources.md
docs/web_api/examples.md
.gitlab/issue_templates/Web_API.md
README.md
```

## Execution constraint

The artifact-generation sandbox could inspect local files but could not resolve external DNS for the PVGIS host. Therefore the live OpenAPI snapshot is intentionally not embedded. Run `pnpm prepare:all` locally to fetch and audit the authoritative spec.
