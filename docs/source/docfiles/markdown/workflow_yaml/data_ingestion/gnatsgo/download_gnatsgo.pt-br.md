# data_ingestion/gnatsgo/download_gnatsgo

Baixa dados raster do gNATSGO que interceptam a geometria e o intervalo de tempo informados. Este fluxo de trabalho lista e baixa produtos raster do conjunto de dados gNATSGO a partir do Planetary Computer. A geometria de entrada deve estar dentro dos Estados Unidos Continentais, enquanto o intervalo de tempo de entrada pode ser arbitrário (todos os ativos gNATSGO são de 01/07/2020). Para mais informações sobre as propriedades disponíveis, consulte https://planetarycomputer.microsoft.com/dataset/gnatsgo-rasters.

```{mermaid}
    graph TD
    inp1>user_input]
    out1>raster]
    tsk1{{list}}
    tsk2{{download}}
    tsk1{{list}} -- gnatsgo_products/gnatsgo_product --> tsk2{{download}}
    inp1>user_input] -- input_item --> tsk1{{list}}
    tsk2{{download}} -- downloaded_raster --> out1>raster]
```

## Fontes (Sources)

- **user_input**: Geometria de interesse (intervalo de tempo arbitrário).

## Sinks

- **raster**: Raster com a propriedade desejada.

## Parâmetros

- **pc_key**: Chave da API do Planetary Computer (opcional).

- **variable**: As opções são:
  aws{DEPTH} - Estimativa de armazenamento de água disponível (AWS) para a zona DEPTH.
  soc{DEPTH} - Estimativa de estoque de carbono orgânico do solo (SOC) para a zona DEPTH.
  tk{DEPTH}a - Espessura dos componentes do solo usados na zona DEPTH para o cálculo de AWS.
  tk{DEPTH}s - Espessura dos componentes do solo usados na zona DEPTH para o cálculo de SOC.
  mukey - Chave da unidade do mapa, um identificador único de um registro para correspondência com as tabelas gNATSGO.
  droughty - Estimativa de vulnerabilidade à seca.
  nccpi3all - Índice Nacional de Produtividade de Culturas de Commodities que possui o valor mais alto entre Milho e Soja, Pequenos Grãos ou Algodão para os principais componentes terrestres.
  nccpi3corn - Índice Nacional de Produtividade de Culturas de Commodities para Milho para os principais componentes terrestres.
  nccpi3cot - Índice Nacional de Produtividade de Culturas de Commodities para Algodão para os principais componentes terrestres.
  nccpi3sg - Índice Nacional de Produtividade de Culturas de Commodities para Pequenos Grãos para os principais componentes terrestres.
  nccpi3soy - Índice Nacional de Produtividade de Culturas de Commodities para Soja para os principais componentes terrestres.
  pctearthmc - Percentual terrestre da unidade de mapa do Índice Nacional de Produtividade de Culturas de Commodities é a soma de comppct_r da unidade de mapa para os principais componentes terrestres.
  pwsl1pomu - Paisagens de Solos de Zonas Úmidas Potenciais (PWSL).
  rootznaws - Estimativa de armazenamento de água disponível na zona radicular (RZAWS) para culturas de commodities.
  rootznemc - A profundidade da zona radicular é a profundidade dentro do perfil do solo onde as raízes das culturas de commodities (cc) podem extrair água e nutrientes de forma eficaz para o crescimento.
  musumcpct - Soma dos valores comppct_r (tabela de componentes SSURGO) para todos os componentes listados na unidade do mapa.
  musumcpcta - Soma dos valores comppct_r (tabela de componentes SSURGO) usados no cálculo de armazenamento de água disponível para a unidade do mapa.
  musumcpcts - Soma dos valores comppct_r (tabela de componentes SSURGO) usados no cálculo de carbono orgânico do solo para a unidade do mapa.
O gNATSGO possui propriedades disponíveis para múltiplas profundidades de solo. Você pode substituir DEPTH nos nomes das variáveis acima por qualquer um dos seguintes (todos medidos em cm):
  0_5
  0_20
  0_30
  5_20
  0_100
  0_150
  0_999
  20_50
  50_100
  100_150
  150_999

## Tarefas (Tasks)

- **list**: Lista produtos gNATSGO do Planetary Computer que interceptam a geometria de entrada.

- **download**: Baixa o ativo raster para a 'variável' (variable) dado um produto gNATSGO.

## Workflow Yaml

