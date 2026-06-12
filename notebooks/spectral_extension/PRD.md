# JTBDs (spectral_extension)

## JTBDs

1. Gerar bandas Sentinel-2 de alta resolução (0.125m) combinando RGB de drone (UAV) com imagens Sentinel-2
2. Reamostrar Sentinel-2 para o grid do UAV e aplicar modelo ONNX de extensão espectral
3. Produzir 8 bandas multiespectrais (Blue, Green, Red, RedEdge B5/B6/B7, NIR, NNIR) em resolução submétrica

## Descrição

Notebook que demonstra a extensão espectral: a partir de uma imagem RGB de drone (0.125m de resolução) e uma cena Sentinel-2 correspondente, o workflow baixa ambos, reamostra o Sentinel-2 para o grid do UAV e aplica um modelo ONNX de deep learning que gera 8 bandas Sentinel-2 (Blue, Green, Red, RedEdge B5/B6/B7, NIR B8, NNIR B8a) na resolução original do drone. O modelo foi treinado com imagens agrícolas da região de Maryland (EUA) e é baseado no paper de Masrur, Adler & Olsen (2024).

## Use Cases

1. **Fusão UAV-Satélite**: Um pesquisador combina a alta resolução espacial do drone com a riqueza espectral do Sentinel-2 para análise detalhada de culturas.
2. **Agricultura de precisão**: Um consultor gera mapas de NDVI e outros índices em resolução de drone para manejo localizado.
3. **Monitoramento ambiental**: Uma ONG produz imagens multiespectrais de alta resolução para inventários florestais e MRV de carbono.

## Faz / Não Faz

- **Faz**: Download de raster UAV (RGB, 3 bandas, 0-255, 0.125m).
- **Faz**: Download e pré-processamento de Sentinel-2 correspondente.
- **Faz**: Reamostragem do Sentinel-2 para o grid do UAV.
- **Faz**: Aplicação de modelo ONNX de extensão espectral.
- **Não Faz**: Não aceita UAV com resolução diferente de 0.125m.
- **Não Faz**: O UAV deve ter exatamente 3 bandas RGB na ordem correta.
- **Não Faz**: Não aceita valores fora do intervalo 0-255.
- **Não Faz**: Não funciona sem cobertura simultânea de Sentinel-2.

## Notebooks

- `spectral_extension.ipynb`: Geração de 8 bandas Sentinel-2 de alta resolução a partir de RGB de drone

## Inputs

- Raster UAV (RGB, 3 bandas, 0.125m, valores 0-255)
- Geometria da área de interesse
- Intervalo de datas (para busca de Sentinel-2)
- Planetary Computer API key (pc_key)
- Parâmetros: resampling method (nearest, bilinear, cubic)

## Outputs

- `s2_rasters`: Raster Sentinel-2 original usado como referência espectral
- `matched_raster`: Sentinel-2 reamostrado para o grid do UAV
- `extended_raster`: 8 bandas Sentinel-2 geradas a 0.125m (B2, B3, B4, B5, B6, B7, B8, B8a)

## Variáveis

| Variável | Tipo | Descrição |
|----------|------|-----------|
| `pc_key` | string | Chave de API do Planetary Computer |
| `resampling` | string | Método de reamostragem (nearest, bilinear, cubic) |

## Lógicas / Cálculos

1. `ingest_raster` — Baixa o raster UAV do usuário (via URL ou storage).
2. `preprocess_s2` — Baixa e pré-processa Sentinel-2 para mesma área (com máscaras de nuvem).
3. `match_raster_to_ref` — Reamostra Sentinel-2 para o grid do UAV (match de extent, resolução e CRS).
4. `compute_onnx` — Aplica modelo ONNX de extensão espectral que gera 8 bandas Sentinel-2 a partir de 3 bandas RGB + 8 bandas S2 reamostradas.

## Outcomes Esperados

- Raster com 8 bandas Sentinel-2 (Blue, Green, Red, RedEdge B5/B6/B7, NIR, NNIR) em resolução de 0.125m.
- Preservação da resolução espacial do UAV com extensão espectral do Sentinel-2.
- Possibilidade de calcular índices espectrais (NDVI, NDRE, etc.) em resolução submétrica.

## Workflows Utilizados

- `ml/spectral_extension`
- `data_ingestion/sentinel2/preprocess_s2`

## APIs / Conectores

- **Planetary Computer API**: Download de cenas Sentinel-2.
- **Modelo ONNX**: Bundled em `/opt/terravibes/ops/resources/spectral_extension_model/spectral_extension.onnx`.

## Datasets / Fontes de Dados

- Imagem RGB de drone/UAV (fornecida pelo usuário, 0.125m)
- Sentinel-2 (MSI, 10-60m, 13 bandas)
- Modelo ONNX pré-treinado (extensão espectral UAV → Sentinel-2)
