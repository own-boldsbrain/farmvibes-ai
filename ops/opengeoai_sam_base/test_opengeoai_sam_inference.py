import pytest
import os
from datetime import datetime
import numpy as np
import xarray as xr
from shapely import geometry as shpg
from vibe_core.data import Raster
from vibe_dev.testing.op_tester import OpTester
from vibe_lib.raster import save_raster_to_asset
from tempfile import TemporaryDirectory

CONFIG_PATH = os.path.join(
    os.path.dirname(os.path.abspath(__file__)), "opengeoai_sam_base.yaml"
)

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


@pytest.fixture
def tmp_dir():
    _tmp_dir = TemporaryDirectory()
    yield _tmp_dir.name
    _tmp_dir.cleanup()


def test_opengeoai_sam_base(tmp_dir: str):
    raster = create_base_raster(tmp_dir)
    op_tester = OpTester(CONFIG_PATH)
    
    # This should fail since we haven't implemented OpenGeoAISAMCallbackBuilder yet
    output = op_tester.run(input_raster=raster)
    
    assert "segmentation_mask" in output
