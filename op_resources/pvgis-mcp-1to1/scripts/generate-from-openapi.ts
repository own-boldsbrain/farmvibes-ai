import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { extractOperations, loadOpenApiSpec } from "../src/openapi.js";

function tsLiteral(value: unknown): string {
  return JSON.stringify(value, null, 2);
}

async function main() {
  const spec = await loadOpenApiSpec({ allowFetch: false });
  const operations = extractOperations(spec);

  const generatedPath = resolve("src/operations.generated.ts");
  const manifestPath = resolve("manifest.operations.json");

  mkdirSync(dirname(generatedPath), { recursive: true });

  writeFileSync(
    generatedPath,
    `/* Auto-generated from PVGIS v6 OpenAPI. Do not edit by hand. */\nexport const operations = ${tsLiteral(operations)} as const;\n\nexport type PvgisGeneratedOperation = (typeof operations)[number];\n`,
    "utf-8"
  );

  writeFileSync(
    manifestPath,
    JSON.stringify({
      generatedAt: new Date().toISOString(),
      apiTitle: spec.info?.title ?? "PVGIS Web API",
      apiVersion: spec.info?.version ?? "unknown",
      openapi: spec.openapi ?? null,
      operationCount: operations.length,
      operations,
    }, null, 2),
    "utf-8"
  );

  console.log(JSON.stringify({
    status: "ok",
    operationCount: operations.length,
    generatedPath,
    manifestPath,
  }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
