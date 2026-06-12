# farm_ai/agriculture/green_house_gas_fluxes

Calcula os Fluxos de Gases de Efeito Estufa (GEE) para uma região e intervalo de datas. O fluxo de trabalho (workflow) segue as diretrizes do Protocolo GHG (GHG Protocol) publicadas para o Brasil (que são baseadas nos relatórios do IPCC) para calcular os fluxos de emissão de Gases de Efeito Estufa (sequestro versus emissões) para uma determinada cultura.

```{mermaid}
    graph TD
    inp1>user_input]
    out1>fluxes]
    tsk1{{ghg}}
    inp1>user_input] -- ghg --> tsk1{{ghg}}
    tsk1{{ghg}} -- fluxes --> out1>fluxes]
```

## Fontes (Sources)

- **user_input**: As entradas fornecidas pelo usuário para o cálculo de GEE.

## Sinks

- **fluxes**: Os fluxos calculados para a área e o intervalo de datas fornecidos, considerando os dados de entrada do usuário.

## Parâmetros

- **crop_type**: O tipo de cultura para calcular as emissões de GEE. As culturas suportadas são 'wheat' (trigo), 'corn' (milho), 'cotton' (algodão) e 'soybeans' (soja).

## Tarefas (Tasks)

- **ghg**: Calcula os fluxos de emissão de Gases de Efeito Estufa com base em fatores de emissão fundamentados na metodologia do IPCC.

## Fluxo de Trabalho (Workflow) Yaml

```yaml

name: green_house_gas_fluxes
sources:
  user_input:
  - ghg.ghg
sinks:
  fluxes: ghg.fluxes
parameters:
  crop_type: corn
tasks:
  ghg:
    op: compute_ghg_fluxes
    parameters:
      crop_type: '@from(crop_type)'
edges: null
description:
  short_description: Calcula os Fluxos de Gases de Efeito Estufa para uma região e intervalo de datas.
  long_description: O fluxo de trabalho segue as diretrizes do Protocolo GHG publicadas para o Brasil (que são baseadas nos relatórios do IPCC) para calcular os fluxos de emissão de Gases de Efeito Estufa (sequestro versus emissões) para uma determinada cultura.
  sources:
    user_input: As entradas fornecidas pelo usuário para o cálculo de GEE.
  sinks:
    fluxes: Os fluxos calculados para a área e o intervalo de datas fornecidos, considerando os dados de entrada do usuário.
  parameters:
    crop_type: O tipo de cultura para calcular as emissões de GEE. As culturas suportadas são 'wheat', 'corn', 'cotton' e 'soybeans'.


```