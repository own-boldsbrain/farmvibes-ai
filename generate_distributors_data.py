import json
import os
import glob

DATA_DIR = 'op_resources/electricitymaps-contrib-rewrite-master/web/public/data'
GEOJSON_FILES = glob.glob(os.path.join(DATA_DIR, '*.normalized.geojson'))

def generate():
    all_features = []
    distributors_list = []
    colors_map = {}
    
    # Simple color palette for distributors
    palette = ['#FF6600', '#FFCE00', '#FF0066', '#10B981', '#3B82F6', '#6366F1', '#8B5CF6', '#EC4899']
    color_idx = 0

    for gj_path in GEOJSON_FILES:
        filename = os.path.basename(gj_path)
        print(f"Processing {filename}...")
        
        with open(gj_path, 'r', encoding='utf-8') as f:
            try:
                data = json.load(f)
            except Exception as e:
                print(f"Error loading {filename}: {e}")
                continue
                
        # Determine type from filename
        b_type = 'concessionaria'
        if 'permissionaria' in filename:
            b_type = 'permissionaria'
            
        features = data.get('features', [])
        for feature in features:
            props = feature.get('properties', {})
            
            # Ensure required properties for the UI
            agent_name = props.get('ysh_agent_name') or props.get('NOME') or filename.split('.')[0]
            props['ysh_agent_name'] = agent_name
            props['ysh_boundary_type'] = b_type
            
            # Estimate area if missing (Shape_Area in EPSG:4326 is degrees^2, not km2)
            # For now, let's just use it as is or a dummy if missing
            if 'ysh_area_km2' not in props:
                props['ysh_area_km2'] = props.get('Shape_Area', 0) * 111 * 111 # Very rough estimate
            
            if agent_name not in colors_map:
                colors_map[agent_name] = palette[color_idx % len(palette)]
                color_idx += 1
            
            props['quality_color'] = colors_map[agent_name]
            props['ysh_geometry_source'] = props.get('ysh_source', 'ANEEL')
            
            all_features.append(feature)
            
            # Add to list if not already there (unique by agent_name)
            if not any(d['ysh_name'] == agent_name for d in distributors_list):
                distributors_list.append({
                    'ysh_name': agent_name,
                    'ysh_boundary_type': b_type,
                    'ysh_area_km2': props['ysh_area_km2'],
                    'quality_color': props['quality_color'],
                    'quality_score': 85.0, # Dummy
                    'quality_status': 'OK',
                    'usinas_siga': 10, # Dummy
                    'potencia_mw': 50.5, # Dummy
                    'ysh_geometry_source': props['ysh_geometry_source']
                })

    # Save merged GeoJSON
    merged_gj = {
        "type": "FeatureCollection",
        "features": all_features
    }
    with open(os.path.join(DATA_DIR, 'bdgd.geojson'), 'w', encoding='utf-8') as f:
        json.dump(merged_gj, f)
        
    # Save distributors list
    with open(os.path.join(DATA_DIR, 'distribuidoras-list.json'), 'w', encoding='utf-8') as f:
        json.dump(distributors_list, f, indent=2)
        
    # Save colors map
    with open(os.path.join(DATA_DIR, 'distribuidoras-colors.json'), 'w', encoding='utf-8') as f:
        json.dump(colors_map, f, indent=2)

    print(f"Generated data for {len(distributors_list)} distributors.")

if __name__ == "__main__":
    generate()
