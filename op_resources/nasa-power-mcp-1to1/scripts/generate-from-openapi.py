import json, glob, os, re, shutil, textwrap, zipfile
from pathlib import Path

SRC_DIR = Path('/mnt/data')
OUT_DIR = Path('/mnt/data/nasa-power-mcp-1to1')
if OUT_DIR.exists(): shutil.rmtree(OUT_DIR)
(OUT_DIR/'src').mkdir(parents=True)
(OUT_DIR/'scripts').mkdir(parents=True)
(OUT_DIR/'openapi').mkdir(parents=True)

openapi_files = sorted(SRC_DIR.glob('*openapi.json'))

def tool_name_from(method, path):
    p = path.strip('/').replace('{','').replace('}','')
    parts = [x for x in p.split('/') if x and x != 'api']
    base = 'power_' + '_'.join(parts + [method.lower()])
    base = re.sub(r'[^a-zA-Z0-9_]+','_', base).lower()
    base = re.sub(r'_+','_', base).strip('_')
    return base

def ref_name(ref):
    return ref.split('/')[-1]

def deref_schema(schema, spec):
    if not isinstance(schema, dict):
        return {}
    if '$ref' in schema:
        name = ref_name(schema['$ref'])
        target = spec.get('components',{}).get('schemas',{}).get(name, {})
        merged = dict(target)
        for k,v in schema.items():
            if k != '$ref': merged[k] = v
        return deref_schema(merged, spec)
    return schema

def simplify_schema(schema, spec):
    schema = deref_schema(schema or {}, spec)
    out = {}
    t = schema.get('type')
    if not t and 'enum' in schema:
        t = 'string'
    out['type'] = t or 'any'
    if 'enum' in schema:
        # remove null enums for zod; nullable not handled in POWER query params normally
        enum = [v for v in schema.get('enum', []) if v is not None]
        out['enum'] = enum
    if 'default' in schema:
        out['default'] = schema.get('default')
    if 'minimum' in schema: out['minimum'] = schema['minimum']
    if 'maximum' in schema: out['maximum'] = schema['maximum']
    if 'minLength' in schema: out['minLength'] = schema['minLength']
    if 'maxLength' in schema: out['maxLength'] = schema['maxLength']
    if 'minItems' in schema: out['minItems'] = schema['minItems']
    if 'maxItems' in schema: out['maxItems'] = schema['maxItems']
    if t == 'array':
        out['items'] = simplify_schema(schema.get('items',{}), spec)
    if schema.get('format'): out['format'] = schema['format']
    return out

operations=[]
for file in openapi_files:
    shutil.copy(file, OUT_DIR/'openapi'/file.name)
    spec=json.load(open(file, encoding='utf-8'))
    title=spec.get('info',{}).get('title','')
    version=spec.get('info',{}).get('version','')
    for path, methods in spec.get('paths',{}).items():
        for method, op in methods.items():
            if not isinstance(op, dict): continue
            method_u = method.upper()
            name=tool_name_from(method_u, path)
            params=[]
            for p in op.get('parameters',[]) or []:
                if not isinstance(p,dict): continue
                schema=simplify_schema(p.get('schema',{}), spec)
                desc = p.get('description') or schema.get('description') or ''
                params.append({
                    'name': p.get('name'),
                    'in': p.get('in'),
                    'required': bool(p.get('required', False)),
                    'description': desc,
                    'schema': schema,
                })
            operations.append({
                'toolName': name,
                'sourceFile': file.name,
                'apiTitle': title,
                'apiVersion': version,
                'method': method_u,
                'path': path,
                'operationId': op.get('operationId'),
                'summary': op.get('summary') or '',
                'description': op.get('description') or '',
                'parameters': params,
            })

# detect collisions
from collections import Counter
cnt=Counter(o['toolName'] for o in operations)
collisions=[k for k,v in cnt.items() if v>1]
assert not collisions, collisions

(OUT_DIR/'src'/'operations.generated.ts').write_text(
    '/* Auto-generated from NASA POWER OpenAPI JSON files. Do not edit by hand. */\n' +
    'export const operations = ' + json.dumps(operations, indent=2, ensure_ascii=False) + ' as const;\n' +
    'export type PowerOperation = (typeof operations)[number];\n',
    encoding='utf-8'
)

