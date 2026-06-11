# JTBDs (Hello World)

## JTBDs
1. Testar a infraestrutura do pipeline com uma operação simples de demonstração
2. Gerar uma imagem visual destacando países que intersectam a geometria de entrada

## Descrição
Operação de teste que gera um raster GeoTIFF de 512×256px do mundo. Usa dados `naturalearth_lowres` para rasterizar países: países que intersectam a geometria de entrada em laranja, demais em azul, com a borda da geometria em verde. Sobreposição do texto "HELLO WORLD" na imagem.

## Inputs
- `user_input`: `DataVibe` (geometria de entrada)
- Parâmetros: `width` (512), `height` (256)

## Outputs
- `raster`: `Raster`

## Lógicas e Cálculos
- Carrega `naturalearth_lowres` com `geopandas`
- Separa geometrias em `yes_geom` (intersectam) e `no_geom` (não intersectam)
- `rasterize` com `tab10` colormap no CRS EPSG:4326, bounds (-180, -90, 180, 90)
- Desenha "HELLO WORLD" com `PIL.ImageDraw`
- Salva como GeoTIFF com CRS EPSG:4326 e transform `from_bounds`
