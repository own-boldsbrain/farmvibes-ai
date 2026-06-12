import logging
import os
import glob
from typing import Dict, List
from datetime import datetime
from shapely import geometry as shpg
from vibe_core.data import Raster, AssetVibe, gen_guid

LOGGER = logging.getLogger(__name__)

class LocalDataReaderCallbackBuilder:
    def __init__(self, data_dir: str, file_pattern: str):
        self.data_dir = data_dir
        self.file_pattern = file_pattern
        
        # Absolute path resolution based on standard project structure
        # Assuming run inside farmvibes-ai cluster, we might need a volume mount.
        # For this implementation, we will use a local path resolution relative to the ysh-packages path
        self.base_path = f"/mnt/data/{self.data_dir}"

    def __call__(self):
        def callback() -> Dict[str, List[Raster]]:
            LOGGER.info(f"Reading local data from {self.data_dir} with pattern {self.file_pattern}")
            
            # This is a dummy logic representing the reading.
            # In a real cluster environment, we would use glob.glob(os.path.join(self.base_path, self.file_pattern))
            # and read the metadata from each GeoTiff to build the Raster object.
            
            now = datetime.now()
            geom = shpg.mapping(shpg.box(0, 0, 1, 1))
            
            dummy_asset = AssetVibe(reference=f"{self.base_path}/dummy_image.tif", type="image/tiff", id=gen_guid())
            
            raster = Raster(
                id=gen_guid(),
                time_range=(now, now),
                geometry=geom,
                assets=[dummy_asset],
                bands={"red": 0, "green": 1, "blue": 2},
            )
            
            return {"rasters": [raster]}

        return callback
