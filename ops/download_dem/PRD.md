# JTBDs (download_dem)

## JTBDs
1. Baixar modelos digitais de elevação (DEM) para um tile específico
2. Obter rasters de elevação georreferenciados para análises topográficas

## Descrição
Baixa rasters de Modelo Digital de Elevação (DEM) da Planetary Computer a partir de um `DemProduct`. A operação valida o provedor e resolução do DEM, consulta o tile pelo ID, faz download dos assets e retorna um `DemRaster` com banda de elevação e colormap interpolado para visualização.

## Inputs
- `input_product`: `DemProduct` com tile_id, provedor, resolução e geometria

## Outputs
- `downloaded_product`: `DemRaster` com banda "elevation", metadados do tile e colormap preto-branco (0-4000m)

## Lógicas e Cálculos
- Valida provedor do DEM com `validate_dem_provider` usando coleção apropriada da Planetary Computer
- Consulta item pelo tile_id na coleção validada
- Faz download dos assets do item para diretório temporário
- Gera colormap interpolado linearmente entre preto (0m) e branco (4000m)
- Retorna `DemRaster` com ID hash único e atributos de tile_id, resolução e provedor

## Use Cases
1. **Ingestão de Dem**: Baixar dados Dem para uma região e período específicos.
2. **Atualização de catálogo**: Manter uma base local atualizada com dados Dem mais recentes.
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

## Outcomes Esperados

- Raster geoespacial pronto para visualização e análises subsequentes.
- Dados de saída formatados e prontos para consumo por operações posteriores.
- Rastreabilidade completa via metadados do asset.

## Workflows Utilizados

- Operação atômica `download_dem` — utilizada como componente de workflows maiores.

## APIs / Conectores

- **Microsoft Planetary Computer**: Catálogo STAC e API de dados.

## Datasets / Fontes de Dados

- **DEM**: Modelo digital de elevação.

