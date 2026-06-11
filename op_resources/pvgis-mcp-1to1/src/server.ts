import { McpServer } from "@modelcontextprotocol/server";
import { StdioServerTransport } from "@modelcontextprotocol/server/stdio";
import * as z from "zod/v4";
import {
  DEFAULT_PVGIS_BASE_URL,
  extractOperations,
  loadOpenApiSpec,
  type JsonSchemaLite,
  type OpenApiParameter,
  type OpenApiSpec,
  type PvgisOperation,
} from "./openapi.js";

const PVGIS_BASE_URL = process.env.PVGIS_BASE_URL ?? DEFAULT_PVGIS_BASE_URL;
const REQUEST_TIMEOUT_MS = Number(process.env.PVGIS_TIMEOUT_MS ?? "120000");
const DEFAULT_USER_AGENT = "pvgis-mcp-1to1/0.1.0";

function resolveRef(spec: OpenApiSpec, ref: string): JsonSchemaLite {
  if (!ref.startsWith("#/")) return {};
  const parts = ref.slice(2).split("/").map((part) => part.replace(/~1/g, "/").replace(/~0/g, "~"));
  let current: any = spec;
  for (const part of parts) current = current?.[part];
  return current ?? {};
}

function withDescription<T extends z.ZodTypeAny>(schema: T, description?: string): T {
  return description ? (schema.describe(description) as T) : schema;
}

