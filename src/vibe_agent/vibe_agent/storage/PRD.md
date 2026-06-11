# PRD — Módulo Storage (vibe_agent.storage)

## JTBDs (Jobs To Be Done)

1. **Armazenar assets geoespaciais com garantia de atomicidade e consistência** — Quando um workflow produz dados, o sistema precisa garantir que todos os assets sejam copiados para o diretório ou blob de destino **antes** que o catálogo STAC seja atualizado, e que falhas revertam operações parciais (rollback removendo assets copiados).

2. **Recuperar saídas de operações anteriores por hash de entrada** — O usuário/operador precisa consultar se um par (operação + hash dos inputs) já foi processado, evitando recomputação. O Storage deve retornar o `ItemDict` em cache ou `None` se inexistente.

3. **Copiar assets entre execuções de workflow** — Cada operação (`DataVibeOp`) precisa que seus assets de entrada sejam copiados para o domínio de armazenamento da execução atual. O `AssetCopyHandler` orquestra essa cópia e garante limpeza em caso de erro.

4. **Gerenciar o ciclo de vida de assets individuais (CRUD)** — O `AssetManager` (abstrato) precisa permitir armazenar (`store`), recuperar (`retrieve`), verificar existência (`exists`) e remover (`remove`) assets identificados por GUID, tanto em filesystem local quanto em Azure Blob Storage.

5. **Garantir desempenho com cache de listagem de blobs** — Para ambientes remotos, o `BlobAssetManager` usa `lru_cache` na listagem de blobs por prefixo (até 100 entradas), evitando chamadas repetidas ao Azure Blob API para verificação de existência.

6. **Particionar listas grandes de itens no Cosmos DB** — No `CosmosStorage`, itens de saída que excedem o tamanho máximo de documento (1 MB) devem ser automaticamente particionados em múltiplos `ItemList`, com tamanho reduzido recursivamente pela metade até 1 item por partição.

7. **Fornecer URLs assinadas (SAS) para acesso seguro a blobs remotos** — Quando o consumidor requisitar um asset remoto, o `BlobAssetManager` deve gerar uma URL com SAS token via `BlobTokenManager`, garantindo acesso temporário sem expor chaves de conta.

## Descrição do Módulo

Camada de abstração de armazenamento persistente para assets geoespaciais e metadados STAC. Suporta dois backends: **local** (filesystem + catálogo STAC em JSON) e **remoto** (Azure Blob Storage para assets + Azure Cosmos DB para metadados). Implementa os padrões ACID (atomicidade, consistência, isolamento, durabilidade) para operações de escrita.

## Inputs

- `Storage` (ABC) — parâmetros: `asset_manager: AssetManager`
- `LocalStorage(Storage)` — parâmetros: `local_path: str`, `asset_manager: AssetManager`
- `CosmosStorage(Storage)` — parâmetros: `key: str`, `asset_manager: AssetManager`, `stac_container_name`, `cosmos_database_name`, `cosmos_url`, `list_max_size`
- `AssetManager` (ABC) — métodos: `store(guid, file_path) -> str`, `retrieve(guid) -> str`, `exists(guid) -> bool`, `remove(guid)`
- `LocalFileAssetManager(AssetManager)` — parâmetros: `local_storage_path: str`
- `BlobAssetManager(AssetManager)` — parâmetros: `storage_account_url` ou `connection_string`, `asset_container_name`, `credential`, `max_upload_concurrency`
- `ItemDict = Dict[str, Union[Item, List[Item]]]` — dicionário de itens STAC
- `CacheInfo` — contém `hash`, `name`, `as_storage_dict()`
- `OpRunId` — contém `hash`, `name`
- `CosmosData`, `ItemList`, `RunInfo` — dataclasses para persistência no Cosmos DB

## Outputs

- `ItemDict` — itens STAC com assets copiados/recuperados
- `Optional[ItemDict]` — retorno de `retrieve_output_from_input_if_exists` (None se cache miss)
- `str` — URL ou path absoluto do asset armazenado/recuperado (`store`/`retrieve`)
- `bool` — resultado de `exists(guid)`
- `None` — operações de `remove`
- `List[BlobProperties]` — listagem de blobs no Azure (com cache LRU)
- `CosmosStorageConfig`, `LocalStorageConfig` — configurações exportáveis via Hydra/Zen

## Lógicas e Cálculos

- **Particionamento Cosmos**: `_build_items_to_store` divide `item_dict` em partições de até `list_max_size` itens. Cada partição recebe um ID único via SHA-256 dos IDs dos itens + output_name + run_hash. Se o documento ultrapassar 1 MB (`entity_too_large_status_code = 413`), o `list_size` é reduzido recursivamente pela metade até `LIST_MIN_SIZE = 1`.
- **Cópia atômica de assets**: `AssetCopyHandler._copy_prepared_assets` itera sobre os GUIDs, copia cada asset, e mantém uma lista de sucesso. Se qualquer cópia falha, todos os assets já copiados são removidos (`asset_manager.remove`).
- **Cache de listagem de blobs**: `cached_blob_list_by_prefix` usa `@lru_cache(maxsize=100)` e é invalidada explicitamente (`cache_clear()`) após operações de `store` ou `remove` no `BlobAssetManager`.
- **Geração de hash para cache**: O `HASH_FIELD = "vibe_op_hash"` é extraído de `cache_info.as_storage_dict()` e usado como diretório (local) ou ID (Cosmos).
- **Conversão STAC**: Em `CosmosStorage`, itens são serializados via `to_dict()` para armazenamento e reconstruídos via `Item.from_dict()` na recuperação. Em `LocalStorage`, catálogos são salvos como JSON via `pystac`.
