# JTBDs (Heatmap Sensor)

## JTBDs
1. Gerar mapas de calor de nutrientes do solo a partir de amostras pontuais e imagens de satélite
2. Interpolar amostras de solo para área total do talhão usando algoritmos configuráveis

## Descrição
Recebe um raster de imagem, uma coleção de pontos de amostra de solo com atributo (ex: "C" = Carbono) e um polígono de boundary. Cria um mesh grid de `resolution` metros dentro do talhão e aplica algoritmo de interpolação (`nearest neighbor`, `cluster overlap` ou `kriging neighbor`). O resultado é rasterizado em faixas (bins) e exportado como GeoTIFF + shapefile.

## Inputs
- `raster`: `Raster`
- `samples`: `GeometryCollection` (amostras de solo com atributo)
- `samples_boundary`: `GeometryCollection` (clusters/boundary)
- Parâmetros: `attribute_name`, `simplify`, `tolerance`, `algorithm`, `resolution`, `bins`

## Outputs
- `result`: `DataVibe`

## Lógicas e Cálculos
- `create_mesh_grid`: gera grade de pontos com espaçamento `resolution` dentro do talhão
- Algoritmos: `nearest neighbor`, `cluster overlap` (média por cluster), `kriging neighbor`
- `rasterize_heatmap`: rasteriza shapes dos nutrientes com `MergeAlg.replace`
- `group_to_nearest`: discretiza valores em `bins` usando histograma, substitui por média do bin
- Aplica máscara do talhão (`ar.sum(axis=0) == 0 → 0`)
- Exporta shapefile + GeoTIFF como assets

## Use Cases
1. **Automação**: Recebe um raster de imagem, uma coleção de pontos de amostra de solo com atributo (ex: "C" = Carbono) e um polígono de boundary de forma programática e escalável.
2. **Pipeline de dados**: Integrar esta operação em workflows maiores de análise geoespacial.
3. **Batch processing**: Processar múltiplas regiões/períodos de forma paralela.

## Faz / Não Faz

- **Faz**: Executa a operação conforme parâmetros fornecidos.
- **Faz**: Processa rasters geoespaciais com suporte a múltiplas bandas.
- **Faz**: Suporte a geometrias delimitadoras para recorte espacial.
- **Não Faz**: Não modifica os dados de entrada originais.
- **Não Faz**: Não valida resultados contra referências externas.

## Variáveis

| Variável | Tipo | Descrição |
|----------|------|-----------|
| `raster` | — | Conforme especificação da operação |
| `samples` | — | Conforme especificação da operação |
| `samples_boundary` | — | Conforme especificação da operação |
| `attribute_name` | — | Conforme especificação da operação |
| `simplify` | — | Conforme especificação da operação |
| `tolerance` | — | Conforme especificação da operação |
| `algorithm` | — | Conforme especificação da operação |
| `resolution` | — | Conforme especificação da operação |

## Outcomes Esperados

- Arquivo compactado (ZIP) com resultados prontos para download.
- Dados de saída formatados e prontos para consumo por operações posteriores.
- Rastreabilidade completa via metadados do asset.

## Workflows Utilizados

- Operação atômica `heatmap_sensor` — utilizada como componente de workflows maiores.

## APIs / Conectores

- **N/A**: Operação puramente computacional, sem dependências externas de API.

## Datasets / Fontes de Dados

- **Dados de entrada**: Fornecidos pelo usuário ou por operações anteriores no pipeline.

