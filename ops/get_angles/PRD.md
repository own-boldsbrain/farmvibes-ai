# JTBDs (Get Angles)

## JTBDs
1. Obter ângulos de visada (view zenith/azimuth) e solares (sun zenith/azimuth) para imagens Sentinel-2
2. Recortar grids de ângulo para a geometria exata do raster de entrada

## Descrição
Consulta o Planetary Computer STAC para encontrar items Sentinel-2 L2A que intersectam a geometria do raster e estão no mesmo período. Baixa o XML de metadados granule e parseia os grids de ângulo de visada (média entre bandas e detectores) e ângulos solares. Une múltiplos tiles, reprojeta para o CRS do raster e recorta pela geometria.

## Inputs
- `raster`: `Raster`
- Parâmetro: `tolerance` (dias, padrão 5)

## Outputs
- `angles`: `Raster` (4 bandas: view_zenith, view_azimuth, sun_zenith, sun_azimuth)

## Lógicas e Cálculos
- `query_catalog`: busca STAC items no Planetary Computer, filtra pela data mais próxima do raster
- `filter_necessary_items`: guloso — pega item com maior interseção, subtrai, recursa até cobrir geometria
- `get_xml_data`: baixa `granule-metadata` assinado do PC
- `parse_grid_params`: extrai centro, resolução e CRS do grid de ângulos (resolução 5000m)
- `get_view_angles`: para cada banda (13), média entre detectores dos grids Zenith e Azimuth
- `get_sun_angles`: parseia `Sun_Angles_Grid` diretamente
- `merge_arrays` com reprojeção bilinear para CRS do raster, clip pela geometria
- Concatena 4 grids ao longo do eixo `band`
