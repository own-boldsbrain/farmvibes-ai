# Lista de Fluxos de Trabalho

Agrupamos os fluxos de trabalho do FarmVibes.AI nas seguintes categorias:

- **Ingestão de Dados (Data Ingestion)**: fluxos de trabalho que baixam e pré-processam dados de uma fonte específica, preparando-os para serem o ponto de partida para a maioria dos outros fluxos de trabalho na plataforma.
Isso inclui fontes de dados brutos (ex: Sentinel 1 e 2, LandSat, CropDataLayer), bem como o modelo de remoção de nuvens SpaceEye;
- **Processamento de Dados (Data Processing)**: fluxos de trabalho que transformam dados em diferentes tipos (ex: computação de índices NDVI/MSAVI/Metano, agregação de estatísticas de média/máximo/mínimo de rasters, agregação de séries temporais);
- **FarmAI**: fluxos de trabalho compostos (ingestão + processamento de dados) cujas saídas habilitam cenários de FarmAI (ex: predição de práticas de conservação, estimativa de sequestro de carbono no solo, identificação de vazamento de metano);
- **ForestAI**: fluxos de trabalho compostos (ingestão + processamento de dados) cujas saídas habilitam cenários de ForestAI (ex: detecção de mudanças florestais, estimativa de extensão florestal);
- **ML**: fluxos de trabalho relacionados a aprendizado de máquina para treinar, avaliar e inferir modelos dentro da plataforma FarmVibes.AI (ex: criação de conjunto de dados, inferência);

Abaixo está uma lista de todos os fluxos de trabalho disponíveis na plataforma FarmVibes.AI. Para cada um deles, fornecemos uma breve descrição e um link para a página de documentação correspondente.

---------

## data_ingestion

- [`admag/admag_seasonal_field` 📄](workflow_yaml/data_ingestion/admag/admag_seasonal_field.md): Gera SeasonalFieldInformation usando ADMAg (Microsoft Azure Data Manager for Agriculture).

- [`admag/prescriptions` 📄](workflow_yaml/data_ingestion/admag/prescriptions.md): Busca prescrições usando ADMAg (Microsoft Azure Data Manager for Agriculture).

- [`airbus/airbus_download` 📄](workflow_yaml/data_ingestion/airbus/airbus_download.md): Baixa imagens AirBus disponíveis para a geometria de entrada e intervalo de tempo.

- [`airbus/airbus_price` 📄](workflow_yaml/data_ingestion/airbus/airbus_price.md): Calcula o preço das imagens AirBus disponíveis para a geometria de entrada e intervalo de tempo.

- [`alos/alos_forest_extent_download` 📄](workflow_yaml/data_ingestion/alos/alos_forest_extent_download.md): Baixa o mapa de classificação floresta/não floresta do Advanced Land Observing Satellite (ALOS).

- [`alos/alos_forest_extent_download_merge` 📄](workflow_yaml/data_ingestion/alos/alos_forest_extent_download_merge.md): Baixa o mapa de classificação floresta/não floresta do Advanced Land Observing Satellite (ALOS) e o mescla em um único raster.

- [`bing/basemap_download` 📄](workflow_yaml/data_ingestion/bing/basemap_download.md): Baixa mapas base do Bing Maps.

- [`bing/basemap_download_merge` 📄](workflow_yaml/data_ingestion/bing/basemap_download_merge.md): Baixa mosaicos de mapa base do Bing Maps e os mescla em um único raster.

- [`cdl/download_cdl` 📄](workflow_yaml/data_ingestion/cdl/download_cdl.md): Baixa mapas de classes de cultivo nos EUA continentais para o intervalo de tempo de entrada.

- [`dem/download_dem` 📄](workflow_yaml/data_ingestion/dem/download_dem.md): Baixa mosaicos de mapa digital de elevação que intersectam com a geometria de entrada e o intervalo de tempo.

