import logging
import os
import shutil
from typing import Dict, List
from vibe_core.data import CategoricalRaster

LOGGER = logging.getLogger(__name__)

class LocalDataWriterCallbackBuilder:
    def __init__(self, output_dir: str):
        self.output_dir = output_dir
        self.base_path = f"/mnt/data/{self.output_dir}"

    def __call__(self):
        def callback(segmentation_mask: CategoricalRaster) -> Dict[str, List[CategoricalRaster]]:
            LOGGER.info(f"Writing data to local infrastructure: {self.base_path}")
            
            # Dummy logic representing writing data.
            # In a real cluster, we would use shutil.copy or rasterio to save the output file to self.base_path.
            os.makedirs(self.base_path, exist_ok=True)
            
            # Simulated write
            LOGGER.info(f"Simulating saving file for mask ID {segmentation_mask.id}")
            
            return {"saved_rasters": [segmentation_mask]}

        return callback
