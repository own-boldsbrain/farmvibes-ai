import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { operations } from "./operations.generated.js";

const DEFAULT_PVGIS_BASE_URL = "https://re.jrc.ec.europa.eu/api/v5_3";
const PVGIS_BASE_URL = process.env.PVGIS_BASE_URL ?? DEFAULT_PVGIS_BASE_URL;
const REQUEST_TIMEOUT_MS = Number(process.env.PVGIS_TIMEOUT_MS ?? "120000");
const DEFAULT_USER_AGENT = "pvgis-mcp-1to1/0.1.1";

type JsonSchemaLite = {
  type?: string;
  enum?: readonly unknown[];
  default?: unknown;
  minimum?: number;
  maximum?: number;
  minLength?: number;
  maxLength?: number;
  minItems?: number;
  maxItems?: number;
  items?: JsonSchemaLite;
};

type ParamMeta = {
  name: string;
  in: "query" | "path" | "header" | "cookie";
  required: boolean;
  description?: string;
  schema?: JsonSchemaLite;
};

type RuntimePvgisOperation = {
  toolName: string;
  method: string;
  path: string;
  operationId: string;
  summary?: string;
  description?: string;
  tags?: readonly string[];
  parameters: readonly ParamMeta[];
};

const runtimeOperations = operations as readonly RuntimePvgisOperation[];

function withDescription<T extends z.ZodTypeAny>(schema: T, description?: string): T {
  return description ? (schema.describe(description) as T) : schema;
}

function zodFromSchema(schema: JsonSchemaLite = {}, description?: string): z.ZodTypeAny {
  let zod: z.ZodTypeAny;

  if (schema.enum && schema.enum.length > 0) {
    const values = schema.enum.map(String);
    zod = values.length === 1 ? z.literal(values[0]) : z.enum(values as [string, ...string[]]);
  } else {
    switch (schema.type) {
      case "integer":
        zod = z.number().int();
        break;
      case "number":
        zod = z.number();
        break;
      case "boolean":
        zod = z.boolean();
        break;
      case "array":
        zod = z.array(zodFromSchema(schema.items ?? {}));
        break;
      case "object":
        zod = z.record(z.string(), z.unknown());
        break;
      case "string":
      default:
        zod = z.string();
        break;
    }
  }

  if (schema.type === "number" || schema.type === "integer") {
    if (typeof schema.minimum === "number") zod = (zod as z.ZodNumber).min(schema.minimum);
    if (typeof schema.maximum === "number") zod = (zod as z.ZodNumber).max(schema.maximum);
  }

  if (schema.type === "string") {
    if (typeof schema.minLength === "number") zod = (zod as z.ZodString).min(schema.minLength);
    if (typeof schema.maxLength === "number") zod = (zod as z.ZodString).max(schema.maxLength);
  }

  if (schema.type === "array") {
    if (typeof schema.minItems === "number") zod = (zod as z.ZodArray<any>).min(schema.minItems);
    if (typeof schema.maxItems === "number") zod = (zod as z.ZodArray<any>).max(schema.maxItems);
  }

  zod = withDescription(zod, description);

  if (schema.default !== undefined) {
    zod = zod.default(schema.default as never);
  }

  return zod;
}

function inputSchemaFor(operation: RuntimePvgisOperation): Record<string, z.ZodTypeAny> {
  const shape: Record<string, z.ZodTypeAny> = {};

  for (const param of operation.parameters) {
    let paramSchema = zodFromSchema(param.schema, param.description);
    if (!param.required && param.schema?.default === undefined) {
      paramSchema = paramSchema.optional();
    }
    shape[param.name] = paramSchema;
  }

  return shape;
}

function encodeQueryValue(value: unknown): string {
  if (Array.isArray(value)) return value.join(",");
  if (typeof value === "boolean") return value ? "1" : "0";
  if (typeof value === "object" && value !== null) return JSON.stringify(value);
  return String(value);
}

function buildUrl(operation: RuntimePvgisOperation, input: Record<string, unknown>): URL {
  let path: string = operation.path;

  for (const param of operation.parameters) {
    if (param.in !== "path") continue;
    const value = input[param.name];
    if (value === undefined || value === null || value === "") {
      throw new Error(`Missing required path parameter: ${param.name}`);
    }
    path = path.replace(`{${param.name}}`, encodeURIComponent(String(value)));
  }

  const url = new URL(path, PVGIS_BASE_URL.endsWith("/") ? PVGIS_BASE_URL : `${PVGIS_BASE_URL}/`);

  for (const param of operation.parameters) {
    if (param.in !== "query") continue;
    const value = input[param.name];
    if (value === undefined || value === null || value === "") continue;
    url.searchParams.set(param.name, encodeQueryValue(value));
  }

  return url;
}

async function executePvgisOperation(operation: RuntimePvgisOperation, input: Record<string, unknown>) {
  const url = buildUrl(operation, input);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method: operation.method,
      signal: controller.signal,
      headers: {
        "User-Agent": DEFAULT_USER_AGENT,
        "Accept": "application/json,text/csv,text/plain,text/html,application/octet-stream,*/*",
      },
    });

    const contentType = response.headers.get("content-type") ?? "";

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`PVGIS ${response.status} ${response.statusText}: ${errorBody}`);
    }

    if (contentType.includes("application/json")) {
      const json = await response.json();
      return {
        content: [{ type: "text" as const, text: JSON.stringify(json, null, 2) }],
      };
    }

    if (contentType.includes("application/octet-stream") || contentType.includes("application/zip")) {
      const arrayBuffer = await response.arrayBuffer();
      const data = Buffer.from(arrayBuffer).toString("base64");
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify({ mimeType: contentType.split(";")[0], base64: data }, null, 2),
          },
        ],
      };
    }

    const text = await response.text();
    return { content: [{ type: "text" as const, text }] };
  } finally {
    clearTimeout(timeout);
  }
}

const server = new McpServer({
  name: "pvgis-mcp-1to1",
  version: "0.1.1",
});

for (const operation of runtimeOperations) {
  const description = [
    operation.summary,
    operation.description,
    `HTTP: ${operation.method} ${operation.path}`,
    `Base URL: ${PVGIS_BASE_URL}`,
  ]
    .filter(Boolean)
    .join("\n\n");

  server.registerTool(
    operation.toolName,
    {
      title: operation.summary ?? operation.toolName,
      description,
      inputSchema: inputSchemaFor(operation),
    },
    async (input: Record<string, unknown>) => executePvgisOperation(operation, input),
  );
}

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