```yaml

name: download_gnatsgo
sources:
  user_input:
  - list.input_item
sinks:
  raster: download.downloaded_raster
parameters:
  pc_key: null
  variable: soc0_5
tasks:
  list:
    op: list_gnatsgo_products
  download:
    op: download_gnatsgo
    parameters:
      api_key: '@from(pc_key)'
      variable: '@from(variable)'
edges:
- origin: list.gnatsgo_products
  destination:
  - download.gnatsgo_product
description:
  short_description: Baixa dados raster do gNATSGO que interceptam a geometria e o intervalo de tempo informados.
  long_description: Este fluxo de trabalho lista e baixa produtos raster do conjunto de dados
    gNATSGO a partir do Planetary Computer. A geometria de entrada deve estar dentro dos Estados
    Unidos Continentais, enquanto o intervalo de tempo de entrada pode ser arbitrário (todos os
    ativos gNATSGO são de 01/07/2020). Para mais informações sobre as propriedades disponíveis,
    consulte https://planetarycomputer.microsoft.com/dataset/gnatsgo-rasters.
  sources:
    user_input: Geometria de interesse (intervalo de tempo arbitrário).
  sinks:
    raster: Raster com a propriedade desejada.
  parameters:
    pc_key: Chave da API do Planetary Computer (opcional).
    variable: "As opções são:\n  aws{DEPTH} - Estimativa de armazenamento de água disponível\
      \ (AWS) para a zona DEPTH.\n  soc{DEPTH} - Estimativa de estoque de carbono orgânico do\
      \ solo (SOC) para a zona DEPTH.\n  tk{DEPTH}a - Espessura dos componentes do solo usados\
      \ na zona DEPTH para o cálculo de AWS.\n  tk{DEPTH}s - Espessura dos componentes do solo\
      \ usados na zona DEPTH para o cálculo de SOC.\n  mukey - Chave da unidade do mapa, um\
      \ identificador único de um registro para correspondência com as tabelas gNATSGO.\n  droughty\
      \ - Estimativa de vulnerabilidade à seca.\n  nccpi3all - Índice Nacional de Produtividade\
      \ de Culturas de Commodities que possui o valor mais alto entre Milho e Soja, Pequenos\
      \ Grãos ou Algodão para os principais componentes terrestres.\n  nccpi3corn - Índice\
      \ Nacional de Produtividade de Culturas de Commodities para Milho para os principais\
      \ componentes terrestres.\n  nccpi3cot - Índice Nacional de Produtividade de Culturas\
      \ de Commodities para Algodão para os principais componentes terrestres.\n\
      \  nccpi3sg - Índice Nacional de Produtividade de Culturas de Commodities para\
      \ Pequenos Grãos para os principais componentes terrestres.\n  nccpi3soy - Índice\
      \ Nacional de Produtividade de Culturas de Commodities para Soja para os principais\
      \ componentes terrestres.\n  pctearthmc - Percentual terrestre da unidade de mapa do\
      \ Índice Nacional de Produtividade de Culturas de Commodities é a soma de comppct_r\
      \ da unidade de mapa para os principais componentes terrestres.\n  pwsl1pomu - Paisagens\
      \ de Solos de Zonas Úmidas Potenciais (PWSL).\n  rootznaws - Estimativa de armazenamento\
      \ de água disponível na zona radicular (RZAWS) para culturas de commodities.\n  rootznemc\
      \ - A profundidade da zona radicular é a profundidade dentro do perfil do solo que as raízes\
      \ das culturas de commodities (cc) podem extrair água e nutrientes de forma eficaz para\
      \ o crescimento.\n  musumcpct - Soma dos valores comppct_r (tabela de componentes\
      \ SSURGO) para todos os componentes listados na unidade do mapa.\n  musumcpcta -\
      \ Soma dos valores comppct_r (tabela de componentes SSURGO) usados no cálculo de\
      \ armazenamento de água disponível para a unidade do mapa.\n  musumcpcts - Soma dos\
      \ valores comppct_r (tabela de componentes SSURGO) usados no cálculo de carbono orgânico\
      \ do solo para a unidade do mapa. \nO gNATSGO possui propriedades disponíveis para múltiplas\
      \ profundidades de solo. Você pode substituir DEPTH nos nomes das variáveis acima por\
      \ qualquer um dos seguintes (todos medidos em cm): \n  0_5\n  0_20\n  0_30\n  5_20\n\
      \  0_100\n  0_150\n  0_999\n  20_50\n  50_100\n  100_150\n  150_999"


```