server_ts = r'''import { McpServer } from "@modelcontextprotocol/server";
import { StdioServerTransport } from "@modelcontextprotocol/server/stdio";
import * as z from "zod/v4";
import { operations, type PowerOperation } from "./operations.generated.js";

const POWER_BASE_URL = process.env.POWER_BASE_URL ?? "https://power.larc.nasa.gov";
const REQUEST_TIMEOUT_MS = Number(process.env.POWER_TIMEOUT_MS ?? "60000");
const DEFAULT_USER_AGENT = "nasa-power-mcp-1to1/0.1.0";

type JsonSchemaLite = {
  type?: string;
  enum?: unknown[];
  default?: unknown;
  minimum?: number;
  maximum?: number;
  minLength?: number;
  maxLength?: number;
  minItems?: number;
  maxItems?: number;
  format?: string;
  items?: JsonSchemaLite;
};

type ParamMeta = {
  name: string;
  in: "query" | "path" | "header" | "cookie";
  required: boolean;
  description?: string;
  schema?: JsonSchemaLite;
};

function withDescription<T extends z.ZodTypeAny>(schema: T, description?: string): T {
  return description ? schema.describe(description) as T : schema;
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

function inputSchemaFor(operation: PowerOperation): z.ZodObject<Record<string, z.ZodTypeAny>> {
  const shape: Record<string, z.ZodTypeAny> = {};

  for (const param of operation.parameters as readonly ParamMeta[]) {
    let paramSchema = zodFromSchema(param.schema, param.description);
    if (!param.required && param.schema?.default === undefined) {
      paramSchema = paramSchema.optional();
    }
    shape[param.name] = paramSchema;
  }

  return z.object(shape);
}

function encodeQueryValue(value: unknown): string {
  if (Array.isArray(value)) return value.join(",");
  if (typeof value === "object" && value !== null) return JSON.stringify(value);
  return String(value);
}

function buildUrl(operation: PowerOperation, input: Record<string, unknown>): URL {
  let path = operation.path;

  for (const param of operation.parameters as readonly ParamMeta[]) {
    if (param.in !== "path") continue;
    const value = input[param.name];
    if (value === undefined || value === null || value === "") {
      throw new Error(`Missing required path parameter: ${param.name}`);
    }
    path = path.replace(`{${param.name}}`, encodeURIComponent(String(value)));
  }

  const url = new URL(path, POWER_BASE_URL);

  for (const param of operation.parameters as readonly ParamMeta[]) {
    if (param.in !== "query") continue;
    const value = input[param.name];
    if (value === undefined || value === null || value === "") continue;
    url.searchParams.set(param.name, encodeQueryValue(value));
  }

  return url;
}

async function executePowerOperation(operation: PowerOperation, input: Record<string, unknown>) {
  const url = buildUrl(operation, input);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method: operation.method,
      signal: controller.signal,
      headers: {
        "User-Agent": DEFAULT_USER_AGENT,
        "Accept": "application/json,text/csv,text/plain,text/html,image/png,*/*",
      },
    });

    const contentType = response.headers.get("content-type") ?? "";

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`NASA POWER ${response.status} ${response.statusText}: ${errorBody}`);
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

const server = new McpServer({
  name: "nasa-power-mcp-1to1",
  version: "0.1.0",
});

for (const operation of operations) {
  const description = [
    operation.summary,
    operation.description,
    `Source: ${operation.sourceFile}`,
    `HTTP: ${operation.method} ${operation.path}`,
  ]
    .filter(Boolean)
    .join("\n\n");

  server.registerTool(
    operation.toolName,
    {
      title: operation.summary || operation.toolName,
      description,
      inputSchema: inputSchemaFor(operation),
    },
    async (input) => executePowerOperation(operation, input as Record<string, unknown>)
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
'''
# Remove escaped quote artifacts introduced by raw string
server_ts = server_ts.replace('\\"', '"')
(OUT_DIR/'src'/'server.ts').write_text(server_ts, encoding='utf-8')

package_json = {
    "name":"nasa-power-mcp-1to1",
    "version":"0.1.0",
    "type":"module",
    "private": True,
    "scripts": {
        "dev":"tsx src/server.ts",
        "build":"tsc",
        "start":"node dist/server.js",
        "inspect":"npx @modelcontextprotocol/inspector pnpm dev"
    },
    "dependencies": {
        "@modelcontextprotocol/server":"latest",
        "zod":"latest"
    },
    "devDependencies": {
        "@types/node":"latest",
        "tsx":"latest",
        "typescript":"latest"
    }
}
(OUT_DIR/'package.json').write_text(json.dumps(package_json, indent=2, ensure_ascii=False), encoding='utf-8')
(OUT_DIR/'tsconfig.json').write_text(json.dumps({
    "compilerOptions": {
        "target":"ES2022",
        "module":"NodeNext",
        "moduleResolution":"NodeNext",
        "outDir":"dist",
        "rootDir":"src",
        "strict": True,
        "esModuleInterop": True,
        "skipLibCheck": True,
        "forceConsistentCasingInFileNames": True,
        "types":["node"]
    },
    "include":["src/**/*.ts"]
}, indent=2), encoding='utf-8')

