# PRD — Workflow `index`

## JTBDs (Jobs To Be Done)

- Calcular índices espectrais (ex.: NDVI, EVI, MSAVI, NDRE, RECI, NDMI, PRI) a partir de imagens multiespectrais de satélite.
- Transformar bandas brutas em métricas biofísicas interpretáveis para agricultura e vegetação.

## Casos de Uso

1. **Monitoramento de vegetação**: Um agrônomo calcula NDVI semanalmente para avaliar a saúde das culturas.
2. **Pré-processamento para ML**: Workflows como `crop_segmentation` e `heatmap/classification` usam `index` como etapa interna para gerar features espectrais.

## Faz / Não Faz

- **Faz**: Calcula qualquer índice da biblioteca `awesome-spectral-indices` (desde que as bandas necessárias estejam disponíveis).
- **Faz**: Suporta índices nomeados: ndvi, evi, msavi, ndre, reci, ndmi, methane, pri.
- **Não Faz**: Não faz download de imagens — espera raster já disponível.
- **Não Faz**: Não calcula índices que exigem bandas ausentes no produto de origem.

## Users Inputs

| Parâmetro | Tipo   | Default | Descrição                        |
| --------- | ------ | ------- | -------------------------------- |
| `raster`  | Raster | —       | Raster multiespectral de entrada |
| `index`   | string | ndvi    | Nome do índice espectral         |

## System Outputs

| Sumidouro      | Tipo   | Descrição                                    |
| -------------- | ------ | -------------------------------------------- |
| `index_raster` | Raster | Raster de banda única com o índice calculado |

## Outcomes Esperados

- O raster de saída contém uma única banda com os valores do índice espectral selecionado.
- Os valores estão no intervalo esperado para cada índice (ex.: NDVI entre -1 e 1).
- O workflow falha se as bandas necessárias não estiverem presentes.

## APIs

- **Op interna**: `compute_index` (utiliza pacote Python `spyndex` + `awesome-spectral-indices`)

## CRUD

- **Create**: Submeter `farmvibes-ai run index`.
- **Read**: Sink `index_raster`.

## Bancos de Dados

Nenhum.

## Datasets e JSON Files

Nenhum.

## Tabelas

Nenhuma.

## Lógicas e Cálculos

1. `compute_index`:
   - Identifica as bandas disponíveis no raster de entrada.
   - Calcula o índice usando fórmulas da biblioteca `awesome-spectral-indices`.
   - **NDVI**: `(NIR - Red) / (NIR + Red)`
   - **EVI**: `2.5 * (NIR - Red) / (NIR + 6 * Red - 7.5 * Blue + 1)`
   - **MSAVI**: `(2 * NIR + 1 - sqrt((2 * NIR + 1)² - 8 * (NIR - Red))) / 2`
   - **NDRE**: `(NIR - RedEdge) / (NIR + RedEdge)`
   - **RECI**: `(NIR / RedEdge) - 1`
   - **NDMI**: `(NIR - SWIR) / (NIR + SWIR)`
   - **PRI**: `(Green - Blue) / (Green + Blue)`
   - Outros índices conforme especificação da awesome-spectral-indices.
   - Retorna raster de banda única.

## Index — Perfis Energéticos

| Perfil (Classe)            | Subclasse                        | Aplicação do Workflow                                                               | Valor Gerado                                                    |
| -------------------------- | -------------------------------- | ----------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| Biomassa / Bioenergia      | Cana, Floresta energética        | NDVI, EVI, NDRE para monitoramento de saúde e produtividade de cultivos energéticos | Estima disponibilidade de biomassa para usinas de bioenergia    |
| Mercado de Carbono         | REDD+, Agricultura baixo carbono | NDVI e NDMI para monitoramento de cobertura florestal e estoque de carbono          | Suporta MRV de projetos de carbono com indicadores espectrais   |
| Eficiência Energética      | Irrigação                        | NDMI para estresse hídrico, PRI para detecção de estresse fotoquímico               | Otimiza turno de rega e diagnose nutricional de cultivos        |
| Geração Solar Fotovoltaica | GD, GC                           | PRI e índices de aerossol para estimativa de irradiância e condição atmosférica     | Subsidia previsão de geração solar com dados de qualidade do ar |
| Distribuição de Energia    | Concessionárias                  | NDVI para monitoramento de crescimento vegetativo em faixas de servidão             | Programa poda seletiva com base em vigor vegetativo             |
