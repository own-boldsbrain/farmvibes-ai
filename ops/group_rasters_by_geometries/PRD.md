# JTBDs (Group Rasters by Geometries)

## JTBDs
1. Agrupar rasters cujas geometrias correspondem a geometrias de referência
2. Produzir sequências de rasters por geometria de referência

## Descrição
Recebe uma lista de `Raster` e uma lista de `DataVibe` de referência. Para cada geometria de referência, seleciona os rasters cuja geometria é aproximadamente igual (baseado em limiar de similaridade) e cria um `RasterSequence`. Todos os rasters devem ter as mesmas bandas.

## Inputs
- `rasters`: `List[Raster]`
- `group_by`: `List[DataVibe]`
- Parâmetro: `geom_threshold` (padrão 0.99)

## Outputs
- `raster_groups`: `List[RasterSequence]`

## Lógicas e Cálculos
- Valida que todos os rasters têm as mesmas bandas
- Para cada geometria de referência, varre os rasters e testa `is_approx_equal(geom_r, geom_g, threshold)`
- Rasters correspondentes são ordenados por `id` e agrupados em `RasterSequence` com `time_range` = (min, max) das datas

## Use Cases
1. **Organização de dados**: Agrupar rasters/produtos por critérios espaciais ou temporais.
2. **Preparação para merge**: Estruturar sequências antes de operações de mosaico.
3. **Redução de complexidade**: Simplificar listas grandes em grupos gerenciáveis.

## Faz / Não Faz

- **Faz**: Agrupamento de itens por critérios espaciais e/ou temporais.
- **Não Faz**: Não altera o conteúdo dos itens agrupados.
- **Não Faz**: Não modifica a ordem interna dos itens.

## Variáveis

| Variável | Tipo | Descrição |
|----------|------|-----------|
| `rasters` | — | Conforme especificação da operação |
| `group_by` | — | Conforme especificação da operação |
| `geom_threshold` | — | Conforme especificação da operação |

## Outcomes Esperados

- Raster geoespacial pronto para visualização e análises subsequentes.
- Lista de produtos disponíveis com metadados completos.
- Estrutura de dados organizada para encadeamento em workflows.

## Workflows Utilizados

- Operação atômica `group_rasters_by_geometries` — utilizada como componente de workflows maiores.

## APIs / Conectores

- **N/A**: Operação puramente computacional, sem dependências externas de API.

## Datasets / Fontes de Dados

- **Dados de entrada**: Fornecidos pelo usuário ou por operações anteriores no pipeline.

