# NASA POWER MCP 1:1 — Inventory

Total de OpenAPI JSONs: **12**  

Total de MCP tools geradas: **62**

| OpenAPI | API | Versão | Tools |
|---|---:|---:|---:|
| `daily-openapi.json` | Climate Projection API | v2.5.0-beta | 10 |
| `hourly-openapi.json` | POWER Hourly API | v2.9.3 | 2 |
| `indicators-openapi.json` | POWER Indicators API | v2.9.0 | 2 |
| `manager-openapi.json` | POWER Manager API | v2.9.0 | 6 |
| `pruve-openapi.json` | POWER PaRameter Uncertainty ViEwer (PRUVE) API | v2.7.0 | 13 |
| `resources-openapi.json` | POWER Resources API | v2.9.0 | 3 |
| `temporal-climatology-openapi.json` | POWER Climatology API | v2.9.4 | 3 |
| `temporal-daily-openapi.json` | POWER Daily API | v2.9.2 | 3 |
| `temporal-monthly-openapi.json` | POWER Monthly and Annual API | v2.9.4 | 3 |
| `toolkit-openapi.json` | POWER Toolkit API | v2.9.0 | 10 |
| `windrose-openapi.json` | POWER Wind Rose API | v2.9.0 | 3 |
| `zones-openapi.json` | POWER Zones API | v2.9.0 | 4 |

## Tools 1:1

