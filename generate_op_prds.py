import os
import json

base_dir = "op_resources"

categories = {
    "energy": {
        "repos": ["carbon-aware-scheduler", "carbon-aware-sdk", "co2signal-docs", "electricitymaps-contrib", "electricitymaps-contrib-rewrite-master", "if-electricitymaps", "zone-finder"],
        "workflows": "Data Pipeline de Emissões, Agendamento Consciente de Carbono, Extração de Intensidade do Grid.",
        "jtbd": "Monitorar e rotear o consumo de energia da infraestrutura baseado na intensidade de carbono regional em tempo real.",
        "use_cases": [
            "Consultar intensidade atual de carbono do grid (gCO2eq/kWh).",
            "Agendar job de processamento para janela de menor emissão.",
            "Calcular emissões totais de um workflow de IA executado.",
            "Integrar telemetria de energia com orquestradores Kubernetes.",
            "Atualizar ou implementar parsers para novas regiões de distribuição de energia."
        ],
        "faz": "Consulta de APIs de grid, normalização temporal de dados de CO2, cálculo de intensidade marginal, rate limiting.",
        "nao_faz": "Controle físico de hardware de data centers, compra de créditos de carbono, operação direta da rede elétrica.",
        "inputs": "Region code (ex: BR-NE), Timestamp/Time-window, Tamanho estimado do job (kWh).",
        "outputs": "Carbon intensity atual, previsão (forecast) 24h, métricas de emissão.",
        "outcomes": "Redução do footprint de carbono operacional (Zero-Line Integrity aplicada à sustentabilidade).",
        "endpoints": "REST API: `/emissions/bylocations`, `/emissions/forecasts`, `/zones`",
        "conectores": "Webhooks, Polling cron jobs, Kubernetes custom controllers.",
        "gets": "GET /emissions (Leitura de métricas atuais).",
        "posts": "POST /schedule (Agendamento de carga de trabalho).",
        "crud": "CREATE (Logs de consumo), UPDATE (Parsers de grid), DELETE (Jobs expirados), APPROVE (Janela verde).",
        "schemas": "Time-series database schema, Zone Mapping configs.",
        "datasets": "JSON files de mapeamento de zonas geográficas (Polígonos de grid).",
        "logicas": "Médias ponderadas de emissão por mix de fontes, interpolação temporal de gaps na API, conversão Fuso-Horário/UTC."
    },
    "models": {
        "repos": ["average_model", "cdl_metadata", "cloud_models", "conservation_practices_models", "driveways_models", "glad_tile_geometry", "if-unofficial-models", "sentinel_tile_geometry", "shadow_models", "spaceeye_models", "spectral_extension_model"],
        "workflows": "Inferência de Machine Learning (CV/Geospatial), Processamento de Tensores de Raster, Geração de Máscaras.",
        "jtbd": "Aplicar modelos de IA sobre imagens de satélite/drone para extração automática de feições agronômicas e ambientais.",
        "use_cases": [
            "Processar raster Sentinel-2/Landsat para gerar inferência.",
            "Gerar máscara de segmentação de nuvens/sombras (Cloud/Shadow Models).",
            "Identificar limites de estradas ou práticas de conservação.",
            "Aplicar extensão espectral para harmonizar bandas de sensores distintos.",
            "Extrair geometria de tiles GLAD/Sentinel para cruzamento espacial."
        ],
        "faz": "Inferência de redes neurais (PyTorch/ONNX), processamento de arrays multidimensionais, thresholding.",
        "nao_faz": "Treinamento do modelo na ponta (é focado em inferência/serving), orquestração de infraestrutura de hardware.",
        "inputs": "Raster images (GeoTIFF, Arrays NumPy), Geometrias delimitadoras (GeoJSON BBox).",
        "outputs": "Máscaras de segmentação (TIFF), Arrays de probabilidade (Feature maps), Metadados em JSON.",
        "outcomes": "Aumento na precisão e escala da análise espacial da propriedade rural.",
        "endpoints": "Invocação via CLI, Python SDK, Geração STAC Item local.",
        "conectores": "FarmVibes.AI Workflow DAGs, Azure Blob Storage / Local disk.",
        "gets": "Leitura estática de pesos (Weights) .onnx/.pt.",
        "posts": "N/A (Pipeline data-driven).",
        "crud": "CREATE (Gerar novos outputs TIFF), DELETE (Cache temporário de inferência).",
        "schemas": "STAC (SpatioTemporal Asset Catalog) Item schema.",
        "datasets": "Model weights (.onnx), CDL Metadata dictionaries.",
        "logicas": "Forward pass em arquiteturas CNN/Transformer, normalização estatística de pixels, aplicação de máscaras booleanas."
    },
    "geo": {
        "repos": ["geoai.js", "mapbox-gl-js", "tippecanoe"],
        "workflows": "Tiling Vetorial, WebGL Rendering 2D/3D, Estilização Espacial.",
        "jtbd": "Renderizar e processar grandes volumes de dados geoespaciais fluidamente no navegador/client.",
        "use_cases": [
            "Converter shapefiles massivos em MBTiles vetoriais (Tippecanoe).",
            "Renderizar camadas base satelitais e de ruas via WebGL.",
            "Aplicar estilos de design dinâmicos (data-driven styling) baseados em propriedades.",
            "Filtrar feições no client-side em tempo real.",
            "Permitir iteração de câmera 3D (pitch, bearing) sobre o terreno."
        ],
        "faz": "Parse de geometrias, simplificação algorítmica de polígonos, injeção de shaders WebGL.",
        "nao_faz": "Edição espacial transacional no banco de dados (SIG desktop), Geocoding estruturado de endereços.",
        "inputs": "GeoJSON, Mapbox Style JSON, Vector/Raster Tiles (pbf/png).",
        "outputs": "WebGL Canvas context, MBTiles files (SQLite archives).",
        "outcomes": "Navegação visual interativa de milhões de hectares de dados agronômicos sem gargalo de performance.",
        "endpoints": "Tile URLs `/{z}/{x}/{y}.pbf`, Sprite/Font endpoints.",
        "conectores": "REST API para Tile Servers, Frontend React/JS wrappers.",
        "gets": "GET Tiles, GET Style, GET Glyphs.",
        "posts": "N/A",
        "crud": "READ-heavy (tiles são imutáveis após build), CREATE (Compilação via Tippecanoe CLI).",
        "schemas": "Vector Tile Specification, Mapbox Style Specification.",
        "datasets": "MBTiles (SQLite local database).",
        "logicas": "Algoritmo de Douglas-Peucker (simplificação), Clipping em Bounding Boxes, Projeção Web Mercator (EPSG:3857)."
    },
    "mcp": {
        "repos": ["nasa-power-mcp-1to1", "pvgis-mcp-1to1"],
        "workflows": "Exposição de Ferramentas de IA (Tool Calling), Proxy de APIs Científicas.",
        "jtbd": "Fornecer conectores MCP (Model Context Protocol) para que agentes LLM busquem dados climáticos e solares ao vivo.",
        "use_cases": [
            "Agente LLM solicita dados de radiação solar histórica para uma coordenada.",
            "Agente solicita variáveis agrometeorológicas da NASA Power.",
            "O servidor MCP valida o payload JSON do agente contra as regras da API de destino.",
            "Retornar séries temporais diretamente no contexto do LLM.",
            "Converter unidades imperiais/científicas para o formato exigido pelo prompt."
        ],
        "faz": "Implementação do protocolo MCP (stdio/http), validação de argumentos via JSON Schema, wrap de APIs legacy.",
        "nao_faz": "Armazenamento persistente (database) dos dados meteorológicos (opera como proxy pass-through).",
        "inputs": "Tool calls de LLMs contendo Latitude, Longitude, Data Início, Data Fim.",
        "outputs": "Respostas JSON padronizadas via protocolo MCP contendo as medições.",
        "outcomes": "Agentes de Inteligência Artificial ganham a capacidade de analisar viabilidade energética e clima com precisão científica.",
        "endpoints": "Comunicação via `stdio` ou SSE (Server-Sent Events) do MCP.",
        "conectores": "NASA Power REST API, PVGIS REST API, Clientes MCP (Claude, Cursor).",
        "gets": "GET proxies repassados para as APIs oficiais da NASA/PVGIS.",
        "posts": "N/A",
        "crud": "READ-only (Consulta de dados científicos externos).",
        "schemas": "JSON Schema para Ferramentas (MCP Tool spec).",
        "datasets": "Respostas JSON transientes em memória.",
        "logicas": "Tradução de schema LLM para query string REST, tratamento de rate limit e timeouts, normalização de erros."
    }
}

