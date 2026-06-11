# JTBDs (download_dem)

## JTBDs
1. Baixar modelos digitais de elevação (DEM) para um tile específico
2. Obter rasters de elevação georreferenciados para análises topográficas

## Descrição
Baixa rasters de Modelo Digital de Elevação (DEM) da Planetary Computer a partir de um `DemProduct`. A operação valida o provedor e resolução do DEM, consulta o tile pelo ID, faz download dos assets e retorna um `DemRaster` com banda de elevação e colormap interpolado para visualização.

## Inputs
- `input_product`: `DemProduct` com tile_id, provedor, resolução e geometria

## Outputs
- `downloaded_product`: `DemRaster` com banda "elevation", metadados do tile e colormap preto-branco (0-4000m)

## Lógicas e Cálculos
- Valida provedor do DEM com `validate_dem_provider` usando coleção apropriada da Planetary Computer
- Consulta item pelo tile_id na coleção validada
- Faz download dos assets do item para diretório temporário
- Gera colormap interpolado linearmente entre preto (0m) e branco (4000m)
- Retorna `DemRaster` com ID hash único e atributos de tile_id, resolução e provedor
