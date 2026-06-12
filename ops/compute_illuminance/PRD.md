# JTBDs (compute_illuminance)

## JTBDs

1. Calcular iluminância média por banda de Sentinel-2
2. Filtrar cenas com pouca área limpa (muita nuvem)

## Descrição

Calcula o valor médio de iluminância para cada banda de um raster Sentinel-2, áreas com nuvem mascaradas, filtrando cenas com razão de pixels limpos abaixo do limiar.

## Inputs

- `rasters: List[Sentinel2Raster]` — rasters Sentinel-2
- `cloud_masks: List[Sentinel2CloudMask]` — máscaras de nuvem correspondentes
- Parâmetro: `num_workers` (padrão 6)

## Outputs

- `illuminance: List[RasterIlluminance]` — iluminância por banda

## Lógicas e Cálculos

- Para cada par raster/máscara: lê máscara, verifica razão de pixels limpos
- Se razão < `MIN_CLEAR_RATIO`, descarta a cena
- Para cada banda: lê dados, divide pelo fator de quantificação, calcula média mascarada
- Retorna apenas resultados não-nulos

## Use Cases
1. **Análise de Illuminance**: Gerar camada derivada de Illuminance para interpretação.
2. **Feature engineering**: Produzir insumos para modelos de machine learning.
3. **Monitoramento temporal**: Calcular o índice/variável para múltiplas datas e comparar.

## Faz / Não Faz

- **Faz**: Cálculo da variável/algoritmo sobre os dados de entrada.
- **Faz**: Parametrização configurável pelo usuário.
- **Não Faz**: Não valida os resultados contra dados de campo/ground truth.
- **Não Faz**: Não modifica o raster de entrada — gera novo raster de saída.

## Variáveis

| Variável | Tipo | Descrição |
|----------|------|-----------|
| `rasters: List[Sentinel2Raster]` | — | Conforme especificação da operação |
| `cloud_masks: List[Sentinel2CloudMask]` | — | Conforme especificação da operação |
| `num_workers` | — | Conforme especificação da operação |

## Outcomes Esperados

- Raster geoespacial pronto para visualização e análises subsequentes.
- Lista de produtos disponíveis com metadados completos.
- Estrutura de dados organizada para encadeamento em workflows.

## Workflows Utilizados

- Operação atômica `compute_illuminance` — utilizada como componente de workflows maiores.

## APIs / Conectores

- **Copernicus Open Access Hub (SciHub)**: Dados Sentinel.

## Datasets / Fontes de Dados

- **Sentinel-2 (MSI)**: Reflectância de superfície, 10-60m, 13 bandas.

