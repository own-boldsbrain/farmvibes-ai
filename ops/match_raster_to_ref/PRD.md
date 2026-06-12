# JTBDs (Match Raster to Ref)

## JTBDs
1. Reprojetar, reamostrar e recortar um raster para alinhar exatamente ao grid de um raster de referência

## Descrição
Recebe um `raster` e um `ref_raster`. Reprojeta o raster de entrada para o CRS, extensão e resolução do raster de referência usando `load_raster_match`. Preserva o mesmo número de bandas do raster de entrada. A geometria de saída é a do raster de referência.

## Inputs
- `raster`: `Raster`
- `ref_raster`: `Raster`
- Parâmetro: `resampling`

## Outputs
- `output_raster`: `Raster`

## Lógicas e Cálculos
- `load_raster_match(raster, match_raster=ref_raster, resampling=resampling)` carrega array alinhado
- Salva em asset GeoTIFF via `save_raster_to_asset`
- Clona com `geometry=ref_raster.geometry` e `id=gen_guid()`
- Tenta preservar `visualization_asset` do raster original

## Use Cases
1. **Automação**: Recebe um `raster` e um `ref_raster` de forma programática e escalável.
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
| `ref_raster` | — | Conforme especificação da operação |
| `resampling` | — | Conforme especificação da operação |

## Outcomes Esperados

- Raster geoespacial pronto para visualização e análises subsequentes.
- Dados de saída formatados e prontos para consumo por operações posteriores.
- Rastreabilidade completa via metadados do asset.

## Workflows Utilizados

- Operação atômica `match_raster_to_ref` — utilizada como componente de workflows maiores.

## APIs / Conectores

- **N/A**: Operação puramente computacional, sem dependências externas de API.

## Datasets / Fontes de Dados

- **Dados de entrada**: Fornecidos pelo usuário ou por operações anteriores no pipeline.

