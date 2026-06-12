
# Configuração de VM do FarmVibes.AI

Este documento auxilia você na criação de uma nova VM do Azure capaz de executar o
FarmVibes.AI do zero.

## Requisitos

* Você precisará de um computador Linux ou do Subsistema Windows para Linux (WSL) em sua máquina Windows.
* O Azure CLI precisará estar instalado. Mais informações [aqui](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli).
* Você precisará de uma Assinatura do Azure (Azure Subscription). Mais detalhes sobre como configurar uma podem ser encontrados [aqui](https://azure.microsoft.com/en-us/free/search/?ef_id=EAIaIQobChMIlcaGu9bG-gIVET6RCh3KXwK9EAAYASAAEgLP-vD_BwE%3AG%3As&OCID=AIDcmmzmnb0182_SEM_EAIaIQobChMIlcaGu9bG-gIVET6RCh3KXwK9EAAYASAAEgLP-vD_BwE%3AG%3As&gclid=EAIaIQobChMIlcaGu9bG-gIVET6RCh3KXwK9EAAYASAAEgLP-vD_BwE).
* Assim que tiver acesso a uma assinatura, você precisará criar um grupo de recursos (resource group) ou usar um existente
para o qual você tenha pelo menos a função de `contributor` (colaborador).
* Você também precisará de uma chave pública ssh (idealmente no local padrão em `~/.ssh/id_rsa.pub`). Se você não tiver
uma chave ssh, uma pode ser gerada executando `ssh-keygen` em seu shell. Ao criar a VM, adicionamos esta chave pública à sua VM para que você possa fazer o login facilmente (mais informações sobre chaves SSH para acessar VMs estão disponíveis [aqui](https://learn.microsoft.com/en-us/azure/virtual-machines/linux/mac-create-ssh-keys)).
* Você precisará de acesso a dois arquivos no repositório FarmVibes, `farmvibes_ai_vm.bicep` e `setup_farmvibes_ai_vm.sh`, ambos na pasta `resources/vm/`. Para acessar esses arquivos, você pode copiá-los diretamente do nosso [repositório](https://github.com/microsoft/farmvibes-ai) ou clonar todo o repositório para o seu computador local.

## Criando uma nova VM Ubuntu

1. Faça login no Azure usando o Azure CLI:
```shell
az login
```

2. Se você tiver múltiplas Assinaturas do Azure, selecione a assinatura que deseja usar:
```shell
az account set --subscription <NOME DA ASSINATURA>
```

3. A partir da raiz do repositório, você precisará executar o seguinte comando de implantação (deployment):
```shell
az deployment group create --resource-group <resource_group> \
   --name <deployment_name> \
   --template-file  resources/vm/farmvibes_ai_vm.bicep \
   --parameters \
            ssh_public_key="$(cat ~/.ssh/id_rsa.pub)" \
            vm_suffix_name=<meu_sufixo_de_teste> \
            encoded_script="$(cat resources/vm/setup_farmvibes_ai_vm.sh | gzip -9 | base64 -w0)"
```
Por favor, altere `<resource_group>`, `<deployment_name>` e `<meu_sufixo_de_teste>`
para nomes de sua preferência.

* `<resource_group>` refere-se ao grupo de recursos onde a VM será implantada.

* `<deployment_name>` especifica o nome desta implantação de VM. Se você não
  passar este argumento, o `az cli` assumirá o nome da implantação como o nome do arquivo bicep.

* `<meu_sufixo_de_teste>`. As VMs são criadas com o prefixo `farmvibes-ai-vm-`. Então,
  se você criar uma VM com o sufixo `testvibes`, o nome da máquina será
  `farmvibes-ai-vm-testvibes`. Nomes de VM do Azure não podem usar espaços, caracteres de controle ou estes
  [caracteres](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/resource-name-rules)
  `~ ! @ # $ % ^ & * ( ) = + _ [ ] { } \ | ; : . ' " , < > / ?`.

Você pode ver a lista de parâmetros da VM no arquivo `resources/vm/farmvibes_ai_vm.bicep`.

4. Assim que o script for concluído, um JSON descrevendo os recursos criados será impresso no shell. Você pode obter o comando de conexão ssh com o seguinte comando:
```shell
az deployment group show \
  -g <resource_group> \
  -n <deployment_name> \
  --query properties.outputs.ssh_command.value
```

Uma vez que a VM for criada com sucesso, você pode seguir os passos no [guia de início rápido](./QUICKSTART.md) para instalar o FarmVibes.AI
e deixá-lo operacional. Por favor, note que todas as dependências necessárias (como o docker) já estarão instaladas na VM.
