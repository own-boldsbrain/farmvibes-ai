# PRD — Terraform Infrastructure-as-Code (AKS, Local, Services)

## JTBDs (Jobs To Be Done)

1. **Provisionar um cluster AKS completo no Azure com recursos de infraestrutura** — O módulo `aks/main.tf` orquestra a criação de Resource Group (`rg`), infraestrutura de rede (VNet, subnets), cluster Kubernetes (AKS) com node pools (default + worker), storage account, Cosmos DB, Key Vault, public IP, Azure Monitor, e identidade gerenciada.

2. **Configurar Kubernetes para ambientes locais (k3d/Docker)** — O módulo `local/main.tf` provisiona um cluster k3d local com Redis, RabbitMQ, Dapr, OpenTelemetry (Jaeger), persistent volumes, e configurações de segurança (run_as_user/group) para desenvolvimento e testes offline.

3. **Implantar serviços de aplicação no Kubernetes (REST API, Worker, Cache, Data Ops, Orchestrator)** — O módulo `services/` cria deployments Kubernetes para cada microsserviço (cache, dataops, orchestrator, restapi, worker) com configurações de image, portas, volumes, variáveis de ambiente e argumentos de inicialização.

4. **Configurar sidecars Dapr para cada microsserviço** — Cada deployment nos serviços possui annotations Dapr (`dapr.io/enabled`, `dapr.io/app-id`, `dapr.io/app-port`, `dapr.io/app-protocol`) que habilitam o runtime Dapr como sidecar, permitindo comunicação via pub/sub, service invocation e state management entre os microsserviços.