- [`gedi/download_gedi` 📄](workflow_yaml/data_ingestion/gedi/download_gedi.md): Baixa produtos GEDI para a região e intervalo de tempo de entrada.

- [`gedi/download_gedi_rh100` 📄](workflow_yaml/data_ingestion/gedi/download_gedi_rh100.md): Baixa produtos L2B GEDI e extrai variáveis RH100.

- [`glad/glad_forest_extent_download` 📄](workflow_yaml/data_ingestion/glad/glad_forest_extent_download.md): Baixa dados de extensão florestal do Global Land Analysis (GLAD).

- [`glad/glad_forest_extent_download_merge` 📄](workflow_yaml/data_ingestion/glad/glad_forest_extent_download_merge.md): Baixa os mosaicos dos dados florestais do Global Land Analysis (GLAD) que intersectam com a geometria e intervalo de tempo de entrada do usuário, e os mescla em um único raster.

- [`gnatsgo/download_gnatsgo` 📄](workflow_yaml/data_ingestion/gnatsgo/download_gnatsgo.md): Baixa dados raster do gNATSGO que intersectam com a geometria e intervalo de tempo de entrada.

- [`hansen/hansen_forest_change_download` 📄](workflow_yaml/data_ingestion/hansen/hansen_forest_change_download.md): Baixa e mescla rasters do Global Forest Change (Hansen) que intersectam a geometria/intervalo de tempo fornecidos pelo usuário.

- [`landsat/preprocess_landsat` 📄](workflow_yaml/data_ingestion/landsat/preprocess_landsat.md): Baixa e pré-processa mosaicos LANDSAT que intersectam com a geometria e o intervalo de tempo de entrada.

- [`modis/download_modis_surface_reflectance` 📄](workflow_yaml/data_ingestion/modis/download_modis_surface_reflectance.md): Baixa rasters de refletância de superfície de 8 dias do MODIS que intersectam com a geometria e intervalo de tempo de entrada.

- [`modis/download_modis_vegetation_index` 📄](workflow_yaml/data_ingestion/modis/download_modis_vegetation_index.md): Baixa produtos de índice de vegetação de 16 dias do MODIS que intersectam com a geometria e intervalo de tempo de entrada.

- [`naip/download_naip` 📄](workflow_yaml/data_ingestion/naip/download_naip.md): Baixa mosaicos NAIP que intersectam com a geometria e o intervalo de tempo de entrada.

- [`osm_road_geometries` 📄](workflow_yaml/data_ingestion/osm_road_geometries.md): Baixa a geometria das estradas para a região de entrada a partir do Open Street Maps.

- [`sentinel1/preprocess_s1` 📄](workflow_yaml/data_ingestion/sentinel1/preprocess_s1.md): Baixa e pré-processa mosaicos de imagens Sentinel-1 que intersectam com os produtos Sentinel-2 de entrada no intervalo de tempo informado.

- [`sentinel2/cloud_ensemble` 📄](workflow_yaml/data_ingestion/sentinel2/cloud_ensemble.md): Calcula a probabilidade de nuvens de um raster Sentinel-2 L2A usando um ensemble de cinco modelos de segmentação de nuvens.

- [`sentinel2/improve_cloud_mask` 📄](workflow_yaml/data_ingestion/sentinel2/improve_cloud_mask.md): Melhora as máscaras de nuvens mesclando a máscara de nuvens do produto com máscaras de nuvens e sombras computadas por modelos de segmentação de aprendizado de máquina.

- [`sentinel2/improve_cloud_mask_ensemble` 📄](workflow_yaml/data_ingestion/sentinel2/improve_cloud_mask_ensemble.md): Melhora as máscaras de nuvens mesclando a máscara de nuvens do produto com máscaras de nuvens e sombras computadas por um ensemble de modelos de segmentação de aprendizado de máquina.

