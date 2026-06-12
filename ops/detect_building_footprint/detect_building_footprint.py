# Copyright (c) Microsoft Corporation.
# Licensed under the MIT License.

import logging
import os
from tempfile import TemporaryDirectory
from typing import Dict

import numpy as np
import rasterio
import torch
from rasterio.windows import Window
from tqdm import tqdm

from vibe_core.data import AssetVibe, gen_guid
from vibe_core.data.rasters import BuildingFootprintRaster, Raster

LOGGER = logging.getLogger(__name__)

TILE_SIZE = 512
OVERLAP = 32


def _normalize_to_uint8(
    tile_data: np.ndarray,
) -> np.ndarray:
    bands = tile_data.shape[0]
    if bands >= 3:
        rgb = tile_data[:3]
    else:
        rgb = np.repeat(tile_data[[0]], 3, axis=0)

    rgb = rgb.astype(np.float64)
    result = np.empty_like(rgb)
    for ch in range(3):
        cmin, cmax = rgb[ch].min(), rgb[ch].max()
        if cmax > cmin:
            result[ch] = (rgb[ch] - cmin) / (cmax - cmin) * 255.0
        elif cmax > 0:
            result[ch] = 128.0
        else:
            result[ch] = 0.0
    return result.astype(np.uint8)


class CallbackBuilder:
    def __init__(
        self,
        text_prompt: str,
        threshold: float,
    ):
        self.text_prompt = text_prompt
        self.threshold = threshold
        self.tmp_dir = TemporaryDirectory()

    def __call__(self):
        from transformers import CLIPSegForImageSegmentation, CLIPSegProcessor

        device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        processor = CLIPSegProcessor.from_pretrained("CIDAS/clipseg-rd64-refined")
        model = CLIPSegForImageSegmentation.from_pretrained(
            "CIDAS/clipseg-rd64-refined"
        ).to(device)
        model.eval()

        def callback(
            input_raster: Raster,
        ) -> Dict[str, BuildingFootprintRaster]:
            raster_url = input_raster.raster_asset.url
            output_path = os.path.join(self.tmp_dir.name, "footprint_mask.tif")

            with rasterio.open(raster_url) as src:
                height, width = src.height, src.width
                meta = src.meta.copy()
                meta.update(count=2, dtype="float32", nodata=None)

                probabilities = np.zeros((height, width), dtype=np.float32)
                effective = TILE_SIZE - 2 * OVERLAP
                n_x = max(1, int(np.ceil(width / effective)))
                n_y = max(1, int(np.ceil(height / effective)))

                for y in tqdm(range(n_y), desc="Tiles"):
                    for x in range(n_x):
                        x_start = max(0, x * effective - OVERLAP)
                        y_start = max(0, y * effective - OVERLAP)
                        x_end = min(width, (x + 1) * effective + OVERLAP)
                        y_end = min(height, (y + 1) * effective + OVERLAP)

                        tile = src.read(window=Window.from_slices(
                            (y_start, y_end), (x_start, x_end)
                        ))
                        rgb = _normalize_to_uint8(tile)
                        rgb_t = torch.from_numpy(rgb).unsqueeze(0)

                        inputs = processor(
                            text=[self.text_prompt],
                            images=rgb_t,
                            return_tensors="pt",
                        ).to(device)

                        with torch.no_grad():
                            logits = model(**inputs).logits[0]
                        probs = torch.sigmoid(logits).cpu().numpy()

                        tw, th = x_end - x_start, y_end - y_start
                        if probs.shape != (th, tw):
                            from PIL import Image as PILImage
                            probs = np.array(
                                PILImage.fromarray(probs).resize(
                                    (tw, th), PILImage.Resampling.BICUBIC
                                )
                            )

                        vx_s = OVERLAP if x > 0 else 0
                        vy_s = OVERLAP if y > 0 else 0
                        vx_e = tw - OVERLAP if x < n_x - 1 else tw
                        vy_e = th - OVERLAP if y < n_y - 1 else th

                        probabilities[
                            y_start + vy_s : y_start + vy_e,
                            x_start + vx_s : x_start + vx_e,
                        ] = probs[vy_s:vy_e, vx_s:vx_e]

                segmentation = (probabilities >= self.threshold).astype(np.float32)

                with rasterio.open(output_path, "w", **meta) as dst:
                    dst.write(segmentation, 1)
                    dst.write(probabilities, 2)
                    dst.set_band_description(1, "Binary Segmentation")
                    dst.set_band_description(2, "Probability Scores")

            asset = AssetVibe(reference=output_path, type="image/tiff", id=gen_guid())
            out = BuildingFootprintRaster.clone_from(
                input_raster,
                id=gen_guid(),
                assets=[asset],
                categories=["Background", self.text_prompt],
            )

            return {"footprint_mask": out}

        return callback

    def __del__(self):
        self.tmp_dir.cleanup()
