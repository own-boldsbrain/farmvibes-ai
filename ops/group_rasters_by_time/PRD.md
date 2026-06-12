# JTBDs (Group Rasters by Time)

## JTBDs
1. Agrupar rasters por critério temporal (dia do ano, semana, mês, ano, mês+ano)
2. Produzir sequências ordenadas temporalmente de rasters

## Descrição
Agrupa uma lista de `Raster` em `RasterSequence` conforme o critério temporal definido. Os rasters são ordenados e agrupados usando `itertools.groupby` com a função chave baseada no `time_range[0]` de cada raster.

## Inputs
- `rasters`: `List[Raster]`
- Parâmetro: `criterion` (`"day_of_year"`, `"week"`, `"month"`, `"year"`, `"month_and_year"`)

## Outputs
- `raster_groups`: `List[RasterSequence]`

## Lógicas e Cálculos
- Função chave mapeada: `tm_yday`, `isocalendar()[1]`, `month`, `year`, `(year, month)`
- `groupby(sorted(rasters, key=criterion_func), criterion_func)`
- Clona primeiro raster como `RasterSequence` com id = `group_{key}_{gen_guid()}`, adiciona demais

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
| `criterion` | — | Conforme especificação da operação |
| `"day_of_year"` | — | Conforme especificação da operação |
| `"week"` | — | Conforme especificação da operação |
| `"month"` | — | Conforme especificação da operação |
| `"year"` | — | Conforme especificação da operação |
| `"month_and_year"` | — | Conforme especificação da operação |

## Outcomes Esperados

- Raster geoespacial pronto para visualização e análises subsequentes.
- Lista de produtos disponíveis com metadados completos.
- Estrutura de dados organizada para encadeamento em workflows.

## Workflows Utilizados

- Operação atômica `group_rasters_by_time` — utilizada como componente de workflows maiores.

## APIs / Conectores

- **N/A**: Operação puramente computacional, sem dependências externas de API.

## Datasets / Fontes de Dados

- **Dados de entrada**: Fornecidos pelo usuário ou por operações anteriores no pipeline.

