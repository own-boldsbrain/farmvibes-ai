import pytest
import os
import shutil
from vibe_dev.testing.op_tester import OpTester
from vibe_core.data import CategoricalRaster, AssetVibe, gen_guid
from datetime import datetime
from shapely import geometry as shpg

CONFIG_PATH = os.path.join(
    os.path.dirname(os.path.abspath(__file__)), "local_data_writer.yaml"
)

def test_local_data_writer():
    op_tester = OpTester(CONFIG_PATH)
    op_tester.update_parameters({
        "output_dir": "50_curated/segmentation"
    })
    
    now = datetime.now()
    geom = shpg.mapping(shpg.box(0, 0, 1, 1))
    asset = AssetVibe(reference="fake_path.tif", type="image/tiff", id=gen_guid())
    
    mock_mask = CategoricalRaster(
        id=gen_guid(),
        time_range=(now, now),
        geometry=geom,
        assets=[asset],
        bands={"mask_0": 0},
        categories=["background", "foreground"]
    )
    
    # Red phase: this will fail until the op is implemented
    output = op_tester.run(segmentation_mask=mock_mask)
    assert "saved_rasters" in output
