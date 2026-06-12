# JTBDs (download_stack_sentinel2)

## JTBDs
1. Obter as 12 bandas Sentinel-2 L2A empilhadas em resolução 10m em um único TIFF
2. Gerar máscara de nuvens (opaca, cirrus, outras) na mesma resolução para filtragem

## Descrição
Baixa as 12 bandas espectrais do Sentinel-2 L2A do Planetary Computer, reamostra para 10m, empilha em TIFF multibanda e gera máscara de nuvens rasterizada.

## Inputs
- `sentinel_product`: `Sentinel2Product` com nome do produto e geometria
- `api_key` (opcional): Chave de API do Planetary Computer
- `block_size`: Tamanho do bloco para leitura paralela (default: 2048)
- `num_workers`: Número de threads (default: 20)
- `timeout_s`: Timeout por banda (default: 120)

## Outputs
- `raster`: `Sentinel2Raster` com 12 bandas empilhadas e aliases Spyndex (R, G, B, N, S1, S2, etc.)
- `cloud`: `Sentinel2CloudMask` com máscara de nuvens categorizada (NO-CLOUD, OPAQUE, CIRRUS, OTHER)

## Lógicas e Cálculos
1. Conecta ao `Sentinel2Collection`, consulta itens e filtra pelo partial ID (mais recente)
2. Assina o item com `pc.sign` e baixa os assets das bandas para diretório temporário
3. Empilha bandas serialmente via `serial_stack_bands` com reamostragem bilinear para 10m (baseada na banda B02)
4. Rasteriza máscara de nuvens: lê GML do Planetary Computer, rasteriza polígonos de OPAQUE, CIRRUS e OTHER sobre a grade de 10m; se GML inexistente, gera máscara vazia (sem nuvens)
5. Adiciona aliases Spyndex para compatibilidade com índices espectrais
6. Retorna `Sentinel2Raster` e `Sentinel2CloudMask` com hashes SHA256 como IDs

## Use Cases
1. **Ingestão de Stack Sentinel2**: Baixar dados Stack Sentinel2 para uma região e período específicos.
2. **Atualização de catálogo**: Manter uma base local atualizada com dados Stack Sentinel2 mais recentes.
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

- Operação atômica `download_stack_sentinel2` — utilizada como componente de workflows maiores.

## APIs / Conectores

- **Microsoft Planetary Computer**: Catálogo STAC e API de dados.
- **Copernicus Open Access Hub (SciHub)**: Dados Sentinel.

## Datasets / Fontes de Dados

- **Sentinel-2 (MSI)**: Reflectância de superfície, 10-60m, 13 bandas.

