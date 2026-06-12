# JTBDs (create_raster_sequence)

## JTBDs
1. Combinar duas listas de rasters em uma única sequência ordenada
2. Mesclar um RasterSequence existente com uma lista de rasters

## Descrição
Cria uma única RasterSequence combinando rasters de duas listas de entrada (ou um sequence + lista), ordenados por data e unificando geometrias e períodos.

## Inputs
- `rasters1`: List[Raster] | RasterSequence — primeira lista ou sequência
- `rasters2`: List[Raster] — segunda lista de rasters

## Outputs
- `sequence`: RasterSequence — sequência combinada com geometria unificada

## Lógicas e Cálculos
1. Ordena cada lista por `time_range[0]` (ou extrai assets ordenados se for RasterSequence)
2. Calcula time_range unificado (min/max das datas)
3. Calcula geometria unificada via `unary_union` das geometrias individuais
4. Adiciona todos os rasters ordenados dentro do RasterSequence resultante

## Use Cases
1. **Automação**: Cria uma única RasterSequence combinando rasters de duas listas de entrada (ou um sequence + lista), ordenados por data e unificando geometrias e períodos de forma programática e escalável.
2. **Pipeline de dados**: Integrar esta operação em workflows maiores de análise geoespacial.
3. **Batch processing**: Processar múltiplas regiões/períodos de forma paralela.

## Faz / Não Faz

- **Faz**: Executa a operação conforme parâmetros fornecidos.
- **Faz**: Processa rasters geoespaciais com suporte a múltiplas bandas.
- **Faz**: Opera sobre sequências de dados de forma estruturada.
- **Não Faz**: Não modifica os dados de entrada originais.
- **Não Faz**: Não valida resultados contra referências externas.

## Variáveis

| Variável | Tipo | Descrição |
|----------|------|-----------|
| `rasters1` | — | Conforme especificação da operação |
| `rasters2` | — | Conforme especificação da operação |

## Outcomes Esperados

- Raster geoespacial pronto para visualização e análises subsequentes.
- Estrutura de dados organizada para encadeamento em workflows.

## Workflows Utilizados

- Operação atômica `create_raster_sequence` — utilizada como componente de workflows maiores.

## APIs / Conectores

- **N/A**: Operação puramente computacional, sem dependências externas de API.

## Datasets / Fontes de Dados

- **Dados de entrada**: Fornecidos pelo usuário ou por operações anteriores no pipeline.

