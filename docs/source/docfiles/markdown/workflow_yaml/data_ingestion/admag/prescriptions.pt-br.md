# data_ingestion/admag/prescriptions

Busca prescrições usando o ADMAg (Microsoft Azure Data Manager for Agriculture). O fluxo de trabalho busca prescrições (amostras de sensores) vinculadas ao prescription_map_id. Cada amostra de sensor possui informações de nutrientes (Nitrogênio, Carbono, Fósforo, pH, Latitude, Longitude, etc.). A Latitude e Longitude são usadas para criar uma geometria de ponto. As informações de geometria e nutrientes são transformadas em GeoJSON. O GeoJSON é armazenado como um asset no farmvibes-ai.

```{mermaid}
    graph TD
    inp1>admag_input]
    out1>response]
    tsk1{{list_prescriptions}}
    tsk2{{get_prescription}}
    tsk3{{admag_prescriptions}}
    tsk1{{list_prescriptions}} -- prescriptions/prescription_without_geom_input --> tsk2{{get_prescription}}
    tsk2{{get_prescription}} -- prescription_with_geom/prescriptions_with_geom_input --> tsk3{{admag_prescriptions}}
    inp1>admag_input] -- admag_input --> tsk1{{list_prescriptions}}
    inp1>admag_input] -- admag_input --> tsk3{{admag_prescriptions}}
    tsk3{{admag_prescriptions}} -- response --> out1>response]
```

## Fontes

- **admag_input**: Entradas necessárias para acessar recursos do ADMAg, party_id e prescription_map_id que auxiliam na busca de prescrições.

## Sinks

- **response**: Prescrições recebidas do ADMAg.

## Parâmetros

- **base_url**: URL para acessar o aplicativo registrado. Consulte esta URL para criar os recursos necessários para o admag: https://learn.microsoft.com/en-us/azure/data-manager-for-agri/quickstart-install-data-manager-for-agriculture

- **client_id**: Valor que identifica exclusivamente o aplicativo registrado na plataforma de identidade da Microsoft. Visite a URL https://learn.microsoft.com/en-us/azure/data-manager-for-agri/quickstart-install-data-manager-for-agriculture para registrar o aplicativo.

- **client_secret**: Às vezes chamado de senha do aplicativo, um client secret é um valor de string que seu aplicativo pode usar no lugar de um certificado para se identificar.

- **authority**: As URIs de endpoint para seu aplicativo são geradas automaticamente quando você registra ou configura seu aplicativo. É usado pelo cliente para obter autorização do proprietário do recurso.

- **default_scope**: URL para permissões padrão do Azure OAuth2.

## Tarefas

- **list_prescriptions**: Lista as prescrições disponíveis usando o mapa de prescrição.

- **get_prescription**: Obtém a prescrição usando a API do ADMAg.

- **admag_prescriptions**: Baixa o limite e as prescrições vinculadas ao campo sazonal da fonte de dados ADMAg.

## Yaml do Fluxo de Trabalho

```yaml

name: admag_prescritpions
sources:
  admag_input:
  - list_prescriptions.admag_input
  - admag_prescriptions.admag_input
sinks:
  response: admag_prescriptions.response
parameters:
  base_url: null
  client_id: null
  client_secret: null
  authority: null
  default_scope: null
tasks:
  list_prescriptions:
    op: list_prescriptions
    op_dir: admag
    parameters:
      base_url: '@from(base_url)'
      client_id: '@from(client_id)'
      client_secret: '@from(client_secret)'
      authority: '@from(authority)'
      default_scope: '@from(default_scope)'
  get_prescription:
    op: get_prescription
    op_dir: admag
    parameters:
      base_url: '@from(base_url)'
      client_id: '@from(client_id)'
      client_secret: '@from(client_secret)'
      authority: '@from(authority)'
      default_scope: '@from(default_scope)'
  admag_prescriptions:
    op: prescriptions
    op_dir: admag
    parameters:
      base_url: '@from(base_url)'
      client_id: '@from(client_id)'
      client_secret: '@from(client_secret)'
      authority: '@from(authority)'
      default_scope: '@from(default_scope)'
edges:
- origin: list_prescriptions.prescriptions
  destination:
  - get_prescription.prescription_without_geom_input
- origin: get_prescription.prescription_with_geom
  destination:
  - admag_prescriptions.prescriptions_with_geom_input
description:
  short_description: Fetches prescriptions using ADMAg (Microsoft Azure Data Manager
    for Agriculture).
  long_description: The workflow fetch prescriptions (sensor samples) linked to prescription_map_id.
    Each sensor sample have the information of nutrient (Nitrogen, Carbon, Phosphorus,
    pH, Latitude, Longitude etc., ). The Latitude & Longitude used to create a point
    geometry. Geometry and nutrient information transformed to GeoJSON. The GeoJSON
    stored as asset in farmvibes-ai.
  sources:
    admag_input: Required inputs to access ADMAg resources, party_id and prescription_map_id
      that helps fetching prescriptions.
  sinks:
    response: Prescriptions received from ADMAg.
  parameters:
    base_url: URL to access the registered app. Refer this url to create required
      resources for admag. https://learn.microsoft.com/en-us/azure/data-manager-for-agri/quickstart-install-data-manager-for-agriculture
    client_id: Value uniquely identifies registered application in the Microsoft identity
      platform. Visit url https://learn.microsoft.com/en-us/azure/data-manager-for-agri/quickstart-install-data-manager-for-agriculture
      to register the app.
    client_secret: Sometimes called an application password, a client secret is a
      string value your app can use in place of a certificate to identity itself.
    authority: The endpoint URIs for your app are generated automatically when you
      register or configure your app. It is used by client to obtain authorization
      from the resource owner
    default_scope: URL for default azure OAuth2 permissions


```