template = """# PRD: {repo}

> **Documento de Requisitos de Produto (High-Level PRD)**
> Sistema: FarmVibes.AI / YSH Energy
> Categoria: {category_name}

---

## 1. Variáveis & Workflows
- **Workflows Principais:** {workflows}
- **Escopo no Ecossistema:** Atua como um módulo acoplável dentro da malha de orquestração do projeto.

## 2. JTBDs & Use Cases
- **Jobs-To-Be-Done (JTBD):** {jtbd}
- **05 Users cases:**
  1. {uc1}
  2. {uc2}
  3. {uc3}
  4. {uc4}
  5. {uc5}

## 3. Escopo do Módulo
- **Faz:** {faz}
- **Não Faz:** {nao_faz}

## 4. Inputs, Outputs & Outcomes Esperados
- **Users Inputs (Entradas):** {inputs}
- **System Outputs (Saídas):** {outputs}
- **Outcomes Esperados:** {outcomes}

## 5. APIs, Endpoints & Conectores
- **Endpoints / URLs de Integração:** {endpoints}
- **Conectores:** {conectores}

## 6. Operações CRUD
- **GETs:** {gets}
- **POSTs:** {posts}
- **Lógica de Estado (Create/Update/Delete/Approve/Reject):** {crud}

## 7. Banco de Dados, Schemas & Lógica
- **Bancos de dados / Schemas:** {schemas}
- **Datasets / JSON files / Tabelas:** {datasets}
- **Lógicas e Cálculos Matemáticos:** {logicas}

---
*Este documento foi gerado aderindo aos princípios técnicos de especificação da YSH, garantindo Integridade de Linha Zero na definição da infraestrutura.*
"""

