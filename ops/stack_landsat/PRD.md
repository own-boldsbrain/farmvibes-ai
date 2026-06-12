# JTBDs (stack_landsat_bands)

## JTBDs
1. Empilhar bandas individuais Landsat em um único raster multibanda
2. Aplicar máscara QA para remover pixels com nuvens/sombras

## Descrição
Agrupa as bandas baixadas de um produto Landsat em um único raster multibanda, aplicando máscara de qualidade (QA_PIXEL) quando configurado.

## Inputs
- `landsat_product`: LandsatProduct — produto Landsat com bandas individuais

## Outputs
- `landsat_raster`: LandsatRaster — raster multibanda empilhado

## Lógicas e Cálculos
1. Abre arquivos de banda via xarray/rasterio e concatena ao longo do eixo bands
2. Se qa_mask_value > 0, aplica bitwise AND com QA_PIXEL para mascarar pixels indesejados
3. Salva raster empilhado com `save_raster_to_asset`
4. Mapeia nomes de banda para índices (incluindo aliases Spyndex: B, G, R, N, S1, S2)

## Use Cases
1. **Automação**: Agrupa as bandas baixadas de um produto Landsat em um único raster multibanda, aplicando máscara de qualidade (QA_PIXEL) quando configurado de forma programática e escalável.
2. **Pipeline de dados**: Integrar esta operação em workflows maiores de análise geoespacial.
3. **Batch processing**: Processar múltiplas regiões/períodos de forma paralela.

## Faz / Não Faz

- **Faz**: Executa a operação conforme parâmetros fornecidos.
- **Não Faz**: Não modifica os dados de entrada originais.
- **Não Faz**: Não valida resultados contra referências externas.

## Variáveis

| Variável | Tipo | Descrição |
|----------|------|-----------|
| `landsat_product` | — | Conforme especificação da operação |

## Outcomes Esperados

- Raster geoespacial pronto para visualização e análises subsequentes.
- Dados de saída formatados e prontos para consumo por operações posteriores.
- Rastreabilidade completa via metadados do asset.

## Workflows Utilizados

- Operação atômica `stack_landsat` — utilizada como componente de workflows maiores.

## APIs / Conectores

- **USGS/EROS**: Catálogo e download de imagens Landsat.

## Datasets / Fontes de Dados

- **Landsat 5/7/8/9**: Reflectância de superfície, 30m (15m pancromático).

