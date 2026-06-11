# PRD — ADMAg (Microsoft Azure Data Manager for Agriculture)

## Workflows

- `admag_seasonal_field.yaml` — Gera informações sazonais de talhões agrícolas
- `prescriptions.yaml` — Obtém prescrições (amostras de sensores) vinculadas a mapas de prescrição

---

## JTBDs (Jobs To Be Done)

1. **Obter informações sazonais de talhão agrícola** — O usuário precisa extrair do ADMAg as operações agrícolas (fertilização, colheita, preparo do solo, plantio, nome da cultura) associadas a um talhão e parte específica.
2. **Obter prescrições agrícolas** — O usuário precisa consultar amostras de sensores (nitrogênio, fósforo, potássio, pH, coordenadas etc.) vinculadas a um `prescription_map_id` e transformá-las em GeoJSON com geometria de ponto.

---

## Casos de Uso

- **C1:** Agrônomo quer consultar o histórico de operações (plantio, fertilização) de um talhão específico no Azure Data Manager for Agriculture.
- **C2:** Técnico agrícola precisa baixar prescrições com teores de nutrientes para aplicar fertilizante em taxa variada.
- **C3:** Engenheiro de dados integra dados do ADMAg a pipelines de análise no farmvibes-ai.

---

## Faz / Não Faz

### Faz

- Conectar-se à API do ADMAg usando OAuth2 (client_id, client_secret, authority, default_scope).
- Listar operações sazonais de um talhão (`SeasonalFieldInformation`).
- Listar prescrições (`prescriptions`) associadas a um `prescription_map_id`.
- Extrair geometria (latitude/longitude) de amostras e gerar GeoJSON.
- Armazenar resultados como assets locais no farmvibes-ai.

### Não Faz

- Não modifica ou exclui dados no ADMAg (apenas leitura).
- Não suporta autenticação diferente de OAuth2 (ex.: chave de API simples).
- Não faz análise estatística dos dados — apenas ingestão.

---

## Users Inputs

### `admag_seasonal_field`

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `base_url` | string | URL do Azure Data Manager for Agriculture |
| `client_id` | string | ID do aplicativo registrado no Microsoft Identity Platform |
| `client_secret` | string | Segredo do aplicativo |
| `authority` | string | Endpoint de autorização OAuth2 |
| `default_scope` | string | Escopo OAuth2 padrão |

### `prescriptions`

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `base_url` | string | URL do ADMAg |
| `client_id` | string | ID do aplicativo |
| `client_secret` | string | Segredo do aplicativo |
| `authority` | string | Endpoint de autorização |
| `default_scope` | string | Escopo OAuth2 |

**Fonte:** `admag_input` — identificadores únicos do talhão sazonal (`party_id`, `prescription_map_id`).

---

## System Outputs

### `admag_seasonal_field`

- **sink:** `seasonal_field` — Objeto `SeasonalFieldInformation` contendo operações agrícolas (fertilização, colheita, preparo, plantio, nome da cultura).

### `prescriptions`

- **sink:** `response` — Prescrições recebidas do ADMAg em formato GeoJSON com geometria de ponto e atributos de nutrientes.

---

## Outcomes Esperados

- Dados sazonais de talhões disponíveis como assets locais para uso em outros workflows.
- Prescrições transformadas em dados geoespaciais (pontos com nutrientes) prontos para análise.
- Integração transparente entre Azure Data Manager for Agriculture e farmvibes-ai.

---

## APIs

- **Endpoint ADMAg:** `{base_url}/ag food models`
- **Autenticação:** OAuth2 via `client_id`, `client_secret`, `authority`, `default_scope`
- **Conector:** API REST do Microsoft Azure Data Manager for Agriculture

---

## CRUD

| Operação | Workflow | Descrição |
|----------|----------|-----------|
| GET (list) | `prescriptions` | Lista prescrições via `list_prescriptions` |
| GET (detail) | `prescriptions` | Obtém prescrição individual via `get_prescription` |
| GET | `admag_seasonal_field` | Obtém informações sazonais do talhão |
| CREATE | ❌ | Não cria dados no ADMAg |
| UPDATE | ❌ | Não altera dados |
| DELETE | ❌ | Não remove dados |

---

## Bancos de Dados

- **Externo:** Azure Data Manager for Agriculture (Microsoft) — dados armazenados na nuvem da Azure.
- **Interno (farmvibes-ai):** Assets locais (GeoJSON, DataVibe) armazenados no cluster.

### Relacionamentos

- `party_id` → identifica a parte proprietária do talhão
- `prescription_map_id` → identifica o mapa de prescrição
- `SeasonalField` → contém operações agrícolas (fertilização, harvest, tillage, planting)

---

## Datasets e JSON Files

- **GeoJSON** gerado a partir das prescrições com geometria de ponto (latitude/longitude) e atributos (N, C, P, pH).
- **JSON de saída** do `admag_seasonal_field` com informações sazonais.

---

## Tabelas

Não há tabelas locais explícitas. Os dados relacionais estão no ADMAg.

---

## Lógicas e Cálculos

- **Geração de geometria:** Latitude e longitude das amostras são convertidas em geometria Point (EPSG:4326).
- **Formatação GeoJSON:** Atributos de nutrientes e geometria são estruturados em GeoJSON.
- **Encadeamento:** `list_prescriptions` → `get_prescription` (filtra sem geometria) → `admag_prescriptions` (enriquece com geometria).

---

## Perfis Energéticos

| Perfil (Classe) | Subclasse | Aplicação do Workflow | Valor Gerado |
|---|---|---|---|
| Eficiência Energética / Agricultura de Precisão | Irrigação, Estufas | Dados sazonais de talhões e prescrições de nutrientes | Subsidia aplicação em taxa variada e manejo localizado |
| Biomassa / Bioenergia | Cana-de-açúcar, Floresta energética | Monitoramento de operações agrícolas (fertilização, colheita) | Fornece dados de manejo para estimativa de biomassa |
| Geração Solar | GD, GC | Dados de uso e ocupação do solo agrícola | Informações sazonais para planejamento de instalação |
| Mercado de Carbono | Agricultura de baixo carbono | Dados históricos de operações agrícolas | Relatório de práticas de manejo para certificação |
| Distribuição de Energia | Concessionárias | Zoneamento de áreas agrícolas | Dados de uso do solo para planejamento de rede |
