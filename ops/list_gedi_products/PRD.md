# JTBDs (List GEDI Products)

## JTBDs
1. Listar produtos GEDI (Global Ecosystem Dynamics Investigation) da NASA EarthData para uma região e período
2. Selecionar nível de processamento (ex: GEDI02_B.002)

## Descrição
Operação que consulta a API EarthData da NASA e lista produtos GEDI que intersectam a geometria e intervalo de tempo. Cada produto contém geometria (polígono ou multipolígono da órbita), número da órbita inicial/final e nível de processamento.

## Inputs
- `input_data` (DataVibe): geometria e intervalo de tempo de interesse

## Outputs
- `gedi_products` (List[GEDIProduct]): produtos GEDI listados

## Lógicas e Cálculos
- Valida `processing_level` contra `EarthDataAPI.concept_ids`
- Consulta EarthData API com geometria e time range
- Converte polígonos da resposta (string de coordenadas) para `shapely.Polygon` ou `MultiPolygon`
- Extrai `start_orbit_number` e `stop_orbit_number` do domínio orbital
- Deriva `processing_level` a partir do `collection_concept_id`

## Use Cases
1. **Descoberta de dados**: Consultar produtos Gedi Products disponíveis para uma região.
2. **Planejamento de aquisição**: Verificar cobertura temporal e espacial antes de baixar.
3. **Curadoria de dataset**: Filtrar cenas por data, cobertura de nuvem e outros critérios.

## Faz / Não Faz

- **Faz**: Consulta a catálogos/fontes de dados para listar produtos disponíveis.
- **Faz**: Filtragem por geometria e intervalo de tempo.
- **Não Faz**: Não baixa os dados listados — apenas retorna metadados.
- **Não Faz**: Não modifica o catálogo de dados.

## Variáveis

| Variável | Tipo | Descrição |
|----------|------|-----------|
| `input_data` | — | Conforme especificação da operação |

## Outcomes Esperados

- Lista de produtos disponíveis com metadados completos.
- Estrutura de dados organizada para encadeamento em workflows.

## Workflows Utilizados

- Operação atômica `list_gedi_products` — utilizada como componente de workflows maiores.

## APIs / Conectores

- **Catálogo remoto**: Consulta a API de catálogo de dados.

## Datasets / Fontes de Dados

- **Catálogo remoto**: Metadados de produtos disponíveis.

