# Tipos Principais

O módulo `vibe_core.data.core_types` fornece um conjunto de classes base e utilitários para representar e manipular vários tipos de dados usados no FarmVibes.AI. A classe `BaseVibe` é a classe base para todos os tipos do FarmVibes.AI e fornece uma interface comum para acesso e manipulação de dados. A classe `DataVibe` representa um objeto de dado no FarmVibes.AI e inclui propriedades como um identificador único, um intervalo de tempo, uma caixa delimitadora (bounding box) e uma geometria. Outras classes, como `TimeSeries`, `DataSummaryStatistics` e `DataSequence`, herdam de `DataVibe` e fornecem funcionalidade adicional para tipos de dados específicos.

O módulo foi projetado para lidar com uma ampla gama de tipos de dados, incluindo dados geoespaciais, dados de séries temporais e muito mais. Ele também fornece funções utilitárias e classes para auxiliar em tarefas como geração de identificadores únicos, validação de tipos de dados e análise (parsing) de especificações de tipo.

## Hierarquia

```{eval-rst}
.. raw:: html
   :file: ../../markdown/data_types_diagram/core_types_hierarchy.md
```

## Documentação

```{eval-rst}
.. automodule:: vibe_core.data.core_types
   :members:
   :show-inheritance:
```

```{eval-rst}
.. autosummary::
   :toctree: _autosummary
```
