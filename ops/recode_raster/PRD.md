# JTBDs (recode_raster)

## JTBDs
1. Reclassificar valores de um raster com base em mapeamento origem → destino
2. Transformar legendas de mapas temáticos (ex: mudar códigos de uso do solo)

## Descrição
Recebe um raster e duas listas de valores (from_values, to_values) para recodificar pixels. Valores não listados permanecem inalterados.

## Inputs
- `raster`: Raster — raster de entrada com valores a recodificar

## Outputs
- `recoded_raster`: Raster — raster com valores recodificados

## Lógicas e Cálculos
1. Carrega raster com `load_raster`
2. Aplica mapeamento via `np.vectorize`: para cada pixel, retorna `to_values[i]` se pixel == `from_values[i]`, senão mantém o valor original
3. Salva raster transformado com `save_raster_from_ref`

## Use Cases
1. **Automação**: Recebe um raster e duas listas de valores (from_values, to_values) para recodificar pixels de forma programática e escalável.
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

- Operação atômica `recode_raster` — utilizada como componente de workflows maiores.

## APIs / Conectores

- **N/A**: Operação puramente computacional, sem dependências externas de API.

## Datasets / Fontes de Dados

- **Dados de entrada**: Fornecidos pelo usuário ou por operações anteriores no pipeline.

