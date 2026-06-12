# Guia do Usuário para Cluster Remoto

Este documento fornece uma visão geral do processo de configuração remota para o
FarmVibes.AI, detalhando os principais componentes, opções de configuração e
possibilidades de customização.

O foco principal deste guia é ajudar os usuários a entender a estrutura e
organização dos scripts Terraform usados para criar e configurar o cluster remoto
e seus componentes associados na nuvem Azure.

## Requisitos

O script de gerenciamento remoto do FarmVibes.AI é um utilitário baseado em [Python](https://python.org) que funciona assumindo que quem o está
executando tem pelo menos a função de *Contributor* (Colaborador) na assinatura do Azure.
Por favor, certifique-se de ter o Python instalado antes de tentar configurar um cluster.

A interface de linha de comando `az` é um requisito obrigatório para a execução do script.
Siga a [documentação da Interface de Linha de Comando (CLI) do Azure](https://docs.microsoft.com/cli/azure/) para instruções sobre como
instalá-la. Certifique-se de instalar a versão apropriada para sua
arquitetura, caso contrário, o processo de instalação pode falhar.

Se você tiver problemas para instalar esses utilitários, consulte a próxima seção,
com instruções sobre como construir um cluster remoto FarmVibes.AI a partir de um Azure
Cloud Shell.

### Quotas de CPU do Azure necessárias

Na configuração padrão, a quota de CPU da sua assinatura deve suportar pelo menos 20 vCPUs na região escolhida. Você também precisará de 12 `vCPUs da Família Standard DSv3` disponíveis. Siga o [guia de aumento de quota do Azure](https://learn.microsoft.com/en-us/azure/quotas/quickstart-increase-quota-portal).
O instalador falhará se a quota não estiver disponível.

Resumindo, o número mínimo de CPUs necessário é:

 * Total de vCPUs Regionais: aumentar para pelo menos 20
 * vCPUs da Família Standard DSv3: aumentar para pelo menos 12
 * vCPUs da Família Standard BS: aumentar para pelo menos 8

Você pode precisar habilitar o provedor `Microsoft.Compute` na sua assinatura.
Para instruções sobre como fazer isso, prossiga para a seção de [Provedores do Azure](#provedores-do-azure).

### Instalação pelo Azure Cloud Shell

Para casos em que os usuários não conseguem instalar os requisitos do FarmVibes.AI em uma máquina local, eles podem usar um Azure Cloud Shell para completar a instalação.

Para fazer isso, visite [https://shell.azure.com/](https://shell.azure.com/) para
iniciar um novo Azure Cloud Shell.

Quando solicitado se deseja iniciar um shell "Bash" ou "PowerShell", selecione "Bash".

Em seguida, execute os seguintes passos manuais:

```bash
pip install --upgrade pip  # para usar a versão mais recente do gerenciador de pacotes
# Execute o seguinte para instalar a biblioteca `vibe_core` e o comando `farmvibes-ai`
pip install "git+https://github.com/microsoft/farmvibes-ai#egg =vibe_core&subdirectory=src/vibe_core"
az provider register --namespace Microsoft.Compute  # para habilitar o provedor de computação
```

Após executar os comandos acima, defina manualmente a quota de processadores na região do Azure que você deseja usar, caso ainda não o tenha feito. (Consulte a seção [Quotas de CPU do Azure necessárias](#quotas-de-cpu-do-azure-necessarias) para detalhes.)

Em seguida, execute um `az account show` e certifique-se de que está conectado à assinatura correta do Azure. Caso contrário, `az account list` listará todas as suas assinaturas, e executar um `az account set $SUBSCRIPTION_ID` definirá a assinatura atual, onde `$SUBSCRIPTION_ID` é o id da assinatura que você gostaria de usar.

Dependendo de suas permissões, você pode ou não precisar criar um grupo de recursos manualmente para instalar o cluster FarmVibes.AI AKS. Se necessário, você pode criar um novo grupo de recursos com `az group create --name nome_do_grupo_de_recursos --location nome_da_localizacao`, onde `nome_do_grupo_de_recursos` é o nome do grupo de recursos e `nome_da_localizacao` é a Região do Azure onde você instalará o cluster.

Uma vez atendidos esses requisitos, você pode seguir as instruções sobre como usar [o script farmvibes-ai](#o-script-farmvibes-ai).

### Provedores do Azure

Como o script de gerenciamento remoto do FarmVibes.AI precisa provisionar novos recursos no Azure, ele precisa de acesso a vários [Provedores do Azure](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs).
O próprio script é capaz de registrar cada provedor necessário. Até o momento da escrita deste documento, os provedores necessários são:

 * `Microsoft.DocumentDB`, para provisionamento do Cosmos DB
 * `Microsoft.KeyVault`, para gerenciar um Azure KeyVault para segredos
 * `Microsoft.ContainerService`, para gerenciar o próprio AKS
 * `Microsoft.Network`, para configurar IPs públicos e vnets
 * `Microsoft.Storage`, para provisionar contas de [armazenamento (storage)](https://learn.microsoft.com/en-us/azure/storage/)
 * `Microsoft.Compute`, para provisionar Máquinas Virtuais e Conjuntos de Escala de Máquinas Virtuais (VMSS)

### Definindo a assinatura

Alguns usuários do Azure terão acesso a múltiplas assinaturas. Para listar todas as assinaturas às quais você tem acesso, use o comando:

```
az account list
```

Em seguida, você pode definir sua assinatura padrão com o comando:

```
az account set ${ID_DA_SUA_ASSINATURA_DESEJADA}
```

## Ambientes do Azure

O ambiente AKS suporta todos os [ambientes de Nuvem (Nacional) do Azure](https://learn.microsoft.com/en-us/graph/deployments). Os usuários podem escolher com qual nuvem desejam interagir usando o argumento `--environment`. Os valores válidos para este argumento são:

 * `public` (o padrão se não for especificado)
 * `usgovernment` (para a nuvem do Governo dos EUA)
 * `german` (para a nuvem soberana da Alemanha)
 * `china` (para a nuvem soberana da China)

## Substituindo o administrador do cluster

O script de instalação `farmvibes-ai` usa a CLI `az` para inferir as credenciais do administrador do cluster (= o usuário logado no momento). Em algumas situações, o usuário que realiza a instalação pode não ser o usuário que realmente gerenciará o cluster com `kubectl`.

Nesses casos, você pode usar o argumento `--cluster-admin-name` para definir quem terá acesso ao cluster.

## Componentes da Nuvem Azure

![Diagrama de arquitetura da configuração remota do FarmVibes.AI](./aks-terraform.svg)

O processo de configuração do cluster funciona provisionando diferentes tipos de recursos na Nuvem Azure, sempre orquestrado pelo script `farmvibes-ai remote`, detalhado na próxima seção.

O primeiro componente que precisa ser configurado é o Grupo de Recursos (Resource Group). O script suporta o uso de um Grupo de Recursos existente ou a criação de um novo. Recomendamos deixar o script criar um novo grupo de recursos, pois o script sempre assumirá que é capaz de gerenciar o grupo de recursos (inclusive excluindo recursos quando a destruição do cluster for solicitada).

Um **(1) Grupo de Recursos** fornece um contêiner lógico para recursos que são implantados dentro de uma assinatura do Azure. Neste projeto, um grupo de recursos é criado para organizar e gerenciar os recursos relacionados ao cluster remoto, facilitando o monitoramento, a segurança e o gerenciamento coletivo dos recursos.

Depois que o script `farmvibes-ai remote` garante a existência do Grupo de Recursos, ele cria uma conta de **(2) Armazenamento de Metadados** para o cluster e recursos associados do Azure. O script determina o nome desta nova conta de armazenamento usando uma função determinística que faz o hash do nome do cluster e do nome do grupo de recursos.

Uma vez que o grupo de recursos e a conta de armazenamento de metadados existam, o script usa o [TerraForm](https://www.terraform.io) para provisionar a infraestrutura, que ocorre em três níveis, descritos abaixo.

### (3) Infraestrutura

- [**Cosmos DB**](https://learn.microsoft.com/en-us/azure/cosmos-db/): a configuração cria duas contas do Azure Cosmos DB, cada uma com seus respectivos bancos de dados e contêineres. O Azure Cosmos DB é um serviço de banco de dados multimodelo totalmente gerenciado, distribuído globalmente, projetado para acesso a dados com baixa latência e escalabilidade horizontal contínua.

- [**Key Vault**](https://learn.microsoft.com/en-us/azure/key-vault/): um componente para armazenar e gerenciar informações sensíveis, como segredos, strings de conexão e credenciais usadas pelos serviços no cluster remoto.

- [**Azure Kubernetes Service (AKS)**](https://learn.microsoft.com/en-us/azure/aks/): um serviço de Kubernetes gerenciado que simplifica a implantação, o gerenciamento e a escala de aplicações conteinerizadas usando Kubernetes. Neste projeto, um cluster AKS é criado com as configurações especificadas, permitindo que você implante e gerencie seus serviços conteinerizados com facilidade.

- [**Conta de Armazenamento (Storage Account)**](https://learn.microsoft.com/en-us/azure/storage/): um serviço de armazenamento em nuvem que fornece armazenamento escalável, durável e altamente disponível para vários tipos de dados, como blobs, arquivos, filas e tabelas. Neste projeto, a Conta de Armazenamento é configurada para permitir o acesso a partir da rede virtual criada para a configuração do AKS, fornecendo acesso seguro e isolado aos dados armazenados.

- [**Rede Virtual (VNet) e Sub-rede**](https://learn.microsoft.com/en-us/azure/virtual-network/): a Rede Virtual (VNet) é o bloco de construção fundamental para criar uma rede privada e isolada no Azure. Ela permite que os recursos dentro da rede se comuniquem entre si de forma segura e eficiente.

- **Endereço IP Público**: os endereços IP Públicos do Azure permitem que você se comunique com recursos pela internet, fornecendo acesso público aos serviços executados no cluster remoto. O rótulo do nome de domínio é criado usando uma combinação do prefixo e um hash do nome do grupo de recursos, criando um nome de domínio único e facilmente identificável para seus serviços.

### (4) Componentes do Kubernetes

Após a conclusão da camada de infraestrutura, o script prossegue para o provisionamento dos componentes do Kubernetes, que são:

- Banco de dados [Redis](https://redis.io/) para cache de dados sobre fluxos de trabalho executados e dados gerados.
- [RabbitMQ](https://www.rabbitmq.com/) para troca de mensagens entre os serviços do FarmVibes.AI.
- [Dapr (Distributed Application Runtime)](https://dapr.io/) para abstrair a invocação de serviços e mensageria.
- Um volume persistente que usa a conta de armazenamento criada no passo anterior como repositório de suporte.
- Serviço de telemetria aberta (Open Telemetry) para coletar dados de telemetria dos serviços.
- Um serviço de gerenciamento de certificados para configurar endpoints TLS para os serviços do FarmVibes.AI, como a API REST.

### (5) Serviços

Finalmente, após a configuração dos componentes básicos do cluster, o script prossegue para definir e implantar os serviços do FarmVibes.AI:

- **Rest-api (Servidor).** Um servidor web que expõe uma API REST para que os usuários possam chamar fluxos de trabalho, acompanhar a execução de fluxos de trabalho e recuperar resultados.

- **Orchestrator.** Este componente gerencia a execução do fluxo de trabalho, transmitindo solicitações aos trabalhadores (workers) e atualizando o status do fluxo de trabalho.

- **Worker.** Um componente escalável responsável pela computação real da operação do fluxo de trabalho. Em vez de executar todo o fluxo de trabalho de uma vez, ele computa os chunks atômicos processados pelo usuário.

- **Cache.** Este componente fica entre o orquestrador e os trabalhadores; ele verifica se uma operação foi executada anteriormente e retorna resultados em cache para o orquestrador.

- **Data Ops.** Este componente é responsável por gerenciar operações de dados, como manter o controle de assets relacionados à execução do fluxo de trabalho e excluir dados de execução quando solicitado.

## Instalação e Configuração

A instalação e configuração do cluster AKS para o FarmVibes.AI é gerenciada por um script chamado `farmvibes-ai`, sob o grupo de ação `remote`. Este script automatiza o processo de configuração da infraestrutura necessária no Azure (discutido acima) e a implantação dos serviços.

Antes de executar o script, você precisa instalar o pacote `vibe_core`, que fornece o comando `farmvibes-ai`. Veja como fazer:

1. Certifique-se de ter o Python 3.8 ou superior instalado, com o comando `pip` disponível. Consulte o [guia de instalação do Python](https://www.python.org/downloads/) e o [guia de instalação do pip](https://pip.pypa.io/en/stable/installing/) para instruções sobre como instalar o Python e o pip.

2. Certifique-se de ter o git instalado e configurado. Consulte o [guia de instalação do git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) para instruções sobre como instalar o git.

3. Agora você tem duas opções para instalar o pacote `vibe_core`:

   3.1. Instalar o pacote diretamente do repositório GitHub, com o pip:
        `pip install "git+https://github.com/microsoft/farmvibes-ai#egg=vibe_core&subdirectory=src/vibe_core"`

   3.2. Clonar o repositório com `git clone https://github.com/microsoft/farmvibes-ai.git` e instalar o pacote a partir da cópia local com `pip install ./farmvibes-ai/src/vibe_core`.

4. Após instalar o pacote `vibe_core`, você pode executar o script `farmvibes-ai`.

### O script farmvibes-ai

O script `farmvibes-ai` gerencia todo o ciclo de vida do cluster remoto, incluindo criação, exclusão e atualizações. O script é organizado em subcomandos, cada um responsável por uma ação específica. Os subcomandos, com suas descrições e instruções de uso, podem ser exibidos executando `farmvibes-ai remote -h`.

Para criar um novo cluster remoto, você deve fornecer alguns argumentos obrigatórios para `farmvibes-ai remote setup`: o nome do cluster, o nome do grupo de recursos e a localização do cluster, bem como um endereço de e-mail para gerar os certificados TLS para a API REST.

O script criará um novo grupo de recursos com o nome especificado e o usará para criar o cluster, criando-o também se ele não existir.

**NOTA**: Recomendamos que você use um grupo de recursos vazio para criar seu cluster. Se você precisar destruir seu cluster, todas as alterações em sua assinatura ficarão restritas àquele grupo de recursos.

**AVISO**: Se você decidir reutilizar um grupo de recursos já existente, destruir o cluster excluirá **TODOS** os recursos naquele grupo de recursos.

Um exemplo de comando de configuração é mostrado abaixo:

```bash
farmvibes-ai remote setup \
  --region eastus \
  --cert-email testemail@example.com \
  --resource-group nome-de-algum-grupo-de-recursos
```

Uma vez que o comando for executado, você receberá um hostname para o cluster, e o script atualizará os arquivos de configuração do FarmVibes.AI para apontar o cliente padrão para a URL do cluster recém-criado.

```text
INFO - URL for your AKS Cluster is: https://test-build-1234-5678e9-dns.eastus2.cloudapp.azure.com
```

Você pode usá-lo para acessar a API REST e o cliente FarmVibes.AI, seguindo as instruções em nosso [Guia do usuário do Cliente](./CLIENT.md):

```python
from vibe_core.client import get_default_vibe_client
client = get_default_vibe_client("remote")
```

## Pré-registrando provedores

Como mencionado anteriormente, o instalador registrará automaticamente cada provedor necessário, mas se você preferir pré-registrar todos os provedores antecipadamente, pode executar o script PowerShell abaixo (que, dependendo das suas configurações de segurança, pode ser mais fácil de copiar e colar no prompt).

<details>
  <summary>Exemplo de script PowerShell (clique para expandir)</summary>

```powershell
# Define a lista de provedores para registrar
$providers = @(
    "Microsoft.DocumentDB",
    "Microsoft.KeyVault",
    "Microsoft.ContainerService",
    "Microsoft.Network",
    "Microsoft.Storage",
    "Microsoft.Compute"
)

# Inicializa arrays para jobs e uma hashtable para mapeamento job-provider
$jobs = @()
$jobProviderMap = @{}

# Inicia um job para cada provedor para registrá-lo
foreach ($provider in $providers) {
    $job = Start-Job -ScriptBlock {
        param($provider)
        $currentState = az provider show -n $provider --query "registrationState" -o tsv

        if ($currentState -ne "Registered" -and $currentState -ne "Registering") {
            az provider register --namespace $provider
        }

        do {
            $registrationState = az provider show -n $provider --query "registrationState" -o tsv
            if ($registrationState -ne "Registered") {
                Start-Sleep -Seconds 10
            }
        } while ($registrationState -ne "Registered")

        $provider
    } -ArgumentList $provider

    $jobs += $job
    $jobProviderMap[$job.Id] = $provider
}

# Verifica periodicamente o status de cada job
while ($jobs | Where-Object { $_.State -eq 'Running' }) {
    Clear-Host
    foreach ($job in $jobs) {
        $state = $job.ChildJobs[0].JobStateInfo.State
        $providerName = $jobProviderMap[$job.Id]
        Write-Host "Provider $providerName is in $state state."
    }
    Start-Sleep -Seconds 10
}

# Recupera e exibe o status final de cada job e depois limpa
foreach ($job in $jobs) {
    $providerName = Receive-Job -Job $job -Wait
    Write-Host "Provider $providerName is now registered."
    Remove-Job -Job $job
}
```
</details>
