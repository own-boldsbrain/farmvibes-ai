# Visão geral do FarmVibes.AI

Está com pressa? Se você deseja instalar/executar o FarmVibes.AI imediatamente, consulte o
[guia de início rápido](./QUICKSTART.md) para uma introdução rápida sobre como instalar
e executar o FarmVibes.AI.

O FarmVibes.AI fornece uma plataforma modular e escalável para o processamento de dados geoespaciais
em larga escala usando componentes reutilizáveis. A plataforma é modular no sentido de
que a computação é orientada por operações e subdividida espacial e
temporalmente. O FarmVibes.AI divide automaticamente as computações de fluxos de trabalho geoespaciais
em múltiplos chunks paralelos e reutiliza os resultados computados anteriormente para
determinadas regiões e carimbos de data/hora (timestamps).

As chamadas de fluxos de trabalho do FarmVibes.AI são idempotentes; diferentes solicitações de execução com
a mesma entrada e parâmetros sempre resultam em saída idêntica. Portanto,
implementamos um [sistema de cache geoespacial](./CACHE.md) para acelerar a computação de
fluxos de trabalho executados anteriormente para a mesma região geoespacial na mesma
janela de tempo. Isso é particularmente útil para fluxos de trabalho de ingestão de dados que tendem
a reavaliar a mesma área repetidamente usando diferentes abordagens analíticas. Por exemplo, suponha que você esteja interessado em realizar uma previsão de safra
para uma determinada cultura em uma janela de tempo específica e use a temperatura como
entrada.

A plataforma proposta divide a computação e ingestão de dados de temperatura
em pequenos chunks para esta região e armazena esses dados em cache. Sempre que precisarmos
realizar outra avaliação para a mesma área/janela de tempo que tenha a temperatura
como entrada (por exemplo, previsão de vento), o FarmVibes.AI usará os dados em cache para
acelerar a avaliação.

Fluxos de trabalho são grafos computacionais com arestas tipadas, com nós representando uma
etapa de processamento e arestas representando o fluxo de entradas/saídas entre cada
computação atômica. Cada nó de computação pode receber um único item ou uma lista de
itens como entrada, onde cada lista de itens possui o mesmo tipo. O FarmVibes.AI aproveita
isso para paralelizar a computação para cada elemento da lista, acelerando ainda mais o desempenho da avaliação. Todo esse processo é automático e não
requer intervenção do usuário.

Dada a sua natureza paralela, o FarmVibes.AI é um projeto especialmente
projetado para aproveitar as características de elasticidade e escalabilidade da nuvem. Nesse sentido,
o projeto proposto possui os seguintes componentes.

## Cluster FarmVibes.AI

O cluster FarmVibes.AI é um conjunto de pods de computação baseados em kubernetes capaz de
executar múltiplos fluxos de trabalho em paralelo. O cluster possui quatro componentes principais:

1. **Rest-api (Servidor).** Um servidor web que expõe uma API REST para que os usuários possam
chamar fluxos de trabalho, acompanhar a execução de fluxos de trabalho e recuperar resultados.

2. **Orquestrador.** Este componente gerencia a execução do fluxo de trabalho, transmitindo
solicitações aos trabalhadores (workers) e atualizando o status do fluxo de trabalho.

3. **Trabalhador (Worker).** Um componente escalável responsável pela computação real da operação do fluxo de trabalho. Em vez de executar todo o fluxo de trabalho de uma vez, ele
computa os chunks atômicos processados pelo usuário.

4. **Cache.** Este componente fica entre o orquestrador e os
trabalhadores; ele verifica se uma operação foi executada anteriormente e retorna
os resultados em cache para o orquestrador.

5. **Operações de Dados (Data Ops).** Este componente é responsável por gerenciar operações de dados,
como manter o controle de assets relacionados à execução do fluxo de trabalho e excluir
dados de execução quando solicitado.

Para verificar como configurar e instalar o cluster FarmVibes.AI, por favor
execute o seguinte comando na pasta raiz do projeto.

```bash
farmvibes-ai local -h
```

## API REST do FarmVibes.AI

O FarmVibes.AI fornece uma API REST para gerenciar a execução de fluxos de trabalho. Supondo que haja um cluster em execução, então a url `http://<cluster_addr>:<port>/v0/docs/` deve
fornecer a documentação da API REST (ex: `http://192.168.49.2:30000/v0/docs`).

## Cliente Python do FarmVibes.AI

Além da API REST, também fornecemos um cliente python que abstrai a
comunicação com o cluster (por favor, verifique a [documentação do cliente python](./CLIENT.md)).

## Documentação de fluxo de trabalho do FarmVibes.AI

A documentação de fluxo de trabalho gerada dinamicamente pode ser acessada via cliente python da seguinte forma:

```python
>>> from vibe_core.client import get_default_vibe_client
>>> client = get_default_vibe_client()
>>> client.document_workflow("data_ingestion/spaceeye/spaceeye")
```

Por favor, consulte a [documentação do cliente python](./CLIENT.md) para ver como obter
uma lista de fluxos de trabalho disponíveis.

## Gerenciamento de dados do FarmVibes.AI

Para detalhes adicionais sobre como os dados são gerenciados e armazenados em cache no FarmVibes.AI, consulte o
[guia do usuário de Gerenciamento de Dados](./CACHE.md).
