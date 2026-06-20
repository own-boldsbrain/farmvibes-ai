# Índice de PRDs — FarmVibes.AI + YSH-Packages

> **Documento**: `PRD_INDEX.md`  
> **Propósito**: Catalogar e sumarizar todos os documentos PRD (Product Requirements Document) espalhados pelo repositório.  
> **Total de PRDs encontrados**: **182**  
> **Última atualização**: 2026-06-11

---

## Sumário Executivo

Este índice centraliza a localização e o propósito de cada um dos 182 arquivos `PRD.md` presentes no repositório FarmVibes.AI / YSH-Packages. Os PRDs estão distribuídos em três grandes áreas: **workflows** (42 PRDs — orquestração de pipelines completos), **src** (22 PRDs — pacotes de biblioteca, agente, servidor e testes) e **ops** (118 PRDs — operações atômicas de download, processamento, listagem e merge de dados geoespaciais e agronômicos). O objetivo é facilitar a navegação, evitar duplicação de esforço e manter a rastreabilidade entre requisitos de produto e implementação.

---

## Estrutura do Repositório

```bash
farmvibes-ai/
├── workflows/                   # 42 PRDs — Pipelines completos (data ingestion, processing, farm_ai, forest_ai, ml)
│   ├── data_ingestion/          #   ingestão de satélite, solo, clima, usuário
│   ├── data_processing/         #   clip, gradient, heatmap, index, merge, outlier, threshold, timeseries
│   ├── farm_ai/                 #   agricultura, carbon, land_cover, land_degradation, segmentation, sensor, water
│   ├── forest_ai/               #   deforestation
│   └── ml/                      #   dataset_generation, segment_anything
│
├── src/                         # 22 PRDs — Pacotes Python e submódulos internos
│   ├── tests/                   #   testes gerais
│   ├── vibe_agent/              #   agente + storage
│   ├── vibe_common/             #   commons + workflow
│   ├── vibe_core/               #   core: CLI, data, terraform, testing
│   ├── vibe_dev/                #   dev: client, testing
│   ├── vibe_lib/                #   libs: comet_farm, deepmc, spaceeye
│   ├── vibe_notebook/           #   notebooks + deepmc
│   └── vibe_server/             #   servidor + workflow/runner
│
└── ops/                         # 118 PRDs — Operações atômicas (download, list, compute, raster, merge, sequence, ML)
    ├── download_*               #   download de fontes externas (satélite, clima, solo, DEM, etc.)
    ├── list_*                   #   listagem/catálogo de produtos disponíveis
    ├── compute_*                #   computação de índices, máscaras, frações, probabilidades
    ├── group_* / merge_*        #   agrupamento e merge de orbitas, rasters, geometrias
    └── demais operações         #   chunk, clip, stack, segment, detect, filter, trend, etc.
```

---

## Lista Completa de PRDs por Diretório

### a) Workflows (`workflows/`) — 42 PRDs

