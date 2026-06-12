# farm_ai/carbon_local/admag_carbon_integration

Calcula a quantidade de compensação de carbono que seria sequestrada em um talhão sazonal (seasonal field) usando dados do Microsoft Azure Data Manager for Agriculture (ADMAg). Deriva informações de sequestro de carbono. O Microsoft Azure Data Manager for Agriculture (ADMAg) e a API COMET-Farm são usados para obter dados agrícolas e avaliar a compensação de carbono. O ADMAg é capaz de descrever atividades agrícolas importantes, como fertilização, preparo do solo (tillage) e aplicações de corretivos orgânicos (organic amendments), todos representados no gerenciador de dados. O FarmVibes.AI recupera essas informações do gerenciador de dados e constrói objetos SeasonalFieldInformation do FarmVibes.AI. Esses objetos são então usados para chamar a API COMET-Farm e avaliar as informações de compensação de carbono.

```{mermaid}
    graph TD
    inp1>baseline_admag_input]
    inp2>scenario_admag_input]
    out1>carbon_output]
    tsk1{{baseline_seasonal_field_list}}
    tsk2{{scenario_seasonal_field_list}}
    tsk3{{admag_carbon}}
    tsk1{{baseline_seasonal_field_list}} -- seasonal_field/baseline_seasonal_fields --> tsk3{{admag_carbon}}
    tsk2{{scenario_seasonal_field_list}} -- seasonal_field/scenario_seasonal_fields --> tsk3{{admag_carbon}}
    inp1>baseline_admag_input] -- admag_input --> tsk1{{baseline_seasonal_field_list}}
    inp2>scenario_admag_input] -- admag_input --> tsk2{{scenario_seasonal_field_list}}
    tsk3{{admag_carbon}} -- carbon_output --> out1>carbon_output]
```

## Fontes (Sources)

- **baseline_admag_input**: Lista de ADMAgSeasonalFieldInput para recuperar objetos SeasonalFieldInformation para a avaliação de compensação de carbono da API COMET-Farm de linha de base (baseline).

- **scenario_admag_input**: Lista de ADMAgSeasonalFieldInput para recuperar objetos SeasonalFieldInformation para a avaliação de compensação de carbono da API COMET-Farm de cenários.

## Sinks (Saídas)

- **carbon_output**: Sequestro de carbono recebido para as informações de cenário fornecidas como entrada.

## Parâmetros

- **base_url**: Host do Azure Data Manager for Agriculture. Visite https://aka.ms/farmvibesDMA para verificar como obter essas credenciais.

- **client_id**: ID do cliente do Azure Data Manager for Agriculture. Visite https://aka.ms/farmvibesDMA para verificar como obter essas credenciais.

- **client_secret**: Segredo do cliente do Azure Data Manager for Agriculture. Visite https://aka.ms/farmvibesDMA para verificar como obter essas credenciais.

- **authority**: Autoridade do Azure Data Manager for Agriculture. Visite https://aka.ms/farmvibesDMA para verificar como obter essas credenciais.

- **default_scope**: Escopo padrão do Azure Data Manager for Agriculture. Visite https://aka.ms/farmvibesDMA para verificar como obter essas credenciais.

- **comet_support_email**: E-mail de suporte do Comet. O e-mail usado para se registrar em uma conta COMET. As solicitações são encaminhadas ao COMET com esta referência de e-mail. Este e-mail é usado pelo COMET para compartilhar as informações de volta para você em caso de solicitações com falha.

- **ngrok_token**: Token de sessão NGROK. Um token que o FarmVibes usa para criar uma URL de web_hook que é compartilhada com o Comet em uma solicitação ao executar o fluxo de trabalho (workflow). O Comet pode usar este link para enviar uma resposta de volta ao FarmVibes. O NGROK é um serviço que cria URLs temporárias para servidores locais. Para usar o NGROK, o FarmVibes precisa obter um token deste site, https://dashboard.ngrok.com/.

## Tarefas (Tasks)

- **baseline_seasonal_field_list**: Gera SeasonalFieldInformation usando ADMAg (Microsoft Azure Data Manager for Agriculture).

- **scenario_seasonal_field_list**: Gera SeasonalFieldInformation usando ADMAg (Microsoft Azure Data Manager for Agriculture).

- **admag_carbon**: Calcula a quantidade de compensação de carbono que seria sequestrada em um talhão sazonal usando as informações da linha de base (histórica) e do cenário (intervalo de tempo de interesse).

