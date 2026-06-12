# PRD: average_model

> **Documento de Requisitos de Produto (High-Level PRD)**
> Sistema: FarmVibes.AI / YSH Energy
> Categoria: MODELS

---

## 1. Variáveis & Workflows
- **Workflows Principais:** Inferência de Machine Learning (CV/Geospatial), Processamento de Tensores de Raster, Geração de Máscaras.
- **Escopo no Ecossistema:** Atua como um módulo acoplável dentro da malha de orquestração do projeto.

## 2. JTBDs & Use Cases
- **Jobs-To-Be-Done (JTBD):** Aplicar modelos de IA sobre imagens de satélite/drone para extração automática de feições agronômicas e ambientais.
- **05 Users cases:**
  1. Processar raster Sentinel-2/Landsat para gerar inferência.
  2. Gerar máscara de segmentação de nuvens/sombras (Cloud/Shadow Models).
  3. Identificar limites de estradas ou práticas de conservação.
  4. Aplicar extensão espectral para harmonizar bandas de sensores distintos.
  5. Extrair geometria de tiles GLAD/Sentinel para cruzamento espacial.

## 3. Escopo do Módulo
- **Faz:** Inferência de redes neurais (PyTorch/ONNX), processamento de arrays multidimensionais, thresholding.
- **Não Faz:** Treinamento do modelo na ponta (é focado em inferência/serving), orquestração de infraestrutura de hardware.

## 4. Inputs, Outputs & Outcomes Esperados
- **Users Inputs (Entradas):** Raster images (GeoTIFF, Arrays NumPy), Geometrias delimitadoras (GeoJSON BBox).
- **System Outputs (Saídas):** Máscaras de segmentação (TIFF), Arrays de probabilidade (Feature maps), Metadados em JSON.
- **Outcomes Esperados:** Aumento na precisão e escala da análise espacial da propriedade rural.

## 5. APIs, Endpoints & Conectores
- **Endpoints / URLs de Integração:** Invocação via CLI, Python SDK, Geração STAC Item local.
- **Conectores:** FarmVibes.AI Workflow DAGs, Azure Blob Storage / Local disk.

## 6. Operações CRUD
- **GETs:** Leitura estática de pesos (Weights) .onnx/.pt.
- **POSTs:** N/A (Pipeline data-driven).
- **Lógica de Estado (Create/Update/Delete/Approve/Reject):** CREATE (Gerar novos outputs TIFF), DELETE (Cache temporário de inferência).

## 7. Banco de Dados, Schemas & Lógica
- **Bancos de dados / Schemas:** STAC (SpatioTemporal Asset Catalog) Item schema.
- **Datasets / JSON files / Tabelas:** Model weights (.onnx), CDL Metadata dictionaries.
- **Lógicas e Cálculos Matemáticos:** Forward pass em arquiteturas CNN/Transformer, normalização estatística de pixels, aplicação de máscaras booleanas.

---
*Este documento foi gerado aderindo aos princípios técnicos de especificação da YSH, garantindo Integridade de Linha Zero na definição da infraestrutura.*