- [`sentinel2/preprocess_s2` 📄](workflow_yaml/data_ingestion/sentinel2/preprocess_s2.md): Baixa e pré-processa imagens Sentinel-2 que cobrem a geometria e o intervalo de tempo de entrada.

- [`sentinel2/preprocess_s2_ensemble_masks` 📄](workflow_yaml/data_ingestion/sentinel2/preprocess_s2_ensemble_masks.md): Baixa e pré-processa imagens Sentinel-2 que cobrem a geometria e o intervalo de tempo de entrada, e calcula máscaras de nuvens melhoradas usando um ensemble de modelos de segmentação de nuvens e sombras.

- [`sentinel2/preprocess_s2_improved_masks` 📄](workflow_yaml/data_ingestion/sentinel2/preprocess_s2_improved_masks.md): Baixa e pré-processa imagens Sentinel-2 que cobrem a geometria e o intervalo de tempo de entrada, e calcula máscaras de nuvens melhoradas usando modelos de segmentação de nuvens e sombras.

- [`soil/soilgrids` 📄](workflow_yaml/data_ingestion/soil/soilgrids.md): Baixa informações de mapeamento digital de solo do SoilGrids para a geometria de entrada.

- [`soil/usda` 📄](workflow_yaml/data_ingestion/soil/usda.md): Baixa o raster de classificação de solo do USDA.

- [`spaceeye/spaceeye` 📄](workflow_yaml/data_ingestion/spaceeye/spaceeye.md): Executa o pipeline de remoção de nuvens SpaceEye, gerando imagens diárias livres de nuvens para a geometria e o intervalo de tempo de entrada.

- [`spaceeye/spaceeye_inference` 📄](workflow_yaml/data_ingestion/spaceeye/spaceeye_inference.md): Realiza a inferência do SpaceEye para gerar imagens diárias livres de nuvens dados os dados Sentinel e as máscaras de nuvens.

- [`spaceeye/spaceeye_interpolation` 📄](workflow_yaml/data_ingestion/spaceeye/spaceeye_interpolation.md): Executa o pipeline de remoção de nuvens SpaceEye usando um algoritmo baseado em interpolação, gerando imagens diárias livres de nuvens para a geometria e o intervalo de tempo de entrada.

- [`spaceeye/spaceeye_interpolation_inference` 📄](workflow_yaml/data_ingestion/spaceeye/spaceeye_interpolation_inference.md): Realiza interpolação temporal amortecida para gerar imagens diárias livres de nuvens dados os dados Sentinel-2 e as máscaras de nuvens.

- [`spaceeye/spaceeye_preprocess` 📄](workflow_yaml/data_ingestion/spaceeye/spaceeye_preprocess.md): Executa o pipeline de pré-processamento do SpaceEye.

- [`spaceeye/spaceeye_preprocess_ensemble` 📄](workflow_yaml/data_ingestion/spaceeye/spaceeye_preprocess_ensemble.md): Executa o pipeline de pré-processamento do SpaceEye com um ensemble de modelos de segmentação de nuvens.

- [`user_data/ingest_geometry` 📄](workflow_yaml/data_ingestion/user_data/ingest_geometry.md): Adiciona geometrias do usuário no armazenamento do cluster, permitindo que sejam usadas em fluxos de trabalho.

- [`user_data/ingest_raster` 📄](workflow_yaml/data_ingestion/user_data/ingest_raster.md): Adiciona rasters do usuário no armazenamento do cluster, permitindo que sejam usados em fluxos de trabalho.

- [`user_data/ingest_smb` 📄](workflow_yaml/data_ingestion/user_data/ingest_smb.md): Adiciona rasters do usuário no armazenamento do cluster a partir de um compartilhamento SMB, permitindo que sejam usados em fluxos de trabalho.

- [`weather/download_chirps` 📄](workflow_yaml/data_ingestion/weather/download_chirps.md): Baixa dados de precipitação acumulada do conjunto de dados CHIRPS.