5. **Expor a REST API com ingress e TLS (Let's Encrypt) no AKS** — O `restapi.tf` cria um `kubernetes_service` do tipo LoadBalancer (AKS) ou ClusterIP (local), um `kubernetes_ingress_v1` com SSL redirect e rewrite-target, e annotations do cert-manager para obtenção automática de certificados Let's Encrypt.

6. **Gerenciar armazenamento compartilhado e volumes persistentes** — Os módulos `kubernetes` (AKS e local) criam `PersistentVolumeClaim` para armazenamento compartilhado entre serviços. O worker monta `shared-resources` para dados temporários, e em modo AKS provisiona `dshm` (emptyDir com memória) para `/dev/shm`.

7. **Parametrizar toda a infraestrutura para diferentes ambientes e escalabilidade** — As variáveis Terraform (`worker_replicas`, `size_of_shared_volume`, `image_tag`, `farmvibes_log_level`, `enable_telemetry`, etc.) permitem ajustar replicação, recursos, imagem, logging e telemetria sem modificar o código IaC.

## Descrição do Módulo

Infraestrutura como código (Terraform) para deploy do FarmVibes.AI em dois ambientes: **AKS** (Azure Kubernetes Service — produção/cloud) com módulos `rg`, `infra` (VNet, AKS, storage, cosmos, keyvault, monitor) e `kubernetes` (Dapr, Redis, RabbitMQ, cert-manager, volumes); **Local** (k3d — desenvolvimento) com `kubernetes` (Redis, RabbitMQ, Dapr, Jaeger, volumes); e **Services** (comum) com deployments de cache, dataops, orchestrator, REST API e worker.

## Inputs

| Módulo | Variáveis Principais |
|---|---|
| `aks/` (root) | `location`, `prefix`, `tenantId`, `subscriptionId`, `namespace`, `acr_registry`, `acr_registry_username/password`, `resource_group_name`, `enable_telemetry`, `monitor_instrumentation_key`, `image_prefix/tag`, `worker_replicas`, `size_of_shared_volume`, `certificate_email`, `farmvibes_log_level` |
| `aks/modules/rg` | `location`, `prefix`, `tags` |
| `aks/modules/infra` | `location`, `prefix`, `tenantId`, `subscriptionId`, `resource_group_name`, `max_worker_nodes`, `enable_telemetry`, `farmvibes_log_level` |
| `aks/modules/kubernetes` | `tenantId`, `namespace`, `acr_registry`, `acr_registry_username/password`, `kubernetes_config_path/context`, `public_ip_address/fqdn/dns`, `keyvault_name`, `application_id`, `storage_connection_key/account_name`, `userfile_container_name`, `resource_group_name`, `size_of_shared_volume`, `monitor_instrumentation_key`, `enable_telemetry`, `certificate_email`, `current_user_name` |
| `local/` (root) | `acr_registry`, `namespace`, `run_as_user_id/group_id`, `host_assets_dir`, `kubernetes_config_path/context`, `image_tag`, `node_pool_name`, `host_storage_path`, `worker_replicas`, `image_prefix`, `redis_image_tag`, `rabbitmq_image_tag`, `enable_telemetry`, `farmvibes_log_level`, `max_log_file_bytes`, `log_backup_count` |
| `local/modules/kubernetes` | `namespace`, `kubernetes_config_path/context`, `host_storage_path`, `redis_image_tag`, `rabbitmq_image_tag`, `enable_telemetry` |
| `services/` | `prefix`, `namespace`, `kubernetes_config_path/context`, `worker_node_pool_name`, `default_node_pool_name`, `acr_registry`, `public_ip_fqdn`, `dapr_sidecars_deployed`, `working_dir`, `run_as_user/group_id`, `log_dir`, `max_log_file_bytes`, `log_backup_count`, `host_assets_dir`, `local_deployment`, `image_prefix/tag`, `worker_memory_request`, `startup_type`, `shared_resource_pv_claim_name`, `otel_service_name`, `worker_replicas`, `farmvibes_log_level` |

## Outputs

| Módulo | Outputs Terraform |
|---|---|
| `aks/modules/infra` | `kubernetes_config_path`, `kubernetes_config_context`, `worker_node_pool_name`, `public_ip_address/fqdn/dns`, `keyvault_name`, `application_id`, `storage_account_name`, `userfile_container_name`, `storage_connection_key` (sensitive), `max_worker_nodes`, `max_default_nodes`, `monitor_instrumentation_key` (sensitive) |
| `aks/modules/kubernetes` | `dapr_sidecars_deployed` (bool, depende de sidecars + PVC), `shared_resource_pv_claim_name` |
| `local/modules/kubernetes` | `ready_to_deploy` (bool, depende de PVC + Redis + RabbitMQ + sidecars), `shared_resource_pv_claim_name` |
| `aks/` (root) | (agrega outputs dos submódulos via passagem de variáveis) |

## Lógicas e Cálculos

- **Orquestração AKS**: `aks/main.tf` define 4 módulos com dependência explícita: `rg` → `infrastructure` → `kubernetes` → `services`. O módulo `infra` cria o cluster AKS, storage, cosmos, keyvault, VNet, public IP e monitor. O módulo `kubernetes` configura o cluster (Dapr, Redis, RabbitMQ, cert-manager, PVC). O módulo `services` (reutilizado do diretório `services/`) implanta os microsserviços.

- **Orquestração Local**: `local/main.tf` define 2 módulos: `kubernetes` (Redis, RabbitMQ, Dapr, Jaeger, PVC) e `services` (mesmo módulo `services/`). O output `kubernetes.ready_to_deploy` serve como gate para o módulo `services`, garantindo que a infraestrutura base esteja pronta antes de implantar os serviços.

- **Deploy de serviços**: O módulo `services/` cria 5 deployments Kubernetes (`cache`, `dataops`, `orchestrator`, `restapi`, `worker`), cada um com:
  - Imagem composta por `{acr_registry}/{image_prefix}{nome}:{image_tag}`
  - Annotations Dapr obrigatórias (app-id, port, protocol, metrics)
  - `node_selector` baseado em `agentpool` (diferente para worker vs. outros)
  - `image_pull_secrets` referenciando `acrtoken`
  - Comando Python com argumentos modulares: `common_args` (sempre) + `extra_args` (apenas `local_deployment=true`)
  - `depends_on = [var.dapr_sidecars_deployed]` — aguarda Dapr estar pronto
  - Volume mounts condicionais: `host-mount` (hostPath, apenas local), `shared-resources` (PVC, worker sempre), `dshm` (emptyDir memória, apenas AKS)

- **Cache e Data Ops**: Ambos usam a mesma imagem base `${image_prefix}cache:${image_tag}` mas com entrypoints diferentes (`vibe-cache` e `vibe-data-ops`). Compartilham variáveis de ambiente de Azure (tenant, client, secret) e configurações de STAC Cosmos DB (URI, container, database, connection key). Em modo local, montam `/mnt/` como hostPath.

- **Orchestrator e REST API**: Ambos usam imagem `${image_prefix}api-orchestrator:${image_tag}` com entrypoints `vibe-server` (REST) e `vibe-orchestrator`. A REST API expõe um `kubernetes_service` (tipo LoadBalancer no AKS, ClusterIP no local) e um `kubernetes_ingress_v1` com classe `nginx` (AKS) ou `traefik` (local), SSL redirect (apenas AKS), e TLS com cert-manager Let's Encrypt. O recurso `kubernetes_annotations` adiciona annotations de cluster-issuer apenas no AKS.

- **Worker**: Deployment escalável (`worker_replicas`), com `progress_deadline_seconds = 3600` e `timeouts` de 120min para create/update. Possui `pre_stop` hook que invoca Dapr shutdown via curl. Define `resources.requests.memory` configurável (`worker_memory_request`). Usa `node_selector` apontando para `worker_node_pool_name` (pool separado dos demais serviços).

- **Dapr sidecars**: No módulo `kubernetes` (AKS), o output `dapr_sidecars_deployed` é `true` somente após a criação dos manifestos `kubectl_manifest` para keyvault sidecar, statestore sidecar, resiliência, control-pubsub e Dapr config collector. No local, `ready_to_deploy` depende de PVC, Redis, RabbitMQ, control-pubsub e resiliência. Todos os services aguardam este sinal via `depends_on`.

- **Telemetria e OpenTelemetry**: Se `otel_service_name` for fornecido, cada serviço adiciona o argumento `--otel-service-name` ou `*.impl.otel_service_name`. Se `enable_telemetry` for true no AKS, o módulo `infra` cria Application Insights e passa a instrumentation key para o módulo `kubernetes`. O módulo local inclui deployment opcional de Jaeger para tracing.

- **Configuração de logging**: Serviços em modo local recebem argumentos extras de logging: `loglevel`, `logdir`, `max_log_file_bytes` e `log_backup_count`. Em AKS, esses argumentos são omitidos (logging é gerenciado pelo Azure Monitor / stdout).
