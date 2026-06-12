# JTBDs (Pair Intersecting Rasters)

## JTBDs
1. Parear rasters de duas listas que possuem geometrias com interseção espacial
2. Garantir que apenas pares com overlap espacial sejam processados adiante

## Descrição
Recebe duas listas de `Raster` e retorna pares preservando a ordem: para cada raster de `rasters1`, encontra todos os rasters de `rasters2` cuja geometria intersecta. Os outputs são duas listas sincronizadas (mesmo índice = par).

## Inputs
- `rasters1`: `List[Raster]`
- `rasters2`: `List[Raster]`

## Outputs
- `paired_rasters1`: `@INHERIT(rasters1)`
- `paired_rasters2`: `@INHERIT(rasters2)`

## Lógicas e Cálculos
- Itera sobre `rasters1` × `rasters2` testando `geom_n.intersects(geom_d)` com `shapely`
- Se nenhum par for encontrado, levanta `ValueError("No intersecting rasters could be paired")`
- Retorna listas sincronizadas (um raster de `rasters1` pode aparecer múltiplas vezes)

## Use Cases
1. **Automação**: Recebe duas listas de `Raster` e retorna pares preservando a ordem: para cada raster de `rasters1`, encontra todos os rasters de `rasters2` cuja geometria intersecta de forma programática e escalável.
2. **Pipeline de dados**: Integrar esta operação em workflows maiores de análise geoespacial.
3. **Batch processing**: Processar múltiplas regiões/períodos de forma paralela.

## Faz / Não Faz

- **Faz**: Executa a operação conforme parâmetros fornecidos.
- **Faz**: Processa rasters geoespaciais com suporte a múltiplas bandas.
- **Não Faz**: Não modifica os dados de entrada originais.
- **Não Faz**: Não valida resultados contra referências externas.

## Variáveis

| Variável | Tipo | Descrição |
|----------|------|-----------|
| `rasters1` | — | Conforme especificação da operação |
| `rasters2` | — | Conforme especificação da operação |

## Outcomes Esperados

- Raster geoespacial pronto para visualização e análises subsequentes.
- Dados de saída formatados e prontos para consumo por operações posteriores.
- Rastreabilidade completa via metadados do asset.

## Workflows Utilizados

- Operação atômica `pair_intersecting_rasters` — utilizada como componente de workflows maiores.

## APIs / Conectores

- **N/A**: Operação puramente computacional, sem dependências externas de API.

## Datasets / Fontes de Dados

- **Dados de entrada**: Fornecidos pelo usuário ou por operações anteriores no pipeline.

