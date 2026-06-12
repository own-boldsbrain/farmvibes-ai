# Segredos (Secrets)

As operações no FarmVibes.AI podem recuperar segredos para usar como parâmetros, o que pode ser útil para evitar o armazenamento de segredos em texto simples. Os segredos são armazenados com segurança dentro do cluster Kubernetes e não são transmitidos ou visíveis fora da VM. Para mais informações sobre segredos no Kubernetes, consulte a [documentação do Kubernetes](https://kubernetes.io/docs/concepts/configuration/secret/).

Os segredos podem ser adicionados ao cluster através do comando ```add-secret``` do comando *farmvibes-ai*. O segredo pode então ser passado como parâmetro para os arquivos yaml do fluxo de trabalho.

Este documento detalha como adicionar ou excluir um segredo no cluster (tanto local quanto remoto), bem como lista todos os fluxos de trabalho que exigem um segredo.

## Adicionando um segredo ao cluster FarmVibes.AI

Para adicionar um segredo com uma chave `<key>` e valor `<value>`, execute:

```bash
farmvibes-ai <local | remote> add-secret <key> <value>
```

Note que os segredos não são persistidos quando os clusters são destruídos e devem ser adicionados novamente após cada configuração (setup).

## Usando um segredo dentro de um fluxo de trabalho

Segredos são usados em um fluxo de trabalho com a notação @SECRET. Por exemplo,
`@SECRET(nome-do-meu-keyvault, minha-chave-de-segredo)` em que `minha-chave-de-segredo` é a chave e
`nome-do-meu-keyvault` é o key-vault. Para instalação local do FarmVibes.AI, o key-vault pode ser qualquer string não vazia.

O seguinte yaml de fluxo de trabalho mostra um exemplo de um parâmetro de segredo exposto (`download_password`) com uma chave padrão (`my-secret-pass`):

```yaml
name: my_test_wf
sources:
  input_a:
    - download.input
sinks:
  output_b: download.output
parameters:
  download_password: "@SECRET(my-keyvault-name, my-secret-pass)"
tasks:
  download:
    op: my_exemple_op
    parameters:
      password: "@from(download_password)"
edges:
description:
  short_description:
    Example workflow.
  long_description:
    Requires secret from parameter download_password.
    Default secret key is my-secret-pass.
  sources:
    input_a: Example input.
  sinks:
    output_b: Example output.
  parameters:
    download_password: Download password secret.
```

## Excluindo um segredo do cluster FarmVibes.AI

O seguinte comando pode ser usado para excluir um segredo do cluster:

```bash
farmvibes-ai <local | remote> delete-secret <key>
```

## Lista de fluxos de trabalho e seus segredos associados

- **Azure Data Manager for Agriculture (ADMAG) client secret** (parâmetro `client_secret`).
  - `data_ingestion/admag/admag_seasonal_field`
  - `data_ingestion/admag/prescriptions`

- **Ambient Weather API key** (parâmetro `api-key` com chave de segredo padrão `ambient-api-key`) e **App key** (parâmetro `app-key` com chave de segredo padrão `ambient-app-key`).
  - `data_ingestion/weather/get_ambient_weather`

- **EarthData API token** (parâmetro `earthdata_token` com chave de segredo padrão `earthdata-token`).
  - `data_ingestion/gedi/download_gedi`
  - `data_ingestion/gedi/download_gedi_rh100`

- **NOAA GFS SAS token** (parâmetro `noaa_gfs_token` com chave de segredo padrão `noaa-gfs-sas`).
  - `data_ingestion/weather/get_forecast`

- **Planetary computer API key**. A chave de API é necessária para fluxos de trabalho que baixam dados do Sentinel-1. Para outros fluxos de trabalho, a chave é opcional e evita limitações de taxa (throttling). Se não for fornecida, o FarmVibes.AI acessa o catálogo do Planetary Computer anonimamente. Para se registrar e obter uma chave de API, [(veja mais informações aqui)](https://planetarycomputer.microsoft.com/docs/overview/about/). 
  - `data_ingestion/dem/download_dem`
  - `data_ingestion/landsat/preprocess_landsat`
  - `data_ingestion/naip/download_naip`
  - `data_ingestion/sentinel1/preprocess_s1` (Obrigatório)
  - `data_ingestion/sentinel2/preprocess_s2`
  - `data_ingestion/sentinel2/preprocess_s2_improved_mask`
  - `data_ingestion/spaceeye/spaceeye` (Obrigatório)
  - `data_ingestion/spaceeye/spaceeye_interpolation`
  - `data_ingestion/spaceeye/spaceeye_preprocess` (Obrigatório)
  - `farm_ai/agriculture/canopy_cover`
  - `farm_ai/agriculture/change_detection` (Obrigatório)
  - `farm_ai/agriculture/emergence_summary`
  - `farm_ai/agriculture/methane_index`
  - `farm_ai/agriculture/ndvi_summary`
  - `farm_ai/agriculture/landsat_ndvi_trend`
  - `farm_ai/land_cover_mapping/conservation_practices`
  - `ml/dataset_generation/datagen_crop_segmentation`

```{eval-rst}
.. autosummary::
   :toctree: _autosummary
```
