# farm_ai/carbon_local/carbon_whatif

Calcula a quantidade de compensação de carbono que seria sequestrada em um talhão sazonal (seasonal field) usando as informações da linha de base (baseline - histórica) e do cenário (intervalo de tempo de interesse). Para derivar a quantidade de carbono, ele se baseia nas informações sazonais fornecidas tanto para a linha de base quanto para o cenário. A linha de base representa as informações históricas das práticas agrícolas usadas durante cada estação, que incluem fertilizantes, preparo do solo (tillage), colheita e corretivos orgânicos (organic amendment). É necessário um mínimo de 2 anos de informações de linha de base para executar o fluxo de trabalho (workflow). O cenário representa as futuras práticas agrícolas planejadas para cada estação, incluindo fertilizantes, preparo do solo, colheita e corretivos orgânicos. Para as informações de cenário fornecidas, o fluxo de trabalho calcula a quantidade de compensação de carbono que seria sequestrada em um talhão sazonal. As solicitações recebidas pelo fluxo de trabalho são encaminhadas para a API do COMET. Para saber mais informações sobre o COMET, consulte https://gitlab.com/comet-api/api-docs/-/tree/master/. Para entender as enumerações e informações aceitas pelo COMET, consulte https://gitlab.com/comet-api/api-docs/-/blob/master/COMET-Farm_API_File_Specification.xlsx. A solicitação enviada é executada em um prazo de 5 minutos a no máximo 2 horas. Se a resposta não for recebida do COMET dentro desse período, verifique o e-mail comet_support_email para obter informações sobre solicitações com falha; se nenhum e-mail for recebido, verifique o status das solicitações entrando em contato com este endereço de e-mail de suporte do COMET "appnrel@colostate.edu". Para uso público, o COMET limita a 50 solicitações por dia. Se mais solicitações precisarem ser enviadas, entre em contato com o endereço de e-mail de suporte.

```{mermaid}
    graph TD
    inp1>baseline_seasonal_fields]
    inp2>scenario_seasonal_fields]
    out1>carbon_output]
    tsk1{{comet_task}}
    inp1>baseline_seasonal_fields] -- baseline_seasonal_fields --> tsk1{{comet_task}}
    inp2>scenario_seasonal_fields] -- scenario_seasonal_fields --> tsk1{{comet_task}}
    tsk1{{comet_task}} -- carbon_output --> out1>carbon_output]
```

## Fontes (Sources)

- **baseline_seasonal_fields**: Lista de talhões sazonais que contêm as informações históricas das práticas agrícolas, como fertilizantes, preparo do solo, colheita e corretivos orgânicos.

- **scenario_seasonal_fields**: Lista de talhões sazonais que contêm as informações futuras das práticas agrícolas, como fertilizantes, preparo do solo, colheita e corretivos orgânicos.

## Sinks (Saídas)

- **carbon_output**: Sequestro de carbono recebido para as informações de cenário fornecidas como entrada.

## Parâmetros

- **comet_support_email**: E-mail registrado na API COMET-Farm. As solicitações são encaminhadas ao COMET com esta referência de e-mail. Este e-mail é usado pelo COMET para compartilhar as informações de volta para você em caso de solicitações com falha.

- **ngrok_token**: Token de sessão NGROK. O FarmVibes gera uma URL de web_hook e uma URL compartilhada com o COMET junto com a solicitação para receber a resposta do COMET. É uma URL acessível publicamente e é única para cada sessão. A URL é destruída assim que a sessão termina. Para iniciar a sessão ngrok, um token é gerado a partir desta URL https://dashboard.ngrok.com/

## Tarefas (Tasks)

- **comet_task**: Calcula a quantidade de compensação de carbono que seria sequestrada em um talhão sazonal usando as informações da linha de base (histórica) e do cenário (intervalo de tempo de interesse).

## Workflow Yaml

```yaml

name: carbon_whatif
sources:
  baseline_seasonal_fields:
  - comet_task.baseline_seasonal_fields
  scenario_seasonal_fields:
  - comet_task.scenario_seasonal_fields
sinks:
  carbon_output: comet_task.carbon_output
parameters:
  comet_support_email: null
  ngrok_token: null
tasks:
  comet_task:
    op: whatif_comet_local_op
    op_dir: carbon_local
    parameters:
      comet_support_email: '@from(comet_support_email)'
      ngrok_token: '@from(ngrok_token)'
description:
  short_description: Calcula a quantidade de compensação de carbono que seria sequestrada em um talhão sazonal usando as informações da linha de base (histórica) e do cenário (intervalo de tempo de interesse).
  long_description: Para derivar a quantidade de carbono, ele se baseia nas informações sazonais fornecidas tanto para a linha de base quanto para o cenário. A linha de base representa as informações históricas das práticas agrícolas usadas durante cada estação, que incluem fertilizantes, preparo do solo, colheita e corretivos orgânicos. É necessário um mínimo de 2 anos de informações de linha de base para executar o fluxo de trabalho. O cenário representa as futuras práticas agrícolas planejadas para cada estação, incluindo fertilizantes, preparo do solo, colheita e corretivos orgânicos. Para as informações de cenário fornecidas, o fluxo de trabalho calcula a quantidade de compensação de carbono que seria sequestrada em um talhão sazonal. É necessário um mínimo de 2 anos de informações de linha de base para executar o fluxo de trabalho. As solicitações recebidas pelo fluxo de trabalho são encaminhadas para a API do COMET. Para saber mais informações sobre o COMET, consulte https://gitlab.com/comet-api/api-docs/-/tree/master/. Para entender as enumerações e informações aceitas pelo COMET, consulte https://gitlab.com/comet-api/api-docs/-/blob/master/COMET-Farm_API_File_Specification.xlsx. A solicitação enviada é executada em um prazo de 5 minutos a no máximo 2 horas. Se a resposta não for recebida do COMET dentro desse período, verifique o e-mail comet_support_email para obter informações sobre solicitações com falha; se nenhum e-mail for recebido, verifique o status das solicitações entrando em contato com este endereço de e-mail de suporte do COMET "appnrel@colostate.edu". Para uso público, o COMET limita a 50 solicitações por dia. Se mais solicitações precisarem ser enviadas, entre em contato com o endereço de e-mail de suporte.
  sources:
    baseline_seasonal_fields: Lista de talhões sazonais que contêm as informações históricas das práticas agrícolas, como fertilizantes, preparo do solo, colheita e corretivos orgânicos.
    scenario_seasonal_fields: Lista de talhões sazonais que contêm as informações futuras das práticas agrícolas, como fertilizantes, preparo do solo, colheita e corretivos orgânicos.
  sinks:
    carbon_output: Sequestro de carbono recebido para as informações de cenário fornecidas como entrada.
  parameters:
    comet_support_email: E-mail registrado na API COMET-Farm. As solicitações são encaminhadas ao COMET com esta referência de e-mail. Este e-mail é usado pelo COMET para compartilhar as informações de volta para você em caso de solicitações com falha.
    ngrok_token: Token de sessão NGROK. O FarmVibes gera uma URL de web_hook e uma URL compartilhada com o COMET junto com a solicitação para receber a resposta do COMET. É uma URL acessível publicamente e é única para cada sessão. A URL é destruída assim que a sessão termina. Para iniciar a sessão ngrok, um token é gerado a partir desta URL https://dashboard.ngrok.com/


```