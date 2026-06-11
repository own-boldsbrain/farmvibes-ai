import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { DEFAULT_PVGIS_OPENAPI_URL, fetchOpenApiSpec, getOpenApiSnapshotPath } from "../src/openapi.js";

async function main() {
  const openApiUrl = process.env.PVGIS_OPENAPI_URL ?? DEFAULT_PVGIS_OPENAPI_URL;
  const outputPath = getOpenApiSnapshotPath();
  const spec = await fetchOpenApiSpec(openApiUrl);

  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, JSON.stringify(spec, null, 2), "utf-8");

  console.log(JSON.stringify({
    status: "ok",
    openApiUrl,
    outputPath,
    title: spec.info?.title ?? null,
    version: spec.info?.version ?? null,
    paths: Object.keys(spec.paths ?? {}).length,
  }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
