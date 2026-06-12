# PRD: geoai.js

> **Documento de Requisitos de Produto (High-Level PRD)**
> Sistema: FarmVibes.AI / YSH Energy
> Categoria: GEO

---

## 1. Variáveis & Workflows
- **Workflows Principais:** Tiling Vetorial, WebGL Rendering 2D/3D, Estilização Espacial.
- **Escopo no Ecossistema:** Atua como um módulo acoplável dentro da malha de orquestração do projeto.

## 2. JTBDs & Use Cases
- **Jobs-To-Be-Done (JTBD):** Renderizar e processar grandes volumes de dados geoespaciais fluidamente no navegador/client.
- **05 Users cases:**
  1. Converter shapefiles massivos em MBTiles vetoriais (Tippecanoe).
  2. Renderizar camadas base satelitais e de ruas via WebGL.
  3. Aplicar estilos de design dinâmicos (data-driven styling) baseados em propriedades.
  4. Filtrar feições no client-side em tempo real.
  5. Permitir iteração de câmera 3D (pitch, bearing) sobre o terreno.

## 3. Escopo do Módulo
- **Faz:** Parse de geometrias, simplificação algorítmica de polígonos, injeção de shaders WebGL.
- **Não Faz:** Edição espacial transacional no banco de dados (SIG desktop), Geocoding estruturado de endereços.

## 4. Inputs, Outputs & Outcomes Esperados
- **Users Inputs (Entradas):** GeoJSON, Mapbox Style JSON, Vector/Raster Tiles (pbf/png).
- **System Outputs (Saídas):** WebGL Canvas context, MBTiles files (SQLite archives).
- **Outcomes Esperados:** Navegação visual interativa de milhões de hectares de dados agronômicos sem gargalo de performance.

## 5. APIs, Endpoints & Conectores
- **Endpoints / URLs de Integração:** Tile URLs `/{z}/{x}/{y}.pbf`, Sprite/Font endpoints.
- **Conectores:** REST API para Tile Servers, Frontend React/JS wrappers.

## 6. Operações CRUD
- **GETs:** GET Tiles, GET Style, GET Glyphs.
- **POSTs:** N/A
- **Lógica de Estado (Create/Update/Delete/Approve/Reject):** READ-heavy (tiles são imutáveis após build), CREATE (Compilação via Tippecanoe CLI).

## 7. Banco de Dados, Schemas & Lógica
- **Bancos de dados / Schemas:** Vector Tile Specification, Mapbox Style Specification.
- **Datasets / JSON files / Tabelas:** MBTiles (SQLite local database).
- **Lógicas e Cálculos Matemáticos:** Algoritmo de Douglas-Peucker (simplificação), Clipping em Bounding Boxes, Projeção Web Mercator (EPSG:3857).

---
*Este documento foi gerado aderindo aos princípios técnicos de especificação da YSH, garantindo Integridade de Linha Zero na definição da infraestrutura.*
