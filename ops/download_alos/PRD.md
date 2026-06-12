# JTBDs (download_alos)

## JTBDs
1. Baixar mapas de classificação floresta/não-floresta do satélite ALOS
2. Integrar dados ALOS da Planetary Computer para análises de cobertura florestal

## Descrição
Baixa mapas de classificação de floresta/não-floresta do Advanced Land Observing Satellite (ALOS) via Planetary Computer. A operação consulta o tile ALOS pelo ID, faz download dos assets TIFF e retorna um raster categórico com as classes de cobertura florestal.

## Inputs
- `product`: `AlosProduct` com metadados do tile ALOS a ser baixado

## Outputs
- `raster`: `CategoricalRaster` com banda "forest_non_forest" e categorias do ALOS

## Lógicas e Cálculos
- Configura chave de assinatura da Planetary Computer
- Consulta coleção ALOS Forest pelo ID do produto
- Faz download dos assets do item encontrado
- Gera ID hash único baseado no produto, geometria e período

## Use Cases
1. **Ingestão de Alos**: Baixar dados Alos para uma região e período específicos.
2. **Atualização de catálogo**: Manter uma base local atualizada com dados Alos mais recentes.
3. **Integração em pipeline**: Fornecer dados de entrada para operações de processamento downstream.

## Faz / Não Faz

- **Faz**: Download de dados da fonte original para armazenamento local.
- **Faz**: Validação de integridade dos dados baixados.
- **Não Faz**: Não processa ou analisa o conteúdo baixado — apenas transfere.
- **Não Faz**: Não modifica os dados originais.

## Variáveis

| Variável | Tipo | Descrição |
|----------|------|-----------|
| `product` | — | Conforme especificação da operação |

## Outcomes Esperados

- Raster geoespacial pronto para visualização e análises subsequentes.
- Dados de saída formatados e prontos para consumo por operações posteriores.
- Rastreabilidade completa via metadados do asset.

## Workflows Utilizados

- Operação atômica `download_alos` — utilizada como componente de workflows maiores.

## APIs / Conectores

- **Microsoft Planetary Computer**: Catálogo STAC e API de dados.

## Datasets / Fontes de Dados

- **ALOS PALSAR**: Mosaico anual florestal (25m).

