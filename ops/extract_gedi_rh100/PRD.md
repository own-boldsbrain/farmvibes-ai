# JTBDs (extract_gedi_rh100)

## JTBDs
1. Extrair altura de dossel (RH100) do GEDI L2B para uma região
2. Filtrar dados por qualidade e geometria de interseção

## Descrição
Extrai variável RH100 (altura relativa 100%) de produtos GEDI L2B (HDF5) que intersectam a região de interesse, gerando GeoPackage com geometria, feixe e valor RH100.

## Inputs
- `gedi_product: GEDIProduct` — produto GEDI L2B
- `roi: DataVibe` — região de interesse
- Parâmetro: `check_quality` (padrão true)

## Outputs
- `rh100: GeometryCollection` — pontos com RH100 e metadados

## Lógicas e Cálculos
- Itera sobre beams (BEAM0000 a BEAM1011) do HDF5
- Filtra por bounding box e within da geometria ROI
- Se `check_quality`, filtra por `l2b_quality_flag`
- Salva GeoDataFrame com colunas: geometry, beam, rh100 em formato GPKG

## Use Cases
1. **Automação**: Extrai variável RH100 (altura relativa 100%) de produtos GEDI L2B (HDF5) que intersectam a região de interesse, gerando GeoPackage com geometria, feixe e valor RH100 de forma programática e escalável.
2. **Pipeline de dados**: Integrar esta operação em workflows maiores de análise geoespacial.
3. **Batch processing**: Processar múltiplas regiões/períodos de forma paralela.

## Faz / Não Faz

- **Faz**: Executa a operação conforme parâmetros fornecidos.
- **Não Faz**: Não modifica os dados de entrada originais.
- **Não Faz**: Não valida resultados contra referências externas.

## Variáveis

| Variável | Tipo | Descrição |
|----------|------|-----------|
| `gedi_product: GEDIProduct` | — | Conforme especificação da operação |
| `roi: DataVibe` | — | Conforme especificação da operação |
| `check_quality` | — | Conforme especificação da operação |

## Outcomes Esperados

- Dados de saída formatados e prontos para consumo por operações posteriores.
- Rastreabilidade completa via metadados do asset.

## Workflows Utilizados

- Operação atômica `extract_gedi_rh100` — utilizada como componente de workflows maiores.

## APIs / Conectores

- **N/A**: Operação puramente computacional, sem dependências externas de API.

## Datasets / Fontes de Dados

- **Dados de entrada**: Fornecidos pelo usuário ou por operações anteriores no pipeline.

