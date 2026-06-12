# Solução de Problemas (Troubleshooting)

Este documento compila os problemas mais comuns encontrados ao instalar e executar a plataforma FarmVibes.AI, agrupados em categorias amplas.
Além dos problemas listados aqui, também coletamos uma lista de [problemas conhecidos em nosso repositório GitHub](https://github.com/microsoft/farmvibes-ai/labels/known%20issues)
que estão sendo tratados atualmente pela equipe de desenvolvimento.

- **Instalação de pacotes:**

    <details>
    <summary> Permissão negada ao instalar o `vibe_core`</summary>

    Versões antigas do `pip` podem falhar ao instalar a biblioteca `vibe_core` porque
    ele erroneamente tenta gravar a biblioteca no diretório `site-packages` do sistema.

    Um trecho do erro segue abaixo:

    ```
    × python setup.py develop did not run successfully.
    │ exit code: 1
    ╰─> [32 lines of output]
        running develop
        /usr/lib/python3/dist-packages/setuptools/command/easy_install.py:158:
            EasyInstallDeprecationWarning: easy_install command is deprecated. Use
            build and pip and other standards-based tools.
          warnings.warn(
        WARNING: The user site-packages directory is disabled.
        /usr/lib/python3/dist-packages/setuptools/command/install.py:34:
            SetuptoolsDeprecationWarning: setup.py install is deprecated. Use build
            and pip and other standards-based tools.
          warnings.warn(
        error: can't create or remove files in install directory
    ```

    Se isso acontecer, você pode ter que atualizar o próprio `pip`. Por favor, execute `pip
    install --upgrade pip` se você tiver acesso de escrita no diretório onde o `pip`
    está instalado, ou `sudo pip install --upgrade pip` se precisar de privilégios de root.

    </details>

<br>

- **Configuração do Cluster:**

    <details>
    <summary> Como alterar o local de armazenamento durante a criação do cluster</summary>

    Você pode alterar o local de armazenamento definindo a variável de ambiente
    `FARMVIBES_AI_STORAGE_PATH` antes da instalação com o comando *farmvibes-ai*.
    Adicionalmente, você pode usar a flag `--storage-path` ao executar
    o comando `farmvibes-ai local setup`. Para mais informações, consulte
    a mensagem de ajuda do comando *farmvibes-ai*.

    </details>

    <details>
    <summary> Segredos (secrets) ausentes</summary>

    Executar um fluxo de trabalho enquanto falta um segredo obrigatório gerará a seguinte mensagem de erro:

    ```bash
    Could not retrieve secret {secret_name} from Dapr.
    ```

    Adicione os segredos ausentes ao cluster Kubernetes. [Saiba mais sobre segredos aqui](SECRETS.md).

    </details>

    <details>
    <summary> Nenhuma rota para a Rest-API </summary>

    A construção de um cluster com o comando *farmvibes-ai* configurará um serviço
    Rest-API com um endereço visível apenas dentro do cluster. Caso o cliente
    não consiga alcançar a Rest-API, certifique-se de reiniciar o cluster com:

    ```bash
    farmvibes-ai local restart
    ```

    </details>

    <details>
    <summary> Ficando sem espaço mesmo após alterar o local de armazenamento</summary>

    Se, mesmo após definir a variável de ambiente `FARMVIBES_AI_STORAGE_PATH` para apontar para
    outro local você ainda estiver ficando sem espaço com o FarmVibes.AI, você
    pode ter que alterar o local de armazenamento do daemon do docker.

    Isso acontece porque, embora o armazenamento de assets vá para
    `FARMVIBES_AI_STORAGE_PATH`, ainda usamos espaço temporário em nossos pods
    de trabalhadores (workers). Se o disco do seu sistema operacional for limitado em espaço (especialmente ao
    executar múltiplos workers), você pode ficar sem espaço. Se esse for o caso,
    você pode alterar o [local do diretório de dados do daemon do docker
    location](https://docs.docker.com/config/daemon/#daemon-data-directory) para
    outro disco com mais espaço.

    Por exemplo, para instruir o daemon do docker a salvar dados em
    `/mnt/docker-data`, você teria que definir o conteúdo de `/etc/docker/daemon.json`
    como

    ```json
    {
      "data-root": "/mnt/docker-data"
    }
    ```

    Como alternativa, você também pode querer excluir dados de execuções anteriores de fluxos de trabalho
    para liberar espaço. Para mais informações sobre como fazer isso e outras operações de
    gerenciamento de dados, consulte o [guia do usuário de Gerenciamento de Dados](CACHE.md).

    </details>

    <details>
    <summary> Não é possível executar fluxos de trabalho após a reinicialização da máquina </summary>

    Após uma reinicialização, certifique-se de iniciar o cluster com:

    ```bash
    farmvibes-ai local start
    ```

    </details>

    <details>
    <summary> Atualizando o cluster na branch `dev` após baixar arquivos com Git LFS </summary>

    Se você não tinha o Git LFS instalado ao clonar o repositório e fazer o checkout para `dev`,
    você sentirá falta de alguns dos arquivos grandes no repositório (ex: modelos ONNX). Certifique-se
    de instalar e configurar o Git LFS conforme descrito no [Guia de Início Rápido](QUICKSTART.md#restore-files-with-git-lfs).
    Você também precisará atualizar seu cluster com `make local`.
    </details>

<br>

- **Compondo e executando fluxos de trabalho:**

    <details>
    <summary> Chamando um fluxo de trabalho desconhecido</summary>

    Chamar `client.run()` com um nome de fluxo de trabalho errado gerará a seguinte mensagem de erro:

    ```HTTPError: 400 Client Error: Bad Request for url: http://192.168.49.2:30000/v0/runs. Unable to run workflow with provided parameters. Workflow "WORKFLOW_NAME" unknown```

    Soluções:

  - Verifique novamente o nome e os parâmetros do fluxo de trabalho;
  - Verifique se o seu cluster e repositório estão atualizados;

    </details>

    <details>
    <summary> Tarefas falham com "Abnormal Termination" (Terminação Anormal)</summary>

    Alguns fluxos de trabalho, como o fluxo SpaceEye (em
    `preprocess.s1.preprocess`) ou o fluxo Segment Anything Model (SAM)
    podem usar uma grande quantidade de memória dependendo da área de entrada e/ou intervalo de
    tempo usado para o processamento. Quando esse for o caso, o Sistema Operacional pode
    encerrar a tarefa ofensora, falhando ela e o fluxo de trabalho.

    Ao inspecionar o motivo do erro, os usuários podem encontrar um texto que diz `...
    ProcessExpired: Abnormal termination`.

    Uma solução é solicitar o processamento de uma região menor.

    Outra solução é reduzir o número de workers com o comando
    `~/.config/farmvibes-ai/kubectl scale deployment terravibes-worker
    --replicas=1`.

    Se, mesmo fazendo o acima, a tarefa ainda falhar, o cluster Kubernetes
    pode precisar ser migrado para uma máquina com mais RAM.

    </details>

    <details>
    <summary> Não é possível encontrar o modelo ONNX ao executar fluxos de trabalho </summary>

    Certifique-se de que o modelo ONNX foi adicionado ao cluster FarmVibes.AI:

    ```bash
    farmvibes-ai local add-onnx <modelo-onnx>
    ```

    Se nenhuma saída for gerada, seu modelo foi adicionado com sucesso.

    </details>

    <details>
    <summary> Verificando por que uma execução de fluxo de trabalho falhou </summary>

    Caso uma execução de fluxo de trabalho falhe, você poderá ver uma tabela de status semelhante ao monitorar uma execução com `run.monitor()` (consulte a [documentação do cliente](CLIENT.md) para mais informações sobre `monitor`):

    ```bash
    >>> run.monitor()
                                  🌎 FarmVibes.AI 🌍 dataset_generation/datagren_crop_segmentation 🌏
                                          Run name: Generating dataset for crop segmentation                                    
                                            Run id: dd541f5b-4f03-46e2-b017-8e88a518dfe6                              
                                                          Run status: failed                                           
                                                        Run duration: 00:00:16
    ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
    ┃ Task Name                          ┃ Status   ┃ Start Time          ┃ End Time            ┃ Duration ┃ Progress                    ┃
    ┡━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┩
    │ spaceeye.preprocess.s2.s2.download │ failed   │ 2022/10/03 22:22:16 │ 2022/10/03 22:22:20 │ 00:00:00 │  ━━━━━━━━━━━━━━━━━━━━  0/1  │
    │ cdl.download_cdl                   │ done     │ 2022/10/03 22:22:12 │ 2022/10/03 22:22:15 │ 00:00:05 │  ━━━━━━━━━━━━━━━━━━━━  1/1  │
    │ spaceeye.preprocess.s2.s2.filter   │ done     │ 2022/10/03 22:22:10 │ 2022/10/03 22:22:12 │ 00:00:02 │  ━━━━━━━━━━━━━━━━━━━━  1/1  │
    │ spaceeye.preprocess.s2.s2.list     │ done     │ 2022/10/03 22:22:09 │ 2022/10/03 22:22:10 │ 00:00:01 │  ━━━━━━━━━━━━━━━━━━━━  1/1  │
    │ cdl.list_cdl                       │ done     │ 2022/10/03 22:22:04 │ 2022/10/03 22:22:09 │ 00:00:04 │  ━━━━━━━━━━━━━━━━━━━━  1/1  │
    └────────────────────────────────────┴──────────┴─────────────────────┴─────────────────────┴──────────┴─────────────────────────────┘
                                                   Last update: 2022/10/03 22:23:59
    ```

    A plataforma registra o possível motivo pelo qual uma tarefa falhou, que pode ser recuperado com `run.reason` e `run.task_details`.

    </details>

    <details>
    <summary> Execução de fluxo de trabalho com status 'pending' indefinidamente</summary>

    Se o status de uma execução de fluxo de trabalho permanecer em 'pending' (pendente), certifique-se de reiniciar o cluster com:

    ```bash
    farmvibes-ai local restart
    ```

    </details>

<br>

- **Notebooks de exemplo:**

  <details>
  <summary> Não é possível importar módulos ao executar um notebook</summary>

  Certifique-se de ter instalado e ativado o [ambiente micromamba](https://mamba.readthedocs.io/en/latest/user_guide/micromamba.html) fornecido com o notebook.

  </details>

  <details>
  <summary> Tabela do monitor de execução do fluxo de trabalho não renderiza dentro do notebook</summary>

  Certifique-se de ter o [pacote](https://pypi.org/project/ipywidgets/) `ipywidgets` instalado em seu ambiente.

  </details>

<br>

- **Modelo Segment Anything (SAM):**

  <details>
  <summary> Adicionando modelos ONNX do SAM ao cluster</summary>

  Executar fluxos de trabalho baseados no SAM requer que o codificador de imagem (image encoder) e o codificador de prompt (prompt encoder)/decodificador de máscara (mask decoder) sejam
  exportados como modelos ONNX e adicionados ao cluster. Para fazer isso, execute o seguinte comando na raiz do repositório:
  
  ```bash
  python scripts/export_sam_models.py --models <model_types>
  ```

  onde `<model_types>` é uma lista de tipos de modelos a serem exportados (`vit_b`, `vit_l`, `vit_h`).
  Por exemplo, para exportar todos os três backbones ViT, execute:
  
  ```bash
  python scripts/export_sam_models.py --models vit_b vit_l vit_h
  ```

  O script baixará os modelos do [repositório SAM](https://github.com/facebookresearch/segment-anything),
  exportará cada componente como um arquivo ONNX separado e os adicionará ao cluster com o
  comando `farmvibes-ai local add-onnx`. Se você estiver usando um local de armazenamento diferente,
  certifique-se de passar a flag `--storage-path` para o comando `add-onnx`.

  Antes de executar o script, certifique-se de ter um ambiente micromamba configurado com os pacotes
  necessários. Você pode usar os ambientes definidos pelos arquivos `env_cpu.yaml` ou `env_gpu.yaml` no
  diretório `notebooks/segment_anything`.

  </details>

  <details>
  <summary> Máscara de segmentação não confiável ao usar caixa delimitadora (bounding box) como prompt</summary>

  Como os rasters Sentinel-2 de entrada podem ser consideravelmente maiores do que as imagens esperadas pelo SAM, dividimos os rasters
  em chips de 1024 x 1024 (com uma sobreposição definida pelo parâmetro `spatial_overlap` do fluxo de trabalho). Isso pode levar a
  casos de borda que geram máscaras de segmentação não confiáveis, especialmente ao usar uma caixa delimitadora como prompt. Para evitar
  tais casos, considere o seguinte:

  - Apenas uma única caixa delimitadora é suportada por grupo de prompt (ou seja, todos os pontos com o mesmo `prompt_id`).
  - Recomendamos fornecer pelo menos um ponto de primeiro plano (foreground) dentro da caixa delimitadora. Embora o modelo suporte a segmentação de rasters apenas com uma caixa delimitadora, os resultados podem ser não confiáveis.
  - Se o prompt contiver um ponto de primeiro plano fora da caixa delimitadora fornecida, o fluxo de trabalho ajustará a caixa delimitadora para incluir todos os pontos de primeiro plano naquele grupo de prompt.
  - Pontos de segundo plano (background) fora da caixa delimitadora são ignorados.
  - Regiões fora da caixa delimitadora serão mascaradas na máscara de segmentação final.

  </details>

```{eval-rst}
.. autosummary::
   :toctree: _autosummary
```
