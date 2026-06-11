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
