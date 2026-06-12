# JTBDs (forest)

## JTBDs

1. Baixar mapas de cobertura florestal de diferentes fontes (ALOS, GLAD, Hansen)
2. Detectar mudanças na cobertura florestal ao longo do tempo
3. Realizar teste estatístico de tendência (Cochran-Armitage) em mudanças florestais

## Descrição

Conjunto de 4 notebooks para download e análise de dados florestais. Três notebooks focam no download de mapas de extensão florestal de fontes distintas: ALOS PALSAR (mosaico anual), GLAD (UMD) e Hansen (perda florestal global). O quarto notebook executa detecção de mudanças florestais usando mapas ALOS, aplicando recodificação de pixels, teste de tendência de Cochran-Armitage e geração de mapas ordinais de mudança.

## Use Cases

1. **Monitoramento de desmatamento**: Uma ONG ambiental detecta áreas de perda florestal entre anos usando múltiplas fontes de dados.
2. **Verificação de compliance**: Um órgão regulador avalia tendências de desmatamento em propriedades rurais.
3. **Pesquisa em ecologia**: Um pesquisador compara acurácia de diferentes mapas florestais (ALOS, GLAD, Hansen).

## Faz / Não Faz

- **Faz**: Download de mapas florestais ALOS PALSAR, GLAD e Hansen.
- **Faz**: Detecção de mudanças florestais com recodificação de pixels.
- **Faz**: Teste estatístico de tendência (Cochran-Armitage).
- **Não Faz**: Não faz segmentação de desmatamento por causa (natural vs. antrópica).
- **Não Faz**: Depende de cobertura das fontes (não cobre todas as regiões do globo).

## Notebooks

- download_alos_forest_map.ipynb: Download e visualização do mapa florestal ALOS PALSAR
- download_glad_forest_map.ipynb: Download e visualização do mapa florestal GLAD
- download_hansen_forest_map.ipynb: Download das camadas Hansen (treecover2000, gain, lossyear)
- forest_change_detection.ipynb: Detecção de mudanças florestais com mapas ALOS e teste de tendência

## Inputs

- Geometria de interesse (WKT)
- Período de tempo
- Planetary Computer API key
- layer_name (Hansen: treecover2000, gain, lossyear)
- Parâmetros de recodificação (from_values, to_values)

## Outputs

- Raster de extensão florestal (ALOS, GLAD, Hansen)
- Mapas de perda florestal por ano (Hansen)
- Mapa ordinal de mudança + tabela de contingência
- Resultado do teste Cochran-Armitage

## Variáveis

| Variável | Tipo | Descrição |
|----------|------|-----------|
| `pc_key` | string | Chave de API do Planetary Computer |
| `layer_name` | string | Camada Hansen (treecover2000, gain, lossyear) |
| `from_values` | list | Valores originais para recodificação |
| `to_values` | list | Novos valores após recodificação |

## Lógicas / Cálculos

1. `alos_forest_extent_download_merge` — Download e mosaicagem de mapas florestais ALOS PALSAR (anual).
2. `glad_forest_extent_download_merge` — Download e mosaicagem de mapas florestais GLAD.
3. `hansen_download` — Download de camadas Hansen (treecover2000, gain, lossyear).
4. `forest_change_detection` — Recodificação de pixels ALOS, teste de tendência Cochran-Armitage, geração de mapa ordinal de mudança.

## Outcomes Esperados

- Mapas de extensão florestal de múltiplas fontes para cruzamento e validação.
- Detecção de mudanças florestais com significância estatística.
- Série temporal de perda florestal por ano (Hansen).

## APIs / Conectores

- **ALOS PALSAR**: Mosaico anual de radar florestal (JAXA).
- **GLAD**: Global Land Analysis & Discovery (UMD).
- **Hansen**: Global Forest Change (UMD/Google).
- **Planetary Computer API**: Acesso a datasets.

## Datasets / Fontes de Dados

- ALOS PALSAR: mosaico anual de florestas (25m).
- GLAD: extensão florestal global (30m).
- Hansen: treecover2000, gain, lossyear (30m).

## Workflows Utilizados

- data_ingestion/alos/alos_forest_extent_download_merge
- data_ingestion/glad/glad_forest_extent_download_merge
- data_ingestion/hansen/hansen_download
- forest_ai/deforestation/forest_change_detection
