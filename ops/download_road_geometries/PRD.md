# JTBDs (download_road_geometries)

## JTBDs
1. Obter malha viária de uma região para análise de acessibilidade a talhões
2. Calcular distâncias de estradas para logística de escoamento de safra

## Descrição
Baixa geometrias de vias do OpenStreetMap para uma região delimitada por bounding box, com tipo de rede e buffer configuráveis.

## Inputs
- `input_region`: `DataVibe` com bounding box da área de interesse
- `network_type`: Tipo de rede viária (ex.: `"all_private"`, `"drive"`, `"walk"`)
- `buffer_size`: Tamanho do buffer em metros ao redor da região para expandir a busca (default: 100m)

## Outputs
- `roads`: `GeometryCollection` contendo as edges da malha viária em formato GeoPackage

## Lógicas e Cálculos
1. Cria polígono a partir do bbox da região de entrada
2. Projeta para UTM, aplica buffer (`buffer_size`) e re-projeta para WGS84 para ampliar área de busca
3. Obtém grafo de vias do OSM via `osmnx.graph_from_polygon` com o `network_type` especificado
4. Converte grafo para GeoDataFrame de edges e filtra apenas as que interseccionam a geometria original
5. Converte listas nos metadados para strings e salva como GeoPackage
6. Retorna `GeometryCollection` com o asset GeoPackage

## Use Cases
1. **Ingestão de Road Geometries**: Baixar dados Road Geometries para uma região e período específicos.
2. **Atualização de catálogo**: Manter uma base local atualizada com dados Road Geometries mais recentes.
3. **Integração em pipeline**: Fornecer dados de entrada para operações de processamento downstream.

## Faz / Não Faz

- **Faz**: Download de dados da fonte original para armazenamento local.
- **Faz**: Validação de integridade dos dados baixados.
- **Não Faz**: Não processa ou analisa o conteúdo baixado — apenas transfere.
- **Não Faz**: Não modifica os dados originais.

## Variáveis

| Variável | Tipo | Descrição |
|----------|------|-----------|
| `input_region` | — | Conforme especificação da operação |
| `network_type` | — | Conforme especificação da operação |
| `"all_private"` | — | Conforme especificação da operação |
| `"drive"` | — | Conforme especificação da operação |
| `"walk"` | — | Conforme especificação da operação |
| `buffer_size` | — | Conforme especificação da operação |

## Outcomes Esperados

- Dados de saída formatados e prontos para consumo por operações posteriores.
- Rastreabilidade completa via metadados do asset.

## Workflows Utilizados

- Operação atômica `download_road_geometries` — utilizada como componente de workflows maiores.

## APIs / Conectores

- **Fonte externa**: API de dados conforme especificação do produto.

## Datasets / Fontes de Dados

- **Dados de entrada**: Fornecidos pelo usuário ou por operações anteriores no pipeline.

