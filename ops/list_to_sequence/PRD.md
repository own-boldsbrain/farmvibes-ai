# JTBDs (List to Sequence)

## JTBDs
1. Combinar múltiplos rasters em uma única sequência ordenada
2. Unificar geometrias e intervalos de tempo de vários rasters

## Descrição
Operação utilitária que recebe uma lista de objetos `Raster` e os combina em um `RasterSequence`. A geometria de saída é a união geométrica de todos os rasters, e o time range é o intervalo mínimo-máximo entre eles.

## Inputs
- `list_rasters` (List[Raster]): lista de rasters a serem combinados

## Outputs
- `rasters_seq` (RasterSequence): sequência de rasters com metadados unificados

## Lógicas e Cálculos
- Calcula `time_range_union`: menor `time_range[0]` e maior `time_range[1]` entre todos os rasters
- Calcula `geometry_union`: união geométrica via `unary_union` + `mapping`
- Gera ID único via SHA-256 concatenando "sequence" com todos os IDs dos rasters
- Adiciona cada raster individualmente à sequência via `add_item()`

## Use Cases
1. **Descoberta de dados**: Consultar produtos To Sequence disponíveis para uma região.
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
| `list_rasters` | — | Conforme especificação da operação |

## Outcomes Esperados

- Raster geoespacial pronto para visualização e análises subsequentes.
- Estrutura de dados organizada para encadeamento em workflows.

## Workflows Utilizados

- Operação atômica `list_to_sequence` — utilizada como componente de workflows maiores.

## APIs / Conectores

- **Catálogo remoto**: Consulta a API de catálogo de dados.

## Datasets / Fontes de Dados

- **Catálogo remoto**: Metadados de produtos disponíveis.

