import duckdb
import geopandas as gpd
import json
import pandas as pd
from pathlib import Path

# Config
DB_PATH = r"C:\Users\fjuni\Projects\01-Upstream\04-YSH-Energy\ysh-packages\infra\data\20_raw\BDs QUOD\quod.duckdb"
GEOJSON_PATH = r"C:\Users\fjuni\Projects\01-Upstream\04-YSH-Energy\ysh-packages\infra\data\60_geospatial\geojson\quod__bdgd-points__br__2026__v1.geojson"
OUTPUT_DIR = Path("reports")
OUTPUT_DIR.mkdir(exist_ok=True)

def audit_lineage():
    con = duckdb.connect(DB_PATH)
    
    # 1. Schema Inventory
    tables = con.execute("SHOW TABLES").fetchdf()
    schema_inventory = {}
    for table in tables['name']:
        columns = con.execute(f"DESCRIBE {table}").fetchdf()
        schema_inventory[table] = columns.to_dict(orient='records')
    
    with open(OUTPUT_DIR / "quod_duckdb_schema_inventory.json", "w") as f:
        json.dump(schema_inventory, f, indent=2)

    # 2. Join Key Profile (Sample)
    # Checking common key candidates
    join_key_profile = {}
    for table in tables['name']:
        cols = con.execute(f"DESCRIBE {table}").fetchdf()['column_name'].tolist()
        for col in ['doc_token', 'cpf', 'cnpj', 'codigo_registro']:
            if col in cols:
                stats = con.execute(f"SELECT COUNT(*) as total, COUNT(DISTINCT {col}) as unique_count, SUM(CASE WHEN {col} IS NULL THEN 1 ELSE 0 END) as null_count FROM {table}").fetchdf()
                join_key_profile[f"{table}.{col}"] = stats.to_dict(orient='records')[0]
    
    with open(OUTPUT_DIR / "quod_duckdb_join_key_profile.json", "w") as f:
        json.dump(join_key_profile, f, indent=2)

    # 3. GeoJSON Join Probe
    gdf = gpd.read_file(GEOJSON_PATH)
    geo_tokens = set(gdf['doc_token'].dropna().unique())
    
    probe_results = {}
    for table in tables['name']:
        cols = con.execute(f"DESCRIBE {table}").fetchdf()['column_name'].tolist()
        if 'doc_token' in cols:
            db_tokens = set(con.execute(f"SELECT DISTINCT doc_token FROM {table} WHERE doc_token IS NOT NULL").fetchdf()['doc_token'].astype(str))
            match_rate = len(geo_tokens.intersection(db_tokens)) / len(geo_tokens) if len(geo_tokens) > 0 else 0
            probe_results[table] = {
                "match_rate": match_rate,
                "common_tokens_count": len(geo_tokens.intersection(db_tokens))
            }
            
    with open(OUTPUT_DIR / "quod_geojson_join_probe.json", "w") as f:
        json.dump(probe_results, f, indent=2)
        
    # 4. Canonical Readiness
    readiness = {
        "suitable_tables": [t for t, res in probe_results.items() if res['match_rate'] > 0.1],
        "overall_readiness": "partial" if any(res['match_rate'] > 0.1 for res in probe_results.values()) else "none"
    }
    
    with open(OUTPUT_DIR / "canonical_target_build_readiness.json", "w") as f:
        json.dump(readiness, f, indent=2)

    con.close()
    print("Audit complete.")

if __name__ == "__main__":
    audit_lineage()
