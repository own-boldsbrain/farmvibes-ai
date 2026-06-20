# JTBDs (download_chirps)

## JTBDs

1. Baixar dados de precipitação acumulada do CHIRPS (Climate Hazards Group InfraRed Precipitation with Station data)
2. Obter rasters COG de precipitação para análises hidrológicas e agronômicas

## Descrição

Baixa produtos de precipitação CHIRPS a partir de URLs de Cloud Optimized GeoTIFFs (COG) listados em `ChirpsProduct`. Extrai o nome do arquivo COG da URL, faz o download e retorna um `ChirpsProduct` com o asset local.

## Inputs

- `chirps_product`: `ChirpsProduct` contendo URL do dado CHIRPS a ser baixado

## Outputs

- `downloaded_product`: `ChirpsProduct` com asset TIFF baixado localmente

## Lógicas e Cálculos

- Extrai nome do arquivo COG da URL usando regex (`chirps-.*cog`)
- Faz download do arquivo via `download_file`
- Gera ID hash único combinando nome do arquivo, geometria e período
- Clona metadados do produto de entrada no produto baixado

## Use Cases

1. **Ingestão de Chirps**: Baixar dados Chirps para uma região e período específicos.
2. **Atualização de catálogo**: Manter uma base local atualizada com dados Chirps mais recentes.
3. **Integração em pipeline**: Fornecer dados de entrada para operações de processamento downstream.

## Faz / Não Faz

- **Faz**: Download de dados da fonte original para armazenamento local.
- **Faz**: Validação de integridade dos dados baixados.
- **Não Faz**: Não processa ou analisa o conteúdo baixado — apenas transfere.
- **Não Faz**: Não modifica os dados originais.

## Variáveis

| Variável         | Tipo | Descrição                          |
| ---------------- | ---- | ---------------------------------- |
| `chirps_product` | —    | Conforme especificação da operação |

## Outcomes Esperados

- Dados de saída formatados e prontos para consumo por operações posteriores.
- Rastreabilidade completa via metadados do asset.

## Workflows Utilizados

- Operação atômica `download_chirps` — utilizada como componente de workflows maiores.

## APIs / Conectores

- **Fonte externa**: API de dados conforme especificação do produto.

## Datasets / Fontes de Dados

- **CHIRPS**: Precipitação acumulada (0.05°, diário).