| Diretório                                 | Nº JTBDs | Tipo / Descrição Curta                       |
| ----------------------------------------- | -------- | -------------------------------------------- |
| `workflows/`                              | ~5-8     | PRD raiz: visão geral dos workflows          |
| `workflows/data_ingestion/`               | ~5-8     | Orquestração geral de ingestão               |
| `workflows/data_ingestion/admag/`         | ~5-8     | Ingestão de dados ADMAG                      |
| `workflows/data_ingestion/airbus/`        | ~5-8     | Ingestão de imagens Airbus                   |
| `workflows/data_ingestion/alos/`          | ~5-8     | Ingestão de dados ALOS                       |
| `workflows/data_ingestion/bing/`          | ~5-8     | Ingestão de basemap Bing                     |
| `workflows/data_ingestion/cdl/`           | ~5-8     | Ingestão de CDL (crop data layer)            |
| `workflows/data_ingestion/dem/`           | ~5-8     | Ingestão de modelos digitais de elevação     |
| `workflows/data_ingestion/gedi/`          | ~5-8     | Ingestão de dados GEDI                       |
| `workflows/data_ingestion/glad/`          | ~5-8     | Ingestão de dados GLAD                       |
| `workflows/data_ingestion/gnatsgo/`       | ~5-8     | Ingestão de dados GNATSGO                    |
| `workflows/data_ingestion/hansen/`        | ~5-8     | Ingestão de dados Hansen                     |
| `workflows/data_ingestion/landsat/`       | ~5-8     | Ingestão de imagens Landsat                  |
| `workflows/data_ingestion/modis/`         | ~5-8     | Ingestão de dados MODIS                      |
| `workflows/data_ingestion/naip/`          | ~5-8     | Ingestão de imagens NAIP                     |
| `workflows/data_ingestion/sentinel1/`     | ~5-8     | Ingestão de imagens Sentinel-1               |
| `workflows/data_ingestion/sentinel2/`     | ~5-8     | Ingestão de imagens Sentinel-2               |
| `workflows/data_ingestion/soil/`          | ~5-8     | Ingestão de dados de solo                    |
| `workflows/data_ingestion/spaceeye/`      | ~5-8     | Ingestão de dados SpaceEye                   |
| `workflows/data_ingestion/user_data/`     | ~5-8     | Ingestão de dados do usuário                 |
| `workflows/data_ingestion/weather/`       | ~5-8     | Ingestão de dados meteorológicos             |
| `workflows/data_processing/chunk_onnx/`   | ~5-8     | Processamento: chunking ONNX                 |
| `workflows/data_processing/clip/`         | ~5-8     | Processamento: recorte de rasters            |
| `workflows/data_processing/gradient/`     | ~5-8     | Processamento: cálculo de gradiente          |
| `workflows/data_processing/heatmap/`      | ~5-8     | Processamento: geração de heatmap            |
| `workflows/data_processing/index/`        | ~5-8     | Processamento: índices espectrais            |
| `workflows/data_processing/linear_trend/` | ~5-8     | Processamento: tendência linear temporal     |
| `workflows/data_processing/merge/`        | ~5-8     | Processamento: merge de rasters              |
| `workflows/data_processing/outlier/`      | ~5-8     | Processamento: detecção de outliers          |
| `workflows/data_processing/threshold/`    | ~5-8     | Processamento: limiarização                  |
| `workflows/data_processing/timeseries/`   | ~5-8     | Processamento: séries temporais              |
| `workflows/farm_ai/agriculture/`          | ~5-8     | Agricultura: práticas agrícolas              |
| `workflows/farm_ai/carbon_local/`         | ~5-8     | Agricultura: estimativa local de carbono     |
| `workflows/farm_ai/land_cover_mapping/`   | ~5-8     | Agricultura: mapeamento de cobertura do solo |
| `workflows/farm_ai/land_degradation/`     | ~5-8     | Agricultura: degradação do solo              |
| `workflows/farm_ai/segmentation/`         | ~5-8     | Agricultura: segmentação de imagens          |
| `workflows/farm_ai/sensor/`               | ~5-8     | Agricultura: dados de sensores               |
| `workflows/farm_ai/water/`                | ~5-8     | Agricultura: recursos hídricos               |
| `workflows/forest_ai/deforestation/`      | ~5-8     | Florestal: detecção de desmatamento          |
| `workflows/ml/`                           | ~5-8     | ML: visão geral de machine learning          |
| `workflows/ml/dataset_generation/`        | ~5-8     | ML: geração de datasets para treinamento     |
| `workflows/ml/segment_anything/`          | ~5-8     | ML: segmentação SAM (Segment Anything Model) |

---

### b) Src Packages (`src/`) — 8 PRDs

