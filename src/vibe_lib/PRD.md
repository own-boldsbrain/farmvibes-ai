# PRD — vibe_lib

## 1. Nome do Módulo

**vibe_lib** — Biblioteca de integração com fontes de dados geoespaciais e algoritmos de sensoriamento remoto.

## 2. JTBDs (Jobs To Be Done)

- Autenticar e extrair dados de provedores de imagens de satélite (Airbus, Planetary Computer, Bing Maps)
- Baixar e processar séries temporais de variáveis climáticas (TerraClimate, GridMET, GFS)
- Calcular métricas estatísticas zonais sobre rasters e geojsons
- Executar modelos de machine learning (SAM, DeepMC, Gaussian Mixture, SpaceEye)
- Realizar operações raster (merge, composite, crop, mask, reprojeção)
- Manipular geometrias (validação, formatação, conversão GeoJSON/CQL2)
- Processar alertas de desmatamento (GLAD) e estimativas de carbono (COMET-Farm)

## 3. Casos de Uso

| Caso de Uso | Descrição |
|---|---|
| Download de imagem Airbus | Cliente autentica via OAuth2, busca produtos por geometria/período e baixa assets |
| Fusão SAR-Óptico (SpaceEye) | Gera chips de dataset com correção de iluminação e interpolação |
| Segmentação de cultivos (SAM) | Executa Segment Anything Model sobre raster de entrada |
| Previsão DeepMC | Codifica séries históricas com LSTM/CNN e aplica transfer learning |
| Estatística zonal | Calcula média/mediana/histograma de raster sobre polígonos |
| Alerta GLAD | Consulta API de alertas de desmatamento global |
| Cenário de carbono COMET | Gera recomendações de manejo com estimativas de sequestro |
| Clustering geoespacial | Aplica Gaussian Mixture ou overlap clustering em geometrias |
| Previsão meteorológica GFS | Obtém e processa blobs de forecast do modelo GFS |
| KDE / Heatmap | Gera mapas de densidade kernel a partir de pontos |

## 4. Faz / Não Faz

**Faz:**
- Integra com APIs externas (Airbus, Planetary Computer, Bing, COMET, GLAD, EarthData)
- Executa modelos de ML embarcados (SAM, DeepMC, GMM)
- Realiza operações de rasterio e shapely para processamento geoespacial
- Trata autenticação e refresh de tokens automaticamente
- Suporta cache local de dados baixados

**Não Faz:**
- Não expõe API HTTP própria
- Não gerencia execução de workflows (responsabilidade do vibe_server/vibe_dev)
- Não persiste resultados em banco de dados
- Não implementa interface de usuário

## 5. Users Inputs / Outputs

| Input | Output |
|---|---|
| Geometria (GeoJSON) + período + coleção STAC | Itens STAC do Planetary Computer |
| Credenciais Airbus + bbox | Lista de produtos Airbus |
| Raster + geojson de polígonos | DataFrame com estatísticas zonais |
| Imagem TIFF + prompt SAM | Máscaras de segmentação em npy |
| Dados meteorológicos históricos | Previsão DeepMC (encoder + modelo) |
| Pontos + peso | Heatmap KDE em grade raster |
| Coordenadas + data | Cenas SpaceEye (SAR + óptico fusionadas) |

## 6. System Outputs

- `xarray.Dataset` ou `xarray.DataArray` para dados raster e séries temporais
- `np.ndarray` para máscaras SAM, embeddings DeepMC, heatmaps
- `pd.DataFrame` para estatísticas zonais e cenários COMET
- `dict` ou `GeoJSON` para geometrias, alertas GLAD, metadados de produtos
- Arquivos TIFF/PNG baixados via Airbus, Bing Maps ou Planetary Computer

## 7. Outcomes Esperados

- Redução de tempo de integração com novas fontes de dados
- Reuso de algoritmos de sensoriamento remoto entre workflows
- Execução confiável de modelos ML em pipelines de produção
- Rastreabilidade de dados via STAC (SpatioTemporal Asset Catalog)

## 8. APIs / Endpoints

Biblioteca Python — não expõe endpoints HTTP. Interfaces principais:

- `AirbusClient` — `get_products()`, `get_product_by_id()`, `download_asset()`, `fetch_asset_download_urls()`
- `PlanetaryComputerClient` — `search_items()`
- `BingMapsClient` — `fetch_static_map()`, `fetch_imagery_metadata()`
- `CometFarmClient` — `create_scenario()`, `get_recommendation()`, `get_farms()`
- `GladClient` — `get_alerts()`
- `SegmentAnythingClient` — `run_npy()`, `run_tiff()`
- `DeepMCTrainer` / `DeepMCPredictor` — `train()`, `predict()`
- `SpaceEyeDataset` — geração de chips, cálculo de iluminação, interpolação
- `GaussianMixture` / `OverlapClustering` — `fit_predict()`
- `raster.merge_rasters()`, `raster.composite()`, `raster.crop_raster()`
- `stats.zonal_stats()`, `stats.histogram()`
- `geometry.validate()`, `geometry.to_feature_collection()`

## 9. CRUD

