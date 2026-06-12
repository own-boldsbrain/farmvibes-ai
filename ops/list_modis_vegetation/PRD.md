# JTBDs (List MODIS Vegetation)

## JTBDs
1. Listar produtos MODIS de vegetação (NDVI/EVI, 16 dias) para uma região e período
2. Selecionar resolução (250m, 500m ou 1000m)

## Descrição
Operação que consulta a coleção MODIS 16-day Vegetation Indices do Planetary Computer e lista produtos que intersectam a geometria e período de entrada. Suporta os índices de vegetação NDVI e EVI.

## Inputs
- `input_data` (List[DataVibe]): geometrias e intervalos de tempo de interesse

## Outputs
- `modis_products` (List[ModisProduct]): produtos MODIS de vegetação listados

## Lógicas e Cálculos
- Valida resolução contra chaves disponíveis em `Modis16DayVICollection.collections`
- Para cada `DataVibe` de entrada, faz query na coleção com geometria e time range
- Deduplica itens por ID (dicionário items[i.id])
- Converte `start_datetime` e `end_datetime` do item para time_range do produto

## Use Cases
1. **Descoberta de dados**: Consultar produtos Modis Vegetation disponíveis para uma região.
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

- Operação atômica `list_modis_vegetation` — utilizada como componente de workflows maiores.

## APIs / Conectores

- **Microsoft Planetary Computer**: Catálogo STAC e API de dados.

## Datasets / Fontes de Dados

- **MODIS**: Vegetation indices e surface reflectance (250m-1km).