| Diretório            | Nº JTBDs | Tipo / Descrição Curta                       |
| -------------------- | -------- | -------------------------------------------- |
| `src/tests/`         | ~5-8     | Testes gerais do ecossistema                 |
| `src/vibe_agent/`    | ~5-8     | Agente interno: execução de tarefas          |
| `src/vibe_common/`   | ~5-8     | Biblioteca comum: utilitários compartilhados |
| `src/vibe_core/`     | ~5-8     | Core: modelos de dados, CLI, infraestrutura  |
| `src/vibe_dev/`      | ~5-8     | Ferramentas de desenvolvimento               |
| `src/vibe_lib/`      | ~5-8     | Bibliotecas externas e integrações           |
| `src/vibe_notebook/` | ~5-8     | Suporte a Jupyter notebooks                  |
| `src/vibe_server/`   | ~5-8     | Servidor: API e execução de workflows        |

---

### c) Src Subdiretórios (`src/*/vibe_*/*`) — 14 PRDs

| Diretório                                      | Nº JTBDs | Tipo / Descrição Curta                 |
| ---------------------------------------------- | -------- | -------------------------------------- |
| `src/vibe_agent/vibe_agent/storage/`           | ~5-8     | Armazenamento do agente                |
| `src/vibe_common/vibe_common/workflow/`        | ~5-8     | Definição e execução de workflows      |
| `src/vibe_core/vibe_core/cli/`                 | ~5-8     | Interface de linha de comando          |
| `src/vibe_core/vibe_core/data/`                | ~5-8     | Modelos e estruturas de dados          |
| `src/vibe_core/vibe_core/terraform/`           | ~5-8     | Infraestrutura como código (Terraform) |
| `src/vibe_core/vibe_core/testing/`             | ~5-8     | Frameworks e utilities de teste        |
| `src/vibe_dev/vibe_dev/client/`                | ~5-8     | Cliente de desenvolvimento             |
| `src/vibe_dev/vibe_dev/testing/`               | ~5-8     | Utilitários de teste para dev          |
| `src/vibe_lib/vibe_lib/comet_farm/`            | ~5-8     | Integração com Comet.Farm              |
| `src/vibe_lib/vibe_lib/deepmc/`                | ~5-8     | Integração com DeepMC                  |
| `src/vibe_lib/vibe_lib/spaceeye/`              | ~5-8     | Integração com SpaceEye                |
| `src/vibe_notebook/vibe_notebook/deepmc/`      | ~5-8     | DeepMC em notebooks                    |
| `src/vibe_server/vibe_server/workflow/`        | ~5-8     | Gerenciamento de workflows no servidor |
| `src/vibe_server/vibe_server/workflow/runner/` | ~5-8     | Runner de workflows                    |

---

### d) Operações (`ops/`) — 118 PRDs

