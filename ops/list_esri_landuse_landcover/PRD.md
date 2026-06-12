# JTBDs (List ESRI Land Use Land Cover)

## JTBDs
1. Listar tiles de uso e cobertura do solo ESRI 10m (9 classes) para uma geometria e período
2. Obter metadados dos tiles disponíveis no Planetary Computer

## Descrição
Operação que consulta a coleção ESRI Land Use Land Cover do Planetary Computer e lista tiles que intersectam a geometria e intervalo de tempo fornecidos. O produto representa a classificação de 9 classes de uso do solo em resolução de 10m.

## Inputs
- `input_item` (DataVibe): geometria e intervalo de tempo de interesse

## Outputs
- `listed_products` (List[EsriLandUseLandCoverProduct]): tiles ESRI LULC listados

## Lógicas e Cálculos
- Instancia `EsriLandUseLandCoverCollection` e faz query com bbox e time range
- Converte `start_datetime` e `end_datetime` do item STAC para o time range
- Cria `EsriLandUseLandCoverProduct` com ID, geometria e time range

## Use Cases
1. **Descoberta de dados**: Consultar produtos Esri Landuse Landcover disponíveis para uma região.
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
| `input_item` | — | Conforme especificação da operação |

## Outcomes Esperados

- Lista de produtos disponíveis com metadados completos.
- Estrutura de dados organizada para encadeamento em workflows.

## Workflows Utilizados

- Operação atômica `list_esri_landuse_landcover` — utilizada como componente de workflows maiores.

## APIs / Conectores

- **Microsoft Planetary Computer**: Catálogo STAC e API de dados.

## Datasets / Fontes de Dados

- **Catálogo remoto**: Metadados de produtos disponíveis.

