# JTBDs (combine_chunks)

## JTBDs

1. Reconstruir raster completo a partir de chunks processados em paralelo
2. Montar cena final com todos os pedaços na posição correta

## Descrição

Combina uma lista de `RasterChunk` em um único `Raster`. Usa as informações de posição e limites de escrita de cada chunk para remontar a imagem final.

## Inputs

- `chunks: List[RasterChunk]` — chunks a serem combinados

## Outputs

- `raster: Raster` — raster completo reconstituído

## Lógicas e Cálculos

- Mapeia cada chunk pela posição `(chunk_pos)` e calcula limites absolutos de escrita
- Abre arquivo GeoTIFF de saída com metadados do chunk (0,0)
- Para cada chunk, lê a janela relativa e escreve na janela absoluta correspondente
- Calcula bounding box em EPSG:4326 a partir do CRS projetado

## Use Cases
1. **Automação**: Combina uma lista de `RasterChunk` em um único `Raster` de forma programática e escalável.
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
| `chunks: List[RasterChunk]` | — | Conforme especificação da operação |

## Outcomes Esperados

- Raster geoespacial pronto para visualização e análises subsequentes.
- Dados de saída formatados e prontos para consumo por operações posteriores.
- Rastreabilidade completa via metadados do asset.

## Workflows Utilizados

- Operação atômica `combine_chunks` — utilizada como componente de workflows maiores.

## APIs / Conectores

- **N/A**: Operação puramente computacional, sem dependências externas de API.

## Datasets / Fontes de Dados

- **Dados de entrada**: Fornecidos pelo usuário ou por operações anteriores no pipeline.

