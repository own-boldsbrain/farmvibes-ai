# JTBDs (Detect Driveway)

## JTBDs
1. Detectar garagens/entradas de veículos em imagens de satélite usando segmentação e NDVI
2. Verificar se há espaço para estacionar um veículo em cada propriedade

## Descrição
Usa um raster de segmentação (pré-processado por `segment_driveway`), imagem multiespectral, limites de propriedades e geometria de ruas para detectar entradas de garagem. Para cada propriedade que intersecta a imagem, analisa a região do segmento mais próximo da rua, verifica NDVI para excluir vegetação e testa se um kernel do tamanho de um carro se encaixa na região.

## Inputs
- `input_raster`: `Raster`
- `segmentation_raster`: `CategoricalRaster`
- `property_boundaries`: `GeometryCollection`
- `roads`: `GeometryCollection`
- Parâmetros: `min_region_area`, `ndvi_thr`, `car_size`, `num_kernels`, `car_thr`

## Outputs
- `properties_with_driveways`: `GeometryCollection`
- `driveways`: `GeometryCollection`

## Lógicas e Cálculos
- Lê imagem e máscara de segmentação, projeta ruas para o CRS do raster
- Para cada propriedade: calcula NDVI = `(nir - red) / (nir + red)`, limiar `ndvi_thr` para excluir vegetação
- Rotula componentes conectados na máscara de segmentação, seleciona o mais próximo da rua
- `can_park`: convolve máscara com kernels rotacionados do tamanho do carro, verifica se algum atinge `car_thr`
- Se cabe carro, calcula `convex_hull` da região → geometria da garagem
- Saídas: GeoJSON com propriedades que têm garagem + geometrias das garagens

## Use Cases
1. **Automação**: Usa um raster de segmentação (pré-processado por `segment_driveway`), imagem multiespectral, limites de propriedades e geometria de ruas para detectar entradas de garagem de forma programática e escalável.
2. **Pipeline de dados**: Integrar esta operação em workflows maiores de análise geoespacial.
3. **Batch processing**: Processar múltiplas regiões/períodos de forma paralela.

## Faz / Não Faz

- **Faz**: Executa a operação conforme parâmetros fornecidos.
- **Faz**: Processa rasters geoespaciais com suporte a múltiplas bandas.
- **Faz**: Suporte a geometrias delimitadoras para recorte espacial.
- **Não Faz**: Não modifica os dados de entrada originais.
- **Não Faz**: Não valida resultados contra referências externas.

## Variáveis

| Variável | Tipo | Descrição |
|----------|------|-----------|
| `input_raster` | — | Conforme especificação da operação |
| `segmentation_raster` | — | Conforme especificação da operação |
| `property_boundaries` | — | Conforme especificação da operação |
| `roads` | — | Conforme especificação da operação |
| `min_region_area` | — | Conforme especificação da operação |
| `ndvi_thr` | — | Conforme especificação da operação |
| `car_size` | — | Conforme especificação da operação |
| `num_kernels` | — | Conforme especificação da operação |

## Outcomes Esperados

- Dados de saída formatados e prontos para consumo por operações posteriores.
- Rastreabilidade completa via metadados do asset.

## Workflows Utilizados

- Operação atômica `detect_driveway` — utilizada como componente de workflows maiores.

## APIs / Conectores

- **N/A**: Operação puramente computacional, sem dependências externas de API.

## Datasets / Fontes de Dados

- **Dados de entrada**: Fornecidos pelo usuário ou por operações anteriores no pipeline.

