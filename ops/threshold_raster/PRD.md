# JTBDs (threshold_raster)

## JTBDs

1. Binarizar um raster aplicando um limiar numérico
2. Identificar regiões onde valores excedem um determinado patamar

## Descrição

Aplica um threshold a um raster: pixels com valor acima do limiar viram 1, abaixo viram 0, resultando em um raster uint8 binário.

## Inputs

- `raster`: Raster — raster de valores contínuos

## Outputs

- `thresholded`: Raster — raster binário (0/1) em uint8

## Lógicas e Cálculos

1. Carrega raster com `load_raster`, converte para masked array
2. Aplica `data_ma > threshold`, resultando em máscara booleana float32
3. Preserva a máscara original (preenche com NaN)
4. Converte encoding para uint8 e salva com `save_raster_from_ref`

## Use Cases
1. **Automação**: Aplica um threshold a um raster: pixels com valor acima do limiar viram 1, abaixo viram 0, resultando em um raster uint8 binário de forma programática e escalável.
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
| `raster` | — | Conforme especificação da operação |

## Outcomes Esperados

- Raster geoespacial pronto para visualização e análises subsequentes.
- Dados de saída formatados e prontos para consumo por operações posteriores.
- Rastreabilidade completa via metadados do asset.

## Workflows Utilizados

- Operação atômica `threshold_raster` — utilizada como componente de workflows maiores.

## APIs / Conectores

- **N/A**: Operação puramente computacional, sem dependências externas de API.

## Datasets / Fontes de Dados

- **Dados de entrada**: Fornecidos pelo usuário ou por operações anteriores no pipeline.

