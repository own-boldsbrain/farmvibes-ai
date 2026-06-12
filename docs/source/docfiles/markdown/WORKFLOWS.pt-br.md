# Fluxos de Trabalho

Um fluxo de trabalho (workflow) define um conjunto de tarefas que o cluster deve executar, bem como o roteamento entre entradas e saídas de cada tarefa.
Agrupamos os fluxos de trabalho do FarmVibes.AI nas seguintes categorias:

- **Ingestão de Dados (Data Ingestion)**: fluxos de trabalho que baixam e pré-processam dados de uma fonte específica, preparando os dados para serem o ponto de partida para a maioria dos outros fluxos de trabalho na plataforma.
Isso inclui fontes de dados brutos (ex: Sentinel 1 e 2, LandSat, CropDataLayer), bem como o modelo de remoção de nuvens SpaceEye;
- **Processamento de Dados (Data Processing)**: fluxos de trabalho que transformam dados em diferentes tipos (ex: computação de índices NDVI/MSAVI/Metano, agregação de estatísticas de média/máximo/mínimo de rasters, agregação de séries temporais);
- **FarmAI**: fluxos de trabalho compostos (ingestão + processamento de dados) cujas saídas habilitam cenários de FarmAI (ex: predição de práticas de conservação, estimativa de sequestro de carbono no solo, identificação de vazamento de metano);
- **ForestAI**: fluxos de trabalho compostos (ingestão + processamento de dados) cujas saídas habilitam cenários de ForestAI (ex: detecção de mudanças florestais, estimativa de extensão florestal);
- **ML**: fluxos de trabalho relacionados a aprendizado de máquina para treinar, avaliar e inferir modelos dentro da plataforma FarmVibes.AI (ex: criação de conjunto de dados, inferência);

Para uma lista de todos os fluxos de trabalho disponíveis na plataforma FarmVibes.AI, por favor
consulte [a lista de fluxos de trabalho](./WORKFLOW_LIST.md).

## Construindo um fluxo de trabalho

