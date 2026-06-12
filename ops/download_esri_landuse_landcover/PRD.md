# JTBDs (download_esri_landuse_landcover)

## JTBDs
1. Baixar mapas de uso e cobertura do solo ESRI 10m (9 classes) para uma região
2. Obter dados categóricos de uso do solo para análises ambientais e agrícolas

## Descrição
Baixa rasters de uso e cobertura do solo ESRI (10m resolução, 9 classes) da Planetary Computer a partir de um `EsriLandUseLandCoverProduct`. Consulta o tile pelo ID, faz download dos assets e retorna um `CategoricalRaster` com as classes de uso do solo.

## Inputs
- `input_product`: `EsriLandUseLandCoverProduct` com ID do tile e geometria

## Outputs
- `downloaded_product`: `CategoricalRaster` com banda "data" e 9 categorias ESRI de uso/cobertura do solo

## Lógicas e Cálculos
- Configura chave de assinatura da Planetary Computer
- Consulta coleção ESRI Land Use/Land Cover pelo ID do produto
- Faz download dos assets do item encontrado
- Gera asset de visualização com banda única
- Retorna `CategoricalRaster` com ID hash único e categorias pré-definidas da coleção ESRI

## Use Cases
1. **Ingestão de Esri Landuse Landcover**: Baixar dados Esri Landuse Landcover para uma região e período específicos.
2. **Atualização de catálogo**: Manter uma base local atualizada com dados Esri Landuse Landcover mais recentes.
3. **Integração em pipeline**: Fornecer dados de entrada para operações de processamento downstream.

## Faz / Não Faz

- **Faz**: Download de dados da fonte original para armazenamento local.
- **Faz**: Validação de integridade dos dados baixados.
- **Não Faz**: Não processa ou analisa o conteúdo baixado — apenas transfere.
- **Não Faz**: Não modifica os dados originais.

## Variáveis

| Variável | Tipo | Descrição |
|----------|------|-----------|
| `input_product` | — | Conforme especificação da operação |
| `EsriLandUseLandCoverProduct` | — | Conforme especificação da operação |

## Outcomes Esperados

- Raster geoespacial pronto para visualização e análises subsequentes.
- Dados de saída formatados e prontos para consumo por operações posteriores.
- Rastreabilidade completa via metadados do asset.

## Workflows Utilizados

- Operação atômica `download_esri_landuse_landcover` — utilizada como componente de workflows maiores.

## APIs / Conectores

- **Microsoft Planetary Computer**: Catálogo STAC e API de dados.

## Datasets / Fontes de Dados

- **Dados de entrada**: Fornecidos pelo usuário ou por operações anteriores no pipeline.

