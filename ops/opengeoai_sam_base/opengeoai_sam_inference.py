import logging
from typing import Dict, List, cast
import numpy as np
import xarray as xr
from shapely import geometry as shpg

from vibe_core.data import Raster, CategoricalRaster, AssetVibe, GeometryCollection, gen_guid
from geoai.segment import GroundedSAM

LOGGER = logging.getLogger(__name__)

class OpenGeoAISAMCallbackBuilder:
    def __init__(self, model_type: str):
        self.model_type = model_type
        # Initialize the real GroundedSAM model
        self.model = GroundedSAM(segmenter_id=model_type)
        LOGGER.info(f"Initialized real GeoAI GroundedSAM operator with model type: {model_type}")

    def __call__(self):
        def callback(input_raster: Raster, input_prompts: GeometryCollection) -> Dict[str, CategoricalRaster]:
            LOGGER.info(f"Processing raster {input_raster.id} with GeoAI GroundedSAM ({self.model_type})")
            
            # Temporary output path for segmentation
            # In a real workflow, this should be handled by the VibeCore pipeline
            output_path = f"segmentation_{gen_guid()}.tif"
            
            # Run actual segmentation
            self.model.segment_image(
                input_path=input_raster.assets[0].local_path,
                output_path=output_path,
                text_prompts="object", # This is a placeholder; need to map prompts
                export_polygons=False
            )
            
            # Create categorical raster asset
            asset = AssetVibe(reference=output_path, type="image/tiff", id=gen_guid())
            
            segmentation_mask = CategoricalRaster.clone_from(
                input_raster,
                id=gen_guid(),
                assets=[asset],
                bands={"mask_0": 0},
                categories=["background", "foreground"],
            )

            return {"segmentation_mask": segmentation_mask}

        return callback
