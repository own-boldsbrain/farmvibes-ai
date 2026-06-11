import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { extractOperations, loadOpenApiSpec, operationKey } from "../src/openapi.js";

type Manifest = {
  operationCount?: number;
  operations?: Array<{ toolName: string; method: string; path: string; operationId?: string }>;
};

async function main() {
  const spec = await loadOpenApiSpec({ allowFetch: false });
  const officialOperations = extractOperations(spec);
  const manifestPath = resolve("manifest.operations.json");

  if (!existsSync(manifestPath)) {
    throw new Error("manifest.operations.json not found. Run pnpm generate first.");
  }

  const manifest = JSON.parse(readFileSync(manifestPath, "utf-8")) as Manifest;
  const generatedOperations = manifest.operations ?? [];

  const officialKeys = new Set(officialOperations.map(operationKey));
  const generatedKeys = new Set(generatedOperations.map(operationKey));
  const officialToolNames = new Set(officialOperations.map((op) => op.toolName));
  const generatedToolNames = new Set(generatedOperations.map((op) => op.toolName));

  const missingEndpoints = [...officialKeys].filter((key) => !generatedKeys.has(key));
  const extraEndpoints = [...generatedKeys].filter((key) => !officialKeys.has(key));
  const missingTools = [...officialToolNames].filter((key) => !generatedToolNames.has(key));
  const extraTools = [...generatedToolNames].filter((key) => !officialToolNames.has(key));
  const duplicateToolNames = generatedOperations
    .map((op) => op.toolName)
    .filter((name, index, arr) => arr.indexOf(name) !== index);

  const audit = {
    auditedAt: new Date().toISOString(),
    apiTitle: spec.info?.title ?? "PVGIS Web API",
    apiVersion: spec.info?.version ?? "unknown",
    officialOperationCount: officialOperations.length,
    generatedOperationCount: generatedOperations.length,
    missingEndpoints,
    extraEndpoints,
    missingTools,
    extraTools,
    duplicateToolNames: [...new Set(duplicateToolNames)],
    status: missingEndpoints.length === 0 && extraEndpoints.length === 0 && duplicateToolNames.length === 0 ? "PASS" : "FAIL",
  };

  writeFileSync("AUDIT.json", JSON.stringify(audit, null, 2), "utf-8");
  writeFileSync("AUDIT.md", [
    "# PVGIS MCP 1:1 Audit",
    "",
    `- Status: **${audit.status}**`,
    `- API: ${audit.apiTitle}`,
    `- Version: ${audit.apiVersion}`,
    `- Official operations: ${audit.officialOperationCount}`,
    `- Generated tools: ${audit.generatedOperationCount}`,
    `- Missing endpoints: ${audit.missingEndpoints.length}`,
    `- Extra endpoints: ${audit.extraEndpoints.length}`,
    `- Duplicate tool names: ${audit.duplicateToolNames.length}`,
    "",
    "## Missing endpoints",
    "",
    audit.missingEndpoints.length ? audit.missingEndpoints.map((x) => `- ${x}`).join("\n") : "None.",
    "",
    "## Extra endpoints",
    "",
    audit.extraEndpoints.length ? audit.extraEndpoints.map((x) => `- ${x}`).join("\n") : "None.",
    "",
  ].join("\n"), "utf-8");

  console.log(JSON.stringify(audit, null, 2));

  if (audit.status !== "PASS") process.exit(1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