function zodFromSchema(spec: OpenApiSpec, schema: JsonSchemaLite = {}, description?: string, depth = 0): z.ZodTypeAny {
  if (depth > 12) return z.unknown();
  if (schema.$ref) return zodFromSchema(spec, resolveRef(spec, schema.$ref), description, depth + 1);

  const unionSchemas = schema.anyOf ?? schema.oneOf;
  if (unionSchemas?.length) {
    const variants = unionSchemas.map((item) => zodFromSchema(spec, item, undefined, depth + 1));
    const nullable = unionSchemas.some((item) => item.type === "null");
    const nonNullVariants = variants.filter((_, index) => unionSchemas[index].type !== "null");
    let zod: z.ZodTypeAny;
    if (nonNullVariants.length === 0) {
      zod = z.null();
    } else if (nonNullVariants.length === 1) {
      zod = nonNullVariants[0];
    } else {
      zod = z.union(nonNullVariants as [z.ZodTypeAny, z.ZodTypeAny, ...z.ZodTypeAny[]]);
    }
    if (nullable && nonNullVariants.length > 0) zod = zod.nullable();
    if (schema.default !== undefined) zod = zod.default(schema.default as never);
    return withDescription(zod, description ?? schema.description);
  }

  if (schema.allOf?.length) {
    const merged = schema.allOf.reduce<JsonSchemaLite>((acc, item) => ({
      ...acc,
      ...item,
      properties: { ...(acc.properties ?? {}), ...(item.properties ?? {}) },
      required: [...(acc.required ?? []), ...(item.required ?? [])],
    }), {});
    return zodFromSchema(spec, merged, description, depth + 1);
  }

  let zod: z.ZodTypeAny;

  if (schema.enum && schema.enum.length > 0) {
    const values = schema.enum.filter((value) => value !== null).map(String);
    if (values.length === 0) {
      zod = z.null();
    } else {
      zod = values.length === 1 ? z.literal(values[0]) : z.enum(values as [string, ...string[]]);
      if (schema.enum.includes(null)) zod = zod.nullable();
    }
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
        zod = z.array(zodFromSchema(spec, schema.items ?? {}, undefined, depth + 1));
        break;
      case "object": {
        const properties = schema.properties ?? {};
        const required = new Set(schema.required ?? []);
        const shape: Record<string, z.ZodTypeAny> = {};
        for (const [key, value] of Object.entries(properties)) {
          let child = zodFromSchema(spec, value, value.description, depth + 1);
          if (!required.has(key) && value.default === undefined) child = child.optional();
          shape[key] = child;
        }
        zod = Object.keys(shape).length ? z.object(shape).passthrough() : z.record(z.string(), z.unknown());
        break;
      }
      case "null":
        zod = z.null();
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

  if (schema.nullable) zod = zod.nullable();
  zod = withDescription(zod, description ?? schema.description);

  if (schema.default !== undefined) {
    zod = zod.default(schema.default as never);
  }

  return zod;
}

function inputSchemaFor(spec: OpenApiSpec, operation: PvgisOperation): z.ZodObject<Record<string, z.ZodTypeAny>> {
  const shape: Record<string, z.ZodTypeAny> = {};

  for (const param of operation.parameters as readonly OpenApiParameter[]) {
    let paramSchema = zodFromSchema(spec, param.schema ?? { type: "string" }, param.description);
    if (!param.required && param.schema?.default === undefined) paramSchema = paramSchema.optional();
    shape[param.name] = paramSchema;
  }

  if (operation.requestBody) {
    shape.body = z.record(z.string(), z.unknown()).optional().describe("JSON request body for this PVGIS operation.");
  }

  return z.object(shape).passthrough();
}

function encodeQueryValue(value: unknown): string {
  if (Array.isArray(value)) return value.join(",");
  if (typeof value === "object" && value !== null) return JSON.stringify(value);
  return String(value);
}

function getOrigin(value: string): string {
  const url = new URL(value);
  return url.origin;
}

function buildApiUrl(path: string): URL {
  if (/^https?:\/\//i.test(path)) return new URL(path);

  if (path.startsWith("/api/v6/")) {
    return new URL(path, getOrigin(PVGIS_BASE_URL));
  }

  const base = PVGIS_BASE_URL.endsWith("/") ? PVGIS_BASE_URL : `${PVGIS_BASE_URL}/`;
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  return new URL(cleanPath, base);
}

function buildUrl(operation: PvgisOperation, input: Record<string, unknown>): URL {
  let path = operation.path;

  for (const param of operation.parameters as readonly OpenApiParameter[]) {
    if (param.in !== "path") continue;
    const value = input[param.name];
    if (value === undefined || value === null || value === "") {
      throw new Error(`Missing required path parameter: ${param.name}`);
    }
    path = path.replace(`{${param.name}}`, encodeURIComponent(String(value)));
  }

  const url = buildApiUrl(path);

  for (const param of operation.parameters as readonly OpenApiParameter[]) {
    if (param.in !== "query") continue;
    const value = input[param.name];
    if (value === undefined || value === null || value === "") continue;
    url.searchParams.set(param.name, encodeQueryValue(value));
  }

  return url;
}

async function executePvgisOperation(operation: PvgisOperation, input: Record<string, unknown>) {
  const url = buildUrl(operation, input);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const headers: Record<string, string> = {
      "User-Agent": DEFAULT_USER_AGENT,
      Accept: "application/json,text/csv,text/plain,text/html,image/png,*/*",
    };

    for (const param of operation.parameters as readonly OpenApiParameter[]) {
      if (param.in !== "header") continue;
      const value = input[param.name];
      if (value !== undefined && value !== null && value !== "") headers[param.name] = String(value);
    }

    const init: RequestInit = {
      method: operation.method,
      signal: controller.signal,
      headers,
    };

    if (operation.requestBody && input.body !== undefined) {
      headers["Content-Type"] = "application/json";
      init.body = JSON.stringify(input.body);
    }

    const response = await fetch(url, init);
    const contentType = response.headers.get("content-type") ?? "";

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`PVGIS ${response.status} ${response.statusText}: ${errorBody}`);
    }

    if (contentType.includes("image/")) {
      const arrayBuffer = await response.arrayBuffer();
      const data = Buffer.from(arrayBuffer).toString("base64");
      return {
        content: [
          {
            type: "image",
            data,
            mimeType: contentType.split(";")[0],
          },
        ],
      } as any;
    }

    if (contentType.includes("application/json")) {
      const json = await response.json();
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(json, null, 2),
          },
        ],
      };
    }

    const text = await response.text();
    return {
      content: [
        {
          type: "text",
          text,
        },
      ],
    };
  } finally {
    clearTimeout(timeout);
  }
}

async function main() {
  const spec = await loadOpenApiSpec({ allowFetch: true });
  const operations = extractOperations(spec);

  if (!operations.length) throw new Error("No PVGIS OpenAPI operations were found.");

  const server = new McpServer({
    name: "pvgis-mcp-1to1",
    version: "0.1.0",
  });

  for (const operation of operations) {
    const description = [
      operation.summary,
      operation.description,
      `Tags: ${operation.tags.join(", ") || "none"}`,
      `HTTP: ${operation.method} ${operation.path}`,
      `OpenAPI operationId: ${operation.operationId || "none"}`,
    ]
      .filter(Boolean)
      .join("\n\n");

    server.registerTool(
      operation.toolName,
      {
        title: operation.summary || operation.toolName,
        description,
        inputSchema: inputSchemaFor(spec, operation),
      },
      async (input) => executePvgisOperation(operation, input as Record<string, unknown>)
    );
  }

  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
