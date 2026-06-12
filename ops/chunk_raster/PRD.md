# JTBDs (chunk_raster / chunk_sequence_raster)

## JTBDs

1. Processar grandes rasters sem estourar memória
2. Paralelizar computações pixel-a-pixel dividindo a cena em pedaços

## Descrição

Divide rasters de entrada em uma série de chunks (blocos) menores, permitindo processamento paralelo em grade. Suporta entrada como `List[Raster]` ou `RasterSequence`.

## Inputs

- `rasters: List[Raster]` ou `RasterSequence` — raster(s) de entrada
- Parâmetros: `step_y` (padrão 1000), `step_x` (padrão 1000)

## Outputs

- `chunk_series: List[RasterChunk]` — lista de chunks com limites, posição e geometria

## Lógicas e Cálculos

- Lê o shape do raster de referência e calcula intervalos de leitura/escrita
- Cria grid de chunks com `(step_y, step_x)` de tamanho
- Cada chunk armazena `ChunkLimits` (col, row, width, height) para leitura absoluta e escrita relativa
- Gera geometria do chunk em EPSG:4326 a partir da window do raster

## Use Cases
1. **Automação**: Divide rasters de entrada em uma série de chunks (blocos) menores, permitindo processamento paralelo em grade de forma programática e escalável.
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
| `rasters: List[Raster]` | — | Conforme especificação da operação |
| `step_y` | — | Conforme especificação da operação |
| `step_x` | — | Conforme especificação da operação |

## Outcomes Esperados

- Raster geoespacial pronto para visualização e análises subsequentes.
- Lista de produtos disponíveis com metadados completos.
- Estrutura de dados organizada para encadeamento em workflows.

## Workflows Utilizados

- Operação atômica `chunk_raster` — utilizada como componente de workflows maiores.

## APIs / Conectores

- **N/A**: Operação puramente computacional, sem dependências externas de API.

## Datasets / Fontes de Dados

- **Dados de entrada**: Fornecidos pelo usuário ou por operações anteriores no pipeline.

