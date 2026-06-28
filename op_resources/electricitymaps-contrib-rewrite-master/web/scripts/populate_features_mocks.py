import os

features_dir = r"C:\Users\fjuni\farmvibes-ai\op_resources\electricitymaps-contrib-rewrite-master\web\src\features"

zone_mocks = {
    "panels/zone/ZoneHeader.mock.ts": """export const mockZoneHeaderProps = {
  zoneId: 'BR',
  isEstimated: false,
  isAggregated: false,
  co2intensity: 200,
  renewableRatio: 0.8,
  fossilFuelRatio: 0.2,
};
""",
    "panels/zone/ZoneHeaderTitle.mock.ts": """export const mockZoneHeaderTitleProps = {
  zoneId: 'BR',
  isEstimated: false,
  isAggregated: false,
};
""",
    "panels/zone/ZoneDetails.mock.ts": """export const mockZoneDetailsProps = {
  zoneId: 'BR',
};
""",
}

def populate():
    for rel_path, content in zone_mocks.items():
        abs_path = os.path.join(features_dir, rel_path.replace("/", os.sep))
        with open(abs_path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Populated zone mock: {rel_path}")

if __name__ == "__main__":
    populate()
