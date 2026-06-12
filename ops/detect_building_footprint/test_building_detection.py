#!/usr/bin/env python3
"""Test building detection with a real satellite tile, then visualize results."""

import argparse
import io
import os
import sys
import tempfile
import urllib.request

import mercantile
import numpy as np
import rasterio
from rasterio.transform import from_bounds

# ESRI World Imagery (free, reliable)
TILE_URL = (
    "https://services.arcgisonline.com/ArcGIS/rest/services/"
    "World_Imagery/MapServer/tile/{z}/{y}/{x}"
)

# Known urban areas for testing (computed via mercantile.tile(lon, lat, 18)):
# São Paulo (av. Paulista): lat=-23.5505, lon=-46.6333 → x=97114, y=148725
# Brasília (esplanada):     lat=-15.7975, lon=-47.8645 → x=96218, y=142723
# NYC (Manhattan):          lat=40.7128,  lon=-74.0060 → x=77182, y=98561
DEFAULT_TILES = {
    "sp":       (18, 97114, 148725, "São Paulo - Av. Paulista"),
    "brasilia": (18, 96218, 142723, "Brasília - Esplanada"),
    "nyc":      (18, 77182, 98561,  "NYC - Manhattan"),
}


def download_tile(z: int, x: int, y: int, url_template: str = TILE_URL) -> np.ndarray:
    url = url_template.format(z=z, x=x, y=y)
    headers = {"User-Agent": "Mozilla/5.0 (compatible; FarmVibesAI-Test)"}
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, timeout=30) as resp:
        data = resp.read()
    from PIL import Image
    return np.array(Image.open(io.BytesIO(data)).convert("RGB"))


def tile_to_geotiff(img: np.ndarray, z: int, x: int, y: int, output_path: str) -> str:
    bounds = mercantile.bounds(x, y, z)
    height, width = img.shape[:2]
    transform = from_bounds(
        bounds.west, bounds.south, bounds.east, bounds.north, width, height
    )
    meta = {
        "driver": "GTiff",
        "height": height,
        "width": width,
        "count": 3,
        "dtype": img.dtype,
        "crs": "EPSG:4326",
        "transform": transform,
    }
    with rasterio.open(output_path, "w", **meta) as dst:
        for i in range(3):
            dst.write(img[:, :, i], i + 1)
    return output_path


def visualize(img: np.ndarray, output_path: str, tmp_dir: str):
    import matplotlib.pyplot as plt

    with rasterio.open(output_path) as src:
        mask = src.read(1)
        probs = src.read(2)

    fig, axes = plt.subplots(1, 3, figsize=(18, 6))
    axes[0].imshow(img)
    axes[0].set_title("Input Satellite Tile")
    axes[0].axis("off")

    axes[1].imshow(mask, cmap="gray", vmin=0, vmax=1)
    axes[1].set_title("Building Mask")
    axes[1].axis("off")

    im = axes[2].imshow(probs, cmap="RdYlBu", vmin=0, vmax=1)
    axes[2].set_title("Probability Scores")
    axes[2].axis("off")
    plt.colorbar(im, ax=axes[2], fraction=0.046)

    vis_path = os.path.join(tmp_dir, "building_detection_result.png")
    plt.tight_layout()
    plt.savefig(vis_path, dpi=150, bbox_inches="tight")
    plt.close()
    return vis_path


def main():
    parser = argparse.ArgumentParser(description="Test building footprint detection")
    parser.add_argument("--preset", choices=list(DEFAULT_TILES.keys()), default="sp")
    parser.add_argument("--z", type=int, help="Zoom level (overrides preset)")
    parser.add_argument("--x", type=int, help="Tile X (overrides preset)")
    parser.add_argument("--y", type=int, help="Tile Y (overrides preset)")
    parser.add_argument("--prompt", default="buildings and rooftops")
    parser.add_argument("--threshold", type=float, default=0.5)
    parser.add_argument("--output", default=None)
    args = parser.parse_args()

    # Resolve tile coords
    if args.x is not None and args.y is not None and args.z is not None:
        z, x, y = args.z, args.x, args.y
        label = f"custom tile z={z} x={x} y={y}"
    else:
        z, x, y, label = DEFAULT_TILES[args.preset]

    tmp = tempfile.mkdtemp() if args.output is None else args.output
    os.makedirs(tmp, exist_ok=True)

    print(f"Location: {label}")
    print(f"Tile:     z={z} x={x} y={y}")

    # Step 1: Download tile
    print("Downloading satellite tile ...", end=" ", flush=True)
    img = download_tile(z, x, y)
    print(f"OK ({img.shape[1]}x{img.shape[0]}px)")

    # Step 2: Convert to GeoTIFF
    gtiff_path = os.path.join(tmp, "input_tile.tif")
    tile_to_geotiff(img, z, x, y, gtiff_path)
    print(f"GeoTIFF:  {gtiff_path}")

    # Step 3: Run building detection via geoai
    print(f"Detecting '{args.prompt}' (threshold={args.threshold}) ...", end=" ", flush=True)
    from geoai import CLIPSegmentation

    output_path = os.path.join(tmp, "footprint_mask.tif")
    segmenter = CLIPSegmentation(tile_size=512, overlap=32)
    segmenter.segment_image(
        input_path=gtiff_path,
        output_path=output_path,
        text_prompt=args.prompt,
        threshold=args.threshold,
    )
    print("OK")

    # Step 4: Visualize
    print("Generating visualization ...", end=" ", flush=True)
    vis_path = visualize(img, output_path, tmp)
    print(f"OK")
    print(f"\nResults:")
    print(f"  Mask:       {output_path}")
    print(f"  Visual:     {vis_path}")
    print(f"  Directory:  {tmp}")


if __name__ == "__main__":
    main()
