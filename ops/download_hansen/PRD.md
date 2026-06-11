# JTBDs (download_hansen)

## JTBDs
1. Obter dados de mudança florestal (cobertura, perda, ganho) para uma região
2. Analisar histórico de desmatamento ou regeneração em talhões e propriedades

## Descrição
Baixa um produto Global Forest Change (Hansen) — cobertura florestal, perda ou ganho — a partir de URL pública e retorna como raster em resolução de 30m.

## Inputs
- `hansen_product`: Produto Hansen contendo URL do asset, nome da camada, tile e ano

## Outputs
- `raster`: Raster com os dados de mudança florestal da camada solicitada

## Lógicas e Cálculos
1. Constrói nome do arquivo a partir do layer, tile e último ano disponível
2. Baixa o asset via `download_file` da URL contida no produto Hansen
3. Gera `AssetVibe` com o arquivo TIFF e retorna `Raster` com a banda mapeada para o nome da camada
