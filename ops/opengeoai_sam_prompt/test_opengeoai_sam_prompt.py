import pytest
import os
import geopandas as gpd
from shapely.geometry import Point
from vibe_dev.testing.op_tester import OpTester

CONFIG_PATH = os.path.join(
    os.path.dirname(os.path.abspath(__file__)), "opengeoai_sam_prompt.yaml"
)

def test_opengeoai_sam_prompt():
    op_tester = OpTester(CONFIG_PATH)
    op_tester.update_parameters({
        "points_file": "quod__bdgd-points__br__2026__v1.geojson"
    })
    
    # Red Phase: This will fail until the implementation is done
    output = op_tester.run()
    assert "prompt_collection" in output
