# JTBDs (Detect Building Footprint)

## JTBDs
1. Detectar footprints de edificações em imagens de satélite/aéreas usando CLIPSeg text-prompt segmentation
2. Produzir máscaras binárias de footprint por pixel

## Descrição
Executa inferência do modelo CLIPSeg (CIDAS/clipseg-rd64-refined) com text prompt sobre um raster de entrada. O raster é processado em tiles com overlap, normalizado, passado pelo modelo CLIPSeg, e remontado. A saída é um `BuildingFootprintRaster` (subclasse de `CategoricalRaster`) com 2 categorias: Background e o texto do prompt.

## Inputs
- `input_raster`: `Raster`
- Parâmetros: `text_prompt`, `threshold`, `batch_size`

## Outputs
- `footprint_mask`: `BuildingFootprintRaster`

## Lógicas e Cálculos
- Tiling do raster de entrada com overlap (`tile_size=512`, `overlap=32`)
- Conversão para RGB uint8 (normalização por canal)
- Inferência via `CLIPSegForImageSegmentation` (HuggingFace transformers)
- Sigmoid sobre logits → probabilities
- Binary mask via `threshold` + gaussian blur opcional
- Reassemblagem com blending nas bordas dos tiles

## Use Cases
1. **Automação**: Detectar edificações em grandes áreas de forma programática.
2. **Pipeline de dados**: Alimentar análises downstream (potencial solar, consumo energético).
3. **Batch processing**: Processar múltiplas regiões/períodos de forma paralela.

## Faz / Não Faz
- **Faz**: Executa a operação conforme parâmetros fornecidos.
- **Faz**: Processa rasters geoespaciais RGB.
- **Não Faz**: Não modifica os dados de entrada originais.
- **Não Faz**: Não valida resultados contra referências externas (BDGD, OSM).

## Workflows Utilizados
- Operação atômica `detect_building_footprint` — utilizada como componente de workflows maiores.

## APIs / Conectores
- **HuggingFace Transformers**: CLIPSegForImageSegmentation via geoai library.

## Datasets / Fontes de Dados
- **Dados de entrada**: Fornecidos pelo usuário ou por operações anteriores no pipeline.
