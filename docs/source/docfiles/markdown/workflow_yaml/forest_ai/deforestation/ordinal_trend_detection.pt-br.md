# forest_ai/deforestation/ordinal_trend_detection

Detecta tendências de aumento/diminuição nos níveis de pixel sobre a geometria e o intervalo de tempo de entrada do usuário. Este fluxo de trabalho (workflow) prepara rasters para realizar o teste de tendência de Cochran-Armitage sobre uma geometria e intervalo de tempo fornecidos pelo usuário. Inicialmente, ele recodifica o raster de entrada de acordo com os parâmetros 'from_values' e 'to_values'. Por exemplo, se o raster original tem os valores (2, 1, 3, 4, 5) e os valores padrão de 'from_values' e 'to_values' são respectivamente [1, 2, 3, 4, 5] e [6, 7, 8, 9, 10], o raster recodificado terá os valores (7, 6, 8, 9, 10). O fluxo de trabalho então recorta (clips) as geometrias fornecidas pelo usuário e calcula um raster ordinal. Ele também conta cada pixel exclusivo presente nos rasters recodificados para criar uma tabela de contingência de frequência de pixels. Esses dados são usados para determinar se há uma tendência de aumento ou diminuição nos níveis de pixel. O teste de Cochran-Armitage é um teste não paramétrico usado para verificar essa tendência. A hipótese nula assume que não há tendência nos níveis de pixel, enquanto a hipótese alternativa assume que existe uma tendência. O teste retorna um valor-p (p-value) e uma pontuação-z (z-score). Se o valor-p for menor que algum nível de significância, a hipótese nula é rejeitada em favor da alternativa. Uma pontuação-z positiva indica uma tendência de aumento, enquanto uma negativa indica uma tendência de diminuição.

```{mermaid}
    graph TD
    inp1>raster]
    inp2>input_geometry]
    out1>recoded_raster]
    out2>trend_test_result]
    out3>clipped_raster]
    tsk1{{recode_raster}}
    tsk2{{clip}}
    tsk3{{compute_pixel_count}}
    tsk4{{trend_test}}
    tsk1{{recode_raster}} -- recoded_raster/raster --> tsk2{{clip}}
    tsk2{{clip}} -- clipped_raster/raster --> tsk3{{compute_pixel_count}}
    tsk3{{compute_pixel_count}} -- pixel_count --> tsk4{{trend_test}}
    inp1>raster] -- raster --> tsk1{{recode_raster}}
    inp2>input_geometry] -- input_geometry --> tsk2{{clip}}
    tsk1{{recode_raster}} -- recoded_raster --> out1>recoded_raster]
    tsk4{{trend_test}} -- ordinal_trend_result --> out2>trend_test_result]
    tsk2{{clip}} -- clipped_raster --> out3>clipped_raster]
```

## Fontes (Sources)

- **raster**: Raster a ser processado e testado para tendências.

- **input_geometry**: Geometria de referência.

## Sinks (Saídas)

- **recoded_raster**: Raster recodificado para a geometria e o intervalo de tempo fornecidos pelo usuário.

- **trend_test_result**: Resultados do teste de Cochran-Armitage compostos por valor-p e pontuação-z.

- **clipped_raster**: Raster ordinal recortado para a geometria e o intervalo de tempo fornecidos pelo usuário.

## Parâmetros

- **from_values**: Lista de valores a partir dos quais recodificar.

- **to_values**: Lista de valores para os quais recodificar.

## Tarefas (Tasks)

- **recode_raster**: Recodifica os valores do raster de entrada.

- **clip**: Realiza um recorte (clip) em um raster de entrada com base em uma geometria de referência fornecida.

- **compute_pixel_count**: Conta os valores de pixel no raster de entrada.

- **trend_test**: Detecta tendências de aumento/diminuição sobre uma lista de Rasters.

## Workflow Yaml

```yaml

name: ordinal_trend_detection
sources:
  raster:
  - recode_raster.raster
  input_geometry:
  - clip.input_geometry
sinks:
  recoded_raster: recode_raster.recoded_raster
  trend_test_result: trend_test.ordinal_trend_result
  clipped_raster: clip.clipped_raster
parameters:
  from_values: []
  to_values: []
tasks:
  recode_raster:
    op: recode_raster
    parameters:
      from_values: '@from(from_values)'
      to_values: '@from(to_values)'
  clip:
    workflow: data_processing/clip/clip
  compute_pixel_count:
    op: compute_pixel_count
  trend_test:
    op: ordinal_trend_test
edges:
- origin: recode_raster.recoded_raster
  destination:
  - clip.raster
- origin: clip.clipped_raster
  destination:
  - compute_pixel_count.raster
- origin: compute_pixel_count.pixel_count
  destination:
  - trend_test.pixel_count
description:
  short_description: Detecta tendências de aumento/diminuição nos níveis de pixel sobre a geometria e o intervalo de tempo de entrada do usuário.
  long_description: Este fluxo de trabalho prepara rasters para realizar o teste de tendência de Cochran-Armitage sobre uma geometria e intervalo de tempo fornecidos pelo usuário. Inicialmente, ele recodifica o raster de entrada de acordo com os parâmetros 'from_values' e 'to_values'. Por exemplo, se o raster original tem os valores (2, 1, 3, 4, 5) e os valores padrão de 'from_values' e 'to_values' são respectivamente [1, 2, 3, 4, 5] e [6, 7, 8, 9, 10], o raster recodificado terá os valores (7, 6, 8, 9, 10). O fluxo de trabalho então recorta as geometrias fornecidas pelo usuário e calcula um raster ordinal. Ele também conta cada pixel exclusivo presente nos rasters recodificados para criar uma tabela de contingência de frequência de pixels. Esses dados são usados para determinar se há uma tendência de aumento ou diminuição nos níveis de pixel. O teste de Cochran-Armitage é um teste não paramétrico usado para verificar essa tendência. A hipótese nula assume que não há tendência nos níveis de pixel, enquanto a hipótese alternativa assume que existe uma tendência. O teste retorna um valor-p e uma pontuação-z. Se o valor-p for menor que algum nível de significância, a hipótese nula é rejeitada em favor da alternativa. Uma pontuação-z positiva indica uma tendência de aumento, enquanto uma negativa indica uma tendência de diminuição.
  sources:
    raster: Raster a ser processado e testado para tendências.
    input_geometry: Geometria de referência.
  sinks:
    recoded_raster: Raster recodificado para a geometria e o intervalo de tempo fornecidos pelo usuário.
    trend_test_result: Resultados do teste de Cochran-Armitage compostos por valor-p e pontuação-z.
    clipped_raster: Raster ordinal recortado para a geometria e o intervalo de tempo fornecidos pelo usuário.


```