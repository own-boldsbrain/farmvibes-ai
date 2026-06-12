import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

export const DEFAULT_PVGIS_V6_OPENAPI_PATH = "openapi/pvgis-v6-openapi.json";
export const DEFAULT_PVGIS_V5_OPENAPI_PATH = "openapi/pvgis-v5_3-fallback.openapi.json";
export const DEFAULT_PVGIS_OPENAPI_PATH = DEFAULT_PVGIS_V6_OPENAPI_PATH;

export type OpenApiParameter = {
  name: string;
  in?: string;
  required?: boolean;
  description?: string;
  schema?: Record<string, unknown>;
};

export type OpenApiOperation = {
  operationId?: string;
  summary?: string;
  description?: string;
  tags?: string[];
  parameters?: OpenApiParameter[];
  requestBody?: unknown;
};

export type OpenApiPathItem = {
  parameters?: OpenApiParameter[];
  [method: string]: unknown;
};

export type OpenApiSpec = {
  openapi?: string;
  info?: { title?: string; version?: string };
  servers?: Array<{ url?: string; description?: string }>;
  paths?: Record<string, OpenApiPathItem>;
  components?: Record<string, unknown>;
};

export type RuntimeOperation = {
  toolName: string;
  method: string;
  path: string;
  operationId: string;
  summary: string;
  description: string;
  tags: string[];
  sourceVersion: "v6" | "v5_3";
  parameters: OpenApiParameter[];
  requestBody?: unknown;
};

const HTTP_METHODS = new Set(["get", "post", "put", "patch", "delete", "head", "options", "trace"]);

export function defaultOpenApiPath(version = process.env.PVGIS_OPENAPI_VERSION ?? "v6"): string {
  const explicit = process.env.PVGIS_OPENAPI_PATH;
  if (explicit) return resolve(explicit);
  return resolve(version === "v5_3" ? DEFAULT_PVGIS_V5_OPENAPI_PATH : DEFAULT_PVGIS_V6_OPENAPI_PATH);
}

export function readOpenApiSpec(filePath = defaultOpenApiPath()): OpenApiSpec {
  if (!existsSync(filePath)) throw new Error(`OpenAPI file not found: ${filePath}`);
  return JSON.parse(readFileSync(filePath, "utf-8")) as OpenApiSpec;
}

export function writeJsonFile(filePath: string, payload: unknown): void {
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, `${JSON.stringify(payload, null, 2)}\n`, "utf-8");
}

function sanitizeToolName(value: string): string {
  return value.replace(/[^a-zA-Z0-9]+/g, "_").replace(/^_+|_+$/g, "").toLowerCase() || "pvgis_operation";
}

export function toolNameFor(operation: OpenApiOperation, method: string, path: string, prefix = "pvgis_v6"): string {
  const seed = operation.operationId || `${method}_${path}`;
  return `${prefix}_${sanitizeToolName(seed)}`;
}

export function extractOperations(spec: OpenApiSpec, prefix = "pvgis_v6", sourceVersion: "v6" | "v5_3" = "v6"): RuntimeOperation[] {
  const operations: RuntimeOperation[] = [];
  const usedNames = new Map<string, number>();

  for (const [path, pathItem] of Object.entries(spec.paths ?? {})) {
    if (!pathItem || typeof pathItem !== "object" || Array.isArray(pathItem)) continue;
    const pathLevelParameters = Array.isArray(pathItem.parameters) ? pathItem.parameters : [];

    for (const [method, rawOperation] of Object.entries(pathItem)) {
      const normalizedMethod = method.toLowerCase();
      if (!HTTP_METHODS.has(normalizedMethod)) continue;
      if (!rawOperation || typeof rawOperation !== "object" || Array.isArray(rawOperation)) continue;

      const operation = rawOperation as OpenApiOperation;
      const parameters = [...pathLevelParameters, ...(Array.isArray(operation.parameters) ? operation.parameters : [])];
      const baseToolName = toolNameFor(operation, normalizedMethod, path, prefix);
      const count = usedNames.get(baseToolName) ?? 0;
      usedNames.set(baseToolName, count + 1);
      const toolName = count === 0 ? baseToolName : `${baseToolName}_${count + 1}`;

      operations.push({
        toolName,
        method: normalizedMethod.toUpperCase(),
        path,
        operationId: operation.operationId ?? "",
        summary: operation.summary ?? "",
        description: operation.description ?? "",
        tags: operation.tags ?? [],
        sourceVersion,
        parameters,
        requestBody: operation.requestBody,
      });
    }
  }
  return operations;
}

export async function fetchOpenApiSpec(openApiUrl = process.env.PVGIS_OPENAPI_URL): Promise<OpenApiSpec> {
  if (!openApiUrl) throw new Error("PVGIS_OPENAPI_URL is required to fetch an OpenAPI file.");
  const response = await fetch(openApiUrl, { headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error(`Failed to fetch OpenAPI ${response.status} ${response.statusText}`);
  return (await response.json()) as OpenApiSpec;
}