- [`weather/download_era5` 📄](workflow_yaml/data_ingestion/weather/download_era5.md): Variáveis meteorológicas estimadas de hora em hora.

- [`weather/download_era5_monthly` 📄](workflow_yaml/data_ingestion/weather/download_era5_monthly.md): Variáveis meteorológicas estimadas mensalmente.

- [`weather/download_gridmet` 📄](workflow_yaml/data_ingestion/weather/download_gridmet.md): Propriedades meteorológicas de superfície diárias do GridMET.

- [`weather/download_herbie` 📄](workflow_yaml/data_ingestion/weather/download_herbie.md): Baixa dados de previsão para a localização e intervalo de tempo fornecidos usando o pacote python herbie.

- [`weather/download_terraclimate` 📄](workflow_yaml/data_ingestion/weather/download_terraclimate.md): Propriedades climáticas e hidroclimáticas mensais do TerraClimate.

- [`weather/get_ambient_weather` 📄](workflow_yaml/data_ingestion/weather/get_ambient_weather.md): Baixa dados meteorológicos de uma estação Ambient Weather.

- [`weather/get_forecast` 📄](workflow_yaml/data_ingestion/weather/get_forecast.md): Baixa dados de previsão do tempo do NOAA Global Forecast System (GFS) para o intervalo de tempo de entrada.

- [`weather/herbie_forecast` 📄](workflow_yaml/data_ingestion/weather/herbie_forecast.md): Baixa observações de previsão para a localização e intervalo de tempo fornecidos usando o pacote python herbie.


## data_processing

- [`chunk_onnx/chunk_onnx` 📄](workflow_yaml/data_processing/chunk_onnx/chunk_onnx.md): Executa um modelo Onnx sobre todos os rasters na entrada para produzir um único raster.

- [`chunk_onnx/chunk_onnx_sequence` 📄](workflow_yaml/data_processing/chunk_onnx/chunk_onnx_sequence.md): Executa um modelo Onnx sobre todos os rasters na entrada para produzir um único raster.

- [`clip/clip` 📄](workflow_yaml/data_processing/clip/clip.md): Realiza um recorte (clip) em um raster de entrada baseado em uma geometria de referência fornecida.

- [`gradient/raster_gradient` 📄](workflow_yaml/data_processing/gradient/raster_gradient.md): Computa o gradiente de cada banda do raster de entrada com um operador Sobel.

- [`heatmap/classification` 📄](workflow_yaml/data_processing/heatmap/classification.md): Utiliza imagens de satélite Sentinel-2 de entrada e amostras de sensores como dados rotulados que contêm informações de nutrientes (Nitrogênio, Carbono, pH, Fósforo) para treinar um modelo usando o classificador Random Forest. A operação de inferência prediz os nutrientes no solo para o limite da fazenda escolhido.


- [`index/index` 📄](workflow_yaml/data_processing/index/index.md): Computa um índice a partir das bandas de um raster de entrada.

- [`linear_trend/chunked_linear_trend` 📄](workflow_yaml/data_processing/linear_trend/chunked_linear_trend.md): Computa a tendência linear pixel a pixel de uma lista de rasters (ex: NDVI).

- [`merge/match_merge_to_ref` 📄](workflow_yaml/data_processing/merge/match_merge_to_ref.md): Reamostra rasters de entrada para a grade dos rasters de referência.

- [`outlier/detect_outlier` 📄](workflow_yaml/data_processing/outlier/detect_outlier.md): Ajusta um Modelo de Mistura Gaussiana (GMM) de componente único sobre os dados de entrada para detectar valores atípicos (outliers) de acordo com o parâmetro de limiar (threshold).

- [`threshold/threshold_raster` 📄](workflow_yaml/data_processing/threshold/threshold_raster.md): Aplica limiar (threshold) nos valores do raster de entrada se forem maiores que o parâmetro de limiar.

