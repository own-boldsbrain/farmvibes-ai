# JTBDs (download_ambient_weather)

## JTBDs
1. Obter dados meteorológicos históricos de estações Ambient Weather em uma região
2. Integrar dados de clima local para análises agronômicas e ambientais

## Descrição
Conecta-se à API REST Ambient Weather para solicitar dados meteorológicos de estações dentro de uma geometria e período especificados. A operação gerencia rate limiting, divide requisições em blocos (max 288 pontos por chamada), trata falhas de estação com skip de 360 min, e exporta os dados como CSV estruturado.

## Inputs
- `user_input`: `DataVibe` com geometria (bounding box) e período de interesse

## Outputs
- `weather`: `WeatherVibe` com asset CSV contendo séries temporais de dados meteorológicos

## Lógicas e Cálculos
- Identifica dispositivo meteorológico dentro da geometria fornecida
- Calcula intervalo de dados baseado no `feed_interval` (5 min default) entre data inicial e final
- Se limite > 288 pontos, divide em chunks e insere sleep de 1s entre chamadas para evitar rate limit
- Em caso de falha, pula 360 min e tenta novamente; após 25 falhas consecutivas, aborta
- Persiste DataFrame pandas como CSV e retorna `WeatherVibe` com hash único

## Use Cases
1. **Ingestão de Ambient Weather**: Baixar dados Ambient Weather para uma região e período específicos.
2. **Atualização de catálogo**: Manter uma base local atualizada com dados Ambient Weather mais recentes.
3. **Integração em pipeline**: Fornecer dados de entrada para operações de processamento downstream.

## Faz / Não Faz

- **Faz**: Download de dados da fonte original para armazenamento local.
- **Faz**: Validação de integridade dos dados baixados.
- **Não Faz**: Não processa ou analisa o conteúdo baixado — apenas transfere.
- **Não Faz**: Não modifica os dados originais.

## Variáveis

N/A — parâmetros definidos no workflow que invoca esta operação.

## Outcomes Esperados

- Dados de saída formatados e prontos para consumo por operações posteriores.
- Rastreabilidade completa via metadados do asset.

## Workflows Utilizados

- Operação atômica `download_ambient_weather` — utilizada como componente de workflows maiores.

## APIs / Conectores

- **Fonte externa**: API de dados conforme especificação do produto.

## Datasets / Fontes de Dados

- **Dados de entrada**: Fornecidos pelo usuário ou por operações anteriores no pipeline.

