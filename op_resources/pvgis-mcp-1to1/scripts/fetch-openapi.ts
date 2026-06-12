import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fetchOpenApiSpec } from "../src/openapi.js";

async function main(): Promise<void> {
  const outputPath = resolve(process.env.PVGIS_OPENAPI_PATH ?? "openapi/pvgis-v6-openapi.json");
  const spec = await fetchOpenApiSpec();
  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, `${JSON.stringify(spec, null, 2)}\n`, "utf-8");
  console.log(`Wrote ${outputPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
