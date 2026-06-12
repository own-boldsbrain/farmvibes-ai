import pytest
import os
from vibe_dev.testing.op_tester import OpTester

CONFIG_PATH = os.path.join(
    os.path.dirname(os.path.abspath(__file__)), "local_data_reader.yaml"
)

def test_local_data_reader():
    op_tester = OpTester(CONFIG_PATH)
    op_tester.update_parameters({
        "data_dir": "20_raw",
        "file_pattern": "*.tif"
    })
    
    # Red Phase: This will fail until the implementation is done
    output = op_tester.run()
    assert "rasters" in output
