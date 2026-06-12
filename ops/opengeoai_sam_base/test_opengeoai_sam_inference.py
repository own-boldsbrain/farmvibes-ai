import pytest
import os
import sys
from datetime import datetime
import numpy as np
import xarray as xr
from shapely import geometry as shpg
from vibe_core.data import Raster, GeometryCollection
from vibe_dev.testing.op_tester import OpTester
from vibe_lib.raster import save_raster_to_asset
from tempfile import TemporaryDirectory
from unittest.mock import MagicMock, patch, PropertyMock

# Remove the global mock of opengeoai
# sys.modules["opengeoai"] = mock_opengeoai

CONFIG_PATH = os.path.join(
    os.path.dirname(os.path.abspath(__file__)), "opengeoai_sam_base.yaml"
)

def create_base_raster(tmp_dir_name: str, raster_size: int = 256) -> Raster:
    # ... (rest of the helper remains the same)
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

def create_geometry_collection() -> GeometryCollection:
    now = datetime.now()
    return GeometryCollection(
        id="prompts",
        time_range=(now, now),
        geometry=shpg.mapping(shpg.GeometryCollection([shpg.Point(100, 100)])),
        assets=[],
    )

@pytest.fixture
def tmp_dir():
    _tmp_dir = TemporaryDirectory()
    yield _tmp_dir.name
    _tmp_dir.cleanup()


@patch("geoai.segment.GroundedSAM")
@patch("vibe_core.data.AssetVibe.local_path", new_callable=PropertyMock)
def test_opengeoai_sam_base(mock_local_path, mock_grounded_sam, tmp_dir: str):
    # Setup mock
    mock_model = MagicMock()
    mock_grounded_sam.return_value = mock_model
    mock_local_path.return_value = os.path.join(tmp_dir, "test.tif")

    raster = create_base_raster(tmp_dir)
    prompts = create_geometry_collection()
    op_tester = OpTester(CONFIG_PATH)
    
    output = op_tester.run(input_raster=raster, input_prompts=prompts)
    
    assert "segmentation_mask" in output
    mock_grounded_sam.assert_called_once()
    mock_model.segment_image.assert_called_once()
