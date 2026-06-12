import json

file_path = r'web\public\data\rs-concessionarias.geojson'
with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

print(f"Type: {data.get('type')}")
print(f"Number of features: {len(data.get('features', []))}")
if data.get('features'):
    feature = data['features'][0]
    print("First feature properties:")
    for k, v in feature['properties'].items():
        print(f"  {k}: {v}")
