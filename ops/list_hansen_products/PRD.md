# JTBDs (List Hansen Products)

## JTBDs
1. Listar produtos Global Forest Change (Hansen) para uma região e camada específica
2. Selecionar camada (treecover2000, loss, gain, lossyear, datamask, first, last)

## Descrição
Operação que lista produtos do dataset Global Forest Change (Hansen) em resolução de 30m. Identifica tiles de 10°×10° que intersectam a geometria e verifica disponibilidade do arquivo .tif para a camada selecionada.

## Inputs
- `input_item` (DataVibe): geometria e intervalo de tempo de interesse

## Outputs
- `hansen_products` (List[HansenProduct]): produtos Hansen listados

## Lógicas e Cálculos
- Carrega geometrias de tiles GLAD (mesmo sistema de tiling) e calcula interseção
- Extrai ano final e versão do dataset a partir da URL base
- Valida que ano inicial seja 2000 e ano final ≤ ano do dataset
- Gera asset template URL e verifica disponibilidade via `verify_url()` para cada tile
- Cria `HansenProduct` com URL do asset, time range e camada
