# JTBDs (Group Sentinel-2 Orbits)

## JTBDs
1. Agrupar rasters e máscaras Sentinel-2 por número de orbita e tile MGRS
2. Parear cada raster com sua máscara de nuvem correspondente via `product_name`

## Descrição
Agrupa `Sentinel2Raster` e `Sentinel2CloudMask` em pares de `Sentinel2RasterOrbitGroup` e `Sentinel2CloudMaskOrbitGroup` pela chave `(orbit_number, tile_id)`. Usa `find_s2_product` para localizar a máscara correspondente a cada raster.

## Inputs
- `rasters`: `List[Sentinel2Raster]`
- `masks`: `List[Sentinel2CloudMask]`

## Outputs
- `raster_groups`: `List[Sentinel2RasterOrbitGroup]`
- `mask_groups`: `List[Sentinel2CloudMaskOrbitGroup]`

## Lógicas e Cálculos
- `defaultdict(list)` chaveado por `(orbit_number, tile_id)`, itens são tuplas `(raster, mask)`
- Ordena por `discriminator_date(product_name)` para consistência
- `unary_union` das geometrias, `time_range` do último raster
- IDs hash SHA-256 separados para raster group e mask group
