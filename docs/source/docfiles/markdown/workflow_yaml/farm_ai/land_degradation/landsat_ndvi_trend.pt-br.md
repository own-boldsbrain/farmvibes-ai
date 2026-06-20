# farm_ai/land_degradation/landsat_ndvi_trend

Estima uma tendência linear sobre o NDVI calculado a partir de mosaicos LANDSAT que intersectam com a geometria e o intervalo de tempo de entrada. O fluxo de trabalho (workflow) baixa dados LANDSAT, calcula o NDVI sobre eles e estima uma tendência linear sobre pedaços (chunks) de dados, combinando-os em um raster de tendência final.

```{mermaid}
    graph TD
    inp1>user_input]
    out1>ndvi]
    out2>linear_trend]
    tsk1{{landsat}}
    tsk2{{trend}}
    tsk1{{landsat}} -- raster --> tsk2{{trend}}
    inp1>user_input] -- user_input --> tsk1{{landsat}}
    tsk2{{trend}} -- ndvi_raster --> out1>ndvi]
    tsk2{{trend}} -- linear_trend --> out2>linear_trend]
```

## Fontes (Sources)

- **user_input**: Intervalo de tempo e geometria de interesse.

## Sinks (Saídas)

- **ndvi**: Rasters NDVI.

- **linear_trend**: Raster com a tendência e as estatísticas do teste.

## Parâmetros

- **pc_key**: Chave de API opcional do Planetary Computer.

## Tarefas (Tasks)

- **landsat**: Baixa e pré-processa mosaicos LANDSAT que intersectam com a geometria e o intervalo de tempo de entrada.

- **trend**: Calcula a tendência linear de NDVI por pixel sobre o raster de entrada.

## Workflow Yaml

```yaml
name: landsat_ndvi_trend
sources:
  user_input:
    - landsat.user_input
sinks:
  ndvi: trend.ndvi_raster
  linear_trend: trend.linear_trend
parameters:
  pc_key: null
tasks:
  landsat:
    workflow: data_ingestion/landsat/preprocess_landsat
    parameters:
      pc_key: "@from(pc_key)"
  trend:
    workflow: farm_ai/land_degradation/ndvi_linear_trend
edges:
  - origin: landsat.raster
    destination:
      - trend.raster
description:
  short_description: Estima uma tendência linear sobre o NDVI calculado a partir de mosaicos LANDSAT que intersectam com a geometria e o intervalo de tempo de entrada.
  long_description: O fluxo de trabalho baixa dados LANDSAT, calcula o NDVI sobre eles e estima uma tendência linear sobre pedaços de dados, combinando-os em um raster de tendência final.
  sources:
    user_input: Intervalo de tempo e geometria de interesse.
  sinks:
    ndvi: Rasters NDVI.
    linear_trend: Raster com a tendência e as estatísticas do teste.
  parameters:
    pc_key: Chave de API opcional do Planetary Computer.
```
