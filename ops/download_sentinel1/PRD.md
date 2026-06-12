# JTBDs (download_sentinel1)

## JTBDs
1. Obter bandas de retroespalhamento (VV+VH) do Sentinel-1 RTC em um único raster empilhado
2. Analisar resposta de radar em áreas agrícolas para estimativa de umidade e biomassa

## Descrição
Baixa as bandas VV e VH do Sentinel-1 RTC (Radiometric Terrain Correction) do Planetary Computer, empilhando-as em um único TIFF multibanda com compressão.

## Inputs
- `sentinel_product`: `Sentinel1Product` com ID e geometria
- `api_key` (opcional): Chave de API do Planetary Computer
- `block_size`: Tamanho do bloco de leitura paralela (default: 2048)
- `num_workers`: Número de threads para download (default: 20)
- `timeout_s`: Timeout por banda em segundos (default: 120)

## Outputs
- `downloaded_product`: `Sentinel1Raster` com as bandas VV e VH empilhadas

## Lógicas e Cálculos
1. Conecta ao `Sentinel1RTCCollection` no Planetary Computer e consulta item pelo ID
2. Assina o item com `pc.sign` e baixa os assets (VV, VH) para diretório temporário
3. Empilha as bandas serialmente via `serial_stack_bands` em blocos com interpolação bilinear
4. Aplica parâmetros de compressão `FLOAT_COMPRESSION_KWARGS`
5. Mapeia bandas como `{"VV": 0, "VH": 1}` e retorna `Sentinel1Raster`

## Use Cases
1. **Ingestão de Sentinel1**: Baixar dados Sentinel1 para uma região e período específicos.
2. **Atualização de catálogo**: Manter uma base local atualizada com dados Sentinel1 mais recentes.
3. **Integração em pipeline**: Fornecer dados de entrada para operações de processamento downstream.

## Faz / Não Faz

- **Faz**: Download de dados da fonte original para armazenamento local.
- **Faz**: Validação de integridade dos dados baixados.
- **Não Faz**: Não processa ou analisa o conteúdo baixado — apenas transfere.
- **Não Faz**: Não modifica os dados originais.

## Variáveis

| Variável | Tipo | Descrição |
|----------|------|-----------|
| `sentinel_product` | — | Conforme especificação da operação |
| `api_key` | — | Conforme especificação da operação |
| `block_size` | — | Conforme especificação da operação |
| `num_workers` | — | Conforme especificação da operação |
| `timeout_s` | — | Conforme especificação da operação |

## Outcomes Esperados

- Raster geoespacial pronto para visualização e análises subsequentes.
- Dados de saída formatados e prontos para consumo por operações posteriores.
- Rastreabilidade completa via metadados do asset.

## Workflows Utilizados

- Operação atômica `download_sentinel1` — utilizada como componente de workflows maiores.

## APIs / Conectores

- **Microsoft Planetary Computer**: Catálogo STAC e API de dados.
- **Copernicus Open Access Hub (SciHub)**: Dados Sentinel.

## Datasets / Fontes de Dados

- **Sentinel-2 (MSI)**: Reflectância de superfície, 10-60m, 13 bandas.
- **Sentinel-1 (SAR)**: Radar C-band, GRD e RTC.

