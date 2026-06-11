# JTBDs (download_from_ref)

## JTBDs
1. Baixar arquivos a partir de referências externas (URLs remotas ou locais)
2. Converter referências externas em datasets tipados (Raster, GeometryCollection, etc.)

## Descrição
Baixa arquivos de URLs remotas ou caminhos locais referenciados por `ExternalReference`. A operação é genérica e parametrizada pelo tipo de saída (`out_type`): pode produzir `Raster`, `GeometryCollection` ou qualquer tipo registrado no `data_registry`. O hash SHA-256 do arquivo é usado como identificador do asset.

## Inputs
- `input_ref`: `ExternalReference` com URL ou caminho local do arquivo

## Outputs
- `downloaded`: Tipo definido por `out_type` (ex: `Raster`, `GeometryCollection`) com asset baixado

## Lógicas e Cálculos
- Se URL é local (`file://`), copia o arquivo via `shutil.copy`; caso contrário, faz download via `download_file`
- Calcula hash SHA-256 do arquivo em chunks de 1MB para usar como ID do asset
- Verifica extensão do arquivo e registra MIME type se necessário (ex: .geojson)
- Constrói saída tipada clonando metadados da referência com campos vazios preenchidos para o tipo destino
