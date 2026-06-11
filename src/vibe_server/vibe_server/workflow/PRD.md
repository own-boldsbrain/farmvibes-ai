# PRD — Workflow Engine (Spec, Graph, Parameters)

## JTBDs (Jobs To Be Done)

1. **Construir um grafo acíclico dirigido (DAG) de operações a partir de especificações YAML** — O usuário carrega workflows definidos em arquivos YAML, que descrevem sources, sinks, tasks e edges. `WorkflowParser.parse()` lê e estrutura a spec; `Workflow.__init__()` constrói o grafo internamente via `Graph`, conectando nós por arestas rotuladas.

2. **Validar a especificação do workflow quanto à integridade estrutural** — O `WorkflowSpecValidator` verifica se sources, sinks, edges e parâmetros estão corretamente definidos: cada source deve apontar para tasks existentes, cada sink deve ser uma porta de saída válida, todas as entradas das tasks devem estar conectadas, e não pode haver ciclos no grafo.

3. **Resolver parâmetros entre workflows aninhados e tasks filhas** — O `ParameterResolver` percorre recursivamente a árvore de workflows, identifica referências `@from(nome_param)` nas tasks, e propaga valores dos parâmetros do workflow pai para os parâmetros das tasks filhas, respeitando defaults.

4. **Mesclar workflows internos (sub-workflows) no grafo principal** — Quando uma task é do tipo `workflow` (não `op`), o `Workflow._load_inner_workflow()` carrega a spec interna, achata suas sources/sinks/edges no grafo pai com prefixo de namespace, e resolve os parâmetros recursivamente.

5. **Resolver tipos de dados dinâmicos (UnresolvedDataVibe) no grafo** — O algoritmo de resolução de tipos percorre o DAG em ordem topológica e, para portas de saída declaradas como genéricas, infere o tipo concreto a partir da porta de entrada correspondente ou da aresta conectada upstream.

6. **Propagar rótulos de paralelismo (single/scatter/gather/parallel) pelo grafo** — `propagate_labels()` percorre o DAG a partir das sources, analisa fan-out (lista para single) e fan-in (single para lista), e rotula cada aresta com o tipo de paralelismo apropriado, permitindo que o runner decida como distribuir e coletar dados.

7. **Validar descrições semânticas de workflows, fontes, sinks e parâmetros** — O `WorkflowDescriptionValidator` assegura que cada source, sink, task e parâmetro possua uma descrição textual preenchida, e que não haja descrições órfãs (que não correspondam a nenhum nó real), garantindo documentação mínima do workflow.

8. **Listar e carregar workflows dinamicamente a partir do diretório de workflows** — `list_workflows()` varre o diretório `workflows_dir` em busca de arquivos `.yaml`, retorna uma lista de nomes. `workflow_from_input()` aceita tanto string (nome do workflow) quanto dict (spec inline) e retorna uma instância de `Workflow` pronta para execução.

## Descrição do Módulo

Engine central de workflows: parsing de specs YAML (`WorkflowParser`, `WorkflowSpec`), construção e validação do grafo DAG (`Graph`, `Workflow`, `WorkflowSpecValidator`), resolução de parâmetros (`ParameterResolver`, `Parameter`), validação de descrições (`WorkflowDescriptionValidator`), e manipulação de entradas (`input_handler`). Suporta workflows aninhados, tipos genéricos, paralelismo automático e validação semântica completa.

## Inputs

| Classe/Função | Parâmetros Principais / Variáveis Terraform |
|---|---|
| `WorkflowParser.parse()` | `workflow_name: str`, `ops_dir: str`, `workflows_dir: str`, `parameters_override: Optional[Dict]` |
| `WorkflowParser.parse_dict()` | `workflow_dict: Dict[str, Any]`, `ops_dir`, `workflows_dir`, `parameters_override` |
| `Workflow.__init__()` | `workflow_spec: WorkflowSpec`, `resolve: bool (True)` |
| `Workflow.build()` | `workflow_path: str`, `ops_base_dir`, `workflow_base_dir`, `parameters_override` |
| `ParameterResolver.resolve()` | `workflow_spec: WorkflowSpec` → `Dict[str, Parameter]` |
| `WorkflowSpecValidator.validate()` | `workflow_spec: WorkflowSpec` → `WorkflowSpec` (validado) |
| `WorkflowDescriptionValidator.validate()` | `workflow_spec: WorkflowSpec` |
| `build_args_for_workflow()` | `user_input: Union[List, Dict, SpatioTemporalJson]`, `wf_inputs: List[str]` |
| `patch_workflow_sources()` | `user_input: OpIOType`, `workflow: Workflow` |
| `validate_workflow_input()` | `user_input: OpIOType`, `inputs_spec: TypeDictVibe` |
| `Graph.add_node()` | `node: T` |
| `Graph.add_edge()` | `origin: T`, `destination: T`, `label: V` |

## Outputs

