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
