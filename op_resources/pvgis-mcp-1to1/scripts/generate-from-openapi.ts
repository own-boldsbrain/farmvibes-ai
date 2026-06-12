import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { extractOperations, readOpenApiSpec } from "../src/openapi.js";

function main(): void {
  const spec = readOpenApiSpec();
  const operations = extractOperations(spec);
  const outputPath = resolve("src/operations.generated.ts");
  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(
    outputPath,
    `export const operations = ${JSON.stringify(operations, null, 2)} as const;\n`,
    "utf-8",
  );
  console.log(`Generated ${operations.length} operations at ${outputPath}`);
}

try {
  main();
} catch (error) {
  console.error(error);
  process.exit(1);
}