def generate_prds():
    if not os.path.exists(base_dir):
        print(f"Diretório base '{base_dir}' não encontrado.")
        return

    generated_count = 0

    for item in os.listdir(base_dir):
        repo_path = os.path.join(base_dir, item)
        if os.path.isdir(repo_path):
            # Find category
            assigned_cat = None
            category_name = "Utilitários Genéricos"
            for cat_key, cat_data in categories.items():
                if item in cat_data["repos"]:
                    assigned_cat = cat_data
                    category_name = cat_key.upper()
                    break
            
            # Fallback to 'models' if not explicitly matched, as most unknowns in this list are models
            if not assigned_cat:
                assigned_cat = categories["models"]
                category_name = "MODELS (Inferido)"

            content = template.format(
                repo=item,
                category_name=category_name,
                workflows=assigned_cat["workflows"],
                jtbd=assigned_cat["jtbd"],
                uc1=assigned_cat["use_cases"][0],
                uc2=assigned_cat["use_cases"][1],
                uc3=assigned_cat["use_cases"][2],
                uc4=assigned_cat["use_cases"][3],
                uc5=assigned_cat["use_cases"][4],
                faz=assigned_cat["faz"],
                nao_faz=assigned_cat["nao_faz"],
                inputs=assigned_cat["inputs"],
                outputs=assigned_cat["outputs"],
                outcomes=assigned_cat["outcomes"],
                endpoints=assigned_cat["endpoints"],
                conectores=assigned_cat["conectores"],
                gets=assigned_cat["gets"],
                posts=assigned_cat["posts"],
                crud=assigned_cat["crud"],
                schemas=assigned_cat["schemas"],
                datasets=assigned_cat["datasets"],
                logicas=assigned_cat["logicas"]
            )

            prd_file = os.path.join(repo_path, "PRD.md")
            with open(prd_file, "w", encoding="utf-8") as f:
                f.write(content)
            print(f"PRD criado em: {prd_file}")
            generated_count += 1
            
    print(f"\\nTotal de PRDs gerados: {generated_count}")

if __name__ == "__main__":
    generate_prds()
