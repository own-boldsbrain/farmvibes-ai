# JTBDs (download_hansen)

## JTBDs
1. Obter dados de mudança florestal (cobertura, perda, ganho) para uma região
2. Analisar histórico de desmatamento ou regeneração em talhões e propriedades

## Descrição
Baixa um produto Global Forest Change (Hansen) — cobertura florestal, perda ou ganho — a partir de URL pública e retorna como raster em resolução de 30m.

## Inputs
- `hansen_product`: Produto Hansen contendo URL do asset, nome da camada, tile e ano

## Outputs
- `raster`: Raster com os dados de mudança florestal da camada solicitada

## Lógicas e Cálculos
1. Constrói nome do arquivo a partir do layer, tile e último ano disponível
2. Baixa o asset via `download_file` da URL contida no produto Hansen
3. Gera `AssetVibe` com o arquivo TIFF e retorna `Raster` com a banda mapeada para o nome da camada

## Use Cases
1. **Ingestão de Hansen**: Baixar dados Hansen para uma região e período específicos.
2. **Atualização de catálogo**: Manter uma base local atualizada com dados Hansen mais recentes.
3. **Integração em pipeline**: Fornecer dados de entrada para operações de processamento downstream.

## Faz / Não Faz

- **Faz**: Download de dados da fonte original para armazenamento local.
- **Faz**: Validação de integridade dos dados baixados.
- **Não Faz**: Não processa ou analisa o conteúdo baixado — apenas transfere.
- **Não Faz**: Não modifica os dados originais.

## Variáveis

| Variável | Tipo | Descrição |
|----------|------|-----------|
| `hansen_product` | — | Conforme especificação da operação |

## Outcomes Esperados

- Raster geoespacial pronto para visualização e análises subsequentes.
- Dados de saída formatados e prontos para consumo por operações posteriores.
- Rastreabilidade completa via metadados do asset.

## Workflows Utilizados

- Operação atômica `download_hansen` — utilizada como componente de workflows maiores.

## APIs / Conectores

- **Fonte externa**: API de dados conforme especificação do produto.

## Datasets / Fontes de Dados

- **Hansen**: Global Forest Change (30m).