Um fluxo de trabalho é definido por cinco partes principais:

  1. Fontes (Sources): entradas para o fluxo de trabalho. É um dicionário que mapeia uma entrada nomeada do fluxo de trabalho para uma lista de portas de entrada de tarefas.
  2. Sinks: saídas do fluxo de trabalho. É um dicionário que mapeia uma saída nomeada do fluxo de trabalho para uma porta de saída de tarefa.
  A saída de uma solicitação de execução será um dicionário cujas chaves são os nomes de saída definidos.
  3. Parâmetros (Parameters): parâmetros do fluxo de trabalho que podem ser alterados em cada execução. Um dicionário de parâmetros nomeados e (opcionalmente) valores padrão.
  Para mais informações sobre parâmetros de fluxo de trabalho, consulte [Parâmetros de Fluxo de Trabalho](#parametros-de-fluxo-de-trabalho).
  4. Tarefas (Tasks): quais tarefas (outros fluxos de trabalho ou operações/ops) o cluster deve executar.
  É um dicionário que tem o nome da tarefa como chave e a definição da tarefa como valor.
  5. Arestas (Edges): conexões entre portas de saída e entrada de tarefas.
  Uma lista de dicionários contendo o nome da porta de saída (`origin`) e uma lista de portas de entrada (`destination`).

A principal maneira de definir um fluxo de trabalho é via um arquivo yaml. Um exemplo de definição e um diagrama equivalente são mostrados abaixo:

```yaml
name: example_workflow
sources:
  first_input:
    - first_task.input_port
    - second_task.port_input
  second_input:
    - third_task.input
sinks:
  first_output: first_task.output_port
  second_output: third_task.output
parameters:
  unused_param: 0
tasks:
  first_task:
    op: op_name  # esta tarefa é uma op
  second_task:
    # esta tarefa é outro fluxo de trabalho, que contém seu próprio conjunto de tarefas
    workflow: another_workflow
  third_task:
    op: another_op
edges:
  - origin: second_task.some_output_port
    destination:
      - third_task.second_input
```

```{mermaid}
graph TD
  inp1>first_input]
  inp2>second_input]
  out1>first_output]
  out2>second_output]

  op1{{first_task}}
  wf1((second_task))
  op2{{third_task}}

  inp1 -- "input_port"--> op1
  inp1 -- "port_input"--> wf1
  inp2 -- "input"--> op2
  op1 -- "output_port" --> out1
  wf1 -- "some_output_port → second_input" --> op2
  op2 --> out2
```

## Parâmetros de fluxo de trabalho

Os parâmetros de fluxo de trabalho podem ser usados para personalizar o comportamento do fluxo alterando os parâmetros das tarefas.
Os parâmetros do fluxo de trabalho são definidos como um dicionário, sendo a chave o nome do parâmetro e o valor um valor de parâmetro padrão opcional.
Se nenhum valor padrão for fornecido (`null`), o valor padrão definido na tarefa será usado.

Definir os parâmetros do fluxo de trabalho é apenas o primeiro passo.
O segundo passo é mapear um parâmetro do fluxo de trabalho para um ou múltiplos parâmetros de tarefa.
Isso pode ser feito substituindo o parâmetro da tarefa usando `@from(wf_param)`, onde `wf_param` é o nome do parâmetro do fluxo de trabalho.

Considere a operação (op) e o fluxo de trabalho definidos abaixo:

```yaml
name: example_op
inputs:
  input: DataVibe
outputs:
  output: DataVibe
parameters:
  op_param1: 1
  op_param2: 10
  unexposed_param: default
entrypoint:
  file: some_file.py
  callback_builder: callback_builder
```

```yaml
name: parameterizable_workflow
sources:
  input:
    - task.input
sinks:
  output:
    - task.output
parameters:
  # O valor padrão será 0
  wf_param1: 0
  # O valor padrão depende do valor definido na tarefa
  wf_param2:
tasks:
  task:
    op: example_op
    parameters:
      op_param1: "@from(wf_param1)"
      op_param2: "@from(wf_param2)"
edges:
```

Neste caso, definimos dois parâmetros de fluxo de trabalho e mapeamos cada um deles para um parâmetro diferente na tarefa (note que um parâmetro de fluxo de trabalho pode ser mapeado para múltiplos parâmetros de tarefa).
Como definimos um valor padrão para `wf_param1`, uma submissão de execução sem substituições de parâmetros de fluxo de trabalho usará 0 como valor padrão.
No caso de `wf_param2`, como o valor padrão está ausente, delegamos a definição do valor padrão para a tarefa (que é 10 neste caso).
Também existe o `unexposed_param`, que é um parâmetro de tarefa que não está mapeado para nenhum parâmetro de fluxo de trabalho, o que significa que ele não pode ser alterado usando uma substituição de parâmetro de fluxo de trabalho na submissão.
Cabe ao criador do fluxo de trabalho definir quais parâmetros de tarefa devem ser expostos no nível do fluxo de trabalho.

## Composição de fluxo de trabalho

A substituição de parâmetros funciona da mesma forma, independentemente da tarefa ser um fluxo de trabalho ou uma operação (op).
Se a tarefa for um fluxo de trabalho, o parâmetro substituirá o valor do parâmetro do fluxo de trabalho interno, e esse valor será roteado para suas próprias tarefas conforme definido em sua definição de fluxo de trabalho.
Por exemplo, se um fluxo de trabalho usa `parameterizable_workflow` como uma tarefa e substitui `wf_param1` sem valor padrão, `example_op` seria executado com o valor padrão de `op_param1 = 0`, conforme definido em `wf_param1`.
Se `wf_param2` fosse substituído sem valor padrão, `example_op` seria executado com o valor padrão `op_param2 = 10` conforme definido na op, já que `parameterizable_workflow` em si também não define um valor padrão para `wf_param2`.
Não é possível substituir o parâmetro de uma op dentro de um fluxo de trabalho se esse fluxo não expuser esse parâmetro como um parâmetro de fluxo de trabalho, portanto, `unexposed_parameter` não poderia ser alterado por um fluxo de trabalho que use `parameterizable_workflow` como tarefa.
