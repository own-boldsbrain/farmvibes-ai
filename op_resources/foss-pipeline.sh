#!/bin/bash

# 🛠️ Pipeline FOSS para processamento de dados geoespaciais
# Conversão: mesh/OBJ/GLB → 3D Tiles, point cloud → EPT, terreno → terrain-RGB

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para log
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[WARNING] $1${NC}"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}"
    exit 1
}

#!/bin/bash

# 🛠️ Pipeline FOSS Completo para Mapa 3D Geoespacial
# ODM → EPT/3D Tiles/Terrain-RGB/COG → Three.js/deck.gl
# Stack: OpenDroneMap + Entwine + py3dtiles + TiTiler + glTF Pipeline

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Função para log
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[WARNING] $1${NC}"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}"
    exit 1
}

info() {
    echo -e "${BLUE}[INFO] $1${NC}"
}

success() {
    echo -e "${PURPLE}[SUCCESS] $1${NC}"
}

# Verificar dependências
check_dependencies() {
    log "🔍 Verificando dependências do pipeline FOSS..."

    # Sistema
    local system_deps=("python3" "pip" "gdal-bin" "nodejs" "npm" "docker")
    local missing_system=()

    for dep in "${system_deps[@]}"; do
        if ! command -v "$dep" &> /dev/null; then
            missing_system+=("$dep")
        fi
    done

    if [ ${#missing_system[@]} -ne 0 ]; then
        error "Dependências de sistema faltando: ${missing_system[*]}"
    fi

    # Python packages
    local python_deps=("py3dtiles" "pdal" "rasterio" "gdal" "numpy" "scipy")
    for dep in "${python_deps[@]}"; do
        if ! python3 -c "import $dep" &> /dev/null; then
            warn "📦 Instalando $dep..."
            pip install "$dep"
        fi
    done

    # Node.js packages
    if ! command -v gltf-pipeline &> /dev/null; then
        warn "📦 Instalando gltf-pipeline..."
        npm install -g gltf-pipeline obj2gltf
    fi

    # Docker images
    if ! docker images | grep -q "opendronemap/odm"; then
        warn "🐳 Baixando imagem OpenDroneMap..."
        docker pull opendronemap/odm:latest
    fi

    if ! docker images | grep -q "developmentseed/titiler"; then
        warn "🐳 Baixando imagem TiTiler..."
        docker pull developmentseed/titiler:latest
    fi

    success "✅ Todas as dependências verificadas!"
}

# 0. Processamento ODM (OpenDroneMap)
process_odm_reconstruction() {
    local input_images_dir="$1"
    local output_dir="$2"
    local project_name="${3:-solar-site}"

    log "🏗️ Iniciando reconstrução com OpenDroneMap..."

    if [ ! -d "$input_images_dir" ]; then
        error "Diretório de imagens não encontrado: $input_images_dir"
    fi

    mkdir -p "$output_dir"

    # Executar ODM via Docker
    docker run --rm -v "$input_images_dir:/images" -v "$output_dir:/output" \
        opendronemap/odm \
        --project-path /output \
        --dsm \
        --dtm \
        --orthophoto-resolution 2 \
        --dem-resolution 2 \
        --feature-quality ultra \
        --pc-quality ultra \
        --mesh-size 300000 \
        --mesh-octree-depth 12 \
        --texturing-skip-global-seam-leveling \
        --texturing-skip-local-seam-leveling \
        --cog \
        --verbose

    # Renomear outputs para convenção
    if [ -f "$output_dir/odm_orthophoto/odm_orthophoto.tif" ]; then
        cp "$output_dir/odm_orthophoto/odm_orthophoto.tif" "$output_dir/orthophoto.tif"
    fi

    if [ -f "$output_dir/odm_dem/dsm.tif" ]; then
        cp "$output_dir/odm_dem/dsm.tif" "$output_dir/dsm.tif"
    fi

    if [ -f "$output_dir/odm_dem/dtm.tif" ]; then
        cp "$output_dir/odm_dem/dtm.tif" "$output_dir/dtm.tif"
    fi

    if [ -f "$output_dir/odm_georeferencing/odm_georeferenced_model.obj" ]; then
        cp "$output_dir/odm_georeferencing/odm_georeferenced_model.obj" "$output_dir/model.obj"
    fi

    if [ -f "$output_dir/odm_georeferencing/odm_georeferenced_model.glb" ]; then
        cp "$output_dir/odm_georeferencing/odm_georeferenced_model.glb" "$output_dir/model.glb"
    fi

    # Converter nuvem de pontos para LAS/LAZ
    if [ -f "$output_dir/odm_georeferencing/odm_georeferenced_model.ply" ]; then
        python3 -c "
import pdal
import json

pipeline = {
    'pipeline': [
        {
            'type': 'readers.ply',
            'filename': '$output_dir/odm_georeferencing/odm_georeferenced_model.ply'
        },
        {
            'type': 'writers.las',
            'filename': '$output_dir/point_cloud.las',
            'compression': 'laszip'
        }
    ]
}

p = pdal.Pipeline(json.dumps(pipeline))
p.execute()
print('Nuvem de pontos convertida para LAS')
"
    fi

    success "✅ Reconstrução ODM concluída!"
    info "📁 Outputs gerados:"
    info "   - orthophoto.tif (ortofoto COG)"
    info "   - dsm.tif (Digital Surface Model)"
    info "   - dtm.tif (Digital Terrain Model)"
    info "   - model.obj/glb (malha 3D)"
    info "   - point_cloud.las (nuvem de pontos)"
}

# 1. Processar mesh para 3D Tiles
process_mesh_to_tiles() {
    local input_file="$1"
    local output_dir="$2"
    local geometric_error="${3:-64}"
    
    log "Processando mesh → 3D Tiles: $input_file"
    
    if [ ! -f "$input_file" ]; then
        error "Arquivo de entrada não encontrado: $input_file"
    fi
    
    # Criar diretório de saída
    mkdir -p "$output_dir"
    
    local temp_dir=$(mktemp -d)
    local base_name=$(basename "$input_file" | cut -d. -f1)
    
    # 1.1 Converter OBJ → GLB (se necessário)
    if [[ "$input_file" == *.obj ]]; then
        log "Convertendo OBJ → GLB..."
        obj2gltf -i "$input_file" -o "$temp_dir/$base_name.glb" --checkTransparency
        input_file="$temp_dir/$base_name.glb"
    fi
    
    # 1.2 Otimizar GLB com Draco + KTX2
    log "Otimizando GLB com compressão..."
    gltf-pipeline -i "$input_file" \
        -o "$temp_dir/${base_name}_optimized.glb" \
        --draco.compressionLevel 7 \
        --draco.quantizePositionBits 14 \
        --draco.quantizeNormalBits 8 \
        --draco.quantizeTexcoordBits 10 \
        --ktx2
    
    # 1.3 Converter para 3D Tiles
    log "Gerando 3D Tiles..."
    python3 -c "
import py3dtiles
from py3dtiles.tileset import TileSet
from py3dtiles.tile import Tile
from py3dtiles.batch_table import BatchTable
from py3dtiles.gltf import GlTF
import json
import os
import shutil

input_glb = '$temp_dir/${base_name}_optimized.glb'
output_dir = '$output_dir'
geometric_error = $geometric_error

# Criar estrutura básica de tileset
tileset = {
    'asset': {
        'version': '1.0',
        'generator': 'YSH Solar Pipeline FOSS'
    },
    'geometricError': geometric_error,
    'root': {
        'boundingVolume': {
            'region': [-1.57, -1.57, 1.57, 1.57, 0, 1000]  # Ajustar conforme necessário
        },
        'geometricError': geometric_error,
        'content': {
            'uri': f'{os.path.basename(input_glb)}'
        },
        'refine': 'REPLACE'
    }
}

# Salvar tileset.json
with open(os.path.join(output_dir, 'tileset.json'), 'w') as f:
    json.dump(tileset, f, indent=2)

# Copiar GLB otimizado
shutil.copy(input_glb, os.path.join(output_dir, os.path.basename(input_glb)))
print(f'3D Tiles gerado em: {output_dir}')
"
    
    # Limpeza
    rm -rf "$temp_dir"
    
    log "3D Tiles criado com sucesso em: $output_dir"
}

# 1. Processar nuvem de pontos para EPT (Entwine)
process_pointcloud_to_ept() {
    local input_file="$1"
    local output_dir="$2"
    local threads="${3:-8}"

    log "🌲 Processando nuvem de pontos → EPT (Entwine): $input_file"

    if [ ! -f "$input_file" ]; then
        error "Arquivo de entrada não encontrado: $input_file"
    fi

    mkdir -p "$output_dir"

    # Usar Docker para Entwine (mais confiável que PDAL writers.ept)
    info "🐳 Executando Entwine via Docker..."

    # Converter para formato compatível se necessário
    local temp_file="$input_file"
    if [[ "$input_file" == *.ply ]]; then
        temp_file="/tmp/$(basename "${input_file%.*}").las"
        python3 -c "
import pdal
import json

pipeline = {
    'pipeline': [
        {'type': 'readers.ply', 'filename': '$input_file'},
        {'type': 'writers.las', 'filename': '$temp_file', 'compression': 'laszip'}
    ]
}

p = pdal.Pipeline(json.dumps(pipeline))
p.execute()
"
        input_file="$temp_file"
    fi

    # Executar Entwine
    docker run --rm -v "$(dirname "$input_file"):/input" -v "$output_dir:/output" \
        connormanning/entwine \
        entwine build \
        -i "/input/$(basename "$input_file")" \
        -o "/output" \
        --threads "$threads" \
        --span 256 \
        --cube \
        --run

    # Verificar se EPT foi criado
    if [ ! -f "$output_dir/ept.json" ]; then
        error "Falha na criação do EPT - ept.json não encontrado"
    fi

    # Limpar arquivo temporário
    if [ "$temp_file" != "$input_file" ] && [ -f "$temp_file" ]; then
        rm "$temp_file"
    fi

    success "✅ EPT criado com sucesso!"
    info "📁 Estrutura EPT:"
    info "   - ept.json (manifesto)"
    info "   - ept-data/ (dados hierárquicos)"
    info "   - ept-hierarchy/ (índices)"
}

# 2. Processar mesh para 3D Tiles (py3dtiles)
process_mesh_to_tiles() {
    local input_file="$1"
    local output_dir="$2"
    local geometric_error="${3:-64}"

    log "🏗️ Processando mesh → 3D Tiles (py3dtiles): $input_file"

    if [ ! -f "$input_file" ]; then
        error "Arquivo de entrada não encontrado: $input_file"
    fi

    mkdir -p "$output_dir"

    local temp_dir=$(mktemp -d)
    local base_name=$(basename "$input_file" | cut -d. -f1)

    # 2.1 Converter OBJ → GLB (se necessário)
    if [[ "$input_file" == *.obj ]]; then
        info "🔄 Convertendo OBJ → GLB..."
        obj2gltf -i "$input_file" -o "$temp_dir/$base_name.glb" \
            --checkTransparency \
            --metallicRoughness
        input_file="$temp_dir/$base_name.glb"
    fi

    # 2.2 Otimizar GLB com Draco + KTX2
    info "🗜️ Otimizando GLB (Draco + KTX2)..."
    gltf-pipeline -i "$input_file" \
        -o "$temp_dir/${base_name}_optimized.glb" \
        --draco.compressionLevel 7 \
        --draco.quantizePositionBits 14 \
        --draco.quantizeNormalBits 8 \
        --draco.quantizeTexcoordBits 10 \
        --draco.quantizeColorBits 8 \
        --draco.quantizeGenericBits 8 \
        --ktx2

    # 2.3 Converter para 3D Tiles usando py3dtiles
    info "🎯 Gerando 3D Tiles..."
    python3 -c "
import py3dtiles
from py3dtiles.tileset import TileSet
from py3dtiles.tile import Tile
from py3dtiles.batch_table import BatchTable
from py3dtiles.gltf import GlTF
import json
import os
import shutil
from py3dtiles.convert import convert_to_3dtiles

input_glb = '$temp_dir/${base_name}_optimized.glb'
output_dir = '$output_dir'
geometric_error = $geometric_error

print(f'Convertendo {input_glb} para 3D Tiles...')

# Usar função de conversão do py3dtiles
convert_to_3dtiles(
    input_glb,
    output_dir,
    srs_in='EPSG:4326',
    srs_out='EPSG:4978',  # WGS84 geocentric
    geometric_error=geometric_error
)

print(f'✅ 3D Tiles gerado em: {output_dir}')
print('📁 Arquivos criados:')
for root, dirs, files in os.walk(output_dir):
    for file in files:
        rel_path = os.path.relpath(os.path.join(root, file), output_dir)
        print(f'   - {rel_path}')
"

    # Limpeza
    rm -rf "$temp_dir"

    success "✅ 3D Tiles criado com sucesso!"
    info "📁 Conteúdo do tileset:"
    ls -la "$output_dir"
}

# 3. Processar terreno para terrain-RGB
process_terrain_to_rgb() {
    local input_dem="$1"
    local output_dir="$2"
    local min_zoom="${3:-8}"
    local max_zoom="${4:-16}"
    
    log "Processando DEM → Terrain-RGB tiles: $input_dem"
    
    if [ ! -f "$input_dem" ]; then
        error "Arquivo DEM não encontrado: $input_dem"
    fi
    
    mkdir -p "$output_dir"
    
    # Converter DEM para Terrain-RGB usando GDAL e Python
    python3 -c "
import rasterio
import numpy as np
from rasterio.transform import from_bounds
from rasterio.warp import calculate_default_transform, reproject, Resampling
import os
from math import floor, ceil, log2, pow, atan, sinh, pi

def deg2num(lat_deg, lon_deg, zoom):
    '''Convert lat/lon to tile numbers'''
    lat_rad = lat_deg * pi / 180.0
    n = 2.0 ** zoom
    x = int((lon_deg + 180.0) / 360.0 * n)
    y = int((1.0 - sinh(lat_rad) / (1.0 + sinh(lat_rad))) / 2.0 * n)
    return (x, y)

def num2deg(xtile, ytile, zoom):
    '''Convert tile numbers to lat/lon'''
    n = 2.0 ** zoom
    lon_deg = xtile / n * 360.0 - 180.0
    lat_rad = atan(sinh(pi * (1 - 2 * ytile / n)))
    lat_deg = lat_rad * 180.0 / pi
    return (lat_deg, lon_deg)

def encode_terrain_rgb(elevation):
    '''Encode elevation to RGB using Terrarium format'''
    # Terrarium format: height = (R * 256 + G + B / 256) - 32768
    # Rearranging: R*256 + G + B/256 = height + 32768
    
    elevation = np.nan_to_num(elevation, nan=0.0)
    height_offset = elevation + 32768
    height_offset = np.clip(height_offset, 0, 65535)
    
    r = np.floor(height_offset / 256).astype(np.uint8)
    g = np.floor(height_offset % 256).astype(np.uint8) 
    b = np.floor((height_offset % 1) * 256).astype(np.uint8)
    
    return np.stack([r, g, b], axis=-1)

input_dem = '$input_dem'
output_dir = '$output_dir'
min_zoom = $min_zoom
max_zoom = $max_zoom

# Abrir DEM
with rasterio.open(input_dem) as src:
    bounds = src.bounds
    profile = src.profile
    elevation = src.read(1)
    
    # Para cada nível de zoom
    for zoom in range(min_zoom, max_zoom + 1):
        zoom_dir = os.path.join(output_dir, str(zoom))
        
        # Calcular tiles que cobrem a área
        min_tile_x, max_tile_y = deg2num(bounds.bottom, bounds.left, zoom)
        max_tile_x, min_tile_y = deg2num(bounds.top, bounds.right, zoom)
        
        for tile_x in range(min_tile_x, max_tile_x + 1):
            x_dir = os.path.join(zoom_dir, str(tile_x))
            os.makedirs(x_dir, exist_ok=True)
            
            for tile_y in range(min_tile_y, max_tile_y + 1):
                # Bounds do tile
                tile_bounds = num2deg(tile_x, tile_y + 1, zoom) + num2deg(tile_x + 1, tile_y, zoom)
                west, south, east, north = tile_bounds[1], tile_bounds[0], tile_bounds[3], tile_bounds[2]
                
                # Recortar e reprojetar para o tile
                transform, width, height = calculate_default_transform(
                    src.crs, src.crs, 256, 256, west, south, east, north)
                
                tile_data = np.empty((height, width), dtype=np.float32)
                
                reproject(
                    source=elevation,
                    destination=tile_data,
                    src_transform=src.transform,
                    src_crs=src.crs,
                    dst_transform=transform,
                    dst_crs=src.crs,
                    resampling=Resampling.bilinear)
                
                # Codificar como RGB
                rgb_tile = encode_terrain_rgb(tile_data)
                
                # Salvar tile
                output_path = os.path.join(x_dir, f'{tile_y}.png')
                with rasterio.open(
                    output_path, 'w',
                    driver='PNG',
                    height=256, width=256,
                    count=3, dtype=np.uint8
                ) as dst:
                    for i in range(3):
                        dst.write(rgb_tile[:, :, i], i + 1)
        
        print(f'Zoom {zoom} processado')

print(f'Terrain-RGB tiles gerados em: {output_dir}')
"
    
    log "Terrain-RGB tiles criados com sucesso em: $output_dir"
}

# 4. Processar ortofoto para COG tiles
process_orthophoto_to_cog() {
    local input_tif="$1"
    local output_file="$2"
    
    log "Processando ortofoto → COG: $input_tif"
    
    if [ ! -f "$input_tif" ]; then
        error "Arquivo ortofoto não encontrado: $input_tif"
    fi
    
    # Converter para COG com otimizações
    gdal_translate \
        -of COG \
        -co COMPRESS=JPEG \
        -co QUALITY=85 \
        -co TILED=YES \
        -co BLOCKSIZE=512 \
        -co OVERVIEW_RESAMPLING=LANCZOS \
        -co NUM_THREADS=ALL_CPUS \
        "$input_tif" \
        "$output_file"
    
    # Adicionar overviews
    gdaladdo -r lanczos "$output_file" 2 4 8 16
    
    log "COG criado com sucesso: $output_file"
}

# Função principal
main() {
    local command="$1"

    case "$command" in
        "odm")
            check_dependencies
            process_odm_reconstruction "$2" "$3" "$4"
            ;;
        "ept")
            check_dependencies
            process_pointcloud_to_ept "$2" "$3" "$4"
            ;;
        "3dtiles")
            check_dependencies
            process_mesh_to_tiles "$2" "$3" "$4"
            ;;
        "terrain")
            check_dependencies
            process_terrain_to_rgb "$2" "$3" "$4" "$5"
            ;;
        "cog")
            check_dependencies
            process_orthophoto_to_cog "$2" "$3"
            ;;
        "setup")
            log "🔧 Configurando ambiente completo..."
            check_dependencies

            # Criar estrutura de diretórios
            mkdir -p data/{images,models,pointclouds,dems} \
                   output/{3dtiles,ept,terrain,cog} \
                   temp

            # Baixar dados de exemplo (opcional)
            if [ "$2" = "--download-sample" ]; then
                warn "📥 Baixando dados de exemplo..."
                # Adicionar downloads de dados de exemplo aqui
            fi

            success "✅ Ambiente configurado!"
            ;;
        "full-pipeline")
            log "🚀 Executando pipeline completo FOSS..."
            check_dependencies

            local input_dir="${2:-./data}"
            local output_dir="${3:-./output}"

            # 1. ODM Reconstruction (se imagens disponíveis)
            if [ -d "$input_dir/images" ] && [ "$(ls -A "$input_dir/images")" ]; then
                info "🏗️ Fase 1: Reconstrução ODM"
                process_odm_reconstruction "$input_dir/images" "$output_dir/odm"
            fi

            # 2. EPT Point Cloud (se nuvem disponível)
            local pointcloud_file=""
            if [ -f "$input_dir/pointclouds/point_cloud.las" ]; then
                pointcloud_file="$input_dir/pointclouds/point_cloud.las"
            elif [ -f "$output_dir/odm/point_cloud.las" ]; then
                pointcloud_file="$output_dir/odm/point_cloud.las"
            fi

            if [ -n "$pointcloud_file" ]; then
                info "🌲 Fase 2: EPT Point Cloud"
                process_pointcloud_to_ept "$pointcloud_file" "$output_dir/ept"
            fi

            # 3. 3D Tiles Mesh (se modelo disponível)
            local mesh_file=""
            if [ -f "$input_dir/models/model.glb" ]; then
                mesh_file="$input_dir/models/model.glb"
            elif [ -f "$output_dir/odm/model.glb" ]; then
                mesh_file="$output_dir/odm/model.glb"
            elif [ -f "$input_dir/models/model.obj" ]; then
                mesh_file="$input_dir/models/model.obj"
            elif [ -f "$output_dir/odm/model.obj" ]; then
                mesh_file="$output_dir/odm/model.obj"
            fi

            if [ -n "$mesh_file" ]; then
                info "🏗️ Fase 3: 3D Tiles Mesh"
                process_mesh_to_tiles "$mesh_file" "$output_dir/3dtiles"
            fi

            # 4. Terrain-RGB (se DEM disponível)
            local dem_file=""
            if [ -f "$input_dir/dems/dsm.tif" ]; then
                dem_file="$input_dir/dems/dsm.tif"
            elif [ -f "$output_dir/odm/dsm.tif" ]; then
                dem_file="$output_dir/odm/dsm.tif"
            fi

            if [ -n "$dem_file" ]; then
                info "🏔️ Fase 4: Terrain-RGB"
                process_terrain_to_rgb "$dem_file" "$output_dir/terrain" 8 16
            fi

            # 5. COG Orthophoto (se ortofoto disponível)
            local ortho_file=""
            if [ -f "$input_dir/orthophoto.tif" ]; then
                ortho_file="$input_dir/orthophoto.tif"
            elif [ -f "$output_dir/odm/orthophoto.tif" ]; then
                ortho_file="$output_dir/odm/orthophoto.tif"
            fi

            if [ -n "$ortho_file" ]; then
                info "🗺️ Fase 5: COG Orthophoto"
                process_orthophoto_to_cog "$ortho_file" "$output_dir/cog/orthophoto.cog.tif"
            fi

            success "🎉 Pipeline completo finalizado!"
            info "📊 Resumo dos outputs:"
            [ -d "$output_dir/ept" ] && info "   ✅ EPT Point Cloud: $output_dir/ept"
            [ -d "$output_dir/3dtiles" ] && info "   ✅ 3D Tiles: $output_dir/3dtiles"
            [ -d "$output_dir/terrain" ] && info "   ✅ Terrain-RGB: $output_dir/terrain"
            [ -f "$output_dir/cog/orthophoto.cog.tif" ] && info "   ✅ COG Orthophoto: $output_dir/cog/orthophoto.cog.tif"
            ;;
        *)
            echo -e "${CYAN}🗺️ YSH Solar - Pipeline FOSS Completo para Mapa 3D Geoespacial${NC}"
            echo ""
            echo -e "${BLUE}Stack Tecnológico:${NC}"
            echo "  • OpenDroneMap (ODM) → Reconstrução 3D"
            echo "  • Entwine → EPT Point Clouds"
            echo "  • py3dtiles → 3D Tiles Meshes"
            echo "  • GDAL → Terrain-RGB & COG"
            echo "  • glTF Pipeline → Draco + KTX2"
            echo "  • TiTiler → Raster Tiles Serving"
            echo ""
            echo -e "${GREEN}Comandos:${NC}"
            echo "  $0 setup [--download-sample]          # Configurar ambiente"
            echo "  $0 odm <images_dir> <output_dir>       # Reconstrução ODM"
            echo "  $0 ept <pointcloud.las> <output_dir>   # EPT Point Cloud"
            echo "  $0 3dtiles <model.glb> <output_dir>    # 3D Tiles Mesh"
            echo "  $0 terrain <dem.tif> <output_dir>      # Terrain-RGB"
            echo "  $0 cog <orthophoto.tif> <output.cog.tif> # COG Orthophoto"
            echo "  $0 full-pipeline [input_dir] [output_dir] # Pipeline completo"
            echo ""
            echo -e "${YELLOW}Exemplos:${NC}"
            echo "  $0 setup"
            echo "  $0 odm ./drone_images ./output"
            echo "  $0 ept point_cloud.las ./tiles/ept"
            echo "  $0 3dtiles building.glb ./tiles/3d"
            echo "  $0 terrain elevation.tif ./tiles/terrain 10 18"
            echo "  $0 cog orthophoto.tif orthophoto.cog.tif"
            echo "  $0 full-pipeline ./data ./output"
            echo ""
            echo -e "${PURPLE}Outputs Integráveis:${NC}"
            echo "  • Three.js: 3D Tiles + atmosfera (three-geospatial)"
            echo "  • deck.gl: EPT + MapLibre + Tile3DLayer"
            echo "  • TiTiler: /tiles/z/x/y.png para terrain/orthophoto"
            echo "  • MinIO: Serving estático de tiles"
            ;;
    esac
}

# Executar
main "$@"