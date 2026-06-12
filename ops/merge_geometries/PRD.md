# JTBDs (Merge Geometries)

## JTBDs
1. Unificar múltiplas geometrias em uma única geometria combinada
2. Calcular interseção entre geometrias de itens diferentes

## Descrição
Cria um novo `DataVibe` com a geometria resultante da união ou interseção de todas as geometrias dos itens de entrada. Copia os demais metadados do primeiro item da lista.

## Inputs
- `items`: `List[DataVibe]`
- Parâmetro: `method` (`"union"` ou `"intersection"`)

## Outputs
- `merged`: `DataVibe`

## Lógicas e Cálculos
- `union`: aplica `shapely.unary_union` em todas as geometrias
- `intersection`: itera calculando `geom.intersection(geom_i)` incrementalmente
- Gera `id` hash SHA-256 a partir dos IDs dos itens + método
- Clona o primeiro item com `clone_from` usando a nova geometria mesclada

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
| `items` | — | Conforme especificação da operação |
| `method` | — | Conforme especificação da operação |
| `"union"` | — | Conforme especificação da operação |
| `"intersection"` | — | Conforme especificação da operação |

## Outcomes Esperados

- Arquivo compactado (ZIP) com resultados prontos para download.
- Dados de saída formatados e prontos para consumo por operações posteriores.
- Rastreabilidade completa via metadados do asset.

## Workflows Utilizados

- Operação atômica `merge_geometries` — utilizada como componente de workflows maiores.

## APIs / Conectores

- **N/A**: Operação puramente computacional, sem dependências externas de API.

## Datasets / Fontes de Dados

- **Múltiplos rasters**: Sequência de rasters para mesclagem.

