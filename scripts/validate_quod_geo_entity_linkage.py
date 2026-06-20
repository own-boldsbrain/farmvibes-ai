import json
import os
import pandas as pd
import argparse
from typing import Optional

def mask_token(token: str) -> str:
    if not token or pd.isna(token):
        return "N/A"
    s = str(token)
    if len(s) <= 4:
        return "****"
    return f"{s[:3]}****{s[-3:]}"

def normalize_cep(cep):
    if pd.isna(cep):
        return ""
    return str(cep).replace("-", "").strip().zfill(8)

def normalize_text(text):
    if pd.isna(text):
        return ""
    return str(text).strip().upper()

def main():
    parser = argparse.ArgumentParser(description="Validate Quod Geo Entity Linkage")
    parser.add_argument("--geojson", required=True, help="Path to geocoded GeoJSON")
    parser.add_argument("--pf-csv", required=True, help="Path to PF CSV")
    parser.add_argument("--pj-csv", required=True, help="Path to PJ CSV")
    parser.add_argument("--reports-dir", default="reports", help="Directory to save reports")
    args = parser.parse_args()

    os.makedirs(args.reports_dir, exist_ok=True)

    print(f"Loading GeoJSON: {args.geojson}")
    with open(args.geojson, 'r') as f:
        geojson_data = json.load(f)
    
    features = geojson_data['features']
    records = []
    for i, feat in enumerate(features):
        props = feat['properties'].copy()
        props['source_row'] = i
        coords = feat['geometry']['coordinates']
        props['longitude'] = coords[0]
        props['latitude'] = coords[1]
        records.append(props)
    
    gdf_emul = pd.DataFrame(records)

    print(f"Loading PF CSV: {args.pf_csv}")
    pf_df = pd.read_csv(args.pf_csv, sep=";", encoding="latin1", dtype=str)
    
    print(f"Loading PJ CSV: {args.pj_csv}")
    pj_df = pd.read_csv(args.pj_csv, sep=";", encoding="latin1", dtype=str)

    # Basic normalization
    gdf_emul['doc_token'] = gdf_emul['doc_token'].astype(str).str.strip().str.replace(".0", "", regex=False)
    pf_df['CPF'] = pf_df['CPF'].astype(str).str.strip().str.replace(".0", "", regex=False)
    
    # PJ normalization (using address1)
    pj_df['cep_norm'] = pj_df['cep1'].apply(normalize_cep)
    pj_df['logradouro_norm'] = pj_df['logradouro1'].apply(normalize_text)
    pj_df['municipio_norm'] = pj_df['cidade1'].apply(normalize_text)
    pj_df['uf_norm'] = pj_df['estado1'].apply(normalize_text)

    gdf_emul['cep_norm'] = gdf_emul['cep'].apply(normalize_cep)
    gdf_emul['logradouro_norm'] = gdf_emul['logradouro'].apply(normalize_text)
    gdf_emul['municipio_norm'] = gdf_emul['municipio'].apply(normalize_text)
    gdf_emul['uf_norm'] = gdf_emul['uf'].apply(normalize_text)

    # Linkage PF
    pf_set = set(pf_df['CPF'])
    # Handle leading zeros for CPF
    gdf_emul['doc_token_z'] = gdf_emul['doc_token'].str.zfill(11)
    pf_set_z = {x.zfill(11) for x in pf_set}
    
    pf_matches = gdf_emul[gdf_emul['doc_token_z'].isin(pf_set_z)]
    pf_match_count = len(pf_matches)

    # Linkage PJ - composite address
    gdf_emul['addr_key'] = gdf_emul['cep_norm'] + "|" + gdf_emul['logradouro_norm'] + "|" + gdf_emul['municipio_norm'] + "|" + gdf_emul['uf_norm']
    pj_df['addr_key'] = pj_df['cep_norm'] + "|" + pj_df['logradouro_norm'] + "|" + pj_df['municipio_norm'] + "|" + pj_df['uf_norm']
    
    pj_set = set(pj_df['addr_key'])
    pj_matches = gdf_emul[gdf_emul['addr_key'].isin(pj_set)]
    pj_match_count = len(pj_matches)

    confirmed_indices = set(pf_matches.index).union(set(pj_matches.index))
    unconfirmed = gdf_emul[~gdf_emul.index.isin(confirmed_indices)]

    # Reports
    report = {
        "total_features": len(gdf_emul),
        "pf_matches": pf_match_count,
        "pj_matches": pj_match_count,
        "confirmed_total": len(confirmed_indices),
        "unconfirmed": len(unconfirmed),
        "match_rate": len(confirmed_indices) / len(gdf_emul) if len(gdf_emul) > 0 else 0
    }

    report_path = os.path.join(args.reports_dir, "entity_linkage_validation_report.json")
    with open(report_path, "w") as f:
        json.dump(report, f, indent=4)

    # PJ CNPJ quality report
    pj_df['cnpj_is_scientific'] = pj_df['cnpj'].astype(str).str.contains('E\\+', na=False)
    scientific_count = pj_df['cnpj_is_scientific'].sum()
    
    pj_quality = {
        "total_pj_records": len(pj_df),
        "scientific_notation_cnpj_count": int(scientific_count),
        "scientific_notation_ratio": float(scientific_count / len(pj_df)) if len(pj_df) > 0 else 0
    }
    
    pj_quality_path = os.path.join(args.reports_dir, "pj_cnpj_format_quality_report.json")
    with open(pj_quality_path, "w") as f:
        json.dump(pj_quality, f, indent=4)

    # Samples of unconfirmed (masked)
    unconfirmed_samples = unconfirmed.head(100).copy()
    unconfirmed_samples['doc_token_masked'] = unconfirmed_samples['doc_token'].apply(mask_token)
    cols_to_keep = ['doc_token_masked', 'cep', 'logradouro', 'municipio', 'uf', 'latitude', 'longitude']
    unconfirmed_samples = unconfirmed_samples[[c for c in cols_to_keep if c in unconfirmed_samples.columns]]
    unconfirmed_samples.to_csv(os.path.join(args.reports_dir, "entity_unconfirmed_samples_masked.csv"), index=False)

    print(f"Validation complete. Reports saved to {args.reports_dir}")

if __name__ == "__main__":
    main()
