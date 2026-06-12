# PRD: nasa-power-mcp-1to1

> **Documento de Requisitos de Produto (High-Level PRD)**
> Sistema: FarmVibes.AI / YSH Energy
> Categoria: MCP

---

## 1. Variáveis & Workflows
- **Workflows Principais:** Exposição de Ferramentas de IA (Tool Calling), Proxy de APIs Científicas.
- **Escopo no Ecossistema:** Atua como um módulo acoplável dentro da malha de orquestração do projeto.

## 2. JTBDs & Use Cases
- **Jobs-To-Be-Done (JTBD):** Fornecer conectores MCP (Model Context Protocol) para que agentes LLM busquem dados climáticos e solares ao vivo.
- **05 Users cases:**
  1. Agente LLM solicita dados de radiação solar histórica para uma coordenada.
  2. Agente solicita variáveis agrometeorológicas da NASA Power.
  3. O servidor MCP valida o payload JSON do agente contra as regras da API de destino.
  4. Retornar séries temporais diretamente no contexto do LLM.
  5. Converter unidades imperiais/científicas para o formato exigido pelo prompt.

## 3. Escopo do Módulo
- **Faz:** Implementação do protocolo MCP (stdio/http), validação de argumentos via JSON Schema, wrap de APIs legacy.
- **Não Faz:** Armazenamento persistente (database) dos dados meteorológicos (opera como proxy pass-through).

## 4. Inputs, Outputs & Outcomes Esperados
- **Users Inputs (Entradas):** Tool calls de LLMs contendo Latitude, Longitude, Data Início, Data Fim.
- **System Outputs (Saídas):** Respostas JSON padronizadas via protocolo MCP contendo as medições.
- **Outcomes Esperados:** Agentes de Inteligência Artificial ganham a capacidade de analisar viabilidade energética e clima com precisão científica.

## 5. APIs, Endpoints & Conectores
- **Endpoints / URLs de Integração:** Comunicação via `stdio` ou SSE (Server-Sent Events) do MCP.
- **Conectores:** NASA Power REST API, PVGIS REST API, Clientes MCP (Claude, Cursor).

## 6. Operações CRUD
- **GETs:** GET proxies repassados para as APIs oficiais da NASA/PVGIS.
- **POSTs:** N/A
- **Lógica de Estado (Create/Update/Delete/Approve/Reject):** READ-only (Consulta de dados científicos externos).

## 7. Banco de Dados, Schemas & Lógica
- **Bancos de dados / Schemas:** JSON Schema para Ferramentas (MCP Tool spec).
- **Datasets / JSON files / Tabelas:** Respostas JSON transientes em memória.
- **Lógicas e Cálculos Matemáticos:** Tradução de schema LLM para query string REST, tratamento de rate limit e timeouts, normalização de erros.

---
*Este documento foi gerado aderindo aos princípios técnicos de especificação da YSH, garantindo Integridade de Linha Zero na definição da infraestrutura.*
