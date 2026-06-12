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

## Use Cases
1. **Organização de dados**: Agrupar rasters/produtos por critérios espaciais ou temporais.
2. **Preparação para merge**: Estruturar sequências antes de operações de mosaico.
3. **Redução de complexidade**: Simplificar listas grandes em grupos gerenciáveis.

## Faz / Não Faz

- **Faz**: Agrupamento de itens por critérios espaciais e/ou temporais.
- **Não Faz**: Não altera o conteúdo dos itens agrupados.
- **Não Faz**: Não modifica a ordem interna dos itens.

## Variáveis

| Variável | Tipo | Descrição |
|----------|------|-----------|
| `rasters` | — | Conforme especificação da operação |
| `List[Sentinel2Raster]` | — | Conforme especificação da operação |
| `masks` | — | Conforme especificação da operação |
| `List[Sentinel2CloudMask]` | — | Conforme especificação da operação |

## Outcomes Esperados

- Raster geoespacial pronto para visualização e análises subsequentes.
- Lista de produtos disponíveis com metadados completos.
- Estrutura de dados organizada para encadeamento em workflows.

## Workflows Utilizados

- Operação atômica `group_sentinel2_orbits` — utilizada como componente de workflows maiores.

## APIs / Conectores

- **Copernicus Open Access Hub (SciHub)**: Dados Sentinel.

## Datasets / Fontes de Dados

- **Sentinel-2 (MSI)**: Reflectância de superfície, 10-60m, 13 bandas.

