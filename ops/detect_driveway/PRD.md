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
