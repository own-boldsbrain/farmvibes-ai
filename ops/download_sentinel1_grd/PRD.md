# JTBDs (download_sentinel1_grd)

## JTBDs
1. Obter a cena completa Sentinel-1 GRD (Ground Range Detected) em formato .SAFE.zip
2. Dispor dos arquivos brutos de radar para processamento especializado fora da plataforma

## Descrição
Baixa todos os arquivos de uma cena Sentinel-1 GRD do blob storage do Planetary Computer e os empacota em arquivo .SAFE.zip.

## Inputs
- `sentinel_product`: `Sentinel1Product` com nome do produto e modo de aquisição
- `api_key` (opcional): Chave de API do Planetary Computer

## Outputs
- `downloaded_product`: `DownloadedSentinel1Product` com o asset ZIP contendo a cena completa

## Lógicas e Cálculos
1. Obtém container client do blob storage e lista os arquivos da cena
2. Determina prefixo comum e nome do produto .SAFE
3. Baixa cada arquivo (blob) com retry de até 5 tentativas e espera de 10s entre falhas
4. Reconstrói estrutura de diretórios .SAFE e compacta tudo em ZIP via `shutil.make_archive`
5. Adiciona o ZIP como asset ao `DownloadedSentinel1Product`

## Use Cases
1. **Ingestão de Sentinel1 Grd**: Baixar dados Sentinel1 Grd para uma região e período específicos.
2. **Atualização de catálogo**: Manter uma base local atualizada com dados Sentinel1 Grd mais recentes.
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

## Outcomes Esperados

- Dados de saída formatados e prontos para consumo por operações posteriores.
- Rastreabilidade completa via metadados do asset.

## Workflows Utilizados

- Operação atômica `download_sentinel1_grd` — utilizada como componente de workflows maiores.

## APIs / Conectores

- **Microsoft Planetary Computer**: Catálogo STAC e API de dados.
- **Copernicus Open Access Hub (SciHub)**: Dados Sentinel.

## Datasets / Fontes de Dados

- **Sentinel-2 (MSI)**: Reflectância de superfície, 10-60m, 13 bandas.
- **Sentinel-1 (SAR)**: Radar C-band, GRD e RTC.

