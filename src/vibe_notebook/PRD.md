# PRD — vibe_notebook

## 1. Nome do Módulo

**vibe_notebook** — Pacote de visualização e suporte a notebooks Jupyter para exploração de dados geoespaciais e previsões DeepMC.

## 2. JTBDs (Jobs To Be Done)

- Visualizar séries temporais de dados raster e meteorológicos em notebooks
- Plotar mapas com geometrias e rasters de fundo
- Exibir resultados de previsão DeepMC (forecast, prediction, preprocessing)
- Manipular coleções de geometrias para inspeção visual
- Renderizar composições coloridas de bandas de satélite

## 3. Casos de Uso

| Caso de Uso | Descrição |
|---|---|
| Plot de série temporal | Usuário plota NDVI, precipitação ou outra variável ao longo do tempo |
| Mapa de cubo de dados | Exibe fatias espaço-temporais de um DataCube |
| Visualização de raster | Mostra raster com composição RGB ou banda única |
| Tile map | Renderiza grade de tiles de dataset sobre fundo cartográfico |
| Preview de forecast DeepMC | Gera gráficos comparativos de previsão vs observado |
| Plot de predição DeepMC | Exibe mapas de predição para diferentes horizontes |
| Visualização de preprocessing | Mostra stages de transformação de dados DeepMC |
| Coleção de geometrias | Lista, valida e plota múltiplas geometrias GeoJSON |

## 4. Faz / Não Faz

**Faz:**

- Gera gráficos matplotlib com projeção CartoPy
- Suporta DataFrames, DataArrays e GeoDataFrames como entrada
- Renderiza composições RGB e multi-banda
- Integra com DeepMC para visualização de forecasts e predições
- Exibe coleções de geometrias em mapas

**Não Faz:**

- Não executa workflows (responsabilidade do vibe_server/vibe_dev)
- Não processa ou modela dados (apenas visualiza)
- Não persiste figuras (salvamento manual)
- Não substitui ferramentas GIS completas (QGIS, ArcGIS)

## 5. Users Inputs / Outputs

| Input | Output |
|---|---|
| `DataArray` / `Dataset` xarray | Figura matplotlib (série temporal ou mapa) |
| `GeoDataFrame` | Mapa com geometrias sobrepostas |
| Raster (numpy/xarray) | Composição RGB renderizada |
| Resultado DeepMC forecast | Gráfico de previsão vs observado |
| Resultado DeepMC prediction | Mapa de predição por horizonte |
| Coleção de geometrias | `GeoCollection` iterável com plot |


## 6. System Outputs

- `matplotlib.figure.Figure` — figuras geradas para exibição em notebook
- `GeoCollection` — objeto que agrupa e manipula geometrias
- Dicionários de metadados de plot (bounds, CRS, bandas usadas)

## 7. Outcomes Esperados

- Exploração interativa de dados geoespaciais sem ferramentas externas
- Depuração visual de pipelines de dados
- Comunicação clara de resultados de previsão para stakeholders
- Reprodutibilidade de análises via notebooks versionados

## 8. APIs / Endpoints

Não expõe API HTTP. Funções públicas principais:

- `plot.plot_time_series(data_array, ...)` — série temporal de xarray
- `plot.plot_data_cube(data_cube, ...)` — fatias de cubo espaço-temporal
- `plot.plot_map(geodataframe, ...)` — mapa com geometrias
- `raster.display_raster(raster, ...)` — exibe raster com banda(s)
- `raster.display_rgb_composite(raster, bands, ...)` — composição RGB
- `raster.create_tile_map(tiles, ...)` — grade de tiles
- `geometry.collect(geometries)` → `GeoCollection`
- `deepmc.forecast.plot_forecast(forecast_result, ...)` — gráfico de forecast
- `deepmc.prediction.plot_prediction(prediction_result, ...)` — mapa de predição
- `deepmc.preprocess.plot_preprocess_stages(stages, ...)` — stages de pré-processamento

## 9. CRUD

| Operação | Entidade | Função |
|---|---|---|
| Create | Figura matplotlib | Todas as funções de plot |
| Read | Coleção de geometrias | `GeoCollection.__iter__()`, `__getitem__()` |
| Read | Metadados de plot | Parâmetros de bounds, CRS |

## 10. Schemas de Dados

| Schema / Tipo | Descrição |
|---|---|
| `xarray.DataArray` / `Dataset` | Dados raster e séries temporais |
| `geopandas.GeoDataFrame` | Geometrias com atributos |
| `rasterio.DatasetReader` | Fonte de raster aberta |
| `GeoCollection` | Lista de geometrias com métodos de conveniência |
| DeepMC `ForecastResult` / `PredictionResult` | Saídas dos modelos de previsão |

## 11. Datasets / Tipos

- Qualquer `xarray.DataArray` com coordenadas espaço-temporais
- Rasters Sentinel-2, Sentinel-1 (pós-processados)
- GeoJSON de propriedades agrícolas, reservatórios, parques eólicos/solares
- Outputs de modelos DeepMC (forecast, prediction)
- Datasets tileados (grid de cenas)

## 12. Lógicas e Cálculos

- **Auto-scaling**: `robust_scale()` normaliza valores para visualização RGB (2º–98º percentil)
- **Bounds automáticos**: Cálculo de extensão máxima de todas as geometrias em uma coleção
- **Composição de bandas**: Mapeamento de bandas selecionadas para canais R, G, B com stretch de contraste
- **DeepMC forecast plot**: Alinhamento temporal entre predição e ground truth; cálculo de métricas de erro (RMSE, MAE) no gráfico
- **DeepMC prediction plot**: Interpolação de predições para grade contínua; sobreposição com geometrias de validação
- **DeepMC preprocess plot**: Visualização sequencial de cada stage (normalização, padding, encoding)

---

## Perfis Energéticos

| Perfil (Classe) | Subclasse | Aplicação do Módulo | Valor Gerado |
|---|---|---|---|
| Geração Solar | GD, GC | Plot de série temporal de irradiância GFS; visualização de predição DeepMC de geração | Comunicação visual de forecasts de geração |
| Geração Eólica | Onshore, Offshore | Mapa de vento com `plot_map`; forecast DeepMC de velocidade/produção | Apoio a decisão de despacho |
| Geração Hidrelétrica | UHE, PCH, CGH | Visualização de nível de reservatório sobre rasters; série de vazão | Monitoramento visual de ativos hídricos |
| Biomassa / Bioenergia | Cana, Floresta, Resíduos, Biogás | Plot de NDVI temporal; composição RGB para classificação de cultivos | Acompanhamento de safra por imagem |
| Distribuição de Energia | Concessionárias, Permissionárias | `create_tile_map` de inspeção de rede; `plot_map` de ativos | Inspeção visual de infraestrutura |
| Comercialização | Comercializadores, Autoprodutores | Gráficos de forecast vs real para relatórios | Relatórios de performance de geração |
| Eficiência Energética | Irrigação, Estufas | Série temporal de variáveis agrícolas; mapas de vigor vegetativo | Decisões de manejo baseadas em dados |
| Óleo e Gás | Exploração, Transporte | Visualização de alertas GLAD; mapa de anomalias com GMM | Monitoramento ambiental em dashboard |
| Mercado de Carbono | REDD+, Agricultura baixo carbono | Plot de baseline vs cenário COMET; mapa de estoque de carbono | Evidência visual para auditoria de créditos |
