# JTBDs (download_bing_basemap)

## JTBDs
1. Baixar tiles de mapa base Bing Maps para uma região específica
2. Converter tiles JPEG em rasters GeoTIFF georreferenciados para uso em análises geoespaciais

## Descrição
Baixa um tile de mapa base representado por um `BingMapsProduct` usando a Bing Maps API e converte a imagem JPEG em um GeoTIFF georreferenciado no CRS EPSG:4326 com bandas RGB.

## Inputs
- `input_product`: `BingMapsProduct` com URL do tile, nível de zoom e bbox

## Outputs
- `basemap`: `Raster` com 3 bandas (red, green, blue) em formato GeoTIFF

## Lógicas e Cálculos
- Faz download da imagem JPEG da URL fornecida pelo produto Bing Maps
- Converte a imagem para GeoTIFF usando `rasterio`, aplicando transformação afim baseada nas coordenadas da bbox
- Gera asset com tipo MIME image/tiff e ID único
- Clona metadados do produto de entrada com hash SHA-256 do ID

## Use Cases
1. **Ingestão de Bing Basemap**: Baixar dados Bing Basemap para uma região e período específicos.
2. **Atualização de catálogo**: Manter uma base local atualizada com dados Bing Basemap mais recentes.
3. **Integração em pipeline**: Fornecer dados de entrada para operações de processamento downstream.

## Faz / Não Faz

- **Faz**: Download de dados da fonte original para armazenamento local.
- **Faz**: Validação de integridade dos dados baixados.
- **Não Faz**: Não processa ou analisa o conteúdo baixado — apenas transfere.
- **Não Faz**: Não modifica os dados originais.

## Variáveis

| Variável | Tipo | Descrição |
|----------|------|-----------|
| `input_product` | — | Conforme especificação da operação |

## Outcomes Esperados

- Raster geoespacial pronto para visualização e análises subsequentes.
- Dados de saída formatados e prontos para consumo por operações posteriores.
- Rastreabilidade completa via metadados do asset.

## Workflows Utilizados

- Operação atômica `download_bing_basemap` — utilizada como componente de workflows maiores.

## APIs / Conectores

- **Fonte externa**: API de dados conforme especificação do produto.

## Datasets / Fontes de Dados

- **Bing Maps**: Basemaps de satélite.

