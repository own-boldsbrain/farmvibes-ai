# JTBDs (crop_cycles)

## JTBDs

1. Contar ciclos agrícolas por ano em uma região a partir de imagens de satélite
2. Executar análise de séries temporais em rasters usando modelo ONNX
3. Processar 365 imagens diárias com SpaceEye + NDVI + análise de Fourier

## Descrição

Notebook que conta o número de ciclos de cultivo por ano usando séries temporais de NDVI. Executa SpaceEye para gerar imagens sem nuvens (365 dias), calcula NDVI e aplica um modelo ONNX de análise de Fourier para identificar ciclos agrícolas (emergência à colheita). O workflow customizado é definido no arquivo crop_cycles.yaml, encadeando SpaceEye, NDVI e chunk_onnx.

## Use Cases

1. **Monitoramento de safras**: Uma trading de grãos conta ciclos agrícolas por ano em regiões produtoras para estimar produção total.
2. **Classificação de uso do solo**: Um órgão ambiental identifica áreas de cultivo intensivo (múltiplos ciclos) vs. extensivo.
3. **Zoneamento agrícola**: Um pesquisador correlaciona número de ciclos com tipos de cultura predominantes.

## Faz / Não Faz

- **Faz**: Geração de imagens diárias sem nuvens via SpaceEye (365 dias).
- **Faz**: Cálculo de NDVI diário.
- **Faz**: Aplicação de modelo ONNX de análise de Fourier para contagem de ciclos.
- **Faz**: Classificação de regiões de alta frequência como perenes.
- **Não Faz**: Não identifica a cultura específica — apenas conta ciclos.
- **Não Faz**: Não funciona sem cobertura SpaceEye contínua.

## Notebooks

- crop_cycles.ipynb: Contagem de ciclos agrícolas via análise de séries temporais com ONNX

## Inputs

- Geometria da região (WKT)
- Período (ex: 2018)
- Modelo ONNX (count_cycles.onnx)
- step (tamanho da janela em pixels)

## Outputs

- Raster com número de ciclos agrícolas por pixel
- Regiões de alta frequência classificadas como perenes

## Variáveis

| Variável | Tipo | Default | Descrição |
|----------|------|---------|-----------|
| `step` | int | — | Tamanho da janela em pixels para processamento |
| `pc_key` | string | — | Chave de API do Planetary Computer |
| `model_file` | string | — | Caminho para o modelo ONNX (count_cycles.onnx) |

## Lógicas / Cálculos

1. `spaceeye_interpolation` — Gera imagens diárias sem nuvens (SpaceEye) para 365 dias.
2. `index` (NDVI) — Calcula NDVI para cada imagem diária.
3. `chunk_onnx` (count_cycles) — Aplica modelo ONNX de análise de Fourier que identifica picos de NDVI correspondentes a ciclos agrícolas.

## Outcomes Esperados

- Raster com contagem de ciclos agrícolas por pixel (1, 2, 3+ ciclos/ano).
- Classificação de áreas perenes (alta frequência NDVI).
- Estimativa de janelas de plantio e colheita por ciclo.

## APIs / Conectores

- **Planetary Computer API**: Download de cenas Sentinel-2.
- **SpaceEye**: Algoritmo de interpolação para imagens sem nuvens.
- **Modelo ONNX**: count_cycles.onnx (análise de Fourier).

## Datasets / Fontes de Dados

- Sentinel-2: reflectância de superfície multitemporal.
- SpaceEye: imagens diárias interpoladas sem nuvens.
- Modelo ONNX de contagem de ciclos (fornecido pelo usuário ou bundle).

## Workflows Utilizados

- data_ingestion/spaceeye/spaceeye_interpolation
- data_processing/index/index (NDVI)
- data_processing/chunk_onnx/chunk_onnx
