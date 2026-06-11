/* Auto-generated from NASA POWER OpenAPI JSON files. Do not edit by hand. */
export const operations = [
  {
    "toolName": "power_projection_daily_point_get",
    "sourceFile": "daily-openapi.json",
    "apiTitle": "Climate Projection API",
    "apiVersion": "v2.5.0-beta",
    "method": "GET",
    "path": "/api/projection/daily/point",
    "operationId": "daily_single_point_data_request_api_projection_daily_point_get",
    "summary": "Single Point Data Request",
    "description": "This endpoint returns a single point time series based Analysis Ready Data (ARD).\n\n- This endpoint selects the closet location to the requested input latitude and longitude from the source projects grid.",
    "parameters": [
      {
        "name": "start",
        "in": "query",
        "required": true,
        "description": "This is the start time for the data request formatted as YYYYMMDD.",
        "schema": {
          "type": "integer"
        }
      },
      {
        "name": "end",
        "in": "query",
        "required": true,
        "description": "This is the end time for the data request formatted as YYYYMMDD.",
        "schema": {
          "type": "integer"
        }
      },
      {
        "name": "latitude",
        "in": "query",
        "required": true,
        "description": "This is the point latitude value.",
        "schema": {
          "type": "number"
        }
      },
      {
        "name": "longitude",
        "in": "query",
        "required": true,
        "description": "This is the point longitude value.",
        "schema": {
          "type": "number"
        }
      },
      {
        "name": "community",
        "in": "query",
        "required": true,
        "description": "The user community to return units for.",
        "schema": {
          "type": "string",
          "enum": [
            "ag",
            "sb",
            "re"
          ]
        }
      },
      {
        "name": "parameters",
        "in": "query",
        "required": true,
        "description": "A comma delimited list of the parameter abbreviations.",
        "schema": {
          "type": "string"
        }
      },
      {
        "name": "format",
        "in": "query",
        "required": false,
        "description": "The response objects output format.",
        "schema": {
          "type": "string",
          "enum": [
            "csv",
            "json",
            "ascii",
            "netcdf",
            "icasa",
            "xarray"
          ]
        }
      },
      {
        "name": "user",
        "in": "query",
        "required": false,
        "description": "A user name for identification purposes.",
        "schema": {
          "type": "string"
        }
      },
      {
        "name": "header",
        "in": "query",
        "required": false,
        "description": "To show or hide the header files of CSV and ASCII formats.",
        "schema": {
          "type": "boolean",
          "default": true
        }
      },
      {
        "name": "time-standard",
        "in": "query",
        "required": false,
        "description": "The time standard to return timestamps for.",
        "schema": {
          "type": "string",
          "enum": [
            "lst",
            "utc"
          ],
          "default": "utc"
        }
      },
      {
        "name": "model",
        "in": "query",
        "required": false,
        "description": "The model run for CMIP.",
        "schema": {
          "type": "string",
          "enum": [
            "ensemble",
            "cmcc_esm2",
            "cnrm_esm2_1",
            "fgoals_g3",
            "inm_cm5_0",
            "mri_esm2_0",
            "noresm2_lm"
          ],
          "default": "ensemble"
        }
      },
      {
        "name": "scenario",
        "in": "query",
        "required": false,
        "description": "The scenario run for CMIP.",
        "schema": {
          "type": "string",
          "enum": [
            "ssp126",
            "ssp245",
            "ssp370"
          ],
          "default": "ssp126"
        }
      }
    ]
  },
  {
    "toolName": "power_projection_annual_point_get",
    "sourceFile": "daily-openapi.json",
    "apiTitle": "Climate Projection API",
    "apiVersion": "v2.5.0-beta",
    "method": "GET",
    "path": "/api/projection/annual/point",
    "operationId": "annual_single_point_data_request_api_projection_annual_point_get",
    "summary": "Single Point Data Request (Annual)",
    "description": "This endpoint returns an annual single point time series based on Analysis Ready Data (ARD).\n\n- This endpoint selects the closet location to the requested input latitude and longitude from the source projects grid.",
    "parameters": [
      {
        "name": "start",
        "in": "query",
        "required": true,
        "description": "This is the start time for the data request formatted as YYYY.",
        "schema": {
          "type": "integer"
        }
      },
      {
        "name": "end",
        "in": "query",
        "required": true,
        "description": "This is the end time for the data request formatted as YYYY.",
        "schema": {
          "type": "integer"
        }
      },
      {
        "name": "latitude",
        "in": "query",
        "required": true,
        "description": "This is the point latitude value.",
        "schema": {
          "type": "number"
        }
      },
      {
        "name": "longitude",
        "in": "query",
        "required": true,
        "description": "This is the point longitude value.",
        "schema": {
          "type": "number"
        }
      },
      {
        "name": "parameter",
        "in": "query",
        "required": true,
        "description": "A comma delimited list of the parameter abbreviations.",
        "schema": {
          "type": "string",
          "enum": [
            "cdd10",
            "hdd18_3",
            "t2m",
            "t2m_min",
            "t2m_max",
            "ws10m",
            "allsky_sfc_sw_dwn",
            "allsky_sfc_lw_dwn",
            "qv2m",
            "rh2m",
            "prectotcorr",
            "t2m_dew",
            "tmax_days_35c",
            "tmax_days_90th",
            "tmax_days_95th",
            "tmax_days_99th",
            "hottest_tmax",
            "max_dtr",
            "tmin_tropnights_20c",
            "tmin_frostdays_0c",
            "coldest_tmin",
            "prec_days_dry",
            "prec_days_oneinch",
            "prec_days_90th",
            "prec_days_95th",
            "prec_days_99th",
            "tmax_annave",
            "tmin_annave",
            "prec_annave",
            "evapotranspiration",
            "particulate_matter",
            "drought_days",
            "flooding_days",
            "d0",
            "d1",
            "d2",
            "d3",
            "d4",
            "f0",
            "f1",
            "f2",
            "f3",
            "f4",
            "temperature_change",
            "precipitation_change",
            "t_zone",
            "tm_zone"
          ]
        }
      },
      {
        "name": "temperature_units",
        "in": "query",
        "required": false,
        "description": "This is the units (C or F) for temperature parameters.",
        "schema": {
          "type": "string",
          "enum": [
            "c",
            "f"
          ],
          "default": "c"
        }
      },
      {
        "name": "format",
        "in": "query",
        "required": false,
        "description": "The response objects output format.",
        "schema": {
          "type": "string",
          "enum": [
            "csv",
            "json",
            "ascii",
            "netcdf",
            "icasa",
            "xarray"
          ]
        }
      },
      {
        "name": "user",
        "in": "query",
        "required": false,
        "description": "A user name for identification purposes.",
        "schema": {
          "type": "string"
        }
      },
      {
        "name": "header",
        "in": "query",
        "required": false,
        "description": "To show or hide the header files of CSV and ASCII formats.",
        "schema": {
          "type": "boolean",
          "default": true
        }
      }
    ]
  },
  {
    "toolName": "power_projection_climatology_comparison_get",
    "sourceFile": "daily-openapi.json",
    "apiTitle": "Climate Projection API",
    "apiVersion": "v2.5.0-beta",
    "method": "GET",
    "path": "/api/projection/climatology/comparison",
    "operationId": "climatology_comparison_request_api_projection_climatology_comparison_get",
    "summary": "Bar Plot Visualization Request",
    "description": "This endpoint returns a climate projection difference comparison from Analysis Ready Data (ARD).\n\n- This endpoint selects the closet location to the requested input latitude and longitude from the source projects grid.",
    "parameters": [
      {
        "name": "period_one_start",
        "in": "query",
        "required": true,
        "description": "This is the start time for the data request formatted as YYYY.",
        "schema": {
          "type": "integer"
        }
      },
      {
        "name": "period_one_end",
        "in": "query",
        "required": true,
        "description": "This is the end time for the data request formatted as YYYY.",
        "schema": {
          "type": "integer"
        }
      },
      {
        "name": "period_two_start",
        "in": "query",
        "required": true,
        "description": "This is the start time for the data request formatted as YYYY.",
        "schema": {
          "type": "integer"
        }
      },
      {
        "name": "period_two_end",
        "in": "query",
        "required": true,
        "description": "This is the end time for the data request formatted as YYYY.",
        "schema": {
          "type": "integer"
        }
      },
      {
        "name": "latitude",
        "in": "query",
        "required": true,
        "description": "This is the point latitude value.",
        "schema": {
          "type": "number"
        }
      },
      {
        "name": "longitude",
        "in": "query",
        "required": true,
        "description": "This is the point longitude value.",
        "schema": {
          "type": "number"
        }
      },
      {
        "name": "parameter",
        "in": "query",
        "required": true,
        "description": "The parameter abbreviation to plot.",
        "schema": {
          "type": "string",
          "enum": [
            "cdd10",
            "hdd18_3"
          ]
        }
      },
      {
        "name": "format",
        "in": "query",
        "required": false,
        "description": "The response objects output format.",
        "schema": {
          "type": "string",
          "enum": [
            "csv",
            "json",
            "ascii",
            "xarray"
          ]
        }
      },
      {
        "name": "user",
        "in": "query",
        "required": false,
        "description": "A user name for identification purposes.",
        "schema": {
          "type": "string"
        }
      },
      {
        "name": "header",
        "in": "query",
        "required": false,
        "description": "To show or hide the header files of CSV and ASCII formats.",
        "schema": {
          "type": "boolean",
          "default": true
        }
      }
    ]
  },
  {
    "toolName": "power_projection_visualization_zones_get",
    "sourceFile": "daily-openapi.json",
    "apiTitle": "Climate Projection API",
    "apiVersion": "v2.5.0-beta",
    "method": "GET",
    "path": "/api/projection/visualization/zones",
    "operationId": "visualization_request_zones_api_projection_visualization_zones_get",
    "summary": "Thermal Zones Visualization Request",
    "description": "This endpoint returns a thermal zones visualization from Analysis Ready Data (ARD).\n\n- This endpoint selects the closet location to the requested input latitude and longitude from the source projects grid.",
    "parameters": [
      {
        "name": "start",
        "in": "query",
        "required": true,
        "description": "This is the start time for the data request formatted as YYYY.",
        "schema": {
          "type": "integer"
        }
      },
      {
        "name": "end",
        "in": "query",
        "required": true,
        "description": "This is the end time for the data request formatted as YYYY.",
        "schema": {
          "type": "integer"
        }
      },
      {
        "name": "latitude",
        "in": "query",
        "required": true,
        "description": "This is the point latitude value.",
        "schema": {
          "type": "number"
        }
      },
      {
        "name": "longitude",
        "in": "query",
        "required": true,
        "description": "This is the point longitude value.",
        "schema": {
          "type": "number"
        }
      },
      {
        "name": "parameter",
        "in": "query",
        "required": true,
        "description": "The parameter abbreviation to plot.",
        "schema": {
          "type": "string",
          "enum": [
            "t_zone",
            "tm_zone"
          ]
        }
      },
      {
        "name": "format",
        "in": "query",
        "required": false,
        "description": "The response objects output format.",
        "schema": {
          "type": "string",
          "enum": [
            "json",
            "html"
          ],
          "default": "html"
        }
      },
      {
        "name": "user",
        "in": "query",
        "required": false,
        "description": "A user name for identification purposes.",
        "schema": {
          "type": "string"
        }
      },
      {
        "name": "theme",
        "in": "query",
        "required": false,
        "description": "The color theme for the output objects.",
        "schema": {
          "type": "string",
          "enum": [
            "light",
            "dark"
          ],
          "default": "light"
        }
      }
    ]
  },
  {
    "toolName": "power_projection_visualization_line_get",
    "sourceFile": "daily-openapi.json",
    "apiTitle": "Climate Projection API",
    "apiVersion": "v2.5.0-beta",
    "method": "GET",
    "path": "/api/projection/visualization/line",
    "operationId": "visualization_request_line_api_projection_visualization_line_get",
    "summary": "Line Plot Visualization Request",
    "description": "This endpoint returns a climate projection line visualization from Analysis Ready Data (ARD)..\n\n- This endpoint selects the closet location to the requested input latitude and longitude from the source projects grid.",
    "parameters": [
      {
        "name": "start",
        "in": "query",
        "required": true,
        "description": "This is the start time for the data request formatted as YYYY.",
        "schema": {
          "type": "integer"
        }
      },
      {
        "name": "end",
        "in": "query",
        "required": true,
        "description": "This is the end time for the data request formatted as YYYY.",
        "schema": {
          "type": "integer"
        }
      },
      {
        "name": "latitude",
        "in": "query",
        "required": true,
        "description": "This is the point latitude value.",
        "schema": {
          "type": "number"
        }
      },
      {
        "name": "longitude",
        "in": "query",
        "required": true,
        "description": "This is the point longitude value.",
        "schema": {
          "type": "number"
        }
      },
      {
        "name": "parameter",
        "in": "query",
        "required": true,
        "description": "The parameter abbreviation to plot.",
        "schema": {
          "type": "string",
          "enum": [
            "cdd10",
            "hdd18_3",
            "tmax_days_35c",
            "tmax_days_90th",
            "tmax_days_95th",
            "tmax_days_99th",
            "hottest_tmax",
            "max_dtr",
            "tmin_tropnights_20c",
            "tmin_frostdays_0c",
            "coldest_tmin",
            "prec_days_dry",
            "prec_days_oneinch",
            "prec_days_90th",
            "prec_days_95th",
            "prec_days_99th",
            "tmax_annave",
            "tmin_annave",
            "prec_annave",
            "evapotranspiration",
            "particulate_matter",
            "drought_days",
            "flooding_days",
            "d0",
            "d1",
            "d2",
            "d3",
            "d4",
            "f0",
            "f1",
            "f2",
            "f3",
            "f4",
            "temperature_change",
            "precipitation_change"
          ]
        }
      },
      {
        "name": "format",
        "in": "query",
        "required": false,
        "description": "The response objects output format.",
        "schema": {
          "type": "string",
          "enum": [
            "json",
            "html"
          ],
          "default": "html"
        }
      },
      {
        "name": "temperature_units",
        "in": "query",
        "required": false,
        "description": "This is the units (C or F) for temperature parameters.",
        "schema": {
          "type": "string",
          "enum": [
            "c",
            "f"
          ],
          "default": "c"
        }
      },
      {
        "name": "user",
        "in": "query",
        "required": false,
        "description": "A user name for identification purposes.",
        "schema": {
          "type": "string"
        }
      },
      {
        "name": "theme",
        "in": "query",
        "required": false,
        "description": "The color theme for the output objects.",
        "schema": {
          "type": "string",
          "enum": [
            "light",
            "dark"
          ],
          "default": "light"
        }
      }
    ]
  },
  {
    "toolName": "power_projection_visualization_bar_get",
    "sourceFile": "daily-openapi.json",
    "apiTitle": "Climate Projection API",
    "apiVersion": "v2.5.0-beta",
    "method": "GET",
    "path": "/api/projection/visualization/bar",
    "operationId": "visualization_request_bar_api_projection_visualization_bar_get",
    "summary": "Bar Plot Visualization Request",
    "description": "This endpoint returns a climate projection bar difference visualization from Analysis Ready Data (ARD).\n\n- This endpoint selects the closet location to the requested input latitude and longitude from the source projects grid.",
    "parameters": [
      {
        "name": "period_one_start",
        "in": "query",
        "required": true,
        "description": "This is the start time for the data request formatted as YYYY.",
        "schema": {
          "type": "integer"
        }
      },
      {
        "name": "period_one_end",
        "in": "query",
        "required": true,
        "description": "This is the end time for the data request formatted as YYYY.",
        "schema": {
          "type": "integer"
        }
      },
      {
        "name": "period_two_start",
        "in": "query",
        "required": true,
        "description": "This is the start time for the data request formatted as YYYY.",
        "schema": {
          "type": "integer"
        }
      },
      {
        "name": "period_two_end",
        "in": "query",
        "required": true,
        "description": "This is the end time for the data request formatted as YYYY.",
        "schema": {
          "type": "integer"
        }
      },
      {
        "name": "latitude",
        "in": "query",
        "required": true,
        "description": "This is the point latitude value.",
        "schema": {
          "type": "number"
        }
      },
      {
        "name": "longitude",
        "in": "query",
        "required": true,
        "description": "This is the point longitude value.",
        "schema": {
          "type": "number"
        }
      },
      {
        "name": "parameter",
        "in": "query",
        "required": true,
        "description": "The parameter abbreviation to plot.",
        "schema": {
          "type": "string",
          "enum": [
            "cdd10",
            "hdd18_3",
            "tmax_days_35c",
            "tmax_days_90th",
            "tmax_days_95th",
            "tmax_days_99th",
            "hottest_tmax",
            "max_dtr",
            "tmin_tropnights_20c",
            "tmin_frostdays_0c",
            "coldest_tmin",
            "prec_days_dry",
            "prec_days_oneinch",
            "prec_days_90th",
            "prec_days_95th",
            "prec_days_99th",
            "tmax_annave",
            "tmin_annave",
            "prec_annave",
            "evapotranspiration",
            "particulate_matter",
            "drought_days",
            "flooding_days",
            "d0",
            "d1",
            "d2",
            "d3",
            "d4",
            "f0",
            "f1",
            "f2",
            "f3",
            "f4",
            "temperature_change",
            "precipitation_change"
          ]
        }
      },
      {
        "name": "format",
        "in": "query",
        "required": false,
        "description": "The response objects output format.",
        "schema": {
          "type": "string",
          "enum": [
            "json",
            "html"
          ],
          "default": "html"
        }
      },
      {
        "name": "user",
        "in": "query",
        "required": false,
        "description": "A user name for identification purposes.",
        "schema": {
          "type": "string"
        }
      },
      {
        "name": "theme",
        "in": "query",
        "required": false,
        "description": "The color theme for the output objects.",
        "schema": {
          "type": "string",
          "enum": [
            "light",
            "dark"
          ],
          "default": "light"
        }
      }
    ]
  },
  {
    "toolName": "power_projection_utilities_sites_get",
    "sourceFile": "daily-openapi.json",
    "apiTitle": "Climate Projection API",
    "apiVersion": "v2.5.0-beta",
    "method": "GET",
    "path": "/api/projection/utilities/sites",
    "operationId": "create_sites_api_projection_utilities_sites_get",
    "summary": "Creates a geojson of site information.",
    "description": "This endpoint returns a geojson of site information.",
    "parameters": []
  },
  {
    "toolName": "power_projection_utilities_site_grids_get",
    "sourceFile": "daily-openapi.json",
    "apiTitle": "Climate Projection API",
    "apiVersion": "v2.5.0-beta",
    "method": "GET",
    "path": "/api/projection/utilities/site-grids",
    "operationId": "create_site_grids_api_projection_utilities_site_grids_get",
    "summary": "Creates a geojson of NEX-GDDP grid cells around sites.",
    "description": "This endpoint returns a geojson of NEX-GDDP grid cell and site-tagged information.",
    "parameters": []
  },
  {
    "toolName": "power_projection_utilities_nearest_site_get",
    "sourceFile": "daily-openapi.json",
    "apiTitle": "Climate Projection API",
    "apiVersion": "v2.5.0-beta",
    "method": "GET",
    "path": "/api/projection/utilities/nearest-site",
    "operationId": "nearest_site_api_projection_utilities_nearest_site_get",
    "summary": "Creates a geojson object for the nearest NASA site to a given location.",
    "description": "This endpoint returns a geojson of the nearest NASA site to a given location based on coordinates.",
    "parameters": [
      {
        "name": "latitude",
        "in": "query",
        "required": true,
        "description": "This is the point latitude value.",
        "schema": {
          "type": "number"
        }
      },
      {
        "name": "longitude",
        "in": "query",
        "required": true,
        "description": "This is the point longitude value.",
        "schema": {
          "type": "number"
        }
      }
    ]
  },
  {
    "toolName": "power_projection_daily_configuration_get",
    "sourceFile": "daily-openapi.json",
    "apiTitle": "Climate Projection API",
    "apiVersion": "v2.5.0-beta",
    "method": "GET",
    "path": "/api/projection/daily/configuration",
    "operationId": "configuration_settings_request_api_projection_daily_configuration_get",
    "summary": "Configuration Settings Request",
    "description": "This endpoint returns configuration settings of the microservice.\n\n- This includes the available data formats, time range, and more.",
    "parameters": []
  },
  {
    "toolName": "power_temporal_hourly_point_get",
    "sourceFile": "hourly-openapi.json",
    "apiTitle": "POWER Hourly API",
    "apiVersion": "v2.9.3",
    "method": "GET",
    "path": "/api/temporal/hourly/point",
    "operationId": "single_point_data_request_api_temporal_hourly_point_get",
    "summary": "Single Point Data Request",
    "description": "",
    "parameters": [
      {
        "name": "start",
        "in": "query",
        "required": true,
        "description": "This is the start time for the data request formatted as YYYYMMDD.",
        "schema": {
          "type": "integer"
        }
      },
      {
        "name": "end",
        "in": "query",
        "required": true,
        "description": "This is the end time for the data request formatted as YYYYMMDD.",
        "schema": {
          "type": "integer"
        }
      },
      {
        "name": "latitude",
        "in": "query",
        "required": true,
        "description": "This is the point latitude value.",
        "schema": {
          "type": "number"
        }
      },
      {
        "name": "longitude",
        "in": "query",
        "required": true,
        "description": "This is the point longitude value.",
        "schema": {
          "type": "number"
        }
      },
      {
        "name": "community",
        "in": "query",
        "required": true,
        "description": "The user community to return units for.",
        "schema": {
          "type": "string",
          "enum": [
            "ag",
            "sb",
            "re"
          ]
        }
      },
      {
        "name": "parameters",
        "in": "query",
        "required": true,
        "description": "A comma delimited list of the parameter abbreviations.",
        "schema": {
          "type": "string"
        }
      },
      {
        "name": "format",
        "in": "query",
        "required": false,
        "description": "The response objects output format.",
        "schema": {
          "type": "string",
          "enum": [
            "csv",
            "json",
            "ascii",
            "netcdf",
            "epw",
            "epw_csv",
            "xarray",
            "sam",
            "srw"
          ]
        }
      },
      {
        "name": "units",
        "in": "query",
        "required": false,
        "description": "The type of units, metric or imperial.",
        "schema": {
          "type": "string",
          "enum": [
            "imperial",
            "metric"
          ],
          "default": "metric"
        }
      },
      {
        "name": "user",
        "in": "query",
        "required": false,
        "description": "A user name for identification purposes.",
        "schema": {
          "type": "string"
        }
      },
      {
        "name": "header",
        "in": "query",
        "required": false,
        "description": "To show or hide the header files of CSV and ASCII formats.",
        "schema": {
          "type": "boolean",
          "default": true
        }
      },
      {
        "name": "time-standard",
        "in": "query",
        "required": false,
        "description": "The time standard to return timestamps for.",
        "schema": {
          "type": "string",
          "enum": [
            "lst",
            "utc"
          ],
          "default": "lst"
        }
      },
      {
        "name": "site-elevation",
        "in": "query",
        "required": false,
        "description": "The custom site elevation in meters to produce the corrected atmospheric pressure adjusted for elevation.",
        "schema": {
          "type": "number"
        }
      },
      {
        "name": "wind-elevation",
        "in": "query",
        "required": false,
        "description": "The custom wind elevation in meters to produce the wind speed adjusted for elevation.",
        "schema": {
          "type": "number"
        }
      },
      {
        "name": "wind-surface",
        "in": "query",
        "required": false,
        "description": "The definable surface type to adjusted the wind speed.",
        "schema": {
          "type": "string"
        }
      }
    ]
  },
  {
    "toolName": "power_temporal_hourly_configuration_get",
    "sourceFile": "hourly-openapi.json",
    "apiTitle": "POWER Hourly API",
    "apiVersion": "v2.9.3",
    "method": "GET",
    "path": "/api/temporal/hourly/configuration",
    "operationId": "configuration_settings_request_api_temporal_hourly_configuration_get",
    "summary": "Configuration Settings Request",
    "description": "",
    "parameters": []
  },
  {
    "toolName": "power_application_indicators_point_get",
    "sourceFile": "indicators-openapi.json",
    "apiTitle": "POWER Indicators API",
    "apiVersion": "v2.9.0",
    "method": "GET",
    "path": "/api/application/indicators/point",
    "operationId": "single_point_data_request_api_application_indicators_point_get",
    "summary": "Single Point Data Request",
    "description": "This endpoint returns a single point time series based Analysis Ready Data (ARD) response of solar and/or meteorological data derived from multiple NASA\"s Earth Science Division (ESD) projects.\n\n- This endpoint selects the closet location to the requested input latitude and longitude from the source projects grid.",
    "parameters": [
      {
        "name": "start",
        "in": "query",
        "required": false,
        "description": "This is the start time for the data request formatted as YYYY.",
        "schema": {
          "type": "integer",
          "default": 2001
        }
      },
      {
        "name": "end",
        "in": "query",
        "required": false,
        "description": "This is the end time for the data request formatted as YYYY.",
        "schema": {
          "type": "integer",
          "default": 2020
        }
      },
      {
        "name": "latitude",
        "in": "query",
        "required": true,
        "description": "This is the point latitude value.",
        "schema": {
          "type": "number"
        }
      },
      {
        "name": "longitude",
        "in": "query",
        "required": true,
        "description": "This is the point longitude value.",
        "schema": {
          "type": "number"
        }
      },
      {
        "name": "units",
        "in": "query",
        "required": false,
        "description": "A user name for identification purposes.",
        "schema": {
          "type": "string",
          "enum": [
            "imperial",
            "metric"
          ],
          "default": "metric"
        }
      },
      {
        "name": "format",
        "in": "query",
        "required": false,
        "description": "The response objects output format.",
        "schema": {
          "type": "string"
        }
      },
      {
        "name": "user",
        "in": "query",
        "required": false,
        "description": "A user name for identification purposes.",
        "schema": {
          "type": "string"
        }
      }
    ]
  },
  {
    "toolName": "power_application_indicators_configuration_get",
    "sourceFile": "indicators-openapi.json",
    "apiTitle": "POWER Indicators API",
    "apiVersion": "v2.9.0",
    "method": "GET",
    "path": "/api/application/indicators/configuration",
    "operationId": "configuration_settings_request_api_application_indicators_configuration_get",
    "summary": "Configuration Settings Request",
    "description": "This endpoint returns configuration settings of the microservice.\n\n- This includes the available data formats, time range, and more.",
    "parameters": []
  },
  {
    "toolName": "power_system_manager_parameters_get",
    "sourceFile": "manager-openapi.json",
    "apiTitle": "POWER Manager API",
    "apiVersion": "v2.9.0",
    "method": "GET",
    "path": "/api/system/manager/parameters",
    "operationId": "parameter_query_api_system_manager_parameters_get",
    "summary": "Parameter Query",
    "description": "To fetch a given parameters\\'s temporal and community specific attribute information please include the temporal level and community.",
    "parameters": [
      {
        "name": "parameters",
        "in": "query",
        "required": false,
        "description": "The parameter abbreviations.",
        "schema": {
          "type": "string"
        }
      },
      {
        "name": "community",
        "in": "query",
        "required": true,
        "description": "The parameter's user community.",
        "schema": {
          "type": "string",
          "enum": [
            "ag",
            "sb",
            "re"
          ]
        }
      },
      {
        "name": "temporal",
        "in": "query",
        "required": true,
        "description": "The parameter's temporal level.",
        "schema": {
          "type": "string",
          "enum": [
            "hourly",
            "daily",
            "monthly",
            "climatology"
          ]
        }
      },
      {
        "name": "metadata",
        "in": "query",
        "required": false,
        "description": "To show or hide the extra parameter metadata information.",
        "schema": {
          "type": "boolean",
          "default": false
        }
      }
    ]
  },
  {
    "toolName": "power_system_manager_parameters_parameter_get",
    "sourceFile": "manager-openapi.json",
    "apiTitle": "POWER Manager API",
    "apiVersion": "v2.9.0",
    "method": "GET",
    "path": "/api/system/manager/parameters/{parameter}",
    "operationId": "parameter_attributes_overview_api_system_manager_parameters__parameter__get",
    "summary": "Parameter Attributes Overview",
    "description": "To fetch a given parameters\\'s complete attribute information please include the parameter.",
    "parameters": [
      {
        "name": "parameter",
        "in": "path",
        "required": true,
        "description": "",
        "schema": {
          "type": "string"
        }
      }
    ]
  },
  {
    "toolName": "power_system_manager_surface_get",
    "sourceFile": "manager-openapi.json",
    "apiTitle": "POWER Manager API",
    "apiVersion": "v2.9.0",
    "method": "GET",
    "path": "/api/system/manager/surface",
    "operationId": "surface_list_api_system_manager_surface_get",
    "summary": "Surface Alias List",
    "description": "List all wind elevation surface alias and attribute information.",
    "parameters": []
  },
  {
    "toolName": "power_system_manager_surface_alias_get",
    "sourceFile": "manager-openapi.json",
    "apiTitle": "POWER Manager API",
    "apiVersion": "v2.9.0",
    "method": "GET",
    "path": "/api/system/manager/surface/{alias}",
    "operationId": "surface_attributes_api_system_manager_surface__alias__get",
    "summary": "Surface Alias Query",
    "description": "To fetch a given wind elevation surface alias\\'s complete attribute information please include the surface alias.",
    "parameters": [
      {
        "name": "alias",
        "in": "path",
        "required": true,
        "description": "",
        "schema": {
          "type": "string"
        }
      }
    ]
  },
  {
    "toolName": "power_system_manager_system_groupings_get",
    "sourceFile": "manager-openapi.json",
    "apiTitle": "POWER Manager API",
    "apiVersion": "v2.9.0",
    "method": "GET",
    "path": "/api/system/manager/system/groupings",
    "operationId": "groupings_list_api_system_manager_system_groupings_get",
    "summary": "Parameters Groupings",
    "description": "List all parameters groupings and attribute information.",
    "parameters": []
  },
  {
    "toolName": "power_system_manager_configuration_get",
    "sourceFile": "manager-openapi.json",
    "apiTitle": "POWER Manager API",
    "apiVersion": "v2.9.0",
    "method": "GET",
    "path": "/api/system/manager/configuration",
    "operationId": "configuration_settings_request_api_system_manager_configuration_get",
    "summary": "Configuration Settings Request",
    "description": "This endpoint returns configuration settings of the microservice.\n\n- This includes the available data formats, time range, and more.",
    "parameters": []
  },
  {
    "toolName": "power_pruve_statistics_descriptive_get",
    "sourceFile": "pruve-openapi.json",
    "apiTitle": "POWER PaRameter Uncertainty ViEwer (PRUVE) API",
    "apiVersion": "v2.7.0",
    "method": "GET",
    "path": "/api/pruve/statistics/descriptive",
    "operationId": "create_descriptive_statistics_api_pruve_statistics_descriptive_get",
    "summary": "Computes the descriptive statistics for a point location.",
    "description": "This endpoint returns the POWER standard statistics response for a point location.\n\n- This endpoint selects the closet location to the requested input latitude and longitude from the source projects grid.",
    "parameters": [
      {
        "name": "temporal",
        "in": "query",
        "required": true,
        "description": "The level of the source data.",
        "schema": {
          "type": "string",
          "enum": [
            "hourly",
            "daily"
          ]
        }
      },
      {
        "name": "parameter",
        "in": "query",
        "required": true,
        "description": "A parameter abbreviation.",
        "schema": {
          "type": "string",
          "enum": [
            "t2m",
            "t2m_min",
            "t2m_max",
            "t2mdew",
            "ps",
            "prectotcorr",
            "ws10m",
            "ws10m_max",
            "wd10m",
            "allsky_sfc_sw_dirh",
            "allsky_sfc_sw_diff",
            "allsky_sfc_lw_dwn",
            "allsky_sfc_sw_dwn",
            "allsky_sfc_sw_dni",
            "aod_84",
            "aod_55",
            "pw"
          ]
        }
      },
      {
        "name": "start",
        "in": "query",
        "required": true,
        "description": "This is the start time for the data request.",
        "schema": {
          "type": "string",
          "format": "date"
        }
      },
      {
        "name": "end",
        "in": "query",
        "required": true,
        "description": "This is the end time for the data request.",
        "schema": {
          "type": "string",
          "format": "date"
        }
      },
      {
        "name": "latitude",
        "in": "query",
        "required": true,
        "description": "This is the point latitude value.",
        "schema": {
          "type": "number",
          "minimum": -90,
          "maximum": 90
        }
      },
      {
        "name": "longitude",
        "in": "query",
        "required": true,
        "description": "This is the point longitude value.",
        "schema": {
          "type": "number",
          "minimum": -180,
          "maximum": 180
        }
      },
      {
        "name": "time-standard",
        "in": "query",
        "required": false,
        "description": "The time standard of the source data.",
        "schema": {
          "type": "string",
          "enum": [
            "utc"
          ],
          "default": "utc"
        }
      },
      {
        "name": "units",
        "in": "query",
        "required": false,
        "description": "The override for default units.",
        "schema": {
          "type": "string",
          "enum": [
            "imperial",
            "metric"
          ],
          "default": "metric"
        }
      },
      {
        "name": "format",
        "in": "query",
        "required": false,
        "description": "The response objects output format.",
        "schema": {
          "type": "string",
          "enum": [
            "json",
            "html"
          ],
          "default": "json"
        }
      },
      {
        "name": "user",
        "in": "query",
        "required": false,
        "description": "A user name for identification purposes.",
        "schema": {
          "type": "string",
          "maxLength": 15
        }
      },
      {
        "name": "theme",
        "in": "query",
        "required": false,
        "description": "The color theme for the output objects.",
        "schema": {
          "type": "string",
          "enum": [
            "light",
            "dark"
          ],
          "default": "light"
        }
      },
      {
        "name": "compact",
        "in": "query",
        "required": false,
        "description": "Enable gzip compression for JSON responses. Reduces response size by ~90%% for large payloads. Browsers automatically decompress.",
        "schema": {
          "type": "boolean",
          "default": false
        }
      }
    ]
  },
  {
    "toolName": "power_pruve_statistics_validation_get",
    "sourceFile": "pruve-openapi.json",
    "apiTitle": "POWER PaRameter Uncertainty ViEwer (PRUVE) API",
    "apiVersion": "v2.7.0",
    "method": "GET",
    "path": "/api/pruve/statistics/validation",
    "operationId": "create_validation_statistics_api_pruve_statistics_validation_get",
    "summary": "Create Validation Statistics",
    "description": "This endpoint returns the POWER standard statistics response for a validation of the nearest POWER data with the nearest available surface site.",
    "parameters": [
      {
        "name": "temporal",
        "in": "query",
        "required": true,
        "description": "The level of the source data.",
        "schema": {
          "type": "string",
          "enum": [
            "hourly",
            "daily"
          ]
        }
      },
      {
        "name": "parameter",
        "in": "query",
        "required": true,
        "description": "A parameter abbreviation.",
        "schema": {
          "type": "string",
          "enum": [
            "t2m",
            "t2m_min",
            "t2m_max",
            "t2mdew",
            "ps",
            "prectotcorr",
            "ws10m",
            "ws10m_max",
            "wd10m",
            "allsky_sfc_sw_dirh",
            "allsky_sfc_sw_diff",
            "allsky_sfc_lw_dwn",
            "allsky_sfc_sw_dwn",
            "allsky_sfc_sw_dni",
            "aod_84",
            "aod_55",
            "pw"
          ]
        }
      },
      {
        "name": "start",
        "in": "query",
        "required": true,
        "description": "This is the start time for the data request.",
        "schema": {
          "type": "string",
          "format": "date"
        }
      },
      {
        "name": "end",
        "in": "query",
        "required": true,
        "description": "This is the end time for the data request.",
        "schema": {
          "type": "string",
          "format": "date"
        }
      },
      {
        "name": "latitude",
        "in": "query",
        "required": true,
        "description": "This is the point latitude value.",
        "schema": {
          "type": "number",
          "minimum": -90,
          "maximum": 90
        }
      },
      {
        "name": "longitude",
        "in": "query",
        "required": true,
        "description": "This is the point longitude value.",
        "schema": {
          "type": "number",
          "minimum": -180,
          "maximum": 180
        }
      },
      {
        "name": "time-standard",
        "in": "query",
        "required": false,
        "description": "The time standard of the source data.",
        "schema": {
          "type": "string",
          "enum": [
            "utc"
          ],
          "default": "utc"
        }
      },
      {
        "name": "units",
        "in": "query",
        "required": false,
        "description": "The override for default units.",
        "schema": {
          "type": "string",
          "enum": [
            "imperial",
            "metric"
          ],
          "default": "metric"
        }
      },
      {
        "name": "format",
        "in": "query",
        "required": false,
        "description": "The response objects output format.",
        "schema": {
          "type": "string",
          "enum": [
            "json",
            "html"
          ],
          "default": "json"
        }
      },
      {
        "name": "user",
        "in": "query",
        "required": false,
        "description": "A user name for identification purposes.",
        "schema": {
          "type": "string",
          "maxLength": 15
        }
      },
      {
        "name": "theme",
        "in": "query",
        "required": false,
        "description": "The color theme for the output objects.",
        "schema": {
          "type": "string",
          "enum": [
            "light",
            "dark"
          ],
          "default": "light"
        }
      },
      {
        "name": "compact",
        "in": "query",
        "required": false,
        "description": "Enable gzip compression for JSON responses. Reduces response size by ~90%% for large payloads. Browsers automatically decompress.",
        "schema": {
          "type": "boolean",
          "default": false
        }
      }
    ]
  },
  {
    "toolName": "power_pruve_statistics_comparative_get",
    "sourceFile": "pruve-openapi.json",
    "apiTitle": "POWER PaRameter Uncertainty ViEwer (PRUVE) API",
    "apiVersion": "v2.7.0",
    "method": "GET",
    "path": "/api/pruve/statistics/comparative",
    "operationId": "create_comparative_statistics_api_pruve_statistics_comparative_get",
    "summary": "Computes the advanced comparative statistics for two different sources for two point locations.",
    "description": "This endpoint returns the POWER standard statistics response for a comparison of point locations.\n\n- This endpoint selects the closet location to the requested input latitude and longitude from the source projects grid.",
    "parameters": [
      {
        "name": "start",
        "in": "query",
        "required": true,
        "description": "This is the start time for the data request.",
        "schema": {
          "type": "string",
          "format": "date-time"
        }
      },
      {
        "name": "end",
        "in": "query",
        "required": true,
        "description": "This is the end time for the data request.",
        "schema": {
          "type": "string",
          "format": "date-time"
        }
      },
      {
        "name": "temporal",
        "in": "query",
        "required": true,
        "description": "The level of the source data.",
        "schema": {
          "type": "string",
          "enum": [
            "hourly",
            "daily"
          ]
        }
      },
      {
        "name": "time-standard",
        "in": "query",
        "required": false,
        "description": "The time standard of the source data.",
        "schema": {
          "type": "string",
          "enum": [
            "utc"
          ],
          "default": "utc"
        }
      },
      {
        "name": "source-y",
        "in": "query",
        "required": true,
        "description": "The source data for the y-axis",
        "schema": {
          "type": "string",
          "enum": [
            "power",
            "noaa",
            "bsrn",
            "aeronet"
          ]
        }
      },
      {
        "name": "parameter-y",
        "in": "query",
        "required": true,
        "description": "A parameter abbreviation for the y-axis.",
        "schema": {
          "type": "string",
          "enum": [
            "t2m",
            "t2m_min",
            "t2m_max",
            "t2mdew",
            "ps",
            "prectotcorr",
            "ws10m",
            "ws10m_max",
            "wd10m",
            "allsky_sfc_sw_dirh",
            "allsky_sfc_sw_diff",
            "allsky_sfc_lw_dwn",
            "allsky_sfc_sw_dwn",
            "allsky_sfc_sw_dni",
            "aod_84",
            "aod_55",
            "pw"
          ]
        }
      },
      {
        "name": "latitude-y",
        "in": "query",
        "required": true,
        "description": "This is the point latitude value for the y-axis.",
        "schema": {
          "type": "number",
          "minimum": -90,
          "maximum": 90
        }
      },
      {
        "name": "longitude-y",
        "in": "query",
        "required": true,
        "description": "This is the point longitude value for the y-axis.",
        "schema": {
          "type": "number",
          "minimum": -180,
          "maximum": 180
        }
      },
      {
        "name": "source-x",
        "in": "query",
        "required": true,
        "description": "The source data for the x-axis.",
        "schema": {
          "type": "string",
          "enum": [
            "power",
            "noaa",
            "bsrn",
            "aeronet"
          ]
        }
      },
      {
        "name": "parameter-x",
        "in": "query",
        "required": true,
        "description": "A parameter abbreviation for the x-axis.",
        "schema": {
          "type": "string",
          "enum": [
            "t2m",
            "t2m_min",
            "t2m_max",
            "t2mdew",
            "ps",
            "prectotcorr",
            "ws10m",
            "ws10m_max",
            "wd10m",
            "allsky_sfc_sw_dirh",
            "allsky_sfc_sw_diff",
            "allsky_sfc_lw_dwn",
            "allsky_sfc_sw_dwn",
            "allsky_sfc_sw_dni",
            "aod_84",
            "aod_55",
            "pw"
          ]
        }
      },
      {
        "name": "latitude-x",
        "in": "query",
        "required": true,
        "description": "This is the point latitude value for the x-axis.",
        "schema": {
          "type": "number",
          "minimum": -90,
          "maximum": 90
        }
      },
      {
        "name": "longitude-x",
        "in": "query",
        "required": true,
        "description": "This is the point longitude value for the x-axis.",
        "schema": {
          "type": "number",
          "minimum": -180,
          "maximum": 180
        }
      },
      {
        "name": "format",
        "in": "query",
        "required": false,
        "description": "The response objects output format.",
        "schema": {
          "type": "string",
          "enum": [
            "json",
            "html"
          ],
          "default": "json"
        }
      },
      {
        "name": "user",
        "in": "query",
        "required": false,
        "description": "A user name for identification purposes.",
        "schema": {
          "type": "string",
          "maxLength": 15
        }
      },
      {
        "name": "theme",
        "in": "query",
        "required": false,
        "description": "The color theme for the output objects.",
        "schema": {
          "type": "string",
          "enum": [
            "light",
            "dark"
          ],
          "default": "light"
        }
      },
      {
        "name": "units",
        "in": "query",
        "required": false,
        "description": "The override for default units.",
        "schema": {
          "type": "string",
          "enum": [
            "imperial",
            "metric"
          ],
          "default": "metric"
        }
      },
      {
        "name": "compact",
        "in": "query",
        "required": false,
        "description": "Enable gzip compression for JSON responses. Reduces response size by ~90%% for large payloads. Browsers automatically decompress.",
        "schema": {
          "type": "boolean",
          "default": false
        }
      }
    ]
  },
  {
    "toolName": "power_pruve_plot_heatmap_get",
    "sourceFile": "pruve-openapi.json",
    "apiTitle": "POWER PaRameter Uncertainty ViEwer (PRUVE) API",
    "apiVersion": "v2.7.0",
    "method": "GET",
    "path": "/api/pruve/plot/heatmap",
    "operationId": "create_heatmap_visualization_api_pruve_plot_heatmap_get",
    "summary": "Creates a single point heatmap.",
    "description": "This endpoint returns a single point heatmap based on Analysis Ready Data (ARD) from solar or meteorological data derived from multiple NASA Earth Science Division (ESD) projects.\n\n- This endpoint selects the closet location to the requested input latitude and longitude from the source projects grid.",
    "parameters": [
      {
        "name": "operation",
        "in": "query",
        "required": false,
        "description": "The operation to represent the heatmap.",
        "schema": {
          "type": "string",
          "enum": [
            "climatological-days",
            "monthly"
          ],
          "default": "climatological-days"
        }
      },
      {
        "name": "temporal",
        "in": "query",
        "required": true,
        "description": "The level of the source data.",
        "schema": {
          "type": "string",
          "enum": [
            "hourly",
            "daily"
          ]
        }
      },
      {
        "name": "parameter",
        "in": "query",
        "required": true,
        "description": "A parameter abbreviation.",
        "schema": {
          "type": "string",
          "enum": [
            "t2m",
            "t2m_min",
            "t2m_max",
            "t2mdew",
            "ps",
            "prectotcorr",
            "ws10m",
            "ws10m_max",
            "wd10m",
            "allsky_sfc_sw_dirh",
            "allsky_sfc_sw_diff",
            "allsky_sfc_lw_dwn",
            "allsky_sfc_sw_dwn",
            "allsky_sfc_sw_dni",
            "aod_84",
            "aod_55",
            "pw"
          ]
        }
      },
      {
        "name": "start",
        "in": "query",
        "required": true,
        "description": "This is the start time for the data request.",
        "schema": {
          "type": "string",
          "format": "date"
        }
      },
      {
        "name": "end",
        "in": "query",
        "required": true,
        "description": "This is the end time for the data request.",
        "schema": {
          "type": "string",
          "format": "date"
        }
      },
      {
        "name": "latitude",
        "in": "query",
        "required": true,
        "description": "This is the point latitude value.",
        "schema": {
          "type": "number",
          "minimum": -90,
          "maximum": 90
        }
      },
      {
        "name": "longitude",
        "in": "query",
        "required": true,
        "description": "This is the point longitude value.",
        "schema": {
          "type": "number",
          "minimum": -180,
          "maximum": 180
        }
      },
      {
        "name": "time-standard",
        "in": "query",
        "required": false,
        "description": "The time standard of the source data.",
        "schema": {
          "type": "string",
          "enum": [
            "utc"
          ],
          "default": "utc"
        }
      },
      {
        "name": "units",
        "in": "query",
        "required": false,
        "description": "The override for default units.",
        "schema": {
          "type": "string",
          "enum": [
            "imperial",
            "metric"
          ],
          "default": "metric"
        }
      },
      {
        "name": "format",
        "in": "query",
        "required": false,
        "description": "The response objects output format.",
        "schema": {
          "type": "string",
          "enum": [
            "json",
            "html"
          ],
          "default": "json"
        }
      },
      {
        "name": "user",
        "in": "query",
        "required": false,
        "description": "A user name for identification purposes.",
        "schema": {
          "type": "string",
          "maxLength": 15
        }
      },
      {
        "name": "theme",
        "in": "query",
        "required": false,
        "description": "The color theme for the output objects.",
        "schema": {
          "type": "string",
          "enum": [
            "light",
            "dark"
          ],
          "default": "light"
        }
      },
      {
        "name": "compact",
        "in": "query",
        "required": false,
        "description": "Enable gzip compression for JSON responses. Reduces response size by ~90%% for large payloads. Browsers automatically decompress.",
        "schema": {
          "type": "boolean",
          "default": false
        }
      }
    ]
  },
  {
    "toolName": "power_pruve_plot_variable_get",
    "sourceFile": "pruve-openapi.json",
    "apiTitle": "POWER PaRameter Uncertainty ViEwer (PRUVE) API",
    "apiVersion": "v2.7.0",
    "method": "GET",
    "path": "/api/pruve/plot/variable",
    "operationId": "create_variable_visualization_api_pruve_plot_variable_get",
    "summary": "Creates a single point time series plot.",
    "description": "This endpoint returns a single point time series plot based on Analysis Ready Data (ARD) from solar or meteorological data derived from multiple NASA Earth Science Division (ESD) projects.\n\n- This endpoint selects the closet location to the requested input latitude and longitude from the source projects grid.",
    "parameters": [
      {
        "name": "temporal",
        "in": "query",
        "required": true,
        "description": "The level of the source data.",
        "schema": {
          "type": "string",
          "enum": [
            "hourly",
            "daily"
          ]
        }
      },
      {
        "name": "parameter",
        "in": "query",
        "required": true,
        "description": "A parameter abbreviation.",
        "schema": {
          "type": "string",
          "enum": [
            "t2m",
            "t2m_min",
            "t2m_max",
            "t2mdew",
            "ps",
            "prectotcorr",
            "ws10m",
            "ws10m_max",
            "wd10m",
            "allsky_sfc_sw_dirh",
            "allsky_sfc_sw_diff",
            "allsky_sfc_lw_dwn",
            "allsky_sfc_sw_dwn",
            "allsky_sfc_sw_dni",
            "aod_84",
            "aod_55",
            "pw"
          ]
        }
      },
      {
        "name": "start",
        "in": "query",
        "required": true,
        "description": "This is the start time for the data request.",
        "schema": {
          "type": "string",
          "format": "date"
        }
      },
      {
        "name": "end",
        "in": "query",
        "required": true,
        "description": "This is the end time for the data request.",
        "schema": {
          "type": "string",
          "format": "date"
        }
      },
      {
        "name": "latitude",
        "in": "query",
        "required": true,
        "description": "This is the point latitude value.",
        "schema": {
          "type": "number",
          "minimum": -90,
          "maximum": 90
        }
      },
      {
        "name": "longitude",
        "in": "query",
        "required": true,
        "description": "This is the point longitude value.",
        "schema": {
          "type": "number",
          "minimum": -180,
          "maximum": 180
        }
      },
      {
        "name": "time-standard",
        "in": "query",
        "required": false,
        "description": "The time standard of the source data.",
        "schema": {
          "type": "string",
          "enum": [
            "utc"
          ],
          "default": "utc"
        }
      },
      {
        "name": "units",
        "in": "query",
        "required": false,
        "description": "The override for default units.",
        "schema": {
          "type": "string",
          "enum": [
            "imperial",
            "metric"
          ],
          "default": "metric"
        }
      },
      {
        "name": "format",
        "in": "query",
        "required": false,
        "description": "The response objects output format.",
        "schema": {
          "type": "string",
          "enum": [
            "json",
            "html"
          ],
          "default": "json"
        }
      },
      {
        "name": "user",
        "in": "query",
        "required": false,
        "description": "A user name for identification purposes.",
        "schema": {
          "type": "string",
          "maxLength": 15
        }
      },
      {
        "name": "theme",
        "in": "query",
        "required": false,
        "description": "The color theme for the output objects.",
        "schema": {
          "type": "string",
          "enum": [
            "light",
            "dark"
          ],
          "default": "light"
        }
      },
      {
        "name": "compact",
        "in": "query",
        "required": false,
        "description": "Enable gzip compression for JSON responses. Reduces response size by ~90%% for large payloads. Browsers automatically decompress.",
        "schema": {
          "type": "boolean",
          "default": false
        }
      }
    ]
  },
  {
    "toolName": "power_pruve_plot_trend_get",
    "sourceFile": "pruve-openapi.json",
    "apiTitle": "POWER PaRameter Uncertainty ViEwer (PRUVE) API",
    "apiVersion": "v2.7.0",
    "method": "GET",
    "path": "/api/pruve/plot/trend",
    "operationId": "create_trend_visualization_api_pruve_plot_trend_get",
    "summary": "Creates a single point trend plot.",
    "description": "This endpoint returns a single point annual trend plot based on Analysis Ready Data (ARD) from solar or meteorological data derived from multiple NASA Earth Science Division (ESD) projects.\n\n- This endpoint selects the closet location to the requested input latitude and longitude from the source projects grid.",
    "parameters": [
      {
        "name": "temporal",
        "in": "query",
        "required": true,
        "description": "The level of the source data.",
        "schema": {
          "type": "string",
          "enum": [
            "hourly",
            "daily"
          ]
        }
      },
      {
        "name": "parameter",
        "in": "query",
        "required": true,
        "description": "A parameter abbreviation.",
        "schema": {
          "type": "string",
          "enum": [
            "t2m",
            "t2m_min",
            "t2m_max",
            "t2mdew",
            "ps",
            "prectotcorr",
            "ws10m",
            "ws10m_max",
            "wd10m",
            "allsky_sfc_sw_dirh",
            "allsky_sfc_sw_diff",
            "allsky_sfc_lw_dwn",
            "allsky_sfc_sw_dwn",
            "allsky_sfc_sw_dni",
            "aod_84",
            "aod_55",
            "pw"
          ]
        }
      },
      {
        "name": "start",
        "in": "query",
        "required": true,
        "description": "This is the start time for the data request.",
        "schema": {
          "type": "string",
          "format": "date"
        }
      },
      {
        "name": "end",
        "in": "query",
        "required": true,
        "description": "This is the end time for the data request.",
        "schema": {
          "type": "string",
          "format": "date"
        }
      },
      {
        "name": "latitude",
        "in": "query",
        "required": true,
        "description": "This is the point latitude value.",
        "schema": {
          "type": "number",
          "minimum": -90,
          "maximum": 90
        }
      },
      {
        "name": "longitude",
        "in": "query",
        "required": true,
        "description": "This is the point longitude value.",
        "schema": {
          "type": "number",
          "minimum": -180,
          "maximum": 180
        }
      },
      {
        "name": "time-standard",
        "in": "query",
        "required": false,
        "description": "The time standard of the source data.",
        "schema": {
          "type": "string",
          "enum": [
            "utc"
          ],
          "default": "utc"
        }
      },
      {
        "name": "units",
        "in": "query",
        "required": false,
        "description": "The override for default units.",
        "schema": {
          "type": "string",
          "enum": [
            "imperial",
            "metric"
          ],
          "default": "metric"
        }
      },
      {
        "name": "format",
        "in": "query",
        "required": false,
        "description": "The response objects output format.",
        "schema": {
          "type": "string",
          "enum": [
            "json",
            "html"
          ],
          "default": "json"
        }
      },
      {
        "name": "user",
        "in": "query",
        "required": false,
        "description": "A user name for identification purposes.",
        "schema": {
          "type": "string",
          "maxLength": 15
        }
      },
      {
        "name": "theme",
        "in": "query",
        "required": false,
        "description": "The color theme for the output objects.",
        "schema": {
          "type": "string",
          "enum": [
            "light",
            "dark"
          ],
          "default": "light"
        }
      },
      {
        "name": "compact",
        "in": "query",
        "required": false,
        "description": "Enable gzip compression for JSON responses. Reduces response size by ~90%% for large payloads. Browsers automatically decompress.",
        "schema": {
          "type": "boolean",
          "default": false
        }
      }
    ]
  },
  {
    "toolName": "power_pruve_plot_anomalies_get",
    "sourceFile": "pruve-openapi.json",
    "apiTitle": "POWER PaRameter Uncertainty ViEwer (PRUVE) API",
    "apiVersion": "v2.7.0",
    "method": "GET",
    "path": "/api/pruve/plot/anomalies",
    "operationId": "create_anomalies_visualization_api_pruve_plot_anomalies_get",
    "summary": "Creates a single point anomalies plot.",
    "description": "This endpoint returns a single point anomalies plot based on Analysis Ready Data (ARD) from solar or meteorological data derived from multiple NASA Earth Science Division (ESD) projects.\n\n- This endpoint selects the closet location to the requested input latitude and longitude from the source projects grid.",
    "parameters": [
      {
        "name": "month",
        "in": "query",
        "required": false,
        "description": "This is the month number.",
        "schema": {
          "type": "integer",
          "default": 0,
          "minimum": 0,
          "maximum": 12
        }
      },
      {
        "name": "temporal",
        "in": "query",
        "required": true,
        "description": "The level of the source data.",
        "schema": {
          "type": "string",
          "enum": [
            "hourly",
            "daily"
          ]
        }
      },
      {
        "name": "parameter",
        "in": "query",
        "required": true,
        "description": "A parameter abbreviation.",
        "schema": {
          "type": "string",
          "enum": [
            "t2m",
            "t2m_min",
            "t2m_max",
            "t2mdew",
            "ps",
            "prectotcorr",
            "ws10m",
            "ws10m_max",
            "wd10m",
            "allsky_sfc_sw_dirh",
            "allsky_sfc_sw_diff",
            "allsky_sfc_lw_dwn",
            "allsky_sfc_sw_dwn",
            "allsky_sfc_sw_dni",
            "aod_84",
            "aod_55",
            "pw"
          ]
        }
      },
      {
        "name": "start",
        "in": "query",
        "required": true,
        "description": "This is the start time for the data request.",
        "schema": {
          "type": "string",
          "format": "date"
        }
      },
      {
        "name": "end",
        "in": "query",
        "required": true,
        "description": "This is the end time for the data request.",
        "schema": {
          "type": "string",
          "format": "date"
        }
      },
      {
        "name": "latitude",
        "in": "query",
        "required": true,
        "description": "This is the point latitude value.",
        "schema": {
          "type": "number",
          "minimum": -90,
          "maximum": 90
        }
      },
      {
        "name": "longitude",
        "in": "query",
        "required": true,
        "description": "This is the point longitude value.",
        "schema": {
          "type": "number",
          "minimum": -180,
          "maximum": 180
        }
      },
      {
        "name": "time-standard",
        "in": "query",
        "required": false,
        "description": "The time standard of the source data.",
        "schema": {
          "type": "string",
          "enum": [
            "utc"
          ],
          "default": "utc"
        }
      },
      {
        "name": "units",
        "in": "query",
        "required": false,
        "description": "The override for default units.",
        "schema": {
          "type": "string",
          "enum": [
            "imperial",
            "metric"
          ],
          "default": "metric"
        }
      },
      {
        "name": "format",
        "in": "query",
        "required": false,
        "description": "The response objects output format.",
        "schema": {
          "type": "string",
          "enum": [
            "json",
            "html"
          ],
          "default": "json"
        }
      },
      {
        "name": "user",
        "in": "query",
        "required": false,
        "description": "A user name for identification purposes.",
        "schema": {
          "type": "string",
          "maxLength": 15
        }
      },
      {
        "name": "theme",
        "in": "query",
        "required": false,
        "description": "The color theme for the output objects.",
        "schema": {
          "type": "string",
          "enum": [
            "light",
            "dark"
          ],
          "default": "light"
        }
      },
      {
        "name": "compact",
        "in": "query",
        "required": false,
        "description": "Enable gzip compression for JSON responses. Reduces response size by ~90%% for large payloads. Browsers automatically decompress.",
        "schema": {
          "type": "boolean",
          "default": false
        }
      }
    ]
  },
  {
    "toolName": "power_pruve_utilities_sites_get",
    "sourceFile": "pruve-openapi.json",
    "apiTitle": "POWER PaRameter Uncertainty ViEwer (PRUVE) API",
    "apiVersion": "v2.7.0",
    "method": "GET",
    "path": "/api/pruve/utilities/sites",
    "operationId": "create_sites_information_api_pruve_utilities_sites_get",
    "summary": "Creates a geojson of site information.",
    "description": "This endpoint returns a GeoJSON feature collection of sites for a named source, which can be filtered by date.",
    "parameters": [
      {
        "name": "temporal",
        "in": "query",
        "required": false,
        "description": "The level of the source data.",
        "schema": {
          "type": "any"
        }
      },
      {
        "name": "parameter",
        "in": "query",
        "required": false,
        "description": "A parameter abbreviation.",
        "schema": {
          "type": "any"
        }
      },
      {
        "name": "source",
        "in": "query",
        "required": false,
        "description": "The source data location to display.",
        "schema": {
          "type": "any"
        }
      },
      {
        "name": "available",
        "in": "query",
        "required": false,
        "description": "Is the site currently available.",
        "schema": {
          "type": "boolean"
        }
      },
      {
        "name": "start",
        "in": "query",
        "required": false,
        "description": "This is the start time for the data request.",
        "schema": {
          "type": "any"
        }
      },
      {
        "name": "end",
        "in": "query",
        "required": false,
        "description": "This is the end time for the data request.",
        "schema": {
          "type": "any"
        }
      }
    ]
  },
  {
    "toolName": "power_pruve_utilities_parameters_get",
    "sourceFile": "pruve-openapi.json",
    "apiTitle": "POWER PaRameter Uncertainty ViEwer (PRUVE) API",
    "apiVersion": "v2.7.0",
    "method": "GET",
    "path": "/api/pruve/utilities/parameters",
    "operationId": "manager_parameters_api_pruve_utilities_parameters_get",
    "summary": "Manager Parameters",
    "description": "Provides data parameters.",
    "parameters": []
  },
  {
    "toolName": "power_pruve_utilities_metadata_get",
    "sourceFile": "pruve-openapi.json",
    "apiTitle": "POWER PaRameter Uncertainty ViEwer (PRUVE) API",
    "apiVersion": "v2.7.0",
    "method": "GET",
    "path": "/api/pruve/utilities/metadata",
    "operationId": "manager_metadata_api_pruve_utilities_metadata_get",
    "summary": "Manager Metadata",
    "description": "Provides metadata.",
    "parameters": []
  },
  {
    "toolName": "power_pruve_utilities_comparative_precheck_get",
    "sourceFile": "pruve-openapi.json",
    "apiTitle": "POWER PaRameter Uncertainty ViEwer (PRUVE) API",
    "apiVersion": "v2.7.0",
    "method": "GET",
    "path": "/api/pruve/utilities/comparative-precheck",
    "operationId": "comparison_distance_precheck_api_pruve_utilities_comparative_precheck_get",
    "summary": "Calculates distance between POWER data point and a surface site.",
    "description": "This endpoint calculates the distance between a power data point and a surface site from an external source and is used in warning the users whether their validation is wise or not.",
    "parameters": [
      {
        "name": "start",
        "in": "query",
        "required": true,
        "description": "This is the start time for the data request.",
        "schema": {
          "type": "string",
          "format": "date-time"
        }
      },
      {
        "name": "end",
        "in": "query",
        "required": true,
        "description": "This is the end time for the data request.",
        "schema": {
          "type": "string",
          "format": "date-time"
        }
      },
      {
        "name": "temporal",
        "in": "query",
        "required": true,
        "description": "The level of the source data.",
        "schema": {
          "type": "string",
          "enum": [
            "hourly",
            "daily"
          ]
        }
      },
      {
        "name": "source-y",
        "in": "query",
        "required": true,
        "description": "The source data for the y-axis",
        "schema": {
          "type": "string",
          "enum": [
            "power",
            "noaa",
            "bsrn",
            "aeronet"
          ]
        }
      },
      {
        "name": "parameter-y",
        "in": "query",
        "required": true,
        "description": "A parameter abbreviation for the y-axis.",
        "schema": {
          "type": "string",
          "enum": [
            "t2m",
            "t2m_min",
            "t2m_max",
            "t2mdew",
            "ps",
            "prectotcorr",
            "ws10m",
            "ws10m_max",
            "wd10m",
            "allsky_sfc_sw_dirh",
            "allsky_sfc_sw_diff",
            "allsky_sfc_lw_dwn",
            "allsky_sfc_sw_dwn",
            "allsky_sfc_sw_dni",
            "aod_84",
            "aod_55",
            "pw"
          ]
        }
      },
      {
        "name": "latitude-y",
        "in": "query",
        "required": true,
        "description": "This is the point latitude value for the y-axis.",
        "schema": {
          "type": "number",
          "minimum": -90,
          "maximum": 90
        }
      },
      {
        "name": "longitude-y",
        "in": "query",
        "required": true,
        "description": "This is the point longitude value for the y-axis.",
        "schema": {
          "type": "number",
          "minimum": -180,
          "maximum": 180
        }
      },
      {
        "name": "source-x",
        "in": "query",
        "required": true,
        "description": "The source data for the x-axis.",
        "schema": {
          "type": "string",
          "enum": [
            "power",
            "noaa",
            "bsrn",
            "aeronet"
          ]
        }
      },
      {
        "name": "parameter-x",
        "in": "query",
        "required": true,
        "description": "A parameter abbreviation for the x-axis.",
        "schema": {
          "type": "string",
          "enum": [
            "t2m",
            "t2m_min",
            "t2m_max",
            "t2mdew",
            "ps",
            "prectotcorr",
            "ws10m",
            "ws10m_max",
            "wd10m",
            "allsky_sfc_sw_dirh",
            "allsky_sfc_sw_diff",
            "allsky_sfc_lw_dwn",
            "allsky_sfc_sw_dwn",
            "allsky_sfc_sw_dni",
            "aod_84",
            "aod_55",
            "pw"
          ]
        }
      },
      {
        "name": "latitude-x",
        "in": "query",
        "required": true,
        "description": "This is the point latitude value for the x-axis.",
        "schema": {
          "type": "number",
          "minimum": -90,
          "maximum": 90
        }
      },
      {
        "name": "longitude-x",
        "in": "query",
        "required": true,
        "description": "This is the point longitude value for the x-axis.",
        "schema": {
          "type": "number",
          "minimum": -180,
          "maximum": 180
        }
      },
      {
        "name": "user",
        "in": "query",
        "required": false,
        "description": "A user name for identification purposes.",
        "schema": {
          "type": "string",
          "maxLength": 15
        }
      },
      {
        "name": "units",
        "in": "query",
        "required": false,
        "description": "The override for default units.",
        "schema": {
          "type": "string",
          "enum": [
            "imperial",
            "metric"
          ],
          "default": "metric"
        }
      }
    ]
  },
  {
    "toolName": "power_pruve_utilities_examples_get",
    "sourceFile": "pruve-openapi.json",
    "apiTitle": "POWER PaRameter Uncertainty ViEwer (PRUVE) API",
    "apiVersion": "v2.7.0",
    "method": "GET",
    "path": "/api/pruve/utilities/examples",
    "operationId": "make_examples_plots_api_pruve_utilities_examples_get",
    "summary": "Make Examples Plots",
    "description": "Provides plot examples.",
    "parameters": [
      {
        "name": "format",
        "in": "query",
        "required": false,
        "description": "The response objects output format.",
        "schema": {
          "type": "string",
          "enum": [
            "json",
            "html"
          ],
          "default": "json"
        }
      },
      {
        "name": "user",
        "in": "query",
        "required": false,
        "description": "A user name for identification purposes.",
        "schema": {
          "type": "string",
          "maxLength": 15
        }
      },
      {
        "name": "theme",
        "in": "query",
        "required": false,
        "description": "The color theme for the output objects.",
        "schema": {
          "type": "string",
          "enum": [
            "light",
            "dark"
          ],
          "default": "light"
        }
      }
    ]
  },
  {
    "toolName": "power_pruve_configuration_get",
    "sourceFile": "pruve-openapi.json",
    "apiTitle": "POWER PaRameter Uncertainty ViEwer (PRUVE) API",
    "apiVersion": "v2.7.0",
    "method": "GET",
    "path": "/api/pruve/configuration",
    "operationId": "configuration_settings_request_api_pruve_configuration_get",
    "summary": "Configuration Settings Request",
    "description": "This endpoint returns configuration settings of the microservice.\n\n- This includes the available data formats, time range, and more.",
    "parameters": []
  },
  {
    "toolName": "power_system_resources_content_get",
    "sourceFile": "resources-openapi.json",
    "apiTitle": "POWER Resources API",
    "apiVersion": "v2.9.0",
    "method": "GET",
    "path": "/api/system/resources/content",
    "operationId": "news_items_api_system_resources_content_get",
    "summary": "Content Pages",
    "description": "The content pages for external applications.",
    "parameters": [
      {
        "name": "name",
        "in": "query",
        "required": true,
        "description": "The name of the POWER content page: dashboard-sources, dashboard-hourly, or dashboard-daily.",
        "schema": {
          "type": "string"
        }
      }
    ]
  },
  {
    "toolName": "power_system_resources_dashboard_availability_get",
    "sourceFile": "resources-openapi.json",
    "apiTitle": "POWER Resources API",
    "apiVersion": "v2.9.0",
    "method": "GET",
    "path": "/api/system/resources/dashboard/availability",
    "operationId": "get_availability_api_system_resources_dashboard_availability_get",
    "summary": "Source Availability",
    "description": "This endpoint returns the availability information.",
    "parameters": []
  },
  {
    "toolName": "power_system_resources_configuration_get",
    "sourceFile": "resources-openapi.json",
    "apiTitle": "POWER Resources API",
    "apiVersion": "v2.9.0",
    "method": "GET",
    "path": "/api/system/resources/configuration",
    "operationId": "configuration_settings_request_api_system_resources_configuration_get",
    "summary": "Configuration Settings Request",
    "description": "This endpoint returns configuration settings of the microservice.\n\n- This includes the available data formats, time range, and more.",
    "parameters": []
  },
  {
    "toolName": "power_temporal_climatology_point_get",
    "sourceFile": "temporal-climatology-openapi.json",
    "apiTitle": "POWER Climatology API",
    "apiVersion": "v2.9.4",
    "method": "GET",
    "path": "/api/temporal/climatology/point",
    "operationId": "single_point_data_request_api_temporal_climatology_point_get",
    "summary": "Single point data request for an monthly and annual based calculated climatology data.",
    "description": "",
    "parameters": [
      {
        "name": "start",
        "in": "query",
        "required": false,
        "description": "This is the start time for the data request formatted as YYYY.",
        "schema": {
          "type": "integer",
          "default": 2001
        }
      },
      {
        "name": "end",
        "in": "query",
        "required": false,
        "description": "This is the end time for the data request formatted as YYYY.",
        "schema": {
          "type": "integer",
          "default": 2020
        }
      },
      {
        "name": "latitude",
        "in": "query",
        "required": true,
        "description": "This is the point latitude value.",
        "schema": {
          "type": "number"
        }
      },
      {
        "name": "longitude",
        "in": "query",
        "required": true,
        "description": "This is the point longitude value.",
        "schema": {
          "type": "number"
        }
      },
      {
        "name": "community",
        "in": "query",
        "required": true,
        "description": "The user community to return units for.",
        "schema": {
          "type": "string",
          "enum": [
            "ag",
            "sb",
            "re"
          ]
        }
      },
      {
        "name": "parameters",
        "in": "query",
        "required": true,
        "description": "A comma delimited list of the parameter abbreviations.",
        "schema": {
          "type": "string"
        }
      },
      {
        "name": "format",
        "in": "query",
        "required": false,
        "description": "The response objects output format.",
        "schema": {
          "type": "string",
          "enum": [
            "csv",
            "json",
            "ascii",
            "netcdf",
            "xarray"
          ]
        }
      },
      {
        "name": "units",
        "in": "query",
        "required": false,
        "description": "The type of units, metric or imperial.",
        "schema": {
          "type": "string",
          "enum": [
            "imperial",
            "metric"
          ],
          "default": "metric"
        }
      },
      {
        "name": "user",
        "in": "query",
        "required": false,
        "description": "A user name for identification purposes.",
        "schema": {
          "type": "string"
        }
      },
      {
        "name": "header",
        "in": "query",
        "required": false,
        "description": "To show or hide the header files of CSV and ASCII formats.",
        "schema": {
          "type": "boolean",
          "default": true
        }
      },
      {
        "name": "time-standard",
        "in": "query",
        "required": false,
        "description": "The time standard to return timestamps for.",
        "schema": {
          "type": "string",
          "enum": [
            "lst",
            "utc"
          ],
          "default": "lst"
        }
      },
      {
        "name": "site-elevation",
        "in": "query",
        "required": false,
        "description": "The custom site elevation in meters to produce the corrected atmospheric pressure adjusted for elevation.",
        "schema": {
          "type": "number"
        }
      },
      {
        "name": "wind-elevation",
        "in": "query",
        "required": false,
        "description": "The custom wind elevation in meters to produce the wind speed adjusted for elevation.",
        "schema": {
          "type": "number"
        }
      },
      {
        "name": "wind-surface",
        "in": "query",
        "required": false,
        "description": "The definable surface type to adjusted the wind speed.",
        "schema": {
          "type": "string"
        }
      }
    ]
  },
  {
    "toolName": "power_temporal_climatology_regional_get",
    "sourceFile": "temporal-climatology-openapi.json",
    "apiTitle": "POWER Climatology API",
    "apiVersion": "v2.9.4",
    "method": "GET",
    "path": "/api/temporal/climatology/regional",
    "operationId": "regional_data_request_api_temporal_climatology_regional_get",
    "summary": "Regional data request for an monthly and annual based calculated climatology data.",
    "description": "",
    "parameters": [
      {
        "name": "latitude-min",
        "in": "query",
        "required": true,
        "description": "This is the region/'s minimum latitude value.",
        "schema": {
          "type": "number"
        }
      },
      {
        "name": "latitude-max",
        "in": "query",
        "required": true,
        "description": "This is the region/'s maximum latitude value.",
        "schema": {
          "type": "number"
        }
      },
      {
        "name": "longitude-min",
        "in": "query",
        "required": true,
        "description": "This is the region/'s minimum latitude value.",
        "schema": {
          "type": "number"
        }
      },
      {
        "name": "longitude-max",
        "in": "query",
        "required": true,
        "description": "This is the region/'s maximum latitude value.",
        "schema": {
          "type": "number"
        }
      },
      {
        "name": "community",
        "in": "query",
        "required": true,
        "description": "The user community to return units for.",
        "schema": {
          "type": "string",
          "enum": [
            "ag",
            "sb",
            "re"
          ]
        }
      },
      {
        "name": "parameters",
        "in": "query",
        "required": true,
        "description": "A comma delimited list of the parameter abbreviations.",
        "schema": {
          "type": "string"
        }
      },
      {
        "name": "format",
        "in": "query",
        "required": false,
        "description": "The response objects output format.",
        "schema": {
          "type": "string",
          "enum": [
            "csv",
            "json",
            "ascii",
            "netcdf",
            "xarray"
          ]
        }
      },
      {
        "name": "units",
        "in": "query",
        "required": false,
        "description": "The type of units, metric or imperial.",
        "schema": {
          "type": "string",
          "enum": [
            "imperial",
            "metric"
          ],
          "default": "metric"
        }
      },
      {
        "name": "time-standard",
        "in": "query",
        "required": false,
        "description": "The time standard to return timestamps for.",
        "schema": {
          "type": "string",
          "enum": [
            "lst",
            "utc"
          ],
          "default": "lst"
        }
      },
      {
        "name": "user",
        "in": "query",
        "required": false,
        "description": "A user name for identification purposes.",
        "schema": {
          "type": "string"
        }
      },
      {
        "name": "header",
        "in": "query",
        "required": false,
        "description": "To show or hide the header files of CSV and ASCII formats.",
        "schema": {
          "type": "boolean",
          "default": true
        }
      }
    ]
  },
  {
    "toolName": "power_temporal_climatology_configuration_get",
    "sourceFile": "temporal-climatology-openapi.json",
    "apiTitle": "POWER Climatology API",
    "apiVersion": "v2.9.4",
    "method": "GET",
    "path": "/api/temporal/climatology/configuration",
    "operationId": "configuration_settings_request_api_temporal_climatology_configuration_get",
    "summary": "Configuration Settings Request",
    "description": "",
    "parameters": []
  },
  {
    "toolName": "power_temporal_daily_point_get",
    "sourceFile": "temporal-daily-openapi.json",
    "apiTitle": "POWER Daily API",
    "apiVersion": "v2.9.2",
    "method": "GET",
    "path": "/api/temporal/daily/point",
    "operationId": "daily_single_point_data_request_api_temporal_daily_point_get",
    "summary": "Single Point Data Request",
    "description": "Retrieve daily time series data for a specific geographic location from NASA POWER datasets",
    "parameters": [
      {
        "name": "start",
        "in": "query",
        "required": true,
        "description": "Start date in YYYYMMDD format (e.g., 20200101 for January 1, 2020). Must be >= 19810101.",
        "schema": {
          "type": "integer"
        }
      },
      {
        "name": "end",
        "in": "query",
        "required": true,
        "description": "End date in YYYYMMDD format (e.g., 20201231 for December 31, 2020). Must be >= start date.",
        "schema": {
          "type": "integer"
        }
      },
      {
        "name": "latitude",
        "in": "query",
        "required": true,
        "description": "Latitude in decimal degrees. Valid range: -90.0 to 90.0. North is positive, South is negative.",
        "schema": {
          "type": "number",
          "minimum": -90.0,
          "maximum": 90.0
        }
      },
      {
        "name": "longitude",
        "in": "query",
        "required": true,
        "description": "Longitude in decimal degrees. Valid range: -180.0 to 180.0. East is positive, West is negative.",
        "schema": {
          "type": "number",
          "minimum": -180.0,
          "maximum": 180.0
        }
      },
      {
        "name": "community",
        "in": "query",
        "required": true,
        "description": "User community determining output units and parameters. Options: RE (Renewable Energy), AG (Agroclimatology), SB (Sustainable Buildings).",
        "schema": {
          "type": "string",
          "enum": [
            "ag",
            "sb",
            "re"
          ]
        }
      },
      {
        "name": "parameters",
        "in": "query",
        "required": true,
        "description": "Comma-separated list of parameter codes (e.g., 'T2M,ALLSKY_SFC_SW_DWN,RH2M'). Use /configuration endpoint to see available parameters.",
        "schema": {
          "type": "string"
        }
      },
      {
        "name": "format",
        "in": "query",
        "required": false,
        "description": "Output format: JSON (default), CSV, ASCII, or NETCDF. JSON recommended for API clients.",
        "schema": {
          "type": "string",
          "enum": [
            "csv",
            "json",
            "ascii",
            "netcdf",
            "icasa",
            "xarray"
          ]
        }
      },
      {
        "name": "units",
        "in": "query",
        "required": false,
        "description": "Unit system: 'metric' (default) or 'imperial'. Applies to temperature, speed, and other measurements.",
        "schema": {
          "type": "string",
          "enum": [
            "imperial",
            "metric"
          ],
          "default": "metric"
        }
      },
      {
        "name": "user",
        "in": "query",
        "required": false,
        "description": "Optional username or identifier for request tracking and analytics. Not required.",
        "schema": {
          "type": "string"
        }
      },
      {
        "name": "header",
        "in": "query",
        "required": false,
        "description": "Include header metadata in CSV/ASCII output. Set to false for headerless data files.",
        "schema": {
          "type": "boolean",
          "default": true
        }
      },
      {
        "name": "time-standard",
        "in": "query",
        "required": false,
        "description": "Time standard for timestamps: 'LST' (Local Solar Time, default) or 'UTC' (Coordinated Universal Time).",
        "schema": {
          "type": "string",
          "enum": [
            "lst",
            "utc"
          ],
          "default": "lst"
        }
      },
      {
        "name": "site-elevation",
        "in": "query",
        "required": false,
        "description": "Custom site elevation in meters for atmospheric pressure correction. If omitted, MERRA-2 elevation is used.",
        "schema": {
          "type": "number"
        }
      },
      {
        "name": "wind-elevation",
        "in": "query",
        "required": false,
        "description": "Custom height in meters above ground for wind speed adjustment. If omitted, standard 2m or 10m height is used.",
        "schema": {
          "type": "number"
        }
      },
      {
        "name": "wind-surface",
        "in": "query",
        "required": false,
        "description": "Surface roughness type for wind speed adjustment (e.g., 'airportice', 'grass'). See documentation for valid values.",
        "schema": {
          "type": "string"
        }
      }
    ]
  },
  {
    "toolName": "power_temporal_daily_regional_get",
    "sourceFile": "temporal-daily-openapi.json",
    "apiTitle": "POWER Daily API",
    "apiVersion": "v2.9.2",
    "method": "GET",
    "path": "/api/temporal/daily/regional",
    "operationId": "daily_regional_data_request_api_temporal_daily_regional_get",
    "summary": "Regional Data Request",
    "description": "Retrieve daily gridded time series data for a bounding box region from NASA POWER datasets",
    "parameters": [
      {
        "name": "start",
        "in": "query",
        "required": true,
        "description": "Start date in YYYYMMDD format (e.g., 20200101). Must be >= 19810101.",
        "schema": {
          "type": "integer"
        }
      },
      {
        "name": "end",
        "in": "query",
        "required": true,
        "description": "End date in YYYYMMDD format (e.g., 20201231). Must be >= start date.",
        "schema": {
          "type": "integer"
        }
      },
      {
        "name": "latitude-min",
        "in": "query",
        "required": true,
        "description": "Minimum latitude of bounding box in decimal degrees. Valid range: -90.0 to 90.0. Must be < latitude-max.",
        "schema": {
          "type": "number",
          "minimum": -90.0,
          "maximum": 90.0
        }
      },
      {
        "name": "latitude-max",
        "in": "query",
        "required": true,
        "description": "Maximum latitude of bounding box in decimal degrees. Valid range: -90.0 to 90.0. Must be > latitude-min.",
        "schema": {
          "type": "number",
          "minimum": -90.0,
          "maximum": 90.0
        }
      },
      {
        "name": "longitude-min",
        "in": "query",
        "required": true,
        "description": "Minimum longitude of bounding box in decimal degrees. Valid range: -180.0 to 180.0. Must be < longitude-max.",
        "schema": {
          "type": "number",
          "minimum": -180.0,
          "maximum": 180.0
        }
      },
      {
        "name": "longitude-max",
        "in": "query",
        "required": true,
        "description": "Maximum longitude of bounding box in decimal degrees. Valid range: -180.0 to 180.0. Must be > longitude-min.",
        "schema": {
          "type": "number",
          "minimum": -180.0,
          "maximum": 180.0
        }
      },
      {
        "name": "community",
        "in": "query",
        "required": true,
        "description": "User community determining output units and parameters. Options: RE (Renewable Energy), AG (Agroclimatology), SB (Sustainable Buildings).",
        "schema": {
          "type": "string",
          "enum": [
            "ag",
            "sb",
            "re"
          ]
        }
      },
      {
        "name": "parameters",
        "in": "query",
        "required": true,
        "description": "Comma-separated list of parameter codes (e.g., 'T2M,ALLSKY_SFC_SW_DWN,RH2M'). Use /configuration endpoint to see available parameters.",
        "schema": {
          "type": "string"
        }
      },
      {
        "name": "format",
        "in": "query",
        "required": false,
        "description": "Output format: JSON (default), CSV, ASCII, NETCDF, or XARRAY. NETCDF recommended for large regions.",
        "schema": {
          "type": "string",
          "enum": [
            "csv",
            "json",
            "ascii",
            "netcdf",
            "xarray"
          ]
        }
      },
      {
        "name": "units",
        "in": "query",
        "required": false,
        "description": "Unit system: 'metric' (default) or 'imperial'. Applies to temperature, speed, and other measurements.",
        "schema": {
          "type": "string",
          "enum": [
            "imperial",
            "metric"
          ],
          "default": "metric"
        }
      },
      {
        "name": "user",
        "in": "query",
        "required": false,
        "description": "Optional username or identifier for request tracking. Not required.",
        "schema": {
          "type": "string"
        }
      },
      {
        "name": "header",
        "in": "query",
        "required": false,
        "description": "Include header metadata in CSV/ASCII output. Set to false for headerless data files.",
        "schema": {
          "type": "boolean",
          "default": true
        }
      },
      {
        "name": "time-standard",
        "in": "query",
        "required": false,
        "description": "Time standard for timestamps: 'LST' (Local Solar Time, default) or 'UTC'.",
        "schema": {
          "type": "string",
          "enum": [
            "lst",
            "utc"
          ],
          "default": "lst"
        }
      }
    ]
  },
  {
    "toolName": "power_temporal_daily_configuration_get",
    "sourceFile": "temporal-daily-openapi.json",
    "apiTitle": "POWER Daily API",
    "apiVersion": "v2.9.2",
    "method": "GET",
    "path": "/api/temporal/daily/configuration",
    "operationId": "configuration_settings_request_api_temporal_daily_configuration_get",
    "summary": "API Configuration and Metadata",
    "description": "Get available parameters, formats, date ranges, and API capabilities",
    "parameters": []
  },
  {
    "toolName": "power_temporal_monthly_point_get",
    "sourceFile": "temporal-monthly-openapi.json",
    "apiTitle": "POWER Monthly and Annual API",
    "apiVersion": "v2.9.4",
    "method": "GET",
    "path": "/api/temporal/monthly/point",
    "operationId": "monthly_single_point_data_request_api_temporal_monthly_point_get",
    "summary": "Single point data request for a monthly and annual based time series request.",
    "description": "",
    "parameters": [
      {
        "name": "start",
        "in": "query",
        "required": true,
        "description": "This is the start time for the data request formatted as YYYY.",
        "schema": {
          "type": "integer"
        }
      },
      {
        "name": "end",
        "in": "query",
        "required": true,
        "description": "This is the end time for the data request formatted as YYYY.",
        "schema": {
          "type": "integer"
        }
      },
      {
        "name": "latitude",
        "in": "query",
        "required": true,
        "description": "This is the point latitude value.",
        "schema": {
          "type": "number"
        }
      },
      {
        "name": "longitude",
        "in": "query",
        "required": true,
        "description": "This is the point longitude value.",
        "schema": {
          "type": "number"
        }
      },
      {
        "name": "community",
        "in": "query",
        "required": true,
        "description": "The user community to return units for.",
        "schema": {
          "type": "string",
          "enum": [
            "ag",
            "sb",
            "re"
          ]
        }
      },
      {
        "name": "parameters",
        "in": "query",
        "required": true,
        "description": "A comma delimited list of the parameter abbreviations.",
        "schema": {
          "type": "string"
        }
      },
      {
        "name": "format",
        "in": "query",
        "required": false,
        "description": "The response objects output format.",
        "schema": {
          "type": "string",
          "enum": [
            "csv",
            "json",
            "ascii",
            "netcdf",
            "xarray"
          ]
        }
      },
      {
        "name": "units",
        "in": "query",
        "required": false,
        "description": "The type of units, metric or imperial.",
        "schema": {
          "type": "string",
          "enum": [
            "imperial",
            "metric"
          ],
          "default": "metric"
        }
      },
      {
        "name": "user",
        "in": "query",
        "required": false,
        "description": "A user name for identification purposes.",
        "schema": {
          "type": "string"
        }
      },
      {
        "name": "header",
        "in": "query",
        "required": false,
        "description": "To show or hide the header files of CSV and ASCII formats.",
        "schema": {
          "type": "boolean",
          "default": true
        }
      },
      {
        "name": "time-standard",
        "in": "query",
        "required": false,
        "description": "The time standard to return timestamps for.",
        "schema": {
          "type": "string",
          "enum": [
            "lst",
            "utc"
          ],
          "default": "lst"
        }
      },
      {
        "name": "site-elevation",
        "in": "query",
        "required": false,
        "description": "The custom site elevation in meters to produce the corrected atmospheric pressure adjusted for elevation.",
        "schema": {
          "type": "number"
        }
      },
      {
        "name": "wind-elevation",
        "in": "query",
        "required": false,
        "description": "The custom wind elevation in meters to produce the wind speed adjusted for elevation.",
        "schema": {
          "type": "number"
        }
      },
      {
        "name": "wind-surface",
        "in": "query",
        "required": false,
        "description": "The definable surface type to adjusted the wind speed.",
        "schema": {
          "type": "string"
        }
      }
    ]
  },
  {
    "toolName": "power_temporal_monthly_regional_get",
    "sourceFile": "temporal-monthly-openapi.json",
    "apiTitle": "POWER Monthly and Annual API",
    "apiVersion": "v2.9.4",
    "method": "GET",
    "path": "/api/temporal/monthly/regional",
    "operationId": "monthly_regional_data_request_api_temporal_monthly_regional_get",
    "summary": "Regional data request for a monthly and annual based time series request.",
    "description": "",
    "parameters": [
      {
        "name": "start",
        "in": "query",
        "required": true,
        "description": "This is the start time for the data request formatted as YYYY.",
        "schema": {
          "type": "integer"
        }
      },
      {
        "name": "end",
        "in": "query",
        "required": true,
        "description": "This is the end time for the data request formatted as YYYY.",
        "schema": {
          "type": "integer"
        }
      },
      {
        "name": "latitude-min",
        "in": "query",
        "required": true,
        "description": "This is the region/'s minimum latitude value.",
        "schema": {
          "type": "number"
        }
      },
      {
        "name": "latitude-max",
        "in": "query",
        "required": true,
        "description": "This is the region/'s maximum latitude value.",
        "schema": {
          "type": "number"
        }
      },
      {
        "name": "longitude-min",
        "in": "query",
        "required": true,
        "description": "This is the region/'s minimum latitude value.",
        "schema": {
          "type": "number"
        }
      },
      {
        "name": "longitude-max",
        "in": "query",
        "required": true,
        "description": "This is the region/'s maximum latitude value.",
        "schema": {
          "type": "number"
        }
      },
      {
        "name": "community",
        "in": "query",
        "required": true,
        "description": "The user community to return units for.",
        "schema": {
          "type": "string",
          "enum": [
            "ag",
            "sb",
            "re"
          ]
        }
      },
      {
        "name": "parameters",
        "in": "query",
        "required": true,
        "description": "A comma delimited list of the parameter abbreviations.",
        "schema": {
          "type": "string"
        }
      },
      {
        "name": "format",
        "in": "query",
        "required": false,
        "description": "The response objects output format.",
        "schema": {
          "type": "string",
          "enum": [
            "csv",
            "json",
            "ascii",
            "netcdf",
            "xarray"
          ]
        }
      },
      {
        "name": "units",
        "in": "query",
        "required": false,
        "description": "The type of units, metric or imperial.",
        "schema": {
          "type": "string",
          "enum": [
            "imperial",
            "metric"
          ],
          "default": "metric"
        }
      },
      {
        "name": "user",
        "in": "query",
        "required": false,
        "description": "A user name for identification purposes.",
        "schema": {
          "type": "string"
        }
      },
      {
        "name": "header",
        "in": "query",
        "required": false,
        "description": "To show or hide the header files of CSV and ASCII formats.",
        "schema": {
          "type": "boolean",
          "default": true
        }
      },
      {
        "name": "time-standard",
        "in": "query",
        "required": false,
        "description": "The time standard to return timestamps for.",
        "schema": {
          "type": "string",
          "enum": [
            "lst",
            "utc"
          ],
          "default": "lst"
        }
      }
    ]
  },
  {
    "toolName": "power_temporal_monthly_configuration_get",
    "sourceFile": "temporal-monthly-openapi.json",
    "apiTitle": "POWER Monthly and Annual API",
    "apiVersion": "v2.9.4",
    "method": "GET",
    "path": "/api/temporal/monthly/configuration",
    "operationId": "configuration_settings_request_api_temporal_monthly_configuration_get",
    "summary": "Configuration Settings Request",
    "description": "",
    "parameters": []
  },
  {
    "toolName": "power_toolkit_power_visualizations_heatmaps_get",
    "sourceFile": "toolkit-openapi.json",
    "apiTitle": "POWER Toolkit API",
    "apiVersion": "v2.9.0",
    "method": "GET",
    "path": "/api/toolkit/power/visualizations/heatmaps",
    "operationId": "create_heatmap_visualization_api_toolkit_power_visualizations_heatmaps_get",
    "summary": "Creates a single point heatmap.",
    "description": "This endpoint returns a single point heatmap based on Analysis Ready Data (ARD) from solar or meteorological data derived from multiple NASA Earth Science Division (ESD) projects.\n\n- This endpoint selects the closet location to the requested input latitude and longitude from the source projects grid.",
    "parameters": [
      {
        "name": "operation",
        "in": "query",
        "required": false,
        "description": "The operation to represent the heatmap.",
        "schema": {
          "type": "string",
          "enum": [
            "climatological-days",
            "monthly"
          ],
          "default": "climatological-days"
        }
      },
      {
        "name": "start",
        "in": "query",
        "required": true,
        "description": "This is the start time for the data request.",
        "schema": {
          "type": "string",
          "format": "date"
        }
      },
      {
        "name": "end",
        "in": "query",
        "required": true,
        "description": "This is the end time for the data request.",
        "schema": {
          "type": "string",
          "format": "date"
        }
      },
      {
        "name": "latitude",
        "in": "query",
        "required": true,
        "description": "This is the point latitude value.",
        "schema": {
          "type": "number",
          "minimum": -90,
          "maximum": 90
        }
      },
      {
        "name": "longitude",
        "in": "query",
        "required": true,
        "description": "This is the point longitude value.",
        "schema": {
          "type": "number",
          "minimum": -180,
          "maximum": 180
        }
      },
      {
        "name": "parameter",
        "in": "query",
        "required": true,
        "description": "A parameter abbreviation.",
        "schema": {
          "type": "array",
          "minItems": 1,
          "maxItems": 1,
          "items": {
            "type": "string",
            "minLength": 2,
            "maxLength": 50
          }
        }
      },
      {
        "name": "community",
        "in": "query",
        "required": true,
        "description": "The user community to return units for.",
        "schema": {
          "type": "string",
          "enum": [
            "ag",
            "sb",
            "re"
          ]
        }
      },
      {
        "name": "format",
        "in": "query",
        "required": false,
        "description": "The response objects output format.",
        "schema": {
          "type": "string",
          "enum": [
            "json",
            "html"
          ],
          "default": "json"
        }
      },
      {
        "name": "units",
        "in": "query",
        "required": false,
        "description": "The override for default units.",
        "schema": {
          "type": "string",
          "enum": [
            "imperial",
            "metric"
          ],
          "default": "metric"
        }
      },
      {
        "name": "user",
        "in": "query",
        "required": false,
        "description": "A user name for identification purposes.",
        "schema": {
          "type": "string",
          "maxLength": 15
        }
      },
      {
        "name": "theme",
        "in": "query",
        "required": false,
        "description": "The color theme for the output objects.",
        "schema": {
          "type": "string",
          "enum": [
            "light",
            "dark"
          ],
          "default": "light"
        }
      }
    ]
  },
  {
    "toolName": "power_toolkit_power_visualizations_variables_get",
    "sourceFile": "toolkit-openapi.json",
    "apiTitle": "POWER Toolkit API",
    "apiVersion": "v2.9.0",
    "method": "GET",
    "path": "/api/toolkit/power/visualizations/variables",
    "operationId": "create_variable_visualization_api_toolkit_power_visualizations_variables_get",
    "summary": "Creates a single point variable plot.",
    "description": "This endpoint returns a single point variable plot based on Analysis Ready Data (ARD) from solar or meteorological data derived from multiple NASA Earth Science Division (ESD) projects.\n\n- This endpoint selects the closet location to the requested input latitude and longitude from the source projects grid.",
    "parameters": [
      {
        "name": "start",
        "in": "query",
        "required": true,
        "description": "This is the start time for the data request.",
        "schema": {
          "type": "string",
          "format": "date"
        }
      },
      {
        "name": "end",
        "in": "query",
        "required": true,
        "description": "This is the end time for the data request.",
        "schema": {
          "type": "string",
          "format": "date"
        }
      },
      {
        "name": "latitude",
        "in": "query",
        "required": true,
        "description": "This is the point latitude value.",
        "schema": {
          "type": "number",
          "minimum": -90,
          "maximum": 90
        }
      },
      {
        "name": "longitude",
        "in": "query",
        "required": true,
        "description": "This is the point longitude value.",
        "schema": {
          "type": "number",
          "minimum": -180,
          "maximum": 180
        }
      },
      {
        "name": "parameter",
        "in": "query",
        "required": true,
        "description": "A parameter abbreviation.",
        "schema": {
          "type": "array",
          "minItems": 1,
          "maxItems": 1,
          "items": {
            "type": "string",
            "minLength": 2,
            "maxLength": 50
          }
        }
      },
      {
        "name": "community",
        "in": "query",
        "required": true,
        "description": "The user community to return units for.",
        "schema": {
          "type": "string",
          "enum": [
            "ag",
            "sb",
            "re"
          ]
        }
      },
      {
        "name": "format",
        "in": "query",
        "required": false,
        "description": "The response objects output format.",
        "schema": {
          "type": "string",
          "enum": [
            "json",
            "html"
          ],
          "default": "json"
        }
      },
      {
        "name": "units",
        "in": "query",
        "required": false,
        "description": "The override for default units.",
        "schema": {
          "type": "string",
          "enum": [
            "imperial",
            "metric"
          ],
          "default": "metric"
        }
      },
      {
        "name": "user",
        "in": "query",
        "required": false,
        "description": "A user name for identification purposes.",
        "schema": {
          "type": "string",
          "maxLength": 15
        }
      },
      {
        "name": "theme",
        "in": "query",
        "required": false,
        "description": "The color theme for the output objects.",
        "schema": {
          "type": "string",
          "enum": [
            "light",
            "dark"
          ],
          "default": "light"
        }
      }
    ]
  },
  {
    "toolName": "power_toolkit_power_visualizations_trend_get",
    "sourceFile": "toolkit-openapi.json",
    "apiTitle": "POWER Toolkit API",
    "apiVersion": "v2.9.0",
    "method": "GET",
    "path": "/api/toolkit/power/visualizations/trend",
    "operationId": "create_trend_visualization_api_toolkit_power_visualizations_trend_get",
    "summary": "Creates a single point variable plot.",
    "description": "This endpoint returns a single point variable plot based on Analysis Ready Data (ARD) from solar or meteorological data derived from multiple NASA Earth Science Division (ESD) projects.\n\n- This endpoint selects the closet location to the requested input latitude and longitude from the source projects grid.",
    "parameters": [
      {
        "name": "start",
        "in": "query",
        "required": true,
        "description": "This is the start time for the data request.",
        "schema": {
          "type": "string",
          "format": "date"
        }
      },
      {
        "name": "end",
        "in": "query",
        "required": true,
        "description": "This is the end time for the data request.",
        "schema": {
          "type": "string",
          "format": "date"
        }
      },
      {
        "name": "latitude",
        "in": "query",
        "required": true,
        "description": "This is the point latitude value.",
        "schema": {
          "type": "number",
          "minimum": -90,
          "maximum": 90
        }
      },
      {
        "name": "longitude",
        "in": "query",
        "required": true,
        "description": "This is the point longitude value.",
        "schema": {
          "type": "number",
          "minimum": -180,
          "maximum": 180
        }
      },
      {
        "name": "parameter",
        "in": "query",
        "required": true,
        "description": "A parameter abbreviation.",
        "schema": {
          "type": "array",
          "minItems": 1,
          "maxItems": 1,
          "items": {
            "type": "string",
            "minLength": 2,
            "maxLength": 50
          }
        }
      },
      {
        "name": "community",
        "in": "query",
        "required": true,
        "description": "The user community to return units for.",
        "schema": {
          "type": "string",
          "enum": [
            "ag",
            "sb",
            "re"
          ]
        }
      },
      {
        "name": "format",
        "in": "query",
        "required": false,
        "description": "The response objects output format.",
        "schema": {
          "type": "string",
          "enum": [
            "json",
            "html"
          ],
          "default": "json"
        }
      },
      {
        "name": "units",
        "in": "query",
        "required": false,
        "description": "The override for default units.",
        "schema": {
          "type": "string",
          "enum": [
            "imperial",
            "metric"
          ],
          "default": "metric"
        }
      },
      {
        "name": "user",
        "in": "query",
        "required": false,
        "description": "A user name for identification purposes.",
        "schema": {
          "type": "string",
          "maxLength": 15
        }
      },
      {
        "name": "theme",
        "in": "query",
        "required": false,
        "description": "The color theme for the output objects.",
        "schema": {
          "type": "string",
          "enum": [
            "light",
            "dark"
          ],
          "default": "light"
        }
      }
    ]
  },
  {
    "toolName": "power_toolkit_power_visualizations_anomalies_get",
    "sourceFile": "toolkit-openapi.json",
    "apiTitle": "POWER Toolkit API",
    "apiVersion": "v2.9.0",
    "method": "GET",
    "path": "/api/toolkit/power/visualizations/anomalies",
    "operationId": "create_anomalies_visualization_api_toolkit_power_visualizations_anomalies_get",
    "summary": "Creates a single point anomalies plot.",
    "description": "This endpoint returns a single point anomalies plot based on Analysis Ready Data (ARD) from solar or meteorological data derived from multiple NASA Earth Science Division (ESD) projects.\n\n- This endpoint selects the closet location to the requested input latitude and longitude from the source projects grid.",
    "parameters": [
      {
        "name": "start",
        "in": "query",
        "required": true,
        "description": "This is the start time for the data request.",
        "schema": {
          "type": "string",
          "format": "date"
        }
      },
      {
        "name": "end",
        "in": "query",
        "required": true,
        "description": "This is the end time for the data request.",
        "schema": {
          "type": "string",
          "format": "date"
        }
      },
      {
        "name": "latitude",
        "in": "query",
        "required": true,
        "description": "This is the point latitude value.",
        "schema": {
          "type": "number",
          "minimum": -90,
          "maximum": 90
        }
      },
      {
        "name": "longitude",
        "in": "query",
        "required": true,
        "description": "This is the point longitude value.",
        "schema": {
          "type": "number",
          "minimum": -180,
          "maximum": 180
        }
      },
      {
        "name": "parameter",
        "in": "query",
        "required": true,
        "description": "A parameter abbreviation.",
        "schema": {
          "type": "array",
          "minItems": 1,
          "maxItems": 1,
          "items": {
            "type": "string",
            "minLength": 2,
            "maxLength": 50
          }
        }
      },
      {
        "name": "community",
        "in": "query",
        "required": true,
        "description": "The user community to return units for.",
        "schema": {
          "type": "string",
          "enum": [
            "ag",
            "sb",
            "re"
          ]
        }
      },
      {
        "name": "format",
        "in": "query",
        "required": false,
        "description": "The response objects output format.",
        "schema": {
          "type": "string",
          "enum": [
            "json",
            "html"
          ],
          "default": "json"
        }
      },
      {
        "name": "units",
        "in": "query",
        "required": false,
        "description": "The override for default units.",
        "schema": {
          "type": "string",
          "enum": [
            "imperial",
            "metric"
          ],
          "default": "metric"
        }
      },
      {
        "name": "user",
        "in": "query",
        "required": false,
        "description": "A user name for identification purposes.",
        "schema": {
          "type": "string",
          "maxLength": 15
        }
      },
      {
        "name": "theme",
        "in": "query",
        "required": false,
        "description": "The color theme for the output objects.",
        "schema": {
          "type": "string",
          "enum": [
            "light",
            "dark"
          ],
          "default": "light"
        }
      }
    ]
  },
  {
    "toolName": "power_toolkit_power_visualizations_cycles_get",
    "sourceFile": "toolkit-openapi.json",
    "apiTitle": "POWER Toolkit API",
    "apiVersion": "v2.9.0",
    "method": "GET",
    "path": "/api/toolkit/power/visualizations/cycles",
    "operationId": "create_cycle_visualization_api_toolkit_power_visualizations_cycles_get",
    "summary": "Creates a single point cycle plot.",
    "description": "This endpoint returns a single point cycle plot based on Analysis Ready Data (ARD) from solar or meteorological data derived from multiple NASA Earth Science Division (ESD) projects.\n\n- This endpoint selects the closet location to the requested input latitude and longitude from the source projects grid.",
    "parameters": [
      {
        "name": "operation",
        "in": "query",
        "required": false,
        "description": "The operation to represent the cycle plot.",
        "schema": {
          "type": "string",
          "enum": [
            "single-parameter",
            "parameter-range"
          ],
          "default": "single-parameter"
        }
      },
      {
        "name": "start",
        "in": "query",
        "required": true,
        "description": "This is the start time for the data request.",
        "schema": {
          "type": "string",
          "format": "date"
        }
      },
      {
        "name": "end",
        "in": "query",
        "required": true,
        "description": "This is the end time for the data request.",
        "schema": {
          "type": "string",
          "format": "date"
        }
      },
      {
        "name": "latitude",
        "in": "query",
        "required": true,
        "description": "This is the point latitude value.",
        "schema": {
          "type": "number",
          "minimum": -90,
          "maximum": 90
        }
      },
      {
        "name": "longitude",
        "in": "query",
        "required": true,
        "description": "This is the point longitude value.",
        "schema": {
          "type": "number",
          "minimum": -180,
          "maximum": 180
        }
      },
      {
        "name": "parameter",
        "in": "query",
        "required": true,
        "description": "A parameter abbreviation.",
        "schema": {
          "type": "array",
          "minItems": 1,
          "maxItems": 1,
          "items": {
            "type": "string",
            "minLength": 2,
            "maxLength": 50
          }
        }
      },
      {
        "name": "community",
        "in": "query",
        "required": true,
        "description": "The user community to return units for.",
        "schema": {
          "type": "string",
          "enum": [
            "ag",
            "sb",
            "re"
          ]
        }
      },
      {
        "name": "format",
        "in": "query",
        "required": false,
        "description": "The response objects output format.",
        "schema": {
          "type": "string",
          "enum": [
            "json",
            "html"
          ],
          "default": "json"
        }
      },
      {
        "name": "units",
        "in": "query",
        "required": false,
        "description": "The override for default units.",
        "schema": {
          "type": "string",
          "enum": [
            "imperial",
            "metric"
          ],
          "default": "metric"
        }
      },
      {
        "name": "user",
        "in": "query",
        "required": false,
        "description": "A user name for identification purposes.",
        "schema": {
          "type": "string",
          "maxLength": 15
        }
      },
      {
        "name": "theme",
        "in": "query",
        "required": false,
        "description": "The color theme for the output objects.",
        "schema": {
          "type": "string",
          "enum": [
            "light",
            "dark"
          ],
          "default": "light"
        }
      }
    ]
  },
  {
    "toolName": "power_toolkit_power_visualizations_zones_get",
    "sourceFile": "toolkit-openapi.json",
    "apiTitle": "POWER Toolkit API",
    "apiVersion": "v2.9.0",
    "method": "GET",
    "path": "/api/toolkit/power/visualizations/zones",
    "operationId": "create_zones_visualization_api_toolkit_power_visualizations_zones_get",
    "summary": "Creates a single point rolling thermal zones plot.",
    "description": "This endpoint returns a single point rolling thermal zones plot based on Analysis Ready Data (ARD) from solar or meteorological data derived from multiple NASA Earth Science Division (ESD) projects.\n\n- This endpoint selects the closet location to the requested input latitude and longitude from the source projects grid.",
    "parameters": [
      {
        "name": "start",
        "in": "query",
        "required": true,
        "description": "This is the start time for the data request formatted as YYYY.",
        "schema": {
          "type": "integer",
          "minimum": 1984,
          "maximum": 2024
        }
      },
      {
        "name": "end",
        "in": "query",
        "required": true,
        "description": "This is the end time for the data request formatted as YYYY.",
        "schema": {
          "type": "integer",
          "minimum": 1984,
          "maximum": 2024
        }
      },
      {
        "name": "latitude",
        "in": "query",
        "required": true,
        "description": "This is the point latitude value.",
        "schema": {
          "type": "number",
          "minimum": -90,
          "maximum": 90
        }
      },
      {
        "name": "longitude",
        "in": "query",
        "required": true,
        "description": "This is the point longitude value.",
        "schema": {
          "type": "number",
          "minimum": -180,
          "maximum": 180
        }
      },
      {
        "name": "format",
        "in": "query",
        "required": false,
        "description": "The response objects output format.",
        "schema": {
          "type": "string",
          "enum": [
            "json",
            "html"
          ],
          "default": "json"
        }
      },
      {
        "name": "user",
        "in": "query",
        "required": false,
        "description": "A user name for identification purposes.",
        "schema": {
          "type": "string",
          "maxLength": 15
        }
      },
      {
        "name": "theme",
        "in": "query",
        "required": false,
        "description": "The color theme for the output objects.",
        "schema": {
          "type": "string",
          "enum": [
            "light",
            "dark"
          ],
          "default": "light"
        }
      }
    ]
  },
  {
    "toolName": "power_toolkit_power_visualizations_histograms_get",
    "sourceFile": "toolkit-openapi.json",
    "apiTitle": "POWER Toolkit API",
    "apiVersion": "v2.9.0",
    "method": "GET",
    "path": "/api/toolkit/power/visualizations/histograms",
    "operationId": "create_histograms_visualization_api_toolkit_power_visualizations_histograms_get",
    "summary": "Creates a single point histogram plot.",
    "description": "This endpoint returns a single point histogram plot based on Analysis Ready Data (ARD) from solar or meteorological data derived from multiple NASA Earth Science Division (ESD) projects.\n\n- This endpoint selects the closet location to the requested input latitude and longitude from the source projects grid.",
    "parameters": [
      {
        "name": "bin-size",
        "in": "query",
        "required": false,
        "description": "The bin size for the histogram.",
        "schema": {
          "type": "number",
          "default": 1
        }
      },
      {
        "name": "start",
        "in": "query",
        "required": true,
        "description": "This is the start time for the data request.",
        "schema": {
          "type": "string",
          "format": "date"
        }
      },
      {
        "name": "end",
        "in": "query",
        "required": true,
        "description": "This is the end time for the data request.",
        "schema": {
          "type": "string",
          "format": "date"
        }
      },
      {
        "name": "latitude",
        "in": "query",
        "required": true,
        "description": "This is the point latitude value.",
        "schema": {
          "type": "number",
          "minimum": -90,
          "maximum": 90
        }
      },
      {
        "name": "longitude",
        "in": "query",
        "required": true,
        "description": "This is the point longitude value.",
        "schema": {
          "type": "number",
          "minimum": -180,
          "maximum": 180
        }
      },
      {
        "name": "parameter",
        "in": "query",
        "required": true,
        "description": "A parameter abbreviation.",
        "schema": {
          "type": "array",
          "minItems": 1,
          "maxItems": 1,
          "items": {
            "type": "string",
            "minLength": 2,
            "maxLength": 50
          }
        }
      },
      {
        "name": "community",
        "in": "query",
        "required": true,
        "description": "The user community to return units for.",
        "schema": {
          "type": "string",
          "enum": [
            "ag",
            "sb",
            "re"
          ]
        }
      },
      {
        "name": "format",
        "in": "query",
        "required": false,
        "description": "The response objects output format.",
        "schema": {
          "type": "string",
          "enum": [
            "json",
            "html"
          ],
          "default": "json"
        }
      },
      {
        "name": "units",
        "in": "query",
        "required": false,
        "description": "The override for default units.",
        "schema": {
          "type": "string",
          "enum": [
            "imperial",
            "metric"
          ],
          "default": "metric"
        }
      },
      {
        "name": "user",
        "in": "query",
        "required": false,
        "description": "A user name for identification purposes.",
        "schema": {
          "type": "string",
          "maxLength": 15
        }
      },
      {
        "name": "theme",
        "in": "query",
        "required": false,
        "description": "The color theme for the output objects.",
        "schema": {
          "type": "string",
          "enum": [
            "light",
            "dark"
          ],
          "default": "light"
        }
      }
    ]
  },
  {
    "toolName": "power_toolkit_power_visualizations_gardening_get",
    "sourceFile": "toolkit-openapi.json",
    "apiTitle": "POWER Toolkit API",
    "apiVersion": "v2.9.0",
    "method": "GET",
    "path": "/api/toolkit/power/visualizations/gardening",
    "operationId": "create_garden_plotting_api_toolkit_power_visualizations_gardening_get",
    "summary": "Creates a single point histogram plot.",
    "description": "This endpoint returns a single point garden plot based on Analysis Ready Data (ARD) from solar or meteorological data derived from multiple NASA Earth Science Division (ESD) projects.\n\n- This endpoint selects the closet location to the requested input latitude and longitude from the source projects grid.",
    "parameters": [
      {
        "name": "start",
        "in": "query",
        "required": true,
        "description": "This is the start time for the data request formatted as YYYY.",
        "schema": {
          "type": "integer",
          "minimum": 1984,
          "maximum": 2024
        }
      },
      {
        "name": "end",
        "in": "query",
        "required": true,
        "description": "This is the end time for the data request formatted as YYYY.",
        "schema": {
          "type": "integer",
          "minimum": 1984,
          "maximum": 2024
        }
      },
      {
        "name": "latitude",
        "in": "query",
        "required": true,
        "description": "This is the point latitude value.",
        "schema": {
          "type": "number",
          "minimum": -90,
          "maximum": 90
        }
      },
      {
        "name": "longitude",
        "in": "query",
        "required": true,
        "description": "This is the point longitude value.",
        "schema": {
          "type": "number",
          "minimum": -180,
          "maximum": 180
        }
      },
      {
        "name": "format",
        "in": "query",
        "required": false,
        "description": "The response objects output format.",
        "schema": {
          "type": "string",
          "enum": [
            "json",
            "html"
          ],
          "default": "json"
        }
      },
      {
        "name": "user",
        "in": "query",
        "required": false,
        "description": "A user name for identification purposes.",
        "schema": {
          "type": "string",
          "maxLength": 15
        }
      },
      {
        "name": "theme",
        "in": "query",
        "required": false,
        "description": "The color theme for the output objects.",
        "schema": {
          "type": "string",
          "enum": [
            "light",
            "dark"
          ],
          "default": "light"
        }
      },
      {
        "name": "units",
        "in": "query",
        "required": false,
        "description": "The override for default units.",
        "schema": {
          "type": "string",
          "enum": [
            "imperial",
            "metric"
          ],
          "default": "metric"
        }
      }
    ]
  },
  {
    "toolName": "power_toolkit_psychrometric_report_get",
    "sourceFile": "toolkit-openapi.json",
    "apiTitle": "POWER Toolkit API",
    "apiVersion": "v2.9.0",
    "method": "GET",
    "path": "/api/toolkit/psychrometric/report",
    "operationId": "create_psychrometric_report_api_toolkit_psychrometric_report_get",
    "summary": "Creates a single point psychrometric report.",
    "description": "This endpoint returns a single point psychrometric report based on Analysis Ready Data (ARD) from solar or meteorological data derived from multiple NASA Earth Science Division (ESD) projects.\n\n- This endpoint selects the closet location to the requested input latitude and longitude from the source projects grid.",
    "parameters": [
      {
        "name": "latitude",
        "in": "query",
        "required": true,
        "description": "This is the point latitude value.",
        "schema": {
          "type": "number",
          "minimum": -90,
          "maximum": 90
        }
      },
      {
        "name": "longitude",
        "in": "query",
        "required": true,
        "description": "This is the point longitude value.",
        "schema": {
          "type": "number",
          "minimum": -180,
          "maximum": 180
        }
      },
      {
        "name": "temporal",
        "in": "query",
        "required": false,
        "description": "The temporal level to produce the plots.",
        "schema": {
          "type": "string",
          "enum": [
            "climatology",
            "daily",
            "hourly"
          ],
          "default": "climatology"
        }
      },
      {
        "name": "start",
        "in": "query",
        "required": false,
        "description": "This is the start time for the data request formatted as YYYY.",
        "schema": {
          "type": "integer",
          "default": 2001,
          "minimum": 1984,
          "maximum": 2024
        }
      },
      {
        "name": "end",
        "in": "query",
        "required": false,
        "description": "This is the end time for the data request formatted as YYYY.",
        "schema": {
          "type": "integer",
          "default": 2020,
          "minimum": 1984,
          "maximum": 2024
        }
      },
      {
        "name": "format",
        "in": "query",
        "required": false,
        "description": "The response objects output format.",
        "schema": {
          "type": "string",
          "enum": [
            "json",
            "html"
          ],
          "default": "json"
        }
      },
      {
        "name": "units",
        "in": "query",
        "required": false,
        "description": "The override for default units.",
        "schema": {
          "type": "string",
          "enum": [
            "imperial",
            "metric"
          ],
          "default": "metric"
        }
      },
      {
        "name": "user",
        "in": "query",
        "required": false,
        "description": "A user name for identification purposes.",
        "schema": {
          "type": "string",
          "maxLength": 15
        }
      },
      {
        "name": "theme",
        "in": "query",
        "required": false,
        "description": "The color theme for the output objects.",
        "schema": {
          "type": "string",
          "enum": [
            "light",
            "dark"
          ],
          "default": "light"
        }
      },
      {
        "name": "axis",
        "in": "query",
        "required": false,
        "description": "The axis values within the visualization.",
        "schema": {
          "type": "string",
          "enum": [
            "default",
            "dynamic"
          ],
          "default": "default"
        }
      },
      {
        "name": "subset",
        "in": "query",
        "required": false,
        "description": "The subset options for data timestamps.",
        "schema": {
          "type": "string",
          "enum": [
            "default",
            "weekend",
            "weekday"
          ],
          "default": "default"
        }
      },
      {
        "name": "orientation",
        "in": "query",
        "required": false,
        "description": "The orientation for the visualization.",
        "schema": {
          "type": "string",
          "enum": [
            "vertical",
            "horizontal"
          ],
          "default": "vertical"
        }
      }
    ]
  },
  {
    "toolName": "power_toolkit_configuration_get",
    "sourceFile": "toolkit-openapi.json",
    "apiTitle": "POWER Toolkit API",
    "apiVersion": "v2.9.0",
    "method": "GET",
    "path": "/api/toolkit/configuration",
    "operationId": "configuration_settings_request_api_toolkit_configuration_get",
    "summary": "Configuration Settings Request",
    "description": "This endpoint returns configuration settings of the microservice.\n\n- This includes the available data formats, time range, and more.",
    "parameters": []
  },
  {
    "toolName": "power_application_windrose_point_get",
    "sourceFile": "windrose-openapi.json",
    "apiTitle": "POWER Wind Rose API",
    "apiVersion": "v2.9.0",
    "method": "GET",
    "path": "/api/application/windrose/point",
    "operationId": "single_point_data_request_api_application_windrose_point_get",
    "summary": "Single Point Data Request",
    "description": "This endpoint returns a windrose report for a point location. This uses meteorological data derived from NASA\"s Earth Science Division (ESD) projects.\n\n- This endpoint selects the closet location to the requested input latitude and longitude from the source projects grid.",
    "parameters": [
      {
        "name": "start",
        "in": "query",
        "required": true,
        "description": "This is the start time for the data request formatted as YYYYMMDD.",
        "schema": {
          "type": "integer"
        }
      },
      {
        "name": "end",
        "in": "query",
        "required": true,
        "description": "This is the end time for the data request formatted as YYYYMMDD.",
        "schema": {
          "type": "integer"
        }
      },
      {
        "name": "latitude",
        "in": "query",
        "required": true,
        "description": "This is the point latitude value.",
        "schema": {
          "type": "number"
        }
      },
      {
        "name": "longitude",
        "in": "query",
        "required": true,
        "description": "This is the point longitude value.",
        "schema": {
          "type": "number"
        }
      },
      {
        "name": "format",
        "in": "query",
        "required": false,
        "description": "The response objects output format.",
        "schema": {
          "type": "string"
        }
      },
      {
        "name": "units",
        "in": "query",
        "required": false,
        "description": "The override for default units.",
        "schema": {
          "type": "string",
          "enum": [
            "imperial",
            "metric"
          ],
          "default": "metric"
        }
      },
      {
        "name": "user",
        "in": "query",
        "required": false,
        "description": "A user name for identification purposes.",
        "schema": {
          "type": "string"
        }
      },
      {
        "name": "time-standard",
        "in": "query",
        "required": false,
        "description": "The time standard to return timestamps for.",
        "schema": {
          "type": "string",
          "enum": [
            "lst",
            "utc"
          ],
          "default": "lst"
        }
      }
    ]
  },
  {
    "toolName": "power_application_windrose_plot_get",
    "sourceFile": "windrose-openapi.json",
    "apiTitle": "POWER Wind Rose API",
    "apiVersion": "v2.9.0",
    "method": "GET",
    "path": "/api/application/windrose/plot",
    "operationId": "single_point_plot_request_api_application_windrose_plot_get",
    "summary": "Single Point Data Request",
    "description": "This endpoint returns a windrose report for a point location. This uses meteorological data derived from NASA\"s Earth Science Division (ESD) projects.\n\n- This endpoint selects the closet location to the requested input latitude and longitude from the source projects grid.",
    "parameters": [
      {
        "name": "start",
        "in": "query",
        "required": true,
        "description": "This is the start time for the data request formatted as YYYYMMDD.",
        "schema": {
          "type": "integer"
        }
      },
      {
        "name": "end",
        "in": "query",
        "required": true,
        "description": "This is the end time for the data request formatted as YYYYMMDD.",
        "schema": {
          "type": "integer"
        }
      },
      {
        "name": "latitude",
        "in": "query",
        "required": true,
        "description": "This is the point latitude value.",
        "schema": {
          "type": "number"
        }
      },
      {
        "name": "longitude",
        "in": "query",
        "required": true,
        "description": "This is the point longitude value.",
        "schema": {
          "type": "number"
        }
      },
      {
        "name": "format",
        "in": "query",
        "required": false,
        "description": "The response objects output format.",
        "schema": {
          "type": "string",
          "enum": [
            "json",
            "html"
          ],
          "default": "json"
        }
      },
      {
        "name": "units",
        "in": "query",
        "required": false,
        "description": "The override for default units.",
        "schema": {
          "type": "string",
          "enum": [
            "imperial",
            "metric"
          ],
          "default": "metric"
        }
      },
      {
        "name": "user",
        "in": "query",
        "required": false,
        "description": "A user name for identification purposes.",
        "schema": {
          "type": "string"
        }
      },
      {
        "name": "time-standard",
        "in": "query",
        "required": false,
        "description": "The time standard to return timestamps for.",
        "schema": {
          "type": "string",
          "enum": [
            "lst",
            "utc"
          ],
          "default": "lst"
        }
      },
      {
        "name": "theme",
        "in": "query",
        "required": false,
        "description": "The color theme for the output objects.",
        "schema": {
          "type": "string",
          "enum": [
            "light",
            "dark"
          ],
          "default": "light"
        }
      }
    ]
  },
  {
    "toolName": "power_application_windrose_configuration_get",
    "sourceFile": "windrose-openapi.json",
    "apiTitle": "POWER Wind Rose API",
    "apiVersion": "v2.9.0",
    "method": "GET",
    "path": "/api/application/windrose/configuration",
    "operationId": "configuration_settings_request_api_application_windrose_configuration_get",
    "summary": "Configuration Settings Request",
    "description": "This endpoint returns configuration settings of the microservice.\n\n- This includes the available data formats, time range, and more.",
    "parameters": []
  },
  {
    "toolName": "power_application_zones_point_get",
    "sourceFile": "zones-openapi.json",
    "apiTitle": "POWER Zones API",
    "apiVersion": "v2.9.0",
    "method": "GET",
    "path": "/api/application/zones/point",
    "operationId": "single_point_data_request_api_application_zones_point_get",
    "summary": "Single Point Data Request",
    "description": "This endpoint returns a single point thermal and thermal moisture zones response.\n\n- This endpoint selects the closet location to the requested input latitude and longitude from the source projects grid.",
    "parameters": [
      {
        "name": "start",
        "in": "query",
        "required": true,
        "description": "This is the start time for the data request formatted as YYYY.",
        "schema": {
          "type": "integer"
        }
      },
      {
        "name": "end",
        "in": "query",
        "required": true,
        "description": "This is the end time for the data request formatted as YYYY.",
        "schema": {
          "type": "integer"
        }
      },
      {
        "name": "latitude",
        "in": "query",
        "required": true,
        "description": "This is the point latitude value.",
        "schema": {
          "type": "number"
        }
      },
      {
        "name": "longitude",
        "in": "query",
        "required": true,
        "description": "This is the point longitude value.",
        "schema": {
          "type": "number"
        }
      },
      {
        "name": "format",
        "in": "query",
        "required": false,
        "description": "The response objects output format.",
        "schema": {
          "type": "string"
        }
      },
      {
        "name": "user",
        "in": "query",
        "required": false,
        "description": "A user name for identification purposes.",
        "schema": {
          "type": "string"
        }
      }
    ]
  },
  {
    "toolName": "power_application_zones_regional_get",
    "sourceFile": "zones-openapi.json",
    "apiTitle": "POWER Zones API",
    "apiVersion": "v2.9.0",
    "method": "GET",
    "path": "/api/application/zones/regional",
    "operationId": "regional_data_request_api_application_zones_regional_get",
    "summary": "Regional Data Request",
    "description": "This endpoint returns a regional based thermal and thermal moisture zones response.\n\n- This endpoint returns the regional data on the source provider's grid.",
    "parameters": [
      {
        "name": "start",
        "in": "query",
        "required": true,
        "description": "This is the start time for the data request formatted as YYYY.",
        "schema": {
          "type": "integer"
        }
      },
      {
        "name": "end",
        "in": "query",
        "required": true,
        "description": "This is the end time for the data request formatted as YYYY.",
        "schema": {
          "type": "integer"
        }
      },
      {
        "name": "latitude-min",
        "in": "query",
        "required": true,
        "description": "This is the region/'s minimum latitude value.",
        "schema": {
          "type": "number"
        }
      },
      {
        "name": "latitude-max",
        "in": "query",
        "required": true,
        "description": "This is the region/'s maximum latitude value.",
        "schema": {
          "type": "number"
        }
      },
      {
        "name": "longitude-min",
        "in": "query",
        "required": true,
        "description": "This is the region/'s minimum latitude value.",
        "schema": {
          "type": "number"
        }
      },
      {
        "name": "longitude-max",
        "in": "query",
        "required": true,
        "description": "This is the region/'s maximum latitude value.",
        "schema": {
          "type": "number"
        }
      },
      {
        "name": "format",
        "in": "query",
        "required": false,
        "description": "The response objects output format.",
        "schema": {
          "type": "string"
        }
      },
      {
        "name": "user",
        "in": "query",
        "required": false,
        "description": "A user name for identification purposes.",
        "schema": {
          "type": "string"
        }
      }
    ]
  },
  {
    "toolName": "power_application_zones_global_get",
    "sourceFile": "zones-openapi.json",
    "apiTitle": "POWER Zones API",
    "apiVersion": "v2.9.0",
    "method": "GET",
    "path": "/api/application/zones/global",
    "operationId": "global_data_request_api_application_zones_global_get",
    "summary": "Global Data Request",
    "description": "This endpoint returns a global based thermal and thermal moisture zones response.\n\n- This endpoint returns the global data on the source projects grid.",
    "parameters": [
      {
        "name": "start",
        "in": "query",
        "required": true,
        "description": "This is the start time for the data request formatted as YYYY.",
        "schema": {
          "type": "integer"
        }
      },
      {
        "name": "end",
        "in": "query",
        "required": true,
        "description": "This is the end time for the data request formatted as YYYY.",
        "schema": {
          "type": "integer"
        }
      },
      {
        "name": "format",
        "in": "query",
        "required": false,
        "description": "The response objects output format.",
        "schema": {
          "type": "string"
        }
      },
      {
        "name": "user",
        "in": "query",
        "required": false,
        "description": "A user name for identification purposes.",
        "schema": {
          "type": "string"
        }
      }
    ]
  },
  {
    "toolName": "power_application_zones_configuration_get",
    "sourceFile": "zones-openapi.json",
    "apiTitle": "POWER Zones API",
    "apiVersion": "v2.9.0",
    "method": "GET",
    "path": "/api/application/zones/configuration",
    "operationId": "configuration_settings_request_api_application_zones_configuration_get",
    "summary": "Configuration Settings Request",
    "description": "This endpoint returns configuration settings of the microservice.\n\n- This includes the available data formats, time range, and more.",
    "parameters": []
  }
] as const;
export type PowerOperation = (typeof operations)[number];
