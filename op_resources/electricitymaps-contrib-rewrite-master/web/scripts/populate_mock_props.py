import os

features_dir = r"C:\Users\fjuni\farmvibes-ai\op_resources\electricitymaps-contrib-rewrite-master\web\src\features"

# Dictionary of custom mock definitions to write
custom_mocks = {
    # 1. d3 scale components
    "charts/elements/AreaGraphLayers.mock.ts": """export const mockAreaGraphLayersProps = {
  layers: [],
  datetimes: [new Date()],
  timeScale: Object.assign((v: any) => 0, { range: () => [0, 100], domain: () => [0, 100] }),
  valueScale: Object.assign((v: any) => 0, { range: () => [0, 100], domain: () => [0, 100] }),
  mouseMoveHandler: () => {},
  mouseOutHandler: () => {},
  isMobile: false,
  svgNode: null,
};
""",
    "charts/elements/GraphBackground.mock.ts": """export const mockGraphBackgroundProps = {
  timeScale: Object.assign((v: any) => 0, { range: () => [0, 100], domain: () => [0, 100] }),
  valueScale: Object.assign((v: any) => 0, { range: () => [0, 100], domain: () => [0, 100] }),
  datetimes: [new Date()],
  mouseMoveHandler: () => {},
  mouseOutHandler: () => {},
  isMobile: false,
  svgNode: null,
};
""",
    "charts/elements/GraphHoverline.mock.ts": """export const mockGraphHoverlineProps = {
  timeScale: Object.assign((v: any) => 0, { range: () => [0, 100], domain: () => [0, 100] }),
  valueScale: Object.assign((v: any) => 0, { range: () => [0, 100], domain: () => [0, 100] }),
  hoveredDatapointIndex: 0,
  datetimes: [new Date()],
};
""",
    "charts/elements/ValueAxis.mock.ts": """export const mockValueAxisProps = {
  scale: Object.assign((v: any) => 0, { range: () => [0, 100], ticks: () => [0, 50, 100], tickFormat: () => (v: any) => String(v) }),
};
""",
    "charts/elements/AreaGraph.mock.ts": """export const mockAreaGraphProps = {
  data: [],
  selectedLayerKey: 'hydro',
  isMobile: false,
};
""",
    "charts/BreakdownChart.mock.ts": """export const mockBreakdownChartProps = {
  isMobile: false,
};
""",
    "charts/CarbonChart.mock.ts": """export const mockCarbonChartProps = {
  isMobile: false,
};
""",
    "charts/EmissionChart.mock.ts": """export const mockEmissionChartProps = {
  isMobile: false,
};
""",
    "charts/PriceChart.mock.ts": """export const mockPriceChartProps = {
  isMobile: false,
};
""",
    "time/TimeAxis.mock.ts": """export const mockTimeAxisProps = {
  timeScale: Object.assign((v: any) => 0, { range: () => [0, 100], domain: () => [0, 100] }),
  datetimes: [new Date()],
};
""",

    # 2. Map & Exchange components
    "exchanges/ExchangeLayer.mock.ts": """export const mockExchangeLayerProps = {
  map: {
    getZoom: () => 5,
    project: () => ({ x: 100, y: 100 }),
    on: () => {},
    off: () => {},
  } as any,
};
""",
    "exchanges/ExchangeArrow.mock.ts": """export const mockExchangeArrowProps = {
  data: {
    key: 'US-BR',
    co2intensity: 200,
    lonlat: [0, 0],
    netFlow: 50,
    rotation: 45,
  },
  viewportWidth: 1000,
  viewportHeight: 1000,
  map: {
    getZoom: () => 5,
    project: () => ({ x: 100, y: 100 }),
  } as any,
};
""",
    "exchanges/ExchangeTooltip.mock.ts": """export const mockExchangeTooltipProps = {
  exchangeKey: 'US-BR',
  position: { x: 100, y: 100 },
};
""",
    "weather-layers/solar/SolarLayer.mock.ts": """export const mockSolarLayerProps = {
  map: {
    getZoom: () => 5,
    on: () => {},
    off: () => {},
  } as any,
};
""",
    "weather-layers/wind-layer/WindLayer.mock.ts": """export const mockWindLayerProps = {
  map: {
    getZoom: () => 5,
    on: () => {},
    off: () => {},
  } as any,
};
""",
    "map/map-utils/CustomLayer.mock.ts": """export const mockCustomLayerProps = {
  map: {
    getZoom: () => 5,
    on: () => {},
    off: () => {},
  } as any,
};
""",
    "map/MapTooltip.mock.ts": """export const mockMapTooltipProps = {
  position: { x: 100, y: 100 },
};
""",
    "map-controls/MapControls.mock.ts": """export const mockMapControlsProps = {
  map: {
    getZoom: () => 5,
    on: () => {},
    off: () => {},
  } as any,
};
""",
    "map-controls/ZoomControls.mock.ts": """export const mockZoomControlsProps = {
  map: {
    getZoom: () => 5,
    zoomIn: () => {},
    zoomOut: () => {},
  } as any,
};
""",

    # 3. Tooltips & Modals
    "charts/tooltips/AreaGraphTooltip.mock.ts": """import React from 'react';
export const mockAreaGraphTooltipProps = {
  children: () => React.createElement('div', null, 'Tooltip Child'),
  position: { x: 100, y: 100 },
  isBiggerThanMobile: true,
};
""",
    "charts/tooltips/BreakdownChartTooltip.mock.ts": """export const mockBreakdownChartTooltipProps = {
  position: { x: 100, y: 100 },
};
""",
    "charts/tooltips/CarbonChartTooltip.mock.ts": """export const mockCarbonChartTooltipProps = {
  position: { x: 100, y: 100 },
};
""",
    "charts/tooltips/EmissionChartTooltip.mock.ts": """export const mockEmissionChartTooltipProps = {
  position: { x: 100, y: 100 },
};
""",
    "charts/tooltips/PriceChartTooltip.mock.ts": """export const mockPriceChartTooltipProps = {
  position: { x: 100, y: 100 },
};
""",

    # 4. Toggles & Panels
    "panels/zone/DisplayByEmissionToggle.mock.ts": """export const mockDisplayByEmissionToggleProps = {
  displayByEmissions: false,
  onChange: () => {},
};
""",
    "panels/concessionarias/ConcessionariasPanel.mock.ts": """export const mockConcessionariasPanelProps = {
  isOpen: true,
  onClose: () => {},
};
""",
}

def populate():
    for rel_path, mock_content in custom_mocks.items():
        abs_path = os.path.join(features_dir, rel_path.replace("/", os.sep))
        with open(abs_path, "w", encoding="utf-8") as f:
            f.write(mock_content)
        print(f"Populated mock: {rel_path}")

if __name__ == "__main__":
    populate()
    print("Done populating custom mock properties!")
