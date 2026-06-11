# PRD — Módulo CLI (vibe_core.cli)

## JTBDs (Jobs To Be Done)

1. **Gerenciar clusters locais (k3d/k8s) com um único comando** — O usuário precisa criar, atualizar, destruir, iniciar, parar e reiniciar clusters Kubernetes locais baseados em k3d usando `farmvibes-ai local <action>`, com validação de dependências (docker, kubectl, k3d) e espaço em disco.

2. **Gerenciar clusters remotos (AKS) na Azure** — O usuário precisa provisionar e gerenciar clusters AKS completos com Terraform, incluindo resource groups, redes, storage, Key Vault, Cosmos DB, DNS e certificados HTTPS via Let's Encrypt, usando `farmvibes-ai remote <action>`.

3. **Gerenciar secrets do cluster (add/delete)** — O operador precisa adicionar e remover secrets Kubernetes (como tokens de registro de contêineres) sem acesso direto ao kubectl, tanto em clusters locais quanto remotos.

4. **Gerenciar modelos ONNX** — O engenheiro de ML precisa adicionar modelos ONNX ao cluster para que os workers possam executar inferência, com upload para storage local (hardlink/cópia) ou remoto (Azure Blob).

5. **Fazer backup e restore do estado do Redis** — Durante a destruição/recriação de clusters locais, o sistema deve automaticamente oferecer backup do estado do Redis (workflows em execução, filas) e restaurá-lo no novo cluster.

6. **Verificar disponibilidade de recursos na Azure antes de provisionar** — O `AzureCliWrapper` deve verificar se há cotas de CPU suficientes na região, se os resource providers necessários estão registrados, e registrar provedores automaticamente se autorizado.

7. **Fazer upgrade incremental de clusters sem perda de dados** — O comando `update` (local e remoto) deve identificar recursos que precisam ser substituídos (via Terraform plan), alertar o usuário sobre riscos de perda de dados (ex.: storage sendo recriado), e executar a migração com segurança.

8. **Baixar e gerenciar binários de dependências (terraform, kubectl, k3d, etc.)** — O `OSArtifacts` deve detectar o SO, baixar as versões corretas das ferramentas, extraí-las e disponibilizá-las em um diretório de configuração, garantindo versões compatíveis.

## Descrição do Módulo

Interface de linha de comando completa para gerenciamento de clusters FarmVibes.AI. Suporta dois modos: **local** (k3d/Kubernetes em Docker) e **remoto** (AKS na Azure). Inclui parsers de argumentos, wrappers para CLI de terceiros (az, kubectl, terraform, docker, k3d, dapr), logging estruturado, e gerenciamento automático de dependências e binários.

## Inputs

- `main()` — argumentos CLI: `cluster_type` (`local`/`remote`), `-v`, `--auto-confirm`
- `LocalCliParser` / `RemoteCliParser` — definem flags específicas (servers, agents, storage-path, registry, image-tag, worker-replicas, port, host, region, cert-email, max-worker-nodes)
- `OSArtifacts` — detecta SO, gerencia download de binários (`k3d`, `kubectl`, `terraform`, `az`, `kubelogin`, `helm`, `dapr`)
- `K3dWrapper` — `cluster_name`, `os_artifacts`; métodos: `create`, `delete`, `start`, `stop`, `info`, `cluster_exists`
- `KubectlWrapper` — `os_artifacts`, `cluster_name`, `config_context`; métodos: `list_pods`, `scale`, `exec`, `cp`, `delete`, `get_secret`, `add_secret`, `restart`
- `TerraformWrapper` — `os_artifacts`, `az` (opcional), `environment`; métodos: `init`, `plan`, `apply`, `get_output`, `workspace`, `ensure_infra`, `ensure_k8s_cluster`, `ensure_services`, `ensure_local_cluster`
- `AzureCliWrapper` — `os_artifacts`, `cluster_name`, `resource_group`; métodos: `cluster_exists`, `refresh_az_creds`, `refresh_aks_credentials`, `ensure_azurerm_backend`, `check_resource_providers`, `verify_enough_cores_available`, `request_registry_token`, `upload_file`
- `DockerWrapper` — `os_artifacts`; métodos: `get`, `rm`, `exec`, `network_inspect`
- `DaprWrapper` — `os_artifacts`, `kubectl`; métodos: `needs_upgrade`, `upgrade_crds`
- `Dependency` — `name`, `install_instructions`, `type`, `version_regex`, `minimum_version`, `maximum_version`

## Outputs

- `bool` — sucesso/falha de cada operação (setup, destroy, start, stop, restart, add-secret, add-onnx)
- `str` — service URL escrito em arquivo de configuração (`service_url` / `remote_service_url`)
- Logs estruturados em arquivo (configurado via `setup_logging`)
- Código de saída 0 (sucesso) ou 1 (falha) no `sys.exit()`
- `None` — em operações de remoção de secret ou parada de cluster
- Arquivos de configuração: `kubeconfig`, `storage`, `terraform` states, secrets

## Lógicas e Cálculos

- **Descoberta de service URL local:** A função `write_service_url` varre os nodes do cluster k3d em busca do node loadbalancer (porta 80), faz fallback para `get_service_from_docker_network` (inspeciona container `k3d-{name}-server-0` via Docker network) e, por último, para `get_service_from_ingress_loadbalancer` (lê ingress do Kubernetes).
- **Particionamento de Terraform:** `TerraformWrapper` gerencia workspaces separados por cluster (`farmvibes-k3d-{name}` ou `farmvibes-aks-{name}-{rg}`), com init/plan/apply em 4 módulos: `rg`, `infra`, `kubernetes`, `services`.
- **Detecção de substituição de recursos:** `_get_replacements` usa regex `r"#\s+(.*)\s+must\s+be\s+replaced"` no output do `terraform plan` para identificar recursos que serão recriados. Se `storageaccount` ou `cosmosdb` estiverem na lista, alerta o usuário sobre perda de dados.
- **Backup/restore Redis:** `backup_redis_data` executa `redis-cli` via `kubectl exec`, força um SAVE e copia o dump com `kubectl cp`. `restore_redis_data` escala o statefulset para 0, cria um pod temporário com o volume Redis, copia o dump e escala de volta.
- **Verificação de cotas de CPU:** `verify_enough_cores_available` consulta `az vm list-usage` para 3 tipos de CPU regionais, calcula `required = max(needed - current, 0)` e valida contra `available = limit - currentValue`.
- **Geração de nome de storage account:** `storage_name` usa SHA-256 de `cluster_name + resource_group`, prefixo `"azurerm"`, truncado a 24 caracteres (`MAXIMUM_STORAGE_ACCOUNT_NAME_LENGTH`).
- **Registro de provedores Azure:** `register_providers` usa `ThreadPoolExecutor` para registrar múltiplos resource providers em paralelo, com polling a cada 10s até 60 tentativas.
