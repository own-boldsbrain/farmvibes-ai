import os
import duckdb
import glob
import json

# Absolute paths provided by the user
BASE_INFRA_PATH = r"C:\Users\fjuni\Projects\01-Upstream\04-YSH-Energy\ysh-packages\infra"
DB_PATH = os.path.join(BASE_INFRA_PATH, "data", "50_curated", "duckdb", "analytical.duckdb")
ANEEL_DB_PATH = os.path.join(BASE_INFRA_PATH, "data", "50_curated", "duckdb", "ysh_aneel.duckdb")
GEOJSON_DIR = os.path.join(BASE_INFRA_PATH, "data", "60_geospatial", "geojson", "normalized", "distribuidoras")
SQL_DIR = os.path.join(BASE_INFRA_PATH, "data", "50_curated", "sql")
NORMALIZED_ADDR_PATH = os.path.join(BASE_INFRA_PATH, "data", "40_normalized", "bdgd", "quod__geocoded-addresses__br__2026__v1.jsonl")

def consolidate():
    print(f"--- Inserindo DuckDB Persistente: {DB_PATH} ---")
    
    # Connect to the main analytical database
    conn = duckdb.connect(DB_PATH)
    
    # Install and load extensions
    conn.execute("INSTALL spatial; LOAD spatial;")
    conn.execute("INSTALL httpfs; LOAD httpfs;")
    
    # 1. Attach ANEEL database if it exists
    if os.path.exists(ANEEL_DB_PATH):
        print(f"Attaching {ANEEL_DB_PATH}...")
        conn.execute(f"ATTACH '{ANEEL_DB_PATH}' AS ysh_aneel;")
    
    # 2. Load Normalized Geocoded Addresses (JSONL)
    if os.path.exists(NORMALIZED_ADDR_PATH):
        print(f"Loading normalized addresses from {NORMALIZED_ADDR_PATH}...")
        conn.execute(f"CREATE TABLE IF NOT EXISTS quod_geocoded_addresses AS SELECT * FROM read_json_auto('{NORMALIZED_ADDR_PATH}');")
    
    # 3. Import GeoJSON boundaries
    print(f"Importing GeoJSON boundaries...")
    
    # Define search patterns for different categories
    search_patterns = [
        os.path.join(BASE_INFRA_PATH, "data", "60_geospatial", "geojson", "normalized", "distribuidoras", "*.geojson"),
        os.path.join(BASE_INFRA_PATH, "data", "60_geospatial", "geojson", "national", "distribuidoras", "*.geojson"),
        os.path.join(BASE_INFRA_PATH, "data", "60_geospatial", "geojson", "dissolved", "distribuidoras", "*.geojson")
    ]
    
    geojson_files = []
    for pattern in search_patterns:
        geojson_files.extend(glob.glob(pattern))
    
    # Create or update geo_distribuidoras table
    conn.execute("""
        CREATE TABLE IF NOT EXISTS bdgd_concessionarias_v2 (
            ysh_id VARCHAR,
            ysh_name VARCHAR,
            ysh_agent_code VARCHAR,
            geom GEOMETRY,
            filename VARCHAR,
            category VARCHAR
        );
    """)
    
    for gj in geojson_files:
        filename = os.path.basename(gj)
        category = os.path.basename(os.path.dirname(gj))
        print(f"  -> Processing {category}/{filename}...")
        try:
            # Query the GeoJSON directly using DuckDB spatial
            conn.execute(f"""
                INSERT INTO bdgd_concessionarias_v2 
                SELECT 
                    properties->>'ysh_id' as ysh_id,
                    properties->>'ysh_name' as ysh_name,
                    properties->>'ysh_agent_code' as ysh_agent_code,
                    geom,
                    '{filename}' as filename,
                    '{category}' as category
                FROM st_read('{gj}');
            """)
        except Exception as e:
            print(f"  [!] Error processing {filename}: {e}")

    # 4. Run SQL curation scripts
    sql_files = [
        "create_tasks_tables.sql",
        "create_dim_distribuidoras.sql",
        "create_concessionaria_score_semaforo.sql",
        "views_360_aneel.sql"
    ]
    
    for sql_file in sql_files:
        sql_path = os.path.join(SQL_DIR, sql_file)
        if os.path.exists(sql_path):
            print(f"Executing {sql_file}...")
            with open(sql_path, 'r', encoding='utf-8') as f:
                sql_query = f.read()
                # Split by semicolon if needed or run as batch
                try:
                    conn.execute(sql_query)
                except Exception as e:
                    print(f"  [!] Error executing {sql_file}: {e}")

    print("--- Consolidação Concluída! ---")
    conn.close()

if __name__ == "__main__":
    consolidate()
