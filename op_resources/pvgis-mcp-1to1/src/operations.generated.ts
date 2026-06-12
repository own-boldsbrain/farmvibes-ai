export const operations = [
  {
    toolName: "pvgis_v5_3_pvcalc_get",
    method: "GET",
    path: "/PVcalc",
    operationId: "pvgis_v5_3_pvcalc_get",
    summary: "PVGIS grid-connected PV performance calculation",
    description: "Calculates grid-connected photovoltaic system performance with PVGIS 5.3.",
    tags: ["PVGIS 5.3"],
    parameters: [
      { name: "lat", in: "query", required: true, description: "Latitude in decimal degrees.", schema: { type: "number", minimum: -90, maximum: 90 } },
      { name: "lon", in: "query", required: true, description: "Longitude in decimal degrees.", schema: { type: "number", minimum: -180, maximum: 180 } },
      { name: "peakpower", in: "query", required: false, description: "Nominal PV system power in kWp.", schema: { type: "number" } },
      { name: "loss", in: "query", required: false, description: "System loss percentage.", schema: { type: "number", default: 14 } },
      { name: "angle", in: "query", required: false, description: "Panel slope angle in degrees.", schema: { type: "number" } },
      { name: "aspect", in: "query", required: false, description: "Panel azimuth/aspect in degrees.", schema: { type: "number" } },
      { name: "mountingplace", in: "query", required: false, description: "Mounting place. Example: free or building.", schema: { type: "string" } },
      { name: "pvtechchoice", in: "query", required: false, description: "PV technology choice.", schema: { type: "string" } },
      { name: "raddatabase", in: "query", required: false, description: "Radiation database.", schema: { type: "string" } },
      { name: "usehorizon", in: "query", required: false, description: "Use horizon shadows: 1 yes, 0 no.", schema: { type: "integer", default: 1 } },
      { name: "optimalinclination", in: "query", required: false, description: "Optimize inclination: 1 yes, 0 no.", schema: { type: "integer" } },
      { name: "optimalangles", in: "query", required: false, description: "Optimize inclination and azimuth: 1 yes, 0 no.", schema: { type: "integer" } },
      { name: "outputformat", in: "query", required: false, description: "Output format.", schema: { type: "string", enum: ["json", "csv", "basic"] } }
    ]
  },
  {
    toolName: "pvgis_v5_3_seriescalc_get",
    method: "GET",
    path: "/seriescalc",
    operationId: "pvgis_v5_3_seriescalc_get",
    summary: "PVGIS hourly time series calculation",
    description: "Returns hourly solar radiation and optionally PV production time series from PVGIS 5.3.",
    tags: ["PVGIS 5.3"],
    parameters: [
      { name: "lat", in: "query", required: true, description: "Latitude in decimal degrees.", schema: { type: "number", minimum: -90, maximum: 90 } },
      { name: "lon", in: "query", required: true, description: "Longitude in decimal degrees.", schema: { type: "number", minimum: -180, maximum: 180 } },
      { name: "startyear", in: "query", required: false, description: "Start year.", schema: { type: "integer" } },
      { name: "endyear", in: "query", required: false, description: "End year.", schema: { type: "integer" } },
      { name: "pvcalculation", in: "query", required: false, description: "Include PV calculation: 1 yes, 0 no.", schema: { type: "integer" } },
      { name: "peakpower", in: "query", required: false, description: "Nominal PV system power in kWp.", schema: { type: "number" } },
      { name: "loss", in: "query", required: false, description: "System loss percentage.", schema: { type: "number", default: 14 } },
      { name: "angle", in: "query", required: false, description: "Panel slope angle in degrees.", schema: { type: "number" } },
      { name: "aspect", in: "query", required: false, description: "Panel azimuth/aspect in degrees.", schema: { type: "number" } },
      { name: "raddatabase", in: "query", required: false, description: "Radiation database.", schema: { type: "string" } },
      { name: "usehorizon", in: "query", required: false, description: "Use horizon shadows: 1 yes, 0 no.", schema: { type: "integer", default: 1 } },
      { name: "components", in: "query", required: false, description: "Return radiation components: 1 yes, 0 no.", schema: { type: "integer" } },
      { name: "outputformat", in: "query", required: false, description: "Output format.", schema: { type: "string", enum: ["json", "csv", "basic"] } }
    ]
  },
  {
    toolName: "pvgis_v5_3_tmy_get",
    method: "GET",
    path: "/tmy",
    operationId: "pvgis_v5_3_tmy_get",
    summary: "PVGIS Typical Meteorological Year",
    description: "Returns a typical meteorological year dataset from PVGIS 5.3.",
    tags: ["PVGIS 5.3"],
    parameters: [
      { name: "lat", in: "query", required: true, description: "Latitude in decimal degrees.", schema: { type: "number", minimum: -90, maximum: 90 } },
      { name: "lon", in: "query", required: true, description: "Longitude in decimal degrees.", schema: { type: "number", minimum: -180, maximum: 180 } },
      { name: "startyear", in: "query", required: false, description: "First year of the period.", schema: { type: "integer" } },
      { name: "endyear", in: "query", required: false, description: "Last year of the period.", schema: { type: "integer" } },
      { name: "usehorizon", in: "query", required: false, description: "Use horizon shadows: 1 yes, 0 no.", schema: { type: "integer", default: 1 } },
      { name: "outputformat", in: "query", required: false, description: "Output format.", schema: { type: "string", enum: ["json", "csv", "basic", "epw"] } }
    ]
  },
  {
    toolName: "pvgis_v5_3_mrcalc_get",
    method: "GET",
    path: "/MRcalc",
    operationId: "pvgis_v5_3_mrcalc_get",
    summary: "PVGIS monthly radiation calculation",
    description: "Returns monthly radiation data from PVGIS 5.3.",
    tags: ["PVGIS 5.3"],
    parameters: [
      { name: "lat", in: "query", required: true, description: "Latitude in decimal degrees.", schema: { type: "number", minimum: -90, maximum: 90 } },
      { name: "lon", in: "query", required: true, description: "Longitude in decimal degrees.", schema: { type: "number", minimum: -180, maximum: 180 } },
      { name: "horirrad", in: "query", required: false, description: "Horizontal irradiation flag.", schema: { type: "integer" } },
      { name: "optrad", in: "query", required: false, description: "Optimal angle irradiation flag.", schema: { type: "integer" } },
      { name: "selectrad", in: "query", required: false, description: "Selected angle irradiation flag.", schema: { type: "integer" } },
      { name: "angle", in: "query", required: false, description: "Panel slope angle in degrees.", schema: { type: "number" } },
      { name: "aspect", in: "query", required: false, description: "Panel azimuth/aspect in degrees.", schema: { type: "number" } },
      { name: "raddatabase", in: "query", required: false, description: "Radiation database.", schema: { type: "string" } },
      { name: "outputformat", in: "query", required: false, description: "Output format.", schema: { type: "string", enum: ["json", "csv", "basic"] } }
    ]
  },
  {
    toolName: "pvgis_v5_3_drcalc_get",
    method: "GET",
    path: "/DRcalc",
    operationId: "pvgis_v5_3_drcalc_get",
    summary: "PVGIS daily radiation calculation",
    description: "Returns daily radiation data from PVGIS 5.3 for a selected month.",
    tags: ["PVGIS 5.3"],
    parameters: [
      { name: "lat", in: "query", required: true, description: "Latitude in decimal degrees.", schema: { type: "number", minimum: -90, maximum: 90 } },
      { name: "lon", in: "query", required: true, description: "Longitude in decimal degrees.", schema: { type: "number", minimum: -180, maximum: 180 } },
      { name: "month", in: "query", required: true, description: "Month number 1-12.", schema: { type: "integer", minimum: 1, maximum: 12 } },
      { name: "global", in: "query", required: false, description: "Global irradiation flag.", schema: { type: "integer" } },
      { name: "clearsky", in: "query", required: false, description: "Clear-sky irradiation flag.", schema: { type: "integer" } },
      { name: "angle", in: "query", required: false, description: "Panel slope angle in degrees.", schema: { type: "number" } },
      { name: "aspect", in: "query", required: false, description: "Panel azimuth/aspect in degrees.", schema: { type: "number" } },
      { name: "raddatabase", in: "query", required: false, description: "Radiation database.", schema: { type: "string" } },
      { name: "outputformat", in: "query", required: false, description: "Output format.", schema: { type: "string", enum: ["json", "csv", "basic"] } }
    ]
  },
  {
    toolName: "pvgis_v5_3_shscalc_get",
    method: "GET",
    path: "/SHScalc",
    operationId: "pvgis_v5_3_shscalc_get",
    summary: "PVGIS stand-alone PV system calculation",
    description: "Calculates stand-alone PV system performance from PVGIS 5.3.",
    tags: ["PVGIS 5.3"],
    parameters: [
      { name: "lat", in: "query", required: true, description: "Latitude in decimal degrees.", schema: { type: "number", minimum: -90, maximum: 90 } },
      { name: "lon", in: "query", required: true, description: "Longitude in decimal degrees.", schema: { type: "number", minimum: -180, maximum: 180 } },
      { name: "peakpower", in: "query", required: true, description: "Nominal PV system power in Wp or kWp according to PVGIS API semantics.", schema: { type: "number" } },
      { name: "batterysize", in: "query", required: true, description: "Battery size.", schema: { type: "number" } },
      { name: "consumptionday", in: "query", required: true, description: "Daily consumption.", schema: { type: "number" } },
      { name: "cutoff", in: "query", required: false, description: "Battery cutoff percentage.", schema: { type: "number" } },
      { name: "angle", in: "query", required: false, description: "Panel slope angle in degrees.", schema: { type: "number" } },
      { name: "aspect", in: "query", required: false, description: "Panel azimuth/aspect in degrees.", schema: { type: "number" } },
      { name: "raddatabase", in: "query", required: false, description: "Radiation database.", schema: { type: "string" } },
      { name: "outputformat", in: "query", required: false, description: "Output format.", schema: { type: "string", enum: ["json", "csv", "basic"] } }
    ]
  },
  {
    toolName: "pvgis_v5_3_printhorizon_get",
    method: "GET",
    path: "/printhorizon",
    operationId: "pvgis_v5_3_printhorizon_get",
    summary: "PVGIS horizon profile",
    description: "Returns the PVGIS horizon profile for a point.",
    tags: ["PVGIS 5.3"],
    parameters: [
      { name: "lat", in: "query", required: true, description: "Latitude in decimal degrees.", schema: { type: "number", minimum: -90, maximum: 90 } },
      { name: "lon", in: "query", required: true, description: "Longitude in decimal degrees.", schema: { type: "number", minimum: -180, maximum: 180 } },
      { name: "userhorizon", in: "query", required: false, description: "Comma-separated custom horizon values.", schema: { type: "string" } },
      { name: "outputformat", in: "query", required: false, description: "Output format.", schema: { type: "string", enum: ["json", "csv", "basic"] } }
    ]
  }
] as const;
