import os

features_dir = r"C:\Users\fjuni\farmvibes-ai\op_resources\electricitymaps-contrib-rewrite-master\web\src\features"

breakdown_mocks = {
    "charts/bar-breakdown/BarBreakdownChart.mock.ts": """export const mockBarBreakdownChartProps = {
  productionData: [],
  exchangeData: [],
};
""",
    "charts/bar-breakdown/BarBreakdownEmissionsChart.mock.ts": """export const mockBarBreakdownEmissionsChartProps = {
  productionData: [],
  exchangeData: [],
};
""",
    "charts/bar-breakdown/BarElectricityBreakdownChart.mock.ts": """export const mockBarElectricityBreakdownChartProps = {
  productionData: [],
  exchangeData: [],
};
""",
    "charts/bar-breakdown/EmptyBarBreakdownChart.mock.ts": """export const mockEmptyBarBreakdownChartProps = {
  productionData: [],
  exchangeData: [],
};
""",
}

def populate():
    for rel_path, content in breakdown_mocks.items():
        abs_path = os.path.join(features_dir, rel_path.replace("/", os.sep))
        with open(abs_path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Populated breakdown mock: {rel_path}")

if __name__ == "__main__":
    populate()
