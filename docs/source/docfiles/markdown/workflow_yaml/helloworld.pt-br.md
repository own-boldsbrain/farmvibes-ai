# helloworld

Olá mundo! Pequeno fluxo de trabalho (workflow) de teste que gera uma imagem da Terra com os países que intersectam com a geometria de entrada destacados em laranja.

```{mermaid}
    graph TD
    inp1>user_input]
    out1>raster]
    tsk1{{hello}}
    inp1>user_input] -- user_input --> tsk1{{hello}}
    tsk1{{hello}} -- raster --> out1>raster]
```

## Fontes (Sources)

- **user_input**: Geometria de entrada.

## Sinks (Saídas)

- **raster**: Raster com países destacados.

## Tarefas (Tasks)

- **hello**: Operação (op) de teste que gera uma imagem da Terra com os países que intersectam com a geometria de entrada destacados em laranja.

## Workflow Yaml

```yaml

name: helloworld
sources:
  user_input:
  - hello.user_input
sinks:
  raster: hello.raster
tasks:
  hello:
    op: helloworld
description:
  short_description: Olá mundo!
  long_description: Pequeno fluxo de trabalho de teste que gera uma imagem da Terra com os países que intersectam com a geometria de entrada destacados em laranja.
  sources:
    user_input: Geometria de entrada.
  sinks:
    raster: Raster com países destacados.


```