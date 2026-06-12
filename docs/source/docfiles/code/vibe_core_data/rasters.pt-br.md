# Rasters

As classes e métodos definidos pelo módulo `vibe_core.data.rasters` lidam com dados raster relacionados a produtos de sensoriamento remoto e outros tipos de dados geoespaciais. A classe base no módulo é `Raster`, que fornece propriedades e métodos para trabalhar com dados raster, como acesso a ativos de raster e visualização. O módulo também inclui classes especializadas para diferentes tipos derivados, como `DemRaster`, `NaipRaster`, `LandsatRaster` e `GNATSGORaster`, que herdam tanto da classe `Raster` quanto de suas respectivas classes de metadados de produto em `vibe_core.data.products`.

Adicionalmente, o módulo fornece classes para lidar com sequências de raster (`RasterSequence`), blocos de raster (`RasterChunk`), rasters categóricos (`CategoricalRaster`), entre outros.

## Hierarquia

```{eval-rst}
.. raw:: html
   :file: ../../markdown/data_types_diagram/rasters_hierarchy.md
```

## Documentação

```{eval-rst}
.. automodule:: vibe_core.data.rasters
   :members:
   :show-inheritance:
```

```{eval-rst}
.. autosummary::
   :toctree: _autosummary
```
