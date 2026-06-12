# JTBDs (download_herbie)

## JTBDs
1. Obter previsões meteorológicas de modelos numéricos (HRRR, GFS, etc.) para datas e lead times específicos
2. Alimentar modelos de tomada de decisão agrícola com dados de forecast

## Descrição
Baixa arquivos GRIB de previsão meteorológica do Herbie (modelo numérico como HRRR/GFS) para um produto, lead time e texto de busca definidos.

## Inputs
- `herbie_product`: Produto Herbie com intervalo de tempo, lead time (horas), modelo, produto e texto de busca

## Outputs
- `forecast`: Arquivo GRIB com a previsão meteorológica e metadados das bandas (elementos GRIB)

## Lógicas e Cálculos
1. Instancia objeto `Herbie` com time range, lead time, modelo e produto
2. Faz download do GRIB via `H.download(search_text)`
3. Abre o GRIB com `rasterio` e extrai os nomes dos elementos (`GRIB_ELEMENT`) de cada banda
4. Ajusta o time range para o instante da previsão somando lead time à data base
5. Retorna `Grib` com assets, bandas mapeadas aos elementos e metadado de lead time

## Use Cases
1. **Ingestão de Herbie**: Baixar dados Herbie para uma região e período específicos.
2. **Atualização de catálogo**: Manter uma base local atualizada com dados Herbie mais recentes.
3. **Integração em pipeline**: Fornecer dados de entrada para operações de processamento downstream.

## Faz / Não Faz

- **Faz**: Download de dados da fonte original para armazenamento local.
- **Faz**: Validação de integridade dos dados baixados.
- **Não Faz**: Não processa ou analisa o conteúdo baixado — apenas transfere.
- **Não Faz**: Não modifica os dados originais.

## Variáveis

| Variável | Tipo | Descrição |
|----------|------|-----------|
| `herbie_product` | — | Conforme especificação da operação |

## Outcomes Esperados

- Dados de saída formatados e prontos para consumo por operações posteriores.
- Rastreabilidade completa via metadados do asset.

## Workflows Utilizados

- Operação atômica `download_herbie` — utilizada como componente de workflows maiores.

## APIs / Conectores

- **Herbie/HRRR**: Acesso a previsões numéricas do NOAA.

## Datasets / Fontes de Dados

- **NOAA HRRR/GFS**: Previsões numéricas meteorológicas.

