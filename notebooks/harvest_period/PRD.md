# JTBDs (harvest_period)

## JTBDs

1. Inferir períodos de germinação e colheita a partir de séries temporais de NDVI
2. Ajustar curva gaussiana assimétrica ao NDVI diário para estimar datas fenológicas

## Descrição

Este notebook utiliza o workflow `farm_ai/agriculture/ndvi_summary` para baixar imagens Sentinel-2, computar NDVI diário sem nuvens e ajustar uma curva Skewed Gaussian para estimar o início da germinação e o fim da colheita.

## Use Cases

1. **Planejamento de safra**: Um produtor estima datas de germinação e colheita para planejar logística de insumos e colheita.
2. **Monitoramento regional**: Uma cooperativa agrícola acompanha o calendário fenológico de seus associados.
3. **Modelagem de produtividade**: Um pesquisador correlaciona períodos fenológicos com produtividade final.

## Faz / Não Faz

- **Faz**: Download e processamento de Sentinel-2.
- **Faz**: Cálculo de NDVI diário sem nuvens.
- **Faz**: Ajuste de curva Skewed Gaussian para fenologia.
- **Faz**: Estimativa de germinação e colheita.
- **Não Faz**: Não identifica eventos fenológicos intermediários (floração, enchimento de grãos).
- **Não Faz**: Requer cobertura temporal contínua da safra completa.

## Notebooks

- ndvi_summary.ipynb: Estimativa de germinação e colheita via curva ajustada ao NDVI

## Inputs

- input_region.wkt: polígono da região de interesse (ex.: Iowa)
- Intervalo de datas cobrindo safra completa
- Parâmetros: ndvi_threshold (0.15), delta_threshold (0.1)

## Outputs

- CSV com série temporal NDVI diário
- Datas estimadas de início da germinação e fim da colheita
- Gráfico da curva ajustada vs. observações

## Variáveis

| Variável | Tipo | Default | Descrição |
|----------|------|---------|-----------|
| `ndvi_threshold` | float | 0.15 | Limiar NDVI para detecção de vegetação |
| `delta_threshold` | float | 0.1 | Variação mínima para detectar transição fenológica |

## Lógicas / Cálculos

1. Download de Sentinel-2 e pré-processamento (máscaras de nuvem/sombra).
2. Cálculo de NDVI diário via SpaceEye (remoção de nuvens).
3. Ajuste de curva Skewed Gaussian à série temporal NDVI.
4. Estimativa de datas fenológicas: germinação (início da subida NDVI) e colheita (fim da descida NDVI).

## Outcomes Esperados

- Série temporal NDVI diária limpa.
- Datas estimadas de germinação e colheita com acurácia sub-sazonal.
- Visualização da curva ajustada para validação visual.

## APIs / Conectores

- **Planetary Computer API**: Download de cenas Sentinel-2.
- **SpaceEye**: Interpolação para remoção de nuvens.

## Datasets / Fontes de Dados

- Sentinel-2: reflectância de superfície.
- SpaceEye: imagens diárias sem nuvens.

## Workflows Utilizados

- `farm_ai/agriculture/ndvi_summary`
