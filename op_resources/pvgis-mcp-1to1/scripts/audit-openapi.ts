import { existsSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { defaultOpenApiPath, extractOperations, readOpenApiSpec } from "../src/openapi.js";
import { operations } from "../src/operations.generated.js";

function main(): void {
  const generatedTools: Set<string> = new Set(operations.map((operation) => operation.toolName));
  const openApiPath = defaultOpenApiPath();
  const audit = {
    status: "PASS",
    generatedToolCount: generatedTools.size,
    openApiPath,
    openApiExists: existsSync(openApiPath),
    openApiOperationCount: null as number | null,
    missingGeneratedTools: [] as string[],
  };

  if (audit.openApiExists) {
    const spec = readOpenApiSpec(openApiPath);
    const openApiOperations = extractOperations(spec);
    audit.openApiOperationCount = openApiOperations.length;
    audit.missingGeneratedTools = openApiOperations
      .map((operation) => operation.toolName)
      .filter((toolName) => !generatedTools.has(toolName));

    if (audit.missingGeneratedTools.length > 0) {
      audit.status = "FAIL";
    }
  }

  const outputPath = resolve("audit.pvgis-mcp.json");
  writeFileSync(outputPath, `${JSON.stringify(audit, null, 2)}\n`, "utf-8");
  console.log(JSON.stringify(audit, null, 2));

  if (audit.status !== "PASS") process.exit(1);
}

try {
  main();
} catch (error) {
  console.error(error);
  process.exit(1);
}
