import { existsSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { DEFAULT_PVGIS_V5_OPENAPI_PATH, DEFAULT_PVGIS_V6_OPENAPI_PATH, extractOperations, readOpenApiSpec } from "../src/openapi.js";
import { operations } from "../src/operations.generated.js";

function main(): void {
  const generatedTools: Set<string> = new Set(operations.map((operation) => operation.toolName));
  const sources = [
    { version: "v6" as const, path: resolve(DEFAULT_PVGIS_V6_OPENAPI_PATH), prefix: "pvgis_v6" },
    { version: "v5_3" as const, path: resolve(DEFAULT_PVGIS_V5_OPENAPI_PATH), prefix: "pvgis_v5_3" },
  ];
  const audit = { status: "PASS", generatedToolCount: generatedTools.size, sources: [] as unknown[] };

  for (const source of sources) {
    const entry = { ...source, openApiExists: existsSync(source.path), openApiOperationCount: 0, missingGeneratedTools: [] as string[] };
    if (entry.openApiExists) {
      const spec = readOpenApiSpec(source.path);
      const openApiOperations = extractOperations(spec, source.prefix, source.version);
      entry.openApiOperationCount = openApiOperations.length;
      entry.missingGeneratedTools = openApiOperations.map((operation) => operation.toolName).filter((toolName) => !generatedTools.has(toolName));
      if (entry.missingGeneratedTools.length > 0) audit.status = "FAIL";
    } else {
      audit.status = "FAIL";
    }
    audit.sources.push(entry);
  }

  const outputPath = resolve("audit.pvgis-mcp.json");
  writeFileSync(outputPath, `${JSON.stringify(audit, null, 2)}\n`, "utf-8");
  console.log(JSON.stringify(audit, null, 2));
  if (audit.status !== "PASS") process.exit(1);
}

try { main(); } catch (error) { console.error(error); process.exit(1); }
