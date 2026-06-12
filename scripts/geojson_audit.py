import json
import geopandas as gpd
import os
import pandas as pd
from pathlib import Path

# Configuration
INPUT_GEOJSON = r"C:\Users\fjuni\Projects\01-Upstream\04-YSH-Energy\ysh-packages\infra\data\60_geospatial\geojson\quod__bdgd-points__br__2026__v1.geojson"
OUTPUT_DIR = Path("reports")
OUTPUT_DIR.mkdir(exist_ok=True)

def audit_points():
    print(f"Auditing {INPUT_GEOJSON}...")
    
    # Load GeoJSON
    gdf = gpd.read_file(INPUT_GEOJSON)
    
    # Metrics
    total_features = len(gdf)
    valid_geometry = gdf[gdf.geometry.is_valid & ~gdf.geometry.is_empty]
    null_geometry = gdf[gdf.geometry.isna()]
    
    # Check for duplicates
    # Assumption: doc_token + cep + geometry represents a duplicate
    gdf['geometry_str'] = gdf.geometry.apply(lambda g: g.wkt)
    duplicates = gdf.duplicated(subset=['doc_token', 'cep', 'geometry_str'])
    
    report = {
        "total_features": total_features,
        "valid_point_features": len(valid_geometry),
        "null_geometry": len(null_geometry),
        "unique_doc_tokens": gdf['doc_token'].nunique(),
        "unique_cep": gdf['cep'].nunique(),
        "duplicate_key_count": int(duplicates.sum()),
        "bounds": list(gdf.total_bounds)
    }
    
    with open(OUTPUT_DIR / "geojson_audit_quod_bdgd_points.json", "w") as f:
        json.dump(report, f, indent=2)
    print("GeoJSON audit complete.")

if __name__ == "__main__":
    audit_points()