## Workflow Yaml

```yaml

name: admag_carbon_integration
sources:
  baseline_admag_input:
  - baseline_seasonal_field_list.admag_input
  scenario_admag_input:
  - scenario_seasonal_field_list.admag_input
sinks:
  carbon_output: admag_carbon.carbon_output
parameters:
  base_url: null
  client_id: null
  client_secret: null
  authority: null
  default_scope: null
  comet_support_email: null
  ngrok_token: null
tasks:
  baseline_seasonal_field_list:
    workflow: data_ingestion/admag/admag_seasonal_field
    parameters:
      base_url: '@from(base_url)'
      client_id: '@from(client_id)'
      client_secret: '@from(client_secret)'
      authority: '@from(authority)'
      default_scope: '@from(default_scope)'
  scenario_seasonal_field_list:
    workflow: data_ingestion/admag/admag_seasonal_field
    parameters:
      base_url: '@from(base_url)'
      client_id: '@from(client_id)'
      client_secret: '@from(client_secret)'
      authority: '@from(authority)'
      default_scope: '@from(default_scope)'
  admag_carbon:
    workflow: farm_ai/carbon_local/carbon_whatif
    parameters:
      comet_support_email: '@from(comet_support_email)'
      ngrok_token: '@from(ngrok_token)'
edges:
- origin: baseline_seasonal_field_list.seasonal_field
  destination:
  - admag_carbon.baseline_seasonal_fields
- origin: scenario_seasonal_field_list.seasonal_field
  destination:
  - admag_carbon.scenario_seasonal_fields
description:
  short_description: Calcula a quantidade de compensação de carbono que seria sequestrada em um talhão sazonal usando dados do Microsoft Azure Data Manager for Agriculture (ADMAg).
  long_description: Deriva informações de sequestro de carbono. O Microsoft Azure Data Manager for Agriculture (ADMAg) e a API COMET-Farm são usados para obter dados agrícolas e avaliar a compensação de carbono. O ADMAg é capaz de descrever atividades agrícolas importantes, como fertilização, preparo do solo e aplicações de corretivos orgânicos, todos representados no gerenciador de dados. O FarmVibes.AI recupera essas informações do gerenciador de dados e constrói objetos SeasonalFieldInformation do FarmVibes.AI. Esses objetos são então usados para chamar a API COMET-Farm e avaliar as informações de compensação de carbono.
  sources:
    baseline_admag_input: Lista de ADMAgSeasonalFieldInput para recuperar objetos SeasonalFieldInformation para a avaliação de compensação de carbono da API COMET-Farm de linha de base.
    scenario_admag_input: Lista de ADMAgSeasonalFieldInput para recuperar objetos SeasonalFieldInformation para a avaliação de compensação de carbono da API COMET-Farm de cenários.
  sinks:
    carbon_output: Sequestro de carbono recebido para as informações de cenário fornecidas como entrada.
  parameters:
    comet_support_email: E-mail de suporte do Comet. O e-mail usado para se registrar em uma conta COMET. As solicitações são encaminhadas ao COMET com esta referência de e-mail. Este e-mail é usado pelo COMET para compartilhar as informações de volta para você em caso de solicitações com falha.
    ngrok_token: Token de sessão NGROK. Um token que o FarmVibes usa para criar uma URL de web_hook que é compartilhada com o Comet em uma solicitação ao executar o fluxo de trabalho. O Comet pode usar este link para enviar uma resposta de volta ao FarmVibes. O NGROK é um serviço que cria URLs temporárias para servidores locais. Para usar o NGROK, o FarmVibes precisa obter um token deste site, https://dashboard.ngrok.com/.
    base_url: Host do Azure Data Manager for Agriculture. Visite https://aka.ms/farmvibesDMA para verificar como obter essas credenciais.
    client_id: ID do cliente do Azure Data Manager for Agriculture. Visite https://aka.ms/farmvibesDMA para verificar como obter essas credenciais.
    client_secret: Segredo do cliente do Azure Data Manager for Agriculture. Visite https://aka.ms/farmvibesDMA para verificar como obter essas credenciais.
    authority: Autoridade do Azure Data Manager for Agriculture. Visite https://aka.ms/farmvibesDMA para verificar como obter essas credenciais.
    default_scope: Escopo padrão do Azure Data Manager for Agriculture. Visite https://aka.ms/farmvibesDMA para verificar como obter essas credenciais.


```