# NASA POWER MCP 1:1

Servidor MCP gerado a partir dos OpenAPI JSONs locais da NASA POWER.

- OpenAPI JSONs processados: **12**
- MCP tools registradas: **62**
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
{
  "mcpServers": {
    "nasa-power-1to1": {
      "command": "pnpm",
      "args": ["dev"],
      "cwd": "/mnt/data/nasa-power-mcp-1to1"
    }
  }
}
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
