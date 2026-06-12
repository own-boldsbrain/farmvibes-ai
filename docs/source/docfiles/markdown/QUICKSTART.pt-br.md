# Início Rápido (Quickstart)

Esta seção mostra como configurar um cluster local do FarmVibes.AI e um cliente no seu
computador e executar um fluxo de trabalho simples. Se você deseja configurar uma
instância remota do FarmVibes.AI, consulte o nosso [guia de configuração remota](./AKS.md).

## Requisitos

Se você precisar configurar uma nova máquina que atenda a todos os requisitos detalhados abaixo e venha com todo o
software necessário instalado, siga as etapas neste [documento](./VM-SETUP.md)
para criá-la no Azure.

Para executar o cluster FarmVibes.AI, você precisa do seguinte:

* Uma máquina Linux (a distro Ubuntu 20.04 é altamente recomendada), com pelo menos
16 GB de memória (32 GB, recomendado), 4 núcleos de CPU e 512 GB de armazenamento
(2 TB, recomendado).

* O seguinte software precisa estar instalado na máquina:

  * [Git](https://www.atlassian.com/git/tutorials/install-git#linux) para baixar
    o repositório. Se você já tem acesso ao código-fonte, o Git não é obrigatório.

  * [Git LFS](https://git-lfs.com/) para restaurar alguns dos arquivos grandes no
    repositório (ex: pesos de modelos).

  * [Docker](https://docs.docker.com/engine/install/ubuntu/). Certifique-se de que você pode
    executar o cliente docker sem usar `sudo`, adicionando sua conta de usuário ao
    grupo `docker` (o que pode exigir logoff/login ao se adicionar ao grupo docker).

  * [Curl](https://curl.se/). O instalador do FarmVibes.AI requer curl para instalar
    software adicional para o gerenciamento do cluster FarmVibes.AI.

  * [Python 3.8+](https://www.python.org/downloads/). O FarmVibes.AI fornece
    um cliente python para simplificar o consumo de resultados e o processo de
    fornecimento de parâmetros.

Para auxiliá-lo, temos um script que instala todas as dependências necessárias em
sua máquina. [Mais informações podem ser encontradas abaixo](#opcional-instalando-dependencias-de-software).

## Clonar o repositório

Escolha uma pasta de sua preferência e clone o repositório FarmVibes.AI.

```shell
git clone https://github.com/microsoft/farmvibes-ai.git
```

Observe que você pode clonar o FarmVibes.AI usando HTTP ou SSH (veja [Cloning
Repos](https://docs.github.com/en/get-started/getting-started-with-git/about-remote-repositories)).

## Opcional: Instalando dependências de software

Um script que instala todas as [dependências obrigatórias](#requisitos) se elas ainda não estiverem instaladas. O script
assume que seu usuário tem permissão `sudo` no seu computador e uma instalação Ubuntu. Se este for
o caso, todas as dependências podem ser instaladas executando (a partir da raiz do repositório):

```shell
bash ./resources/vm/setup_farmvibes_ai_vm.sh
```

Você pode precisar reiniciar sua sessão de shell assim que o script terminar.

## Restaurar arquivos com Git LFS

Caso você não tenha o Git LFS instalado ao clonar o repositório, você precisará instalá-lo
para restaurar os arquivos grandes no repositório. Observe que a última etapa
["Instalando dependências de software"](#opcional-instalando-dependencias-de-software) já instala
o Git LFS.

Para restaurar os arquivos ausentes, você pode executar o seguinte comando na raiz do repositório:

```shell
git lfs install
git lfs pull
```

## Instalar o cluster FarmVibes.AI

Com python 3.8+ e pip instalados em sua máquina, por favor instale o pacote
`vibe_core` do FarmVibes.AI, com o seguinte comando:

```shell
pip install ./src/vibe_core
```

Com o pacote principal instalado, vamos configurar o cluster FarmVibes.AI. Por favor, certifique-se
de executar este comando na pasta raiz do projeto. A instalação em um ambiente local
pode levar até 1 hora para ser concluída.

```shell
farmvibes-ai local setup
```

Quando o processo de instalação terminar, você deverá ver uma mensagem semelhante à
seguinte:

```shell
FarmVibes.AI REST API is running at http://192.168.49.2:30000
```

Note que o endereço `http://192.168.49.2:30000` depende da configuração de rede do
docker e pode ser diferente na sua instalação.

Para mais informações sobre o script de instalação, suas opções e argumentos, certifique-se
de executá-lo com as flags `--help` ou `-h`:

```shell
farmvibes-ai local --help
```

## Verificar a Instalação do FarmVibes.AI

Se a instalação foi bem-sucedida, você deve ser capaz de executar o teste "hello world" com:

```shell
python -m vibe_core.farmvibes_ai_hello_world
```

Você deve ver uma saída listando os fluxos de trabalho existentes no FarmVibes.AI e a
saída do fluxo de trabalho helloworld.

Se você vir a mensagem `Successfully executed helloworld workflow.`, isso significa
que o FarmVibes.AI e o cliente python estão funcionando corretamente.

Para mais informações sobre como executar fluxos de trabalho, por favor dê uma olhada no nosso
[guia do cliente](./CLIENT.md). Para informações sobre quaisquer problemas ao executar o cluster, incluindo sobre
como reiniciá-lo após uma reinicialização da máquina, consulte o nosso [guia de solução de problemas](./TROUBLESHOOTING.md).
Se você não encontrar a informação que está procurando, entre em contato com a equipe abrindo
uma issue no nosso [repositório GitHub](https://github.com/microsoft/farmvibes-ai/issues) ou navegando
através dos nossos [problemas conhecidos](https://github.com/microsoft/farmvibes-ai/labels/known%20issues).