# Inventory markdown
by_file={}
for op in operations:
    by_file.setdefault(op['sourceFile'], []).append(op)
summary_lines=[]
summary_lines.append('# NASA POWER MCP 1:1 — Inventory\n')
summary_lines.append(f'Total de OpenAPI JSONs: **{len(openapi_files)}**  \n')
summary_lines.append(f'Total de MCP tools geradas: **{len(operations)}**\n')
summary_lines.append('| OpenAPI | API | Versão | Tools |')
summary_lines.append('|---|---:|---:|---:|')
for file in sorted(by_file):
    ops=by_file[file]
    summary_lines.append(f"| `{file}` | {ops[0]['apiTitle']} | {ops[0]['apiVersion']} | {len(ops)} |")
summary_lines.append('\n## Tools 1:1\n')
summary_lines.append('| Tool | Method | Path | Source | Required inputs |')
summary_lines.append('|---|---|---|---|---|')
for op in operations:
    req = ', '.join([p['name'] for p in op['parameters'] if p.get('required')]) or '—'
    summary_lines.append(f"| `{op['toolName']}` | `{op['method']}` | `{op['path']}` | `{op['sourceFile']}` | `{req}` |")
(OUT_DIR/'INVENTORY.md').write_text('\n'.join(summary_lines)+'\n', encoding='utf-8')

readme = f'''# NASA POWER MCP 1:1

Servidor MCP gerado a partir dos OpenAPI JSONs locais da NASA POWER.

- OpenAPI JSONs processados: **{len(openapi_files)}**
- MCP tools registradas: **{len(operations)}**
- Estratégia: **1 operação OpenAPI → 1 MCP tool**
- Transporte: **stdio**
- Validação de entrada: **Zod**
- Execução: `fetch()` para `https://power.larc.nasa.gov`

## Instalação

```bash
pnpm install
pnpm dev
```

## Build

```bash
pnpm build
pnpm start
```

## Config MCP local

```json
{{
  "mcpServers": {{
    "nasa-power-1to1": {{
      "command": "pnpm",
      "args": ["dev"],
      "cwd": "{str(OUT_DIR).replace('\\', '/')}"
    }}
  }}
}}
```

## Variáveis de ambiente

```bash
POWER_BASE_URL=https://power.larc.nasa.gov
POWER_TIMEOUT_MS=60000
```

## Inventário

Veja `INVENTORY.md` para a tabela completa de tools.

## Arquivos principais

```txt
src/server.ts                 # MCP server 1:1
src/operations.generated.ts   # Manifest gerado a partir dos OpenAPI
openapi/*.json                # Cópias dos specs usados como fonte
INVENTORY.md                  # Mapa completo: tool → endpoint
```

## Observação de compatibilidade

Este scaffold usa o padrão atual documentado para o SDK TypeScript com `McpServer`, `registerTool` e `StdioServerTransport`. Caso seu ambiente use o pacote legado `@modelcontextprotocol/sdk`, ajuste apenas os imports no topo de `src/server.ts`.
'''
(OUT_DIR/'README.md').write_text(readme, encoding='utf-8')

# generator script as documentation
(OUT_DIR/'scripts'/'generate-from-openapi.py').write_text(Path('/tmp/generate_power_mcp.py').read_text(encoding='utf-8'), encoding='utf-8')

# machine manifest
(OUT_DIR/'manifest.operations.json').write_text(json.dumps({
    'count': len(operations),
    'sources': sorted([p.name for p in openapi_files]),
    'operations': operations
}, indent=2, ensure_ascii=False), encoding='utf-8')

# zip
zip_path = Path('/mnt/data/nasa-power-mcp-1to1.zip')
if zip_path.exists(): zip_path.unlink()
with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zf:
    for p in OUT_DIR.rglob('*'):
        zf.write(p, p.relative_to(OUT_DIR.parent))

print(f'Generated {OUT_DIR}')
print(f'Zip {zip_path}')
print(f'Operations: {len(operations)}')
for file, ops in sorted(by_file.items()):
    print(file, len(ops))