- [`timeseries/timeseries_aggregation` 📄](workflow_yaml/data_processing/timeseries/timeseries_aggregation.md): Computa a média, desvio padrão, valores máximo e mínimo de todas as regiões do raster e os agrega em uma série temporal.

- [`timeseries/timeseries_masked_aggregation` 📄](workflow_yaml/data_processing/timeseries/timeseries_masked_aggregation.md): Computa a média, desvio padrão, valores máximo e mínimo de todas as regiões do raster consideradas pela máscara e os agrega em uma série temporal.


## farm_ai

- [`agriculture/canopy_cover` 📄](workflow_yaml/farm_ai/agriculture/canopy_cover.md): Estima a cobertura do dossel pixel a pixel para uma região e data.

- [`agriculture/change_detection` 📄](workflow_yaml/farm_ai/agriculture/change_detection.md): Identifica mudanças/outliers no NDVI através das datas.

- [`agriculture/emergence_summary` 📄](workflow_yaml/farm_ai/agriculture/emergence_summary.md): Calcula estatísticas de emergência usando MSAVI com limiar (média, desvio padrão, máximo e mínimo) para a geometria e intervalo de tempo de entrada.

- [`agriculture/green_house_gas_fluxes` 📄](workflow_yaml/farm_ai/agriculture/green_house_gas_fluxes.md): Computa fluxos de gases de efeito estufa (Green House Fluxes) para uma região e intervalo de datas.

- [`agriculture/heatmap_using_classification` 📄](workflow_yaml/farm_ai/agriculture/heatmap_using_classification.md): O fluxo de trabalho gera um mapa de calor de nutrientes para amostras fornecidas pelo usuário baixando as amostras da entrada do usuário.

- [`agriculture/heatmap_using_classification_admag` 📄](workflow_yaml/farm_ai/agriculture/heatmap_using_classification_admag.md): Este fluxo de trabalho integra a API ADMAG para baixar prescrições e gerar mapas de calor.

- [`agriculture/heatmap_using_neighboring_data_points` 📄](workflow_yaml/farm_ai/agriculture/heatmap_using_neighboring_data_points.md): Cria mapas de calor usando os vizinhos realizando operações de interpolação espacial. Utiliza informações do solo coletadas em locais ideais de sensores/amostras e imagens de satélite Sentinel baixadas.

- [`agriculture/methane_index` 📄](workflow_yaml/farm_ai/agriculture/methane_index.md): Computa o índice de metano de ultra-emissores para uma região e intervalo de datas.

- [`agriculture/ndvi_summary` 📄](workflow_yaml/farm_ai/agriculture/ndvi_summary.md): Calcula estatísticas de NDVI (média, desvio padrão, máximo e mínimo) para a geometria e intervalo de tempo de entrada.

- [`agriculture/weed_detection` 📄](workflow_yaml/farm_ai/agriculture/weed_detection.md): Gera arquivos shapefile para regiões de cores semelhantes no raster de entrada.

- [`carbon_local/admag_carbon_integration` 📄](workflow_yaml/farm_ai/carbon_local/admag_carbon_integration.md): Computa a quantidade de compensação de carbono que seria sequestrada em um campo sazonal usando dados do Microsoft Azure Data Manager for Agriculture (ADMAg).

- [`carbon_local/carbon_whatif` 📄](workflow_yaml/farm_ai/carbon_local/carbon_whatif.md): Computa a quantidade de compensação de carbono que seria sequestrada em um campo sazonal usando as informações de linha de base (histórica) e de cenário (intervalo de tempo de interesse).

- [`land_cover_mapping/conservation_practices` 📄](workflow_yaml/farm_ai/land_cover_mapping/conservation_practices.md): Identifica práticas de conservação (terraços e canais gramados) usando dados de elevação.

