import os
from geoai.segment import GroundedSAM
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
LOGGER = logging.getLogger("segmentation_verify")

def verify_segmentation():
    input_path = r"C:\Users\fjuni\Projects\01-Upstream\04-YSH-Energy\farmvibes-ai\ops\detect_building_footprint\test_output\input_tile.tif"
    output_path = r"C:\Users\fjuni\Projects\01-Upstream\04-YSH-Energy\farmvibes-ai\verification_mask.tif"

    LOGGER.info(f"Starting real segmentation on {input_path}")

    # Use the same model as in our operator
    model = GroundedSAM(segmenter_id="facebook/sam-vit-base")
    
    # Run segmentation
    LOGGER.info("Running model.segment_image()...")
    model.segment_image(
        input_path=input_path,
        output_path=output_path,
        text_prompts="rooftop", # Targeting the requested rooftop
        export_polygons=False
    )
    
    if os.path.exists(output_path):
        LOGGER.info(f"Segmentation successful. Output saved to {output_path}")
    else:
        LOGGER.error("Segmentation failed - output file not found.")

if __name__ == "__main__":
    verify_segmentation()
