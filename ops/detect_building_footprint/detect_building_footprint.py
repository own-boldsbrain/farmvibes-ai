# Copyright (c) Microsoft Corporation.
# Licensed under the MIT License.

import logging
import os
from tempfile import TemporaryDirectory
from typing import Dict

from geoai import CLIPSegmentation

from vibe_core.data import AssetVibe, gen_guid
from vibe_core.data.rasters import BuildingFootprintRaster, Raster

LOGGER = logging.getLogger(__name__)


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
        def callback(
            input_raster: Raster,
        ) -> Dict[str, BuildingFootprintRaster]:
            raster_url = input_raster.raster_asset.url
            output_path = os.path.join(self.tmp_dir.name, "footprint_mask.tif")

            segmenter = CLIPSegmentation(tile_size=512, overlap=32)
            segmenter.segment_image(
                input_path=raster_url,
                output_path=output_path,
                text_prompt=self.text_prompt,
                threshold=self.threshold,
            )

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
