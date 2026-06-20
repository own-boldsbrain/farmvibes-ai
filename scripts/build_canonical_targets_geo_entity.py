import json
import os
import pandas as pd
import argparse
import hashlib
from datetime import datetime

def generate_id(*args):
    s = "|".join([str(arg) for arg in args])
    return hashlib.sha256(s.encode()).hexdigest()

def normalize_cep(cep):
    if pd.isna(cep):
        return ""
    return str(cep).replace("-", "").strip().zfill(8)

def normalize_text(text):
    if pd.isna(text):
        return ""
    return str(text).strip().upper()

def mask_token(token: str) -> str:
    if not token or pd.isna(token):
        return "N/A"
    s = str(token)
    if len(s) <= 4:
        return "****"
    return f"{s[:3]}****{s[-3:]}"

def main():
    parser = argparse.ArgumentParser(description="Build Canonical Targets Geo Entity Parquet")
    parser.add_argument("--geojson", required=True)
    parser.add_argument("--pf-csv", required=True)
    parser.add_argument("--pj-csv", required=True)
    parser.add_argument("--out-parquet", required=True)
    parser.add_argument("--out-schema", required=True)
    parser.add_argument("--report", required=True)
    args = parser.parse_args()

    os.makedirs(os.path.dirname(args.out_parquet), exist_ok=True)
    os.makedirs(os.path.dirname(args.report), exist_ok=True)

    print("Loading data...")
    with open(args.geojson, 'r') as f:
        geojson_data = json.load(f)
    
    features = geojson_data['features']
    records = []
    for i, feat in enumerate(features):
        props = feat['properties'].copy()
        props['source_geojson_row_number'] = i
        coords = feat['geometry']['coordinates']
        props['longitude'] = coords[0]
        props['latitude'] = coords[1]
        props['geometry_wkt'] = f"POINT ({coords[0]} {coords[1]})"
        records.append(props)
    
    df = pd.DataFrame(records)
    
    pf_df = pd.read_csv(args.pf_csv, sep=";", encoding="latin1", dtype=str)
    pj_df = pd.read_csv(args.pj_csv, sep=";", encoding="latin1", dtype=str)

    # Normalization
    df['doc_token'] = df['doc_token'].astype(str).str.strip().str.replace(".0", "", regex=False)
    df['cep_norm'] = df['cep'].apply(normalize_cep)
    df['logradouro_norm'] = df['logradouro'].apply(normalize_text)
    df['municipio_norm'] = df['municipio'].apply(normalize_text)
    df['uf_norm'] = df['uf'].apply(normalize_text)
    df['addr_key'] = df['cep_norm'] + "|" + df['logradouro_norm'] + "|" + df['municipio_norm'] + "|" + df['uf_norm']

    pf_df['CPF'] = pf_df['CPF'].astype(str).str.strip().str.replace(".0", "", regex=False)
    pj_df['addr_key'] = pj_df['cep1'].apply(normalize_cep) + "|" + pj_df['logradouro1'].apply(normalize_text) + "|" + pj_df['cidade1'].apply(normalize_text) + "|" + pj_df['estado1'].apply(normalize_text)

    # Entity Type Matching
    df['doc_token_z'] = df['doc_token'].str.zfill(11)
    pf_set_z = {x.zfill(11) for x in pf_df['CPF']}
    pj_set = set(pj_df['addr_key'])
    
    def get_match_info(row):
        if row['doc_token_z'] in pf_set_z:
            return "PF", "cpf_doc_token", "confirmed"
        if row['addr_key'] in pj_set:
            return "PJ", "pj_address_composite", "confirmed"
        return "UNKNOWN", "unconfirmed", "unconfirmed"

    print("Determining entity types...")
    match_results = df.apply(get_match_info, axis=1)
    df['entity_type'] = [r[0] for r in match_results]
    df['entity_match_method'] = [r[1] for r in match_results]
    df['entity_match_status'] = [r[2] for r in match_results]

    # Deduplication
    print("Deduplicating...")
    # Use normalized fields for dedupe key
    df['dedupe_key_hash'] = df.apply(lambda r: generate_id(r['doc_token'], r['cep_norm'], r['longitude'], r['latitude']), axis=1)
    
    unique_df = df.drop_duplicates(subset=['dedupe_key_hash']).copy()

    # Final IDs and Hashes
    unique_df['roof_target_id'] = unique_df.apply(lambda r: generate_id(r['entity_type'], r['doc_token'], r['cep_norm'], r['longitude'], r['latitude']), axis=1)
    unique_df['doc_token_hash'] = unique_df['doc_token'].apply(lambda x: hashlib.sha256(str(x).encode()).hexdigest())
    unique_df['doc_token_masked'] = unique_df['doc_token'].apply(mask_token)
    unique_df['pii_status'] = "no_raw_pii"
    unique_df['commercial_enrichment_status'] = "basic_entity_validated"
    unique_df['segmentation_status'] = "pending"
    unique_df['created_at'] = datetime.now().isoformat()

    # Select final columns
    final_cols = [
        'roof_target_id', 'source_geojson_row_number', 'doc_token_hash', 'doc_token_masked',
        'entity_type', 'entity_match_method', 'entity_match_status',
        'cep', 'logradouro', 'bairro', 'municipio', 'uf',
        'latitude', 'longitude', 'geometry_wkt', 'geocode_source',
        'dedupe_key_hash', 'pii_status', 'commercial_enrichment_status',
        'segmentation_status', 'created_at'
    ]
    
    final_df = unique_df[[c for c in final_cols if c in unique_df.columns]]

    print(f"Saving parquet to {args.out_parquet}...")
    final_df.to_parquet(args.out_parquet, engine='fastparquet')

    # Save schema
    schema = {col: str(final_df[col].dtype) for col in final_df.columns}
    with open(args.out_schema, "w") as f:
        json.dump(schema, f, indent=4)

    # Save build report
    report = {
        "total_input_features": len(df),
        "total_unique_targets": len(final_df),
        "entity_type_counts": final_df['entity_type'].value_counts().to_dict(),
        "match_status_counts": final_df['entity_match_status'].value_counts().to_dict(),
        "created_at": datetime.now().isoformat()
    }
    with open(args.report, "w") as f:
        json.dump(report, f, indent=4)

    print("Canonical build complete.")

if __name__ == "__main__":
    main()
