import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

export type JsonSchemaLite = {
  $ref?: string;
  type?: string;
  title?: string;
  description?: string;
  enum?: unknown[];
  default?: unknown;
  minimum?: number;
  maximum?: number;
  exclusiveMinimum?: number | boolean;
  exclusiveMaximum?: number | boolean;
  minLength?: number;
  maxLength?: number;
  minItems?: number;
  maxItems?: number;
  items?: JsonSchemaLite;
  properties?: Record<string, JsonSchemaLite>;
  required?: string[];
  additionalProperties?: boolean | JsonSchemaLite;
  anyOf?: JsonSchemaLite[];
  oneOf?: JsonSchemaLite[];
  allOf?: JsonSchemaLite[];
  nullable?: boolean;
  format?: string;
};

export type OpenApiParameter = {
  name: string;
  in: "query" | "path" | "header" | "cookie";
  required?: boolean;
  description?: string;
  schema?: JsonSchemaLite;
};

export type OpenApiOperation = {
  tags?: string[];
  summary?: string;
  description?: string;
  operationId?: string;
  parameters?: OpenApiParameter[];
  requestBody?: unknown;
};

export type OpenApiSpec = {
  openapi?: string;
  info?: {
    title?: string;
    version?: string;
    description?: string;
  };
  servers?: Array<{ url: string; description?: string }>;
  paths: Record<string, Record<string, OpenApiOperation> & { parameters?: OpenApiParameter[] }>;
  components?: Record<string, unknown>;
};

export type PvgisOperation = {
  toolName: string;
  apiTitle: string;
  apiVersion: string;
  method: string;
  path: string;
  operationId: string;
  summary: string;
  description: string;
  tags: string[];
  parameters: OpenApiParameter[];
  requestBody?: unknown;
};

const HTTP_METHODS = new Set(["get", "post", "put", "patch", "delete", "head", "options"]);

export const DEFAULT_PVGIS_BASE_URL =
  "https://photovoltaic-geographic-information-system.ec.europa.eu/api/v6";

export const DEFAULT_PVGIS_OPENAPI_URL = `${DEFAULT_PVGIS_BASE_URL}/openapi.json`;

export function getProjectRoot(): string {
  return resolve(process.cwd());
}

export function getOpenApiSnapshotPath(): string {
  return resolve(process.env.PVGIS_OPENAPI_PATH ?? "openapi/pvgis-v6-openapi.json");
}

export function sanitizeToolName(value: string): string {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .replace(/[^a-zA-Z0-9_]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "")
    .toLowerCase();
}

export function toolNameFor(operation: OpenApiOperation, method: string, path: string): string {
  const raw = operation.operationId || `${method}_${path}`;
  const sanitized = sanitizeToolName(raw.replace(/^pvgis[_-]?/i, ""));
  return sanitized.startsWith("pvgis_") ? sanitized : `pvgis_${sanitized}`;
}

export function extractOperations(spec: OpenApiSpec): PvgisOperation[] {
  const operations: PvgisOperation[] = [];
  const seenToolNames = new Map<string, number>();

  for (const [path, pathItem] of Object.entries(spec.paths ?? {})) {
    const commonParameters = Array.isArray(pathItem.parameters) ? pathItem.parameters : [];

    for (const [methodRaw, operation] of Object.entries(pathItem)) {
      const method = methodRaw.toLowerCase();
      if (!HTTP_METHODS.has(method)) continue;

      const parameters = [
        ...commonParameters,
        ...(Array.isArray(operation.parameters) ? operation.parameters : []),
      ];

      let toolName = toolNameFor(operation, method, path);
      const previousCount = seenToolNames.get(toolName) ?? 0;
      seenToolNames.set(toolName, previousCount + 1);
      if (previousCount > 0) toolName = `${toolName}_${previousCount + 1}`;

      operations.push({
        toolName,
        apiTitle: spec.info?.title ?? "PVGIS Web API",
        apiVersion: spec.info?.version ?? "unknown",
        method: method.toUpperCase(),
        path,
        operationId: operation.operationId ?? "",
        summary: operation.summary ?? "",
        description: operation.description ?? "",
        tags: operation.tags ?? [],
        parameters,
        requestBody: operation.requestBody,
      });
    }
  }

  return operations.sort((a, b) => a.toolName.localeCompare(b.toolName));
}

export async function fetchOpenApiSpec(openApiUrl = process.env.PVGIS_OPENAPI_URL ?? DEFAULT_PVGIS_OPENAPI_URL): Promise<OpenApiSpec> {
  const response = await fetch(openApiUrl, {
    headers: {
      accept: "application/json",
      "user-agent": "pvgis-mcp-1to1/0.1.0",
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`PVGIS OpenAPI fetch failed: ${response.status} ${response.statusText}: ${text}`);
  }

  return (await response.json()) as OpenApiSpec;
}

export async function loadOpenApiSpec(options: { allowFetch?: boolean } = {}): Promise<OpenApiSpec> {
  const snapshotPath = getOpenApiSnapshotPath();
  if (existsSync(snapshotPath)) {
    return JSON.parse(readFileSync(snapshotPath, "utf-8")) as OpenApiSpec;
  }

  if (options.allowFetch === false) {
    throw new Error(`OpenAPI snapshot not found at ${snapshotPath}. Run pnpm fetch:openapi first.`);
  }

  const spec = await fetchOpenApiSpec();
  mkdirSync(dirname(snapshotPath), { recursive: true });
  writeFileSync(snapshotPath, JSON.stringify(spec, null, 2), "utf-8");
  return spec;
}

export function operationKey(operation: Pick<PvgisOperation, "method" | "path">): string {
  return `${operation.method.toUpperCase()} ${operation.path}`;
}
