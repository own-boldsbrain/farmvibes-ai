# PRD — Módulo Workflow (vibe_common.workflow)

## JTBDs (Jobs To Be Done)

1. **Definir operações de processamento de dados geoespaciais com tipagem forte** — O engenheiro de dados precisa declarar classes que herdam de `DataVibeOp` especificando tipos de entrada (`Input`) e saída (`Output`) como tipos do sistema `vibe_core.data`, garantindo validação em tempo de construção do grafo.

2. **Registrar operações no sistema via decorador simples** — O desenvolvedor precisa anotar uma função com `@op` para que ela seja automaticamente convertida em um nó de workflow, com metadados (nome, descrição, inputs, outputs) extraídos da assinatura da função.

3. **Compor workflows como grafos acíclicos dirigidos (DAGs)** — O cientista de dados precisa encadear operações conectando saídas de uma operação às entradas de outra, formando um pipeline reutilizável que o orquestrador possa executar.

4. **Garantir que tipos de dados conectados sejam compatíveis** — O sistema deve validar em tempo de definição do workflow que o tipo de saída de uma operação corresponde ao tipo de entrada esperado pela próxima, emitindo erro em caso de incompatibilidade.

5. **Permitir saídas singulares ou plurais (lista)** — Uma operação pode produzir um único item (`DataVibe`) ou uma lista de itens (`List[DataVibe]`). O sistema de tipos deve suportar ambas as formas e propagar a informação para o storage/cache.

6. **Serializar/deserializar definições de workflow para intercâmbio** — As definições de operações e workflows precisam ser convertíveis para dicionários/dataclasses (via Hydra/Zen) para que possam ser armazenadas, versionadas ou transmitidas via API.

## Descrição do Módulo

Módulo de definição de interfaces para construção de workflows de processamento de dados no FarmVibes.AI. Fornece as classes base abstratas (`DataVibeOp`), o decorador `@op` para registro simplificado de operações, e o sistema de tipos (`Input`, `Output`, `TypeDictVibe`) para validação das conexões entre nós do grafo de processamento.

## Inputs

- `DataVibeOp` (classe base abstrata) — parâmetros definidos via `Input` e `Output` usando tipos `vibe_core.data`
- Decorador `@op` — recebe função Python com type hints; extrai `name`, `description`, `inputs`, `outputs`
- `TypeDictVibe` — dicionário validado que mapeia nomes de portas a tipos `DataVibeType` (`BaseVibe` ou `List[BaseVibe]`)
- `TypeParser.parse(typespec: str)` — recebe string como `"Raster"`, `"List[Sentinel2Raster]"`, `"@INHERIT(input_field)"`
- `OpIOType = Dict[str, Union[List[Dict[str, Any]], Dict[str, Any]]]` — representação serializada de IO

## Outputs

- Subclasse concreta de `DataVibeOp` — nó de workflow pronto para composição em DAG
- `DataVibeType = Union[Type[BaseVibe], Type[List[BaseVibe]]]` — tipo resolvido para validação
- `UnresolvedDataVibe(Type[BaseVibe])` — tipo meta para referências `@INHERIT` (resolvido em tempo de execução)
- Registro no `data_registry` — toda subclasse de `BaseVibe` é automaticamente registrada via `__init_subclass__`

## Lógicas e Cálculos

- **Registro automático de tipos:** `BaseVibe.__init_subclass__` chama `data_registry.register_vibe_datatype(cls)` sempre que uma nova subclasse de `BaseVibe` ou `DataVibe` é criada, garantindo que todo tipo definido esteja disponível para `TypeParser.parse()`.
- **Resolução de tipos via regex:** `TypeParser.type_pattern = r"((\w+)\[)?(\w+)\]?"` extrai container (`List`) e nome do tipo. `TypeParser.inherit_pattern = r"\s*\@INHERIT\((.*)\)\s*"` captura referências de herança entre portas de entrada/saída.
- **Geração de hash ID:** `BaseVibe.hash_id` calcula SHA-256 da representação JSON do objeto (via `dump_to_json`), a menos que a subclasse tenha um `id` explícito.
- **Cálculo de bbox:** `DataVibe.__post_init__` calcula automaticamente `bbox` a partir do campo `geometry` usando `shapely.geometry.shape(self.geometry).bounds`.
- **Clone de DataVibe:** `DataVibe.clone_from` copia campos de uma instância fonte (excluindo `id`, `assets`, `hash_id`, `bbox`) e permite sobrescrita via `**kwargs`, útil para operações que transformam metadados sem recomputar geometria.
