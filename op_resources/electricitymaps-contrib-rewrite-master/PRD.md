# PRD: electricitymaps-contrib-rewrite-master

> **Documento de Requisitos de Produto (High-Level PRD)**
> Sistema: FarmVibes.AI / YSH Energy
> Categoria: ENERGY

---

## 1. Variáveis & Workflows
- **Workflows Principais:** Data Pipeline de Emissões, Agendamento Consciente de Carbono, Extração de Intensidade do Grid.
- **Escopo no Ecossistema:** Atua como um módulo acoplável dentro da malha de orquestração do projeto.

## 2. JTBDs & Use Cases
- **Jobs-To-Be-Done (JTBD):** Monitorar e rotear o consumo de energia da infraestrutura baseado na intensidade de carbono regional em tempo real.
- **05 Users cases:**
  1. Consultar intensidade atual de carbono do grid (gCO2eq/kWh).
  2. Agendar job de processamento para janela de menor emissão.
  3. Calcular emissões totais de um workflow de IA executado.
  4. Integrar telemetria de energia com orquestradores Kubernetes.
  5. Atualizar ou implementar parsers para novas regiões de distribuição de energia.

## 3. Escopo do Módulo
- **Faz:** Consulta de APIs de grid, normalização temporal de dados de CO2, cálculo de intensidade marginal, rate limiting.
- **Não Faz:** Controle físico de hardware de data centers, compra de créditos de carbono, operação direta da rede elétrica.

## 4. Inputs, Outputs & Outcomes Esperados
- **Users Inputs (Entradas):** Region code (ex: BR-NE), Timestamp/Time-window, Tamanho estimado do job (kWh).
- **System Outputs (Saídas):** Carbon intensity atual, previsão (forecast) 24h, métricas de emissão.
- **Outcomes Esperados:** Redução do footprint de carbono operacional (Zero-Line Integrity aplicada à sustentabilidade).

## 5. APIs, Endpoints & Conectores
- **Endpoints / URLs de Integração:** REST API: `/emissions/bylocations`, `/emissions/forecasts`, `/zones`
- **Conectores:** Webhooks, Polling cron jobs, Kubernetes custom controllers.

## 6. Operações CRUD
- **GETs:** GET /emissions (Leitura de métricas atuais).
- **POSTs:** POST /schedule (Agendamento de carga de trabalho).
- **Lógica de Estado (Create/Update/Delete/Approve/Reject):** CREATE (Logs de consumo), UPDATE (Parsers de grid), DELETE (Jobs expirados), APPROVE (Janela verde).

## 7. Banco de Dados, Schemas & Lógica
- **Bancos de dados / Schemas:** Time-series database schema, Zone Mapping configs.
- **Datasets / JSON files / Tabelas:** JSON files de mapeamento de zonas geográficas (Polígonos de grid).
- **Lógicas e Cálculos Matemáticos:** Médias ponderadas de emissão por mix de fontes, interpolação temporal de gaps na API, conversão Fuso-Horário/UTC.

---
*Este documento foi gerado aderindo aos princípios técnicos de especificação da YSH, garantindo Integridade de Linha Zero na definição da infraestrutura.*
