# JTBDs (clip_raster)

## JTBDs

1. Extrair apenas a região de interesse do raster
2. Reduzir área processada eliminando pixels fora do boundary

## Descrição

Recorta o raster de entrada com base na geometria de referência fornecida. Suporta dois modos: soft clip (apenas metadados) e hard clip (corta efetivamente os pixels).

## Inputs

- `input_item: DataVibe` — geometria de referência
- `raster: Raster` — raster a ser recortado
- Parâmetro: `hard_clip` (padrão false)

## Outputs

- `clipped_raster: Raster` — raster recortado (tipo herdado do input)

## Lógicas e Cálculos

- Verifica interseção entre geometrias do raster e do item de referência
- **Soft clip**: clona o raster com nova geometria sem modificar pixels
- **Hard clip**: usa `rioxarray.clip()` para recortar os dados fisicamente, gerando novo asset

## Use Cases
1. **Automação**: Recorta o raster de entrada com base na geometria de referência fornecida de forma programática e escalável.
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
| `input_item: DataVibe` | — | Conforme especificação da operação |
| `raster: Raster` | — | Conforme especificação da operação |
| `hard_clip` | — | Conforme especificação da operação |

## Outcomes Esperados

- Raster geoespacial pronto para visualização e análises subsequentes.
- Dados de saída formatados e prontos para consumo por operações posteriores.
- Rastreabilidade completa via metadados do asset.

## Workflows Utilizados

- Operação atômica `clip_raster` — utilizada como componente de workflows maiores.

## APIs / Conectores

- **N/A**: Operação puramente computacional, sem dependências externas de API.

## Datasets / Fontes de Dados

- **Dados de entrada**: Fornecidos pelo usuário ou por operações anteriores no pipeline.