- [`land_degradation/landsat_ndvi_trend` 📄](workflow_yaml/farm_ai/land_degradation/landsat_ndvi_trend.md): Estima uma tendência linear sobre o NDVI computado em mosaicos LANDSAT que intersectam com a geometria e o intervalo de tempo de entrada.

- [`land_degradation/ndvi_linear_trend` 📄](workflow_yaml/farm_ai/land_degradation/ndvi_linear_trend.md): Computa a tendência linear de NDVI pixel a pixel sobre o raster de entrada.

- [`segmentation/auto_segment_basemap` 📄](workflow_yaml/farm_ai/segmentation/auto_segment_basemap.md): Baixa o mapa base com a API do BingMaps e executa a segmentação automática do Modelo Segment Anything (SAM) sobre eles.

- [`segmentation/auto_segment_s2` 📄](workflow_yaml/farm_ai/segmentation/auto_segment_s2.md): Baixa imagens Sentinel-2 e executa a segmentação automática do Modelo Segment Anything (SAM) sobre elas.

- [`segmentation/segment_basemap` 📄](workflow_yaml/farm_ai/segmentation/segment_basemap.md): Baixa o mapa base com a API do BingMaps e executa o Modelo Segment Anything (SAM) sobre eles com pontos e/ou caixas delimitadoras (bounding boxes) como prompts.

- [`segmentation/segment_s2` 📄](workflow_yaml/farm_ai/segmentation/segment_s2.md): Baixa imagens Sentinel-2 e executa o Modelo Segment Anything (SAM) sobre elas com pontos e/ou caixas delimitadoras (bounding boxes) como prompts.

- [`sensor/optimal_locations` 📄](workflow_yaml/farm_ai/sensor/optimal_locations.md): Identifica locais ideais realizando operação de agrupamento (clustering) usando o Modelo de Mistura Gaussiana em índices de raster computados.

- [`water/irrigation_classification` 📄](workflow_yaml/farm_ai/water/irrigation_classification.md): Desenvolve um mapa de probabilidade de irrigação de 30m pixel a pixel.


## forest_ai

- [`deforestation/alos_trend_detection` 📄](workflow_yaml/forest_ai/deforestation/alos_trend_detection.md): Detecta tendências de aumento/redução nos níveis de pixels de floresta sobre a geometria e intervalo de tempo de entrada do usuário para o mapa florestal ALOS.

- [`deforestation/ordinal_trend_detection` 📄](workflow_yaml/forest_ai/deforestation/ordinal_trend_detection.md): Detecta tendências de aumento/redução nos níveis de pixels sobre a geometria e intervalo de tempo de entrada do usuário.


## ml

- [`crop_segmentation` 📄](workflow_yaml/ml/crop_segmentation.md): Executa um modelo de segmentação de cultura baseado no NDVI de imagens SpaceEye ao longo do ano.

- [`dataset_generation/datagen_crop_segmentation` 📄](workflow_yaml/ml/dataset_generation/datagen_crop_segmentation.md): Gera um conjunto de dados para segmentação de cultura, baseado no raster NDVI e nos mapas de Crop Data Layer (CDL).

- [`driveway_detection` 📄](workflow_yaml/ml/driveway_detection.md): Detecta entradas de garagem (driveways) na frente das casas.

- [`segment_anything/automatic_segmentation` 📄](workflow_yaml/ml/segment_anything/automatic_segmentation.md): Executa uma segmentação automática do Modelo Segment Anything (SAM) sobre rasters de entrada.

- [`segment_anything/prompt_segmentation` 📄](workflow_yaml/ml/segment_anything/prompt_segmentation.md): Executa o Modelo Segment Anything (SAM) sobre rasters de entrada com pontos e/ou caixas delimitadoras (bounding boxes) como prompts.

- [`spectral_extension` 📄](workflow_yaml/ml/spectral_extension.md): Gera bandas Sentinel-2 de alta resolução combinando dados de VANT (UAV) e Sentinel-2.


