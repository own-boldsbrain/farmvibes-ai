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

## Use Cases
1. **Automação**: Consulta o Planetary Computer STAC para encontrar items Sentinel-2 L2A que intersectam a geometria do raster e estão no mesmo período de forma programática e escalável.
2. **Pipeline de dados**: Integrar esta operação em workflows maiores de análise geoespacial.
3. **Batch processing**: Processar múltiplas regiões/períodos de forma paralela.

## Faz / Não Faz

- **Faz**: Executa a operação conforme parâmetros fornecidos.
- **Faz**: Processa rasters geoespaciais com suporte a múltiplas bandas.
- **Não Faz**: Não modifica os dados de entrada originais.
- **Não Faz**: Não valida resultados contra referências externas.

## Variáveis

| Variável | Tipo | Descrição |
|----------|------|-----------|
| `raster` | — | Conforme especificação da operação |
| `tolerance` | — | Conforme especificação da operação |

## Outcomes Esperados

- Raster geoespacial pronto para visualização e análises subsequentes.
- Dados de saída formatados e prontos para consumo por operações posteriores.
- Rastreabilidade completa via metadados do asset.

## Workflows Utilizados

- Operação atômica `get_angles` — utilizada como componente de workflows maiores.

## APIs / Conectores

- **Microsoft Planetary Computer**: Catálogo STAC e API de dados.
- **Copernicus Open Access Hub (SciHub)**: Dados Sentinel.

## Datasets / Fontes de Dados

- **Sentinel-2 (MSI)**: Reflectância de superfície, 10-60m, 13 bandas.

