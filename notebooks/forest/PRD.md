# JTBDs (forest)

## JTBDs
1. Baixar mapas de cobertura florestal de diferentes fontes (ALOS, GLAD, Hansen)
2. Detectar mudanças na cobertura florestal ao longo do tempo
3. Realizar teste estatístico de tendência (Cochran-Armitage) em mudanças florestais

## Descrição
Conjunto de 4 notebooks para download e análise de dados florestais. Três notebooks focam no download de mapas de extensão florestal de fontes distintas: ALOS PALSAR (mosaico anual), GLAD (UMD) e Hansen (perda florestal global). O quarto notebook executa detecção de mudanças florestais usando mapas ALOS, aplicando recodificação de pixels, teste de tendência de Cochran-Armitage e geração de mapas ordinais de mudança.

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

## Workflows Utilizados
- data_ingestion/alos/alos_forest_extent_download_merge
- data_ingestion/glad/glad_forest_extent_download_merge
- data_ingestion/hansen/hansen_download
- forest_ai/deforestation/forest_change_detection