| Diretório                                    | Nº JTBDs | Tipo / Descrição Curta                        |
| -------------------------------------------- | -------- | --------------------------------------------- |
| **Download (30)**                            |          |                                               |
| `ops/admag/`                                 | ~5-8     | Download de dados ADMAG                       |
| `ops/download_airbus/`                       | ~5-8     | Download de imagens Airbus                    |
| `ops/download_alos/`                         | ~5-8     | Download de dados ALOS                        |
| `ops/download_ambient_weather/`              | ~5-8     | Download de dados meteorológicos ambiente     |
| `ops/download_bing_basemap/`                 | ~5-8     | Download de basemap Bing                      |
| `ops/download_cdl_data/`                     | ~5-8     | Download de CDL (crop data layer)             |
| `ops/download_chirps/`                       | ~5-8     | Download de dados CHIRPS (precipitação)       |
| `ops/download_climatology_lab/`              | ~5-8     | Download de dados Climatology Lab             |
| `ops/download_dem/`                          | ~5-8     | Download de DEM (modelo digital de elevação)  |
| `ops/download_era5/`                         | ~5-8     | Download de reanálise ERA5                    |
| `ops/download_esri_landuse_landcover/`       | ~5-8     | Download de uso/cobertura do solo ESRI        |
| `ops/download_from_ref/`                     | ~5-8     | Download a partir de referência STAC          |
| `ops/download_from_smb/`                     | ~5-8     | Download a partir de share SMB                |
| `ops/download_gedi_product/`                 | ~5-8     | Download de produtos GEDI                     |
| `ops/download_glad_data/`                    | ~5-8     | Download de dados GLAD                        |
| `ops/download_gnatsgo/`                      | ~5-8     | Download de dados GNATSGO                     |
| `ops/download_hansen/`                       | ~5-8     | Download de dados Hansen                      |
| `ops/download_herbie/`                       | ~5-8     | Download de dados meteorológicos (Herbie)     |
| `ops/download_landsat_from_pc/`              | ~5-8     | Download de Landsat via Planetary Computer    |
| `ops/download_modis_sr/`                     | ~5-8     | Download de MODIS Surface Reflectance         |
| `ops/download_modis_vegetation/`             | ~5-8     | Download de MODIS Vegetation                  |
| `ops/download_naip/`                         | ~5-8     | Download de imagens NAIP                      |
| `ops/download_road_geometries/`              | ~5-8     | Download de geometrias de estradas            |
| `ops/download_sentinel1/`                    | ~5-8     | Download de Sentinel-1                        |
| `ops/download_sentinel1_grd/`                | ~5-8     | Download de Sentinel-1 GRD                    |
| `ops/download_sentinel2_from_pc/`            | ~5-8     | Download de Sentinel-2 via Planetary Computer |
| `ops/download_soilgrids/`                    | ~5-8     | Download de dados SoilGrids                   |
| `ops/download_stack_sentinel2/`              | ~5-8     | Download empilhado de Sentinel-2              |
| `ops/download_usda_soils/`                   | ~5-8     | Download de dados de solo USDA                |
| `ops/gfs_download/`                          | ~5-8     | Download de previsão GFS                      |
| **List (20)**                                |          |                                               |
| `ops/list_airbus_products/`                  | ~5-8     | Listagem de produtos Airbus disponíveis       |
| `ops/list_alos_products/`                    | ~5-8     | Listagem de produtos ALOS disponíveis         |
| `ops/list_bing_maps/`                        | ~5-8     | Listagem de mapas Bing disponíveis            |
| `ops/list_cdl_products/`                     | ~5-8     | Listagem de produtos CDL disponíveis          |
| `ops/list_chirps/`                           | ~5-8     | Listagem de dados CHIRPS disponíveis          |
| `ops/list_climatology_lab/`                  | ~5-8     | Listagem de dados Climatology Lab             |
| `ops/list_dem_products/`                     | ~5-8     | Listagem de produtos DEM disponíveis          |
| `ops/list_era5/`                             | ~5-8     | Listagem de dados ERA5 disponíveis            |
| `ops/list_esri_landuse_landcover/`           | ~5-8     | Listagem de dados ESRI LULC                   |
| `ops/list_gedi_products/`                    | ~5-8     | Listagem de produtos GEDI                     |
| `ops/list_glad_products/`                    | ~5-8     | Listagem de produtos GLAD                     |
| `ops/list_gnatsgo_products/`                 | ~5-8     | Listagem de produtos GNATSGO                  |
| `ops/list_hansen_products/`                  | ~5-8     | Listagem de produtos Hansen                   |
| `ops/list_herbie/`                           | ~5-8     | Listagem de dados Herbie                      |
| `ops/list_landsat_products_pc/`              | ~5-8     | Listagem de produtos Landsat (PC)             |
| `ops/list_modis_sr/`                         | ~5-8     | Listagem de MODIS Surface Reflectance         |
| `ops/list_modis_vegetation/`                 | ~5-8     | Listagem de MODIS Vegetation                  |
| `ops/list_naip_products/`                    | ~5-8     | Listagem de produtos NAIP                     |
| `ops/list_sentinel1_products/`               | ~5-8     | Listagem de produtos Sentinel-1               |
| `ops/list_sentinel2_products/`               | ~5-8     | Listagem de produtos Sentinel-2               |
| **Compute (15)**                             |          |                                               |
| `ops/compute_cloud_prob/`                    | ~5-8     | Computação de probabilidade de nuvem          |
| `ops/compute_cloud_water_mask/`              | ~5-8     | Máscara de água/nuvem                         |
| `ops/compute_conservation_practice/`         | ~5-8     | Detecção de práticas conservacionistas        |
| `ops/compute_evaporative_fraction/`          | ~5-8     | Fração evaporativa                            |
| `ops/compute_fcover/`                        | ~5-8     | Fração de cobertura vegetal                   |
| `ops/compute_ghg_fluxes/`                    | ~5-8     | Fluxos de gases de efeito estufa              |
| `ops/compute_illuminance/`                   | ~5-8     | Iluminância                                   |
| `ops/compute_index/`                         | ~5-8     | Índices espectrais genéricos                  |
| `ops/compute_irrigation_probability/`        | ~5-8     | Probabilidade de irrigação                    |
| `ops/compute_ngi_egi_layers/`                | ~5-8     | Camadas NGI/EGI                               |
| `ops/compute_onnx/`                          | ~5-8     | Inferência via modelo ONNX                    |
| `ops/compute_pixel_count/`                   | ~5-8     | Contagem de pixels                            |
| `ops/compute_raster_class_windowed_average/` | ~5-8     | Média janelada por classe de raster           |
| `ops/compute_raster_cluster/`                | ~5-8     | Clusterização de raster                       |
| `ops/compute_raster_gradient/`               | ~5-8     | Gradiente de raster                           |
| `ops/compute_shadow_prob/`                   | ~5-8     | Probabilidade de sombra                       |
| **Raster / Geometry (19)**                   |          |                                               |
| `ops/chunk_raster/`                          | ~5-8     | Fragmentação de raster em blocos              |
| `ops/clip_raster/`                           | ~5-8     | Recorte de raster por geometria               |
| `ops/combine_chunks/`                        | ~5-8     | Recomposição de chunks                        |
| `ops/create_raster_sequence/`                | ~5-8     | Criação de sequência temporal de rasters      |
| `ops/group_rasters_by_geometries/`           | ~5-8     | Agrupamento de rasters por geometria          |
| `ops/group_rasters_by_time/`                 | ~5-8     | Agrupamento de rasters por tempo              |
| `ops/group_tile_sequence/`                   | ~5-8     | Agrupamento de sequência de tiles             |
| `ops/match_raster_to_ref/`                   | ~5-8     | Casamento de raster a referência              |
| `ops/merge_cloud_masks/`                     | ~5-8     | Merge de máscaras de nuvem                    |
| `ops/merge_geometries/`                      | ~5-8     | Merge de geometrias                           |
| `ops/merge_geometry_and_time_range/`         | ~5-8     | Merge de geometria + intervalo temporal       |
| `ops/merge_rasters/`                         | ~5-8     | Merge de múltiplos rasters                    |
| `ops/pair_intersecting_rasters/`             | ~5-8     | Pareamento de rasters sobrepostos             |
| `ops/recode_raster/`                         | ~5-8     | Recodificação de valores de raster            |
| `ops/remove_clouds/`                         | ~5-8     | Remoção de nuvens                             |
| `ops/stack_landsat/`                         | ~5-8     | Empilhamento de bandas Landsat                |
| `ops/stack_sentinel2_bands/`                 | ~5-8     | Empilhamento de bandas Sentinel-2             |
| `ops/summarize_raster/`                      | ~5-8     | Sumarização estatística de raster             |
| `ops/threshold_raster/`                      | ~5-8     | Limiarização de raster                        |
| `ops/tile_sentinel1/`                        | ~5-8     | Tiling de imagens Sentinel-1                  |
| **Sequence / Select (8)**                    |          |                                               |
| `ops/group_sentinel1_orbits/`                | ~5-8     | Agrupamento de orbitas Sentinel-1             |
| `ops/group_sentinel2_orbits/`                | ~5-8     | Agrupamento de orbitas Sentinel-2             |
| `ops/list_to_sequence/`                      | ~5-8     | Conversão de lista em sequência               |
| `ops/merge_sentinel1_orbits/`                | ~5-8     | Merge de orbitas Sentinel-1                   |
| `ops/merge_sentinel2_orbits/`                | ~5-8     | Merge de orbitas Sentinel-2                   |
| `ops/select_necessary_coverage_items/`       | ~5-8     | Seleção de itens de cobertura necessários     |
| `ops/select_sequence/`                       | ~5-8     | Seleção de sub-sequência                      |
| `ops/split_sequence/`                        | ~5-8     | Divisão de sequência                          |
| **Time Series / Stats (6)**                  |          |                                               |
| `ops/aggregate_statistics_timeseries/`       | ~5-8     | Agregação estatística de séries temporais     |
| `ops/gfs_preprocess/`                        | ~5-8     | Pré-processamento de dados GFS                |
| `ops/linear_trend/`                          | ~5-8     | Tendência linear                              |
| `ops/ordinal_trend_test/`                    | ~5-8     | Teste ordinal de tendência                    |
| `ops/minimum_samples/`                       | ~5-8     | Amostragem mínima                             |
| `ops/read_grib_forecast/`                    | ~5-8     | Leitura de previsão em formato GRIB           |
| **ML / Detection (9)**                       |          |                                               |
| `ops/detect_driveway/`                       | ~5-8     | Detecção de estradas/acessos                  |
| `ops/detect_outliers/`                       | ~5-8     | Detecção de outliers                          |
| `ops/extract_protein_sequence/`              | ~5-8     | Extração de sequência de proteínas            |
| `ops/protlearn/`                             | ~5-8     | Aprendizado de proteínas                      |
| `ops/segment_anything/`                      | ~5-8     | Segmentação SAM                               |
| `ops/segment_anything_combine_masks/`        | ~5-8     | Combinação de máscaras SAM                    |
| `ops/segment_driveway/`                      | ~5-8     | Segmentação de acessos                        |
| `ops/weed_detection/`                        | ~5-8     | Detecção de ervas daninhas                    |
| **Outros (11)**                              |          |                                               |
| `ops/carbon_local/`                          | ~5-8     | Estimativa local de carbono                   |
| `ops/datavibe_filter/`                       | ~5-8     | Filtro DataVibe                               |
| `ops/ensemble_cloud_prob/`                   | ~5-8     | Ensemble de probabilidade de nuvem            |
| `ops/estimate_canopy_cover/`                 | ~5-8     | Estimativa de cobertura de dossel             |
| `ops/extract_gedi_rh100/`                    | ~5-8     | Extração de RH100 do GEDI                     |
| `ops/get_angles/`                            | ~5-8     | Cálculo de ângulos de imageamento             |
| `ops/heatmap_sensor/`                        | ~5-8     | Heatmap de sensores                           |
| `ops/helloworld/`                            | ~5-8     | Operação de exemplo/hello world               |
| `ops/price_airbus_products/`                 | ~5-8     | Precificação de produtos Airbus               |
| `ops/unpack_refs/`                           | ~5-8     | Desempacotamento de referências               |

---

## Estatísticas

| Categoria               | Quantidade | Abrangência                                                                                                                 |
| ----------------------- | ---------- | --------------------------------------------------------------------------------------------------------------------------- |
| **Workflows**           | 42         | Pipelines de ingestão, processamento, farm_ai, forest_ai e ML                                                               |
| **Src — Packages**      | 8          | Pacotes raiz: tests, vibe_agent, vibe_common, vibe_core, vibe_dev, vibe_lib, vibe_notebook, vibe_server                     |
| **Src — Subdiretórios** | 14         | Módulos internos: storage, CLI, data, terraform, testing, client, runner, integrações                                       |
| **Operações (ops)**     | 118        | Downloads (30), listagens (20), computes (16), raster/geometry (20), sequence (8), séries (6), ML/detecção (9), outros (11) |
| **Total**               | **182**    | Trabalho completo de documentação de requisitos de produto                                                                  |

> **Nota**: Os valores de "Nº JTBDs" nas tabelas são estimativas (~5-8 jobs-to-be-done por PRD), conforme convenção adotada pela equipe de produto. O total real de arquivos PRD.md encontrados no repositório é 182.
