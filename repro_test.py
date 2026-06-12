import logging
import os
import sys
from datetime import datetime
import numpy as np
import xarray as xr
from shapely import geometry as shpg
from unittest.mock import patch, MagicMock

import logging
import os
import sys
from datetime import datetime
import numpy as np
import xarray as xr
from shapely import geometry as shpg
from unittest.mock import patch, MagicMock

# Add src packages to path
sys.path.append("src/vibe_core")
sys.path.append("src/vibe_dev")
sys.path.append("src/vibe_lib")
sys.path.append("src/vibe_agent")
sys.path.append("src/vibe_common")
sys.path.append("ops/opengeoai_sam_base")


from vibe_core.data import Raster
from vibe_dev.testing.op_tester import OpTester
from vibe_lib.raster import save_raster_to_asset
from tempfile import TemporaryDirectory

CONFIG_PATH = "ops/opengeoai_sam_base/opengeoai_sam_base.yaml"

def create_base_raster(tmp_dir_name: str, raster_size: int = 256) -> Raster:
    now = datetime.now()
    geom = shpg.mapping(shpg.box(0, 0, raster_size, raster_size))

    n_channels = 3
    raster_dim = (n_channels, raster_size, raster_size)

    fake_data = np.random.rand(*raster_dim) * 10000

    fake_da = xr.DataArray(
        fake_data,
        coords={
            "bands": np.arange(raster_dim[0]),
            "x": np.linspace(0, 1, raster_dim[1]),
            "y": np.linspace(0, 1, raster_dim[2]),
        },
        dims=["bands", "y", "x"],
    )
    fake_da.rio.write_crs("epsg:4326", inplace=True)

    asset = save_raster_to_asset(fake_da, tmp_dir_name)

    raster = Raster(
        id="basemap",
        time_range=(now, now),
        geometry=geom,
        assets=[asset],
        bands={"red": 0, "green": 1, "blue": 2},
    )

    return raster

@patch("opengeoai_sam_inference.opengeoai")
def run_test(mock_opengeoai):
    with TemporaryDirectory() as tmp_dir:
        # Setup mock
        mock_sam = MagicMock()
        mock_opengeoai.sam.load_model.return_value = mock_sam
        mock_sam.generate_embeddings.return_value = np.zeros((1, 256, 64, 64))

        raster = create_base_raster(tmp_dir)
        op_tester = OpTester(CONFIG_PATH)
        
        print("Running operator...")
        output = op_tester.run(input_raster=raster)
        
        assert "segmentation_mask" in output
        mock_opengeoai.sam.load_model.assert_called_once()
        print("Test passed!")

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    run_test()
