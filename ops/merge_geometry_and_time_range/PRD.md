# JTBDs (Merge Geometry and Time Range)

## JTBDs
1. Combinar geometria de um item com intervalo de tempo de outro em um único item

## Descrição
Cria um novo `DataVibe` sem assets que carrega a geometria do primeiro item de entrada (`geometry`) e o `time_range` do segundo (`time_range`). Útil para compor metadados de diferentes fontes em um único item.

## Inputs
- `geometry`: `DataVibe` (fonte da geometria)
- `time_range`: `DataVibe` (fonte do intervalo de tempo)

## Outputs
- `merged`: `DataVibe`

## Lógicas e Cálculos
- Gera `id` hash SHA-256 a partir dos IDs dos dois itens de entrada
- Cria novo `DataVibe(id, geometry, time_range, assets=[])` diretamente, sem clonagem de item existente

## Use Cases
1. **Mosaico de imagens**: Unir múltiplos rasters adjacentes em uma única cena contínua.
2. **Fusão de dados**: Combinar coberturas de diferentes datas ou sensores.
3. **Preparação de dado único**: Consolidar sequência de rasters para análise integrada.

## Faz / Não Faz

- **Faz**: Mesclagem de múltiplos rasters em um único arquivo.
- **Faz**: Validação de compatibilidade entre rasters (CRS, dtype, bandas).
- **Não Faz**: Não faz interpolação entre rasters sobrepostos — usa o primeiro disponível.
- **Não Faz**: Não recorta ou reprojeta — opera no CRS herdado da entrada.

## Variáveis

| Variável | Tipo | Descrição |
|----------|------|-----------|
| `geometry` | — | Conforme especificação da operação |
| `time_range` | — | Conforme especificação da operação |

## Outcomes Esperados

- Arquivo compactado (ZIP) com resultados prontos para download.
- Dados de saída formatados e prontos para consumo por operações posteriores.
- Rastreabilidade completa via metadados do asset.

## Workflows Utilizados

- Operação atômica `merge_geometry_and_time_range` — utilizada como componente de workflows maiores.

## APIs / Conectores

- **N/A**: Operação puramente computacional, sem dependências externas de API.

## Datasets / Fontes de Dados

- **Múltiplos rasters**: Sequência de rasters para mesclagem.

