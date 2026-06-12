import json

def summarize_geojson(file_path):
    print(f"--- Summarizing {file_path} ---")
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    features = data.get('features', [])
    print(f"Total features: {len(features)}")
    
    names = set()
    for f in features:
        props = f.get('properties', {})
        name = props.get('ysh_name') or props.get('concessionaria_1') or props.get('permissionaria_1')
        if name:
            names.add(name)
            
    print(f"Unique entities found: {len(names)}")
    for name in sorted(names):
        print(f"  - {name}")
    print("\n")

summarize_geojson(r'web\public\data\rs-concessionarias.geojson')
summarize_geojson(r'web\public\data\rs-permissionarias.geojson')