| Operação | Entidade | Função |
|---|---|---|
| Create | Chips SpaceEye | `SpaceEyeDataset.__getitem__()` |
| Create | Máscaras SAM | `SegmentAnythingClient.run_npy()` |
| Create | Previsões DeepMC | `DeepMCPredictor.predict()` |
| Read | Produtos Airbus | `AirbusClient.get_products()` |
| Read | Itens Planetary Computer | `PlanetaryComputerClient.search_items()` |
| Read | Alertas GLAD | `GladClient.get_alerts()` |
| Read | Cenários COMET | `CometFarmClient.get_recommendation()` |
| Read | Previsão GFS | GFS blob registry lookup |
| Update | Cache local | Download de assets para diretório de cache |
| Delete | Cache local | Gerenciamento manual de diretório de cache |

## 10. Schemas de Dados

| Schema / Tipo | Descrição |
|---|---|
| `STACItem` / `STACCatalog` | Metadados SpatioTemporal Asset Catalog |
| `AirbusProduct` | Produto Airbus com geometria, período, assets |
| `RasterSet` / `RasterMeta` | Metadados de rasters multi-bandas |
| `GeoJSON` Feature / FeatureCollection | Geometrias de entrada/saída |
| `xarray.Dataset` | Grades espaço-temporais (clima, raster) |
| `CometScenario` / `CometRecommendation` | Dados de cenário e recomendação COMET |
| `GladAlert` | Alerta individual de desmatamento |
| GFS Blob Types | `GFSForecastBlob`, `GFSRegistryEntry` |

## 11. Datasets / Tipos

- Sentinel-2, Sentinel-1 (via Planetary Computer, STAC)
- Airbus Pleiades / SPOT (imagens de muito alta resolução)
- TerraClimate / GridMET (grade climática mensal/diária)
- GFS (modelo de previsão meteorológica global)
- GLAD (alertas de desmatamento) — `umd_glad_landsat_alerts`
- COMET-Farm (carbono no solo, cenários de manejo)
- Bing Maps (imagens de satélite estáticas)
- SpaceEye (SAR + óptico fusionados)
- Dados de entrada para SAM (qualquer raster TIFF ou npy)

## 12. Lógicas e Cálculos

- **Iluminação (SpaceEye/illumination.py)**: Cálculo de ângulo solar (zenite, azimute) por data/local; compositing por ângulo e cobertura de nuvem; `compute_illumination_condition()`
- **Interpolação**: `interp2d` com regularização por spline; `robust_scale()` para normalização; `Conv2dInterpolation` com rede neural convolucional simples
- **Estatística zonal**: `raster_stats()` computa média, mediana, desvio padrão, máscara de cada polígono sobre raster; `raster_histogram()` greta distribuição por banda
- **Encoder DeepMC**: `DeepMCEncoder` com LSTM bidirecional + atenção, `TransferLearningDataModule` para fine-tuning
- **Gaussian Mixture**: Implementação própria de GMM com EM, cálculo de log-verossimilhança, inicialização k-means
- **Overlap Clustering**: Algoritmo de clusterização que considera sobreposição espacial entre geometrias
- **SAM**: Invoca modelo Segment Anything pré-treinado; suporte a prompts (pontos, bounding boxes) e batch
- **KDE / Heatmap**: Kernel Density Estimation 2D com banda adaptativa, grade de saída ajustável
- **COMET**: Mapeamento de parâmetros agrícolas para API REST do COMET-Farm; cálculo de cenários `baseline` vs `alternative` com diferença de carbono
- **GLAD**: Parsing de alertas por data de confirmação; interseção com geometria de interesse
- **GFS Registry**: Catálogo de blobs GFS por horizonte de forecast e resolução

---

## Perfis Energéticos

| Perfil (Classe) | Subclasse | Aplicação do Módulo | Valor Gerado |
|---|---|---|---|
| Geração Solar | GD, GC | `SpaceEye` + `illumination` para avaliação de irradiância; `GFS` para previsão de cobertura | Estimativa precisa de GHI e sombreamento |
| Geração Eólica | Onshore, Offshore | `TerraClimate`/`GridMET` para séries de vento; `kde`/`heatmap` para prospecção | Mapas de densidade de potencial eólico |
| Geração Hidrelétrica | UHE, PCH, CGH | `stats.zonal` + `raster` para monitoramento de reservatórios; `GLAD` para alertas de desmate em bacias | Previsão de vazão com dados de uso do solo |
| Biomassa / Bioenergia | Cana, Floresta, Resíduos, Biogás | `SAM` para segmentação de cultivos; `COMET` para carbono no solo; `PlanetaryComputer` para NDVI | Classificação de biomassa e potencial energético |
| Distribuição de Energia | Concessionárias, Permissionárias | `Airbus` para inspeção de alta resolução de ativos; `OverlapClustering` para agrupamento de consumidores | Planejamento de rede com imagens VHR |
| Comercialização | Comercializadores, Autoprodutores | `DeepMC` para previsão de geração; `stats` para agregação de ativos | Precisão em contratos de compra de energia |
| Eficiência Energética | Irrigação, Estufas | `COMET` + `SpaceEye` para monitoramento agrícola; `stats` para indicadores de produtividade | Otimização de insumos por sensoriamento |
| Óleo e Gás | Exploração, Transporte | `GLAD` para alertas em áreas de exploração; `GaussianMixture` para detecção de anomalias | Monitoramento ambiental de áreas operacionais |
| Mercado de Carbono | REDD+, Agricultura baixo carbono | `COMET-Farm` paraMRV de carbono no solo; `GLAD` para desmatamento evitado; `SAM` para classificação de uso | Créditos de carbono verificáveis por sensoriamento remoto |