| Classe/Função | Retorno / Outputs Terraform |
|---|---|
| `WorkflowParser.parse()` | `WorkflowSpec` (name, sources, sinks, tasks, edges, parameters, description) |
| `Workflow(workflow_spec)` | `Workflow` (Graph[GraphNodeType, EdgeLabel] com index, sources, sinks, inputs_spec, output_spec) |
| `Workflow.inputs_spec` | `TypeDictVibe` — mapeamento source → tipo de dado esperado |
| `Workflow.output_spec` | `TypeDictVibe` — mapeamento sink → tipo de dado produzido |
| `Workflow.topological_sort()` | `Iterable[List[GraphNodeType]]` — níveis do DAG ordenados topologicamente |
| `ParameterResolver.resolve()` | `Dict[str, Parameter]` — parâmetros resolvidos com name, task, value, default, description |
| `WorkflowSpecValidator.validate()` | `WorkflowSpec` validado (ou lança `ValueError`) |
| `WorkflowDescriptionValidator.validate()` | `None` (ou lança `ValueError`) |
| `Graph.has_cycle()` | `bool` |
| `WorkflowSpec.to_mermaid()` | `str` — diagrama Mermaid do workflow |
| `fan_out_workflow_source()` | `None` — modifica o workflow in-place adicionando nó `InputFanOut` |

## Lógicas e Cálculos

- **Parsing de spec YAML**: `WorkflowParser._load_workflow()` carrega o YAML, `parse_dict()` decide se é um `WorkflowSpec` serializado ou dict bruto. Se for dict bruto, `_workflow_spec_from_yaml_dict()` extrai campos obrigatórios (`name`, `sources`, `sinks`, `tasks`) e opcionais (`edges`, `parameters`, `description`). Cada task é parseada via `_parse_nodespec()` que diferencia `op` de `workflow` pelo campo presente.

- **Construção do grafo**: `Workflow._build_index()` itera as tasks da spec. Para tasks do tipo `workflow`, chama `_load_inner_workflow()` que carrega a sub-spec, achata seus sources/sinks/edges no grafo pai (com prefixo `taskname.`), e atualiza a spec pai. Para tasks `op`, adiciona diretamente como `GraphNodeType`. Depois, itera as edges da spec e chama `_add_workflow_edge_to_graph()`.

- **Resolução de parâmetros**: `ParameterResolver._get_wf_params()` coleta parâmetros do workflow raiz, depois varre tasks em busca de referências `@from(nome)`. Para cada referência encontrada, adiciona um `Parameter` child ao parâmetro pai. A property `Parameter.default` usa `_resolve()`: se o próprio default é None e há childs, coleta os defaults dos childs; se todos forem iguais, retorna valor único; senão, retorna tupla (o que dispara erro de validação em `_validate_parameter_defaults`).

- **Substituição de parâmetros**: `Workflow._resolve_parameters()` percorre recursivamente o dicionário de parâmetros de uma task, identifica strings `@from(nome)`, e substitui pelo valor correspondente em `workflow_spec.parameters`. Se o override for None, mantém o default da task.

- **Mesclagem de sub-workflow**: `_update_workflow_spec_sources()` substitui referências a sources do sub-workflow pelas sources internas expandidas. `_update_workflow_spec_sinks()` faz o análogo para sinks. `_update_workflow_spec_edges()` substitui origens/destinos de arestas que apontam para sinks/sources internas.

- **Resolução de tipos**: `resolve_types()` percorre nós em ordem topológica. Para cada porta de saída do tipo `UnresolvedDataVibe`, `_resolve_port_type()` busca a aresta de entrada conectada à porta de origem (definida pelo nome da `UnresolvedDataVibe`), obtém o tipo concreto upstream, e aplica `_ensure_same_container()` para manter consistência de container (List vs. single).

- **Propagação de paralelismo**: `propagate_labels()` percorre o DAG a partir das sources. Se uma aresta de entrada de um nó é `scatter`, incrementa `parallelism_level`; se é `gather`, decrementa (mínimo 0). Arestas `single` viram `parallel` se `parallelism_level > 0`. O nível máximo entre todas as entradas de um nó é propagado para suas saídas.

- **Fan-out/fan-in de fontes**: `fan_out_workflow_source()` cria um nó `InputFanOut` que recebe uma lista de inputs e distribui cada elemento como uma execução paralela. A função `_find_fan_out_fan_in_edges()` detecta arestas onde source e destination têm tipos container diferentes (ex.: `List[T]` → `T` para fan-out, `T` → `List[T]` para fan-in) e rotula como `scatter`/`gather`.

- **Input handling**: `build_args_for_workflow()` converte `user_input` para `OpIOType`: se for `SpatioTemporalJson`, gera um STAC item via `gen_stac_item_from_bounds()`. Se houver múltiplos sources e o input não for um dict com chaves correspondentes, lança erro. `validate_vibe_types()` deserializa cada input STAC e verifica se o tipo concreto é subclasse do tipo esperado.

- **Validação**: `WorkflowSpecValidator.validate()` executa em sequência: `_validate_sources` (estrutura, existência de nós), `_validate_sinks` (estrutura, existência), `_validate_edges` (sem ciclos, sem conflitos source/destination), `_validate_parameters` (referências e defaults). Depois, valida recursivamente sub-workflows.
