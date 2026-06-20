import json
import os
import pandas as pd
import argparse
import math
from datetime import datetime

def deg2num(lat_deg, lon_deg, zoom):
    lat_rad = math.radians(lat_deg)
    n = 1 << zoom
    xtile = int((lon_deg + 180.0) / 360.0 * n)
    ytile = int((1.0 - math.log(math.tan(lat_rad) + (1 / math.cos(lat_rad))) / math.pi) / 2.0 * n)
    return (xtile, ytile)

def main():
    parser = argparse.ArgumentParser(description="Batch Segmentation Planner")
    parser.add_argument("--input", required=True)
    parser.add_argument("--out-dir", required=True)
    parser.add_argument("--limit", type=int, default=None)
    parser.add_argument("--uf", default=None)
    parser.add_argument("--entity-type", default=None)
    parser.add_argument("--zoom", type=int, default=19)
    parser.add_argument("--buffer-meters", type=int, default=40)
    parser.add_argument("--max-targets-per-batch", type=int, default=25)
    args = parser.parse_args()

    os.makedirs(args.out_dir, exist_ok=True)

    print(f"Loading alvos from {args.input}...")
    df = pd.read_parquet(args.input)

    # Filters
    if args.uf:
        df = df[df['uf'] == args.uf]
    if args.entity_type:
        df = df[df['entity_type'] == args.entity_type]
    if args.limit:
        df = df.head(args.limit)

    print(f"Planning jobs for {len(df)} targets...")

    # Group by tiles at specified zoom
    df['tile'] = df.apply(lambda r: deg2num(r['latitude'], r['longitude'], args.zoom), axis=1)
    
    batches = []
    batch_counter = 0
    
    for tile, group in df.groupby('tile'):
        # Sub-group if too many targets in one tile
        target_list = group['roof_target_id'].tolist()
        for i in range(0, len(target_list), args.max_targets_per_batch):
            sub_targets = target_list[i : i + args.max_targets_per_batch]
            batch_id = f"batch_{batch_counter:05d}"
            
            # Simple bbox for tile (could be more precise)
            # For now just use the tile as reference
            batch_job = {
                "batch_id": batch_id,
                "tile_z": args.zoom,
                "tile_x": tile[0],
                "tile_y": tile[1],
                "target_count": len(sub_targets),
                "target_ids": sub_targets,
                "status": "pending",
                "created_at": datetime.now().isoformat()
            }
            batches.append(batch_job)
            batch_counter += 1

    # Save outputs
    jsonl_path = os.path.join(args.out_dir, "batch_jobs.jsonl")
    with open(jsonl_path, "w") as f:
        for batch in batches:
            f.write(json.dumps(batch) + "\n")

    manifest = {
        "total_batches": len(batches),
        "total_targets": len(df),
        "zoom": args.zoom,
        "created_at": datetime.now().isoformat()
    }
    with open(os.path.join(args.out_dir, "batch_manifest.json"), "w") as f:
        json.dump(manifest, f, indent=4)

    report = {
        "parameters": vars(args),
        "summary": manifest
    }
    with open(os.path.join(args.out_dir, "batch_planner_report.json"), "w") as f:
        json.dump(report, f, indent=4)

    print(f"Batch planning complete. Generated {len(batches)} jobs.")

if __name__ == "__main__":
    main()
