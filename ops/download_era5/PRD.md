# JTBDs (download_era5)

## JTBDs
1. Baixar variáveis climáticas globais do ERA5 (Copernicus)
2. Obter dados de reanálise atmosférica para modelos agronômicos e ambientais

## Descrição
Baixa produtos ERA5 do Copernicus Climate Data Store (CDS) ou da Planetary Computer. A operação suporta duas fontes: (1) Planetary Computer, baixando assets Zarr assinados para a variável solicitada; (2) CDS diretamente via API cdsapi. Em ambos os casos, converte o dado para NetCDF e retorna como `Era5Product`.

## Inputs
- `era5_product`: `Era5Product` com item_id, variável, geometria e período

## Outputs
- `downloaded_product`: `Era5Product` com asset NetCDF contendo a variável ERA5 solicitada

## Lógicas e Cálculos
- Se `item_id` não é vazio, acessa Planetary Computer: assina asset Zarr, abre com xarray usando kwargs específicos
- Se `item_id` é vazio, acessa CDS: usa cdsapi.Client com chave da API para fazer requisição e baixa resultado via fsspec
- Converte dataset xarray para NetCDF e persiste em arquivo local
- Gera ID hash único combinando ID do produto, geometria e período

## Use Cases
1. **Ingestão de Era5**: Baixar dados Era5 para uma região e período específicos.
2. **Atualização de catálogo**: Manter uma base local atualizada com dados Era5 mais recentes.
3. **Integração em pipeline**: Fornecer dados de entrada para operações de processamento downstream.

## Faz / Não Faz

- **Faz**: Download de dados da fonte original para armazenamento local.
- **Faz**: Validação de integridade dos dados baixados.
- **Não Faz**: Não processa ou analisa o conteúdo baixado — apenas transfere.
- **Não Faz**: Não modifica os dados originais.

## Variáveis

| Variável | Tipo | Descrição |
|----------|------|-----------|
| `era5_product` | — | Conforme especificação da operação |

## Outcomes Esperados

- Dados de saída formatados e prontos para consumo por operações posteriores.
- Rastreabilidade completa via metadados do asset.

## Workflows Utilizados

- Operação atômica `download_era5` — utilizada como componente de workflows maiores.

## APIs / Conectores

- **Microsoft Planetary Computer**: Catálogo STAC e API de dados.
- **Copernicus Open Access Hub (SciHub)**: Dados Sentinel.

## Datasets / Fontes de Dados

- **ERA5**: Reanálise climática (0.25°, horária).