| Tool | Method | Path | Source | Required inputs |
|---|---|---|---|---|
| `power_projection_daily_point_get` | `GET` | `/api/projection/daily/point` | `daily-openapi.json` | `start, end, latitude, longitude, community, parameters` |
| `power_projection_annual_point_get` | `GET` | `/api/projection/annual/point` | `daily-openapi.json` | `start, end, latitude, longitude, parameter` |
| `power_projection_climatology_comparison_get` | `GET` | `/api/projection/climatology/comparison` | `daily-openapi.json` | `period_one_start, period_one_end, period_two_start, period_two_end, latitude, longitude, parameter` |
| `power_projection_visualization_zones_get` | `GET` | `/api/projection/visualization/zones` | `daily-openapi.json` | `start, end, latitude, longitude, parameter` |
| `power_projection_visualization_line_get` | `GET` | `/api/projection/visualization/line` | `daily-openapi.json` | `start, end, latitude, longitude, parameter` |
| `power_projection_visualization_bar_get` | `GET` | `/api/projection/visualization/bar` | `daily-openapi.json` | `period_one_start, period_one_end, period_two_start, period_two_end, latitude, longitude, parameter` |
| `power_projection_utilities_sites_get` | `GET` | `/api/projection/utilities/sites` | `daily-openapi.json` | `—` |
| `power_projection_utilities_site_grids_get` | `GET` | `/api/projection/utilities/site-grids` | `daily-openapi.json` | `—` |
| `power_projection_utilities_nearest_site_get` | `GET` | `/api/projection/utilities/nearest-site` | `daily-openapi.json` | `latitude, longitude` |
| `power_projection_daily_configuration_get` | `GET` | `/api/projection/daily/configuration` | `daily-openapi.json` | `—` |
| `power_temporal_hourly_point_get` | `GET` | `/api/temporal/hourly/point` | `hourly-openapi.json` | `start, end, latitude, longitude, community, parameters` |
| `power_temporal_hourly_configuration_get` | `GET` | `/api/temporal/hourly/configuration` | `hourly-openapi.json` | `—` |
| `power_application_indicators_point_get` | `GET` | `/api/application/indicators/point` | `indicators-openapi.json` | `latitude, longitude` |
| `power_application_indicators_configuration_get` | `GET` | `/api/application/indicators/configuration` | `indicators-openapi.json` | `—` |
| `power_system_manager_parameters_get` | `GET` | `/api/system/manager/parameters` | `manager-openapi.json` | `community, temporal` |
| `power_system_manager_parameters_parameter_get` | `GET` | `/api/system/manager/parameters/{parameter}` | `manager-openapi.json` | `parameter` |
| `power_system_manager_surface_get` | `GET` | `/api/system/manager/surface` | `manager-openapi.json` | `—` |
| `power_system_manager_surface_alias_get` | `GET` | `/api/system/manager/surface/{alias}` | `manager-openapi.json` | `alias` |
| `power_system_manager_system_groupings_get` | `GET` | `/api/system/manager/system/groupings` | `manager-openapi.json` | `—` |
| `power_system_manager_configuration_get` | `GET` | `/api/system/manager/configuration` | `manager-openapi.json` | `—` |
| `power_pruve_statistics_descriptive_get` | `GET` | `/api/pruve/statistics/descriptive` | `pruve-openapi.json` | `temporal, parameter, start, end, latitude, longitude` |
| `power_pruve_statistics_validation_get` | `GET` | `/api/pruve/statistics/validation` | `pruve-openapi.json` | `temporal, parameter, start, end, latitude, longitude` |
| `power_pruve_statistics_comparative_get` | `GET` | `/api/pruve/statistics/comparative` | `pruve-openapi.json` | `start, end, temporal, source-y, parameter-y, latitude-y, longitude-y, source-x, parameter-x, latitude-x, longitude-x` |
| `power_pruve_plot_heatmap_get` | `GET` | `/api/pruve/plot/heatmap` | `pruve-openapi.json` | `temporal, parameter, start, end, latitude, longitude` |
| `power_pruve_plot_variable_get` | `GET` | `/api/pruve/plot/variable` | `pruve-openapi.json` | `temporal, parameter, start, end, latitude, longitude` |
| `power_pruve_plot_trend_get` | `GET` | `/api/pruve/plot/trend` | `pruve-openapi.json` | `temporal, parameter, start, end, latitude, longitude` |
| `power_pruve_plot_anomalies_get` | `GET` | `/api/pruve/plot/anomalies` | `pruve-openapi.json` | `temporal, parameter, start, end, latitude, longitude` |
| `power_pruve_utilities_sites_get` | `GET` | `/api/pruve/utilities/sites` | `pruve-openapi.json` | `—` |
| `power_pruve_utilities_parameters_get` | `GET` | `/api/pruve/utilities/parameters` | `pruve-openapi.json` | `—` |
| `power_pruve_utilities_metadata_get` | `GET` | `/api/pruve/utilities/metadata` | `pruve-openapi.json` | `—` |
| `power_pruve_utilities_comparative_precheck_get` | `GET` | `/api/pruve/utilities/comparative-precheck` | `pruve-openapi.json` | `start, end, temporal, source-y, parameter-y, latitude-y, longitude-y, source-x, parameter-x, latitude-x, longitude-x` |
| `power_pruve_utilities_examples_get` | `GET` | `/api/pruve/utilities/examples` | `pruve-openapi.json` | `—` |
| `power_pruve_configuration_get` | `GET` | `/api/pruve/configuration` | `pruve-openapi.json` | `—` |
| `power_system_resources_content_get` | `GET` | `/api/system/resources/content` | `resources-openapi.json` | `name` |
| `power_system_resources_dashboard_availability_get` | `GET` | `/api/system/resources/dashboard/availability` | `resources-openapi.json` | `—` |
| `power_system_resources_configuration_get` | `GET` | `/api/system/resources/configuration` | `resources-openapi.json` | `—` |
| `power_temporal_climatology_point_get` | `GET` | `/api/temporal/climatology/point` | `temporal-climatology-openapi.json` | `latitude, longitude, community, parameters` |
| `power_temporal_climatology_regional_get` | `GET` | `/api/temporal/climatology/regional` | `temporal-climatology-openapi.json` | `latitude-min, latitude-max, longitude-min, longitude-max, community, parameters` |
| `power_temporal_climatology_configuration_get` | `GET` | `/api/temporal/climatology/configuration` | `temporal-climatology-openapi.json` | `—` |
| `power_temporal_daily_point_get` | `GET` | `/api/temporal/daily/point` | `temporal-daily-openapi.json` | `start, end, latitude, longitude, community, parameters` |
| `power_temporal_daily_regional_get` | `GET` | `/api/temporal/daily/regional` | `temporal-daily-openapi.json` | `start, end, latitude-min, latitude-max, longitude-min, longitude-max, community, parameters` |
| `power_temporal_daily_configuration_get` | `GET` | `/api/temporal/daily/configuration` | `temporal-daily-openapi.json` | `—` |
| `power_temporal_monthly_point_get` | `GET` | `/api/temporal/monthly/point` | `temporal-monthly-openapi.json` | `start, end, latitude, longitude, community, parameters` |
| `power_temporal_monthly_regional_get` | `GET` | `/api/temporal/monthly/regional` | `temporal-monthly-openapi.json` | `start, end, latitude-min, latitude-max, longitude-min, longitude-max, community, parameters` |
| `power_temporal_monthly_configuration_get` | `GET` | `/api/temporal/monthly/configuration` | `temporal-monthly-openapi.json` | `—` |
| `power_toolkit_power_visualizations_heatmaps_get` | `GET` | `/api/toolkit/power/visualizations/heatmaps` | `toolkit-openapi.json` | `start, end, latitude, longitude, parameter, community` |
| `power_toolkit_power_visualizations_variables_get` | `GET` | `/api/toolkit/power/visualizations/variables` | `toolkit-openapi.json` | `start, end, latitude, longitude, parameter, community` |
| `power_toolkit_power_visualizations_trend_get` | `GET` | `/api/toolkit/power/visualizations/trend` | `toolkit-openapi.json` | `start, end, latitude, longitude, parameter, community` |
| `power_toolkit_power_visualizations_anomalies_get` | `GET` | `/api/toolkit/power/visualizations/anomalies` | `toolkit-openapi.json` | `start, end, latitude, longitude, parameter, community` |
| `power_toolkit_power_visualizations_cycles_get` | `GET` | `/api/toolkit/power/visualizations/cycles` | `toolkit-openapi.json` | `start, end, latitude, longitude, parameter, community` |
| `power_toolkit_power_visualizations_zones_get` | `GET` | `/api/toolkit/power/visualizations/zones` | `toolkit-openapi.json` | `start, end, latitude, longitude` |
| `power_toolkit_power_visualizations_histograms_get` | `GET` | `/api/toolkit/power/visualizations/histograms` | `toolkit-openapi.json` | `start, end, latitude, longitude, parameter, community` |
| `power_toolkit_power_visualizations_gardening_get` | `GET` | `/api/toolkit/power/visualizations/gardening` | `toolkit-openapi.json` | `start, end, latitude, longitude` |
| `power_toolkit_psychrometric_report_get` | `GET` | `/api/toolkit/psychrometric/report` | `toolkit-openapi.json` | `latitude, longitude` |
| `power_toolkit_configuration_get` | `GET` | `/api/toolkit/configuration` | `toolkit-openapi.json` | `—` |
| `power_application_windrose_point_get` | `GET` | `/api/application/windrose/point` | `windrose-openapi.json` | `start, end, latitude, longitude` |
| `power_application_windrose_plot_get` | `GET` | `/api/application/windrose/plot` | `windrose-openapi.json` | `start, end, latitude, longitude` |
| `power_application_windrose_configuration_get` | `GET` | `/api/application/windrose/configuration` | `windrose-openapi.json` | `—` |
| `power_application_zones_point_get` | `GET` | `/api/application/zones/point` | `zones-openapi.json` | `start, end, latitude, longitude` |
| `power_application_zones_regional_get` | `GET` | `/api/application/zones/regional` | `zones-openapi.json` | `start, end, latitude-min, latitude-max, longitude-min, longitude-max` |
| `power_application_zones_global_get` | `GET` | `/api/application/zones/global` | `zones-openapi.json` | `start, end` |
| `power_application_zones_configuration_get` | `GET` | `/api/application/zones/configuration` | `zones-openapi.json` | `—` |
