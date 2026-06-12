# JTBDs (download_landsat_from_pc)

## JTBDs
1. Obter todas as bandas espectrais de uma cena Landsat (qualquer missão) para processamento downstream
2. Ter acesso local às bandas de reflectância, termal e qualidade de uma cena

## Descrição
Baixa todas as bandas disponíveis de um produto Landsat (Landsat 4-9) do Planetary Computer e as anexa ao produto.

## Inputs
- `landsat_product`: Produto Landsat com ID do tile e geometria
- `api_key` (opcional): Chave de API do Planetary Computer

## Outputs
- `downloaded_product`: `LandsatProduct` com todas as bandas baixadas como assets locais

## Lógicas e Cálculos
1. Conecta ao `LandsatCollection` no Planetary Computer e consulta o item pelo `tile_id`
2. Itera sobre todas as chaves de asset da coleção e baixa cada banda
3. Trata bandas ausentes com log de aviso (sem interromper o fluxo)
4. Adiciona cada banda baixada ao produto via `add_downloaded_band`

## Use Cases
1. **Ingestão de Landsat From Pc**: Baixar dados Landsat From Pc para uma região e período específicos.
2. **Atualização de catálogo**: Manter uma base local atualizada com dados Landsat From Pc mais recentes.
3. **Integração em pipeline**: Fornecer dados de entrada para operações de processamento downstream.

## Faz / Não Faz

- **Faz**: Download de dados da fonte original para armazenamento local.
- **Faz**: Validação de integridade dos dados baixados.
- **Não Faz**: Não processa ou analisa o conteúdo baixado — apenas transfere.
- **Não Faz**: Não modifica os dados originais.

## Variáveis

| Variável | Tipo | Descrição |
|----------|------|-----------|
| `landsat_product` | — | Conforme especificação da operação |
| `api_key` | — | Conforme especificação da operação |

## Outcomes Esperados

- Dados de saída formatados e prontos para consumo por operações posteriores.
- Rastreabilidade completa via metadados do asset.

## Workflows Utilizados

- Operação atômica `download_landsat_from_pc` — utilizada como componente de workflows maiores.

## APIs / Conectores

- **Microsoft Planetary Computer**: Catálogo STAC e API de dados.
- **USGS/EROS**: Catálogo e download de imagens Landsat.

## Datasets / Fontes de Dados

- **Landsat 5/7/8/9**: Reflectância de superfície, 30m (15m pancromático).

