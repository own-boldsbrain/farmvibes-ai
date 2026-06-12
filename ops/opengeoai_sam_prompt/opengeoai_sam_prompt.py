import logging
import os
from typing import Dict
from datetime import datetime
from shapely import geometry as shpg
from vibe_core.data import GeometryCollection, AssetVibe, gen_guid

LOGGER = logging.getLogger(__name__)

class OpenGeoAISAMPromptCallbackBuilder:
    def __init__(self, points_file: str):
        self.points_file = points_file
        # Local paths mapped from standard repo design
        self.base_path = f"/mnt/data/60_geospatial/geojson"
        self.file_path = os.path.join(self.base_path, self.points_file)

    def __call__(self):
        def callback() -> Dict[str, GeometryCollection]:
            LOGGER.info(f"Loading BDGD points for prompting SAM from {self.file_path}")
            
            # Dummy logic representing reading the points from GeoJSON
            # Usually we'd do something like `gpd.read_file(self.file_path)`
            now = datetime.now()
            
            # Just create a dummy GeometryCollection
            geom = {"type": "FeatureCollection", "features": []}
            
            asset = AssetVibe(reference=self.file_path, type="application/geo+json", id=gen_guid())
            
            prompt_collection = GeometryCollection(
                id=gen_guid(),
                geometry=geom,
                time_range=(now, now),
                assets=[asset]
            )
            
            return {"prompt_collection": prompt_collection}

        return callback
