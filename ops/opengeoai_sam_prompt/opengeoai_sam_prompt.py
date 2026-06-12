import logging
import os
import geopandas as gpd
from typing import Dict
from datetime import datetime
from shapely import geometry as shpg
from vibe_core.data import GeometryCollection, AssetVibe, gen_guid

LOGGER = logging.getLogger(__name__)

class OpenGeoAISAMPromptCallbackBuilder:
    def __init__(self, points_file: str):
        self.points_file = points_file
        # Local paths mapped from standard repo design
        # Using a relative path for the test environment
        self.file_path = os.path.join("C:/Users/fjuni/Projects/01-Upstream/04-YSH-Energy/ysh-packages/infra/data/60_geospatial/geojson", self.points_file)

    def __call__(self):
        def callback() -> Dict[str, GeometryCollection]:
            LOGGER.info(f"Loading BDGD points for prompting SAM from {self.file_path}")
            
            # Read GeoJSON
            gdf = gpd.read_file(self.file_path)
            
            # Convert to GeometryCollection
            geom = shpg.mapping(shpg.GeometryCollection(gdf.geometry.tolist()))
            
            asset = AssetVibe(reference=self.file_path, type="application/geo+json", id=gen_guid())
            
            now = datetime.now()
            prompt_collection = GeometryCollection(
                id=gen_guid(),
                geometry=geom,
                time_range=(now, now),
                assets=[asset]
            )
            
            return {"prompt_collection": prompt_collection}

        return callback
