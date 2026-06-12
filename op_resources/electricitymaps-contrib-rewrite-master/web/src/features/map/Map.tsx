import mapboxgl from 'mapbox-gl';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { ReactElement, useEffect, useMemo, useRef, useState } from 'react';
import { Layer, Map, MapRef, Source } from 'react-map-gl';
import { useCo2ColorScale, useTheme } from '../../hooks/theme';
import distributorColors from '../../data/distribuidoras-colors.json';

import useGetState from 'api/getState';
import ExchangeLayer from 'features/exchanges/ExchangeLayer';
import ZoomControls from 'features/map-controls/ZoomControls';
import { leftPanelOpenAtom } from 'features/panels/panelAtoms';
import SolarLayer from 'features/weather-layers/solar/SolarLayer';
import WindLayer from 'features/weather-layers/wind-layer/WindLayer';
import { useAtom, useSetAtom } from 'jotai';
import { useLocation, useNavigate } from 'react-router-dom';
import { Mode } from 'utils/constants';
import { createToWithState, getCO2IntensityByMode } from 'utils/helpers';
import { productionConsumptionAtom, selectedDatetimeIndexAtom } from 'utils/state/atoms';
import CustomLayer from './map-utils/CustomLayer';
import { useGetGeometries } from './map-utils/getMapGrid';
import {
  hoveredZoneAtom,
  loadingMapAtom,
  mapMovingAtom,
  mousePositionAtom,
  hoveredDistributorAtom,
} from './mapAtoms';
import { FeatureId } from './mapTypes';

const ZONE_SOURCE = 'zones-clickable';
const SOUTHERN_LATITUDE_BOUND = -78;
const NORTHERN_LATITUDE_BOUND = 85;
const MAP_STYLE = { version: 8, sources: {}, layers: [] };
const isMobile = window.innerWidth < 768;
// TODO: Selected feature-id should be stored in a global state instead (and as zoneId).
// We could even consider not changing it hear, but always reading it from the path parameter?
export default function MapPage(): ReactElement {
  const [selectedFeatureId, setSelectedFeatureId] = useState<FeatureId>();
  const [selectedDistributorId, setSelectedDistributorId] = useState<string | number>();
  const setIsMoving = useSetAtom(mapMovingAtom);
  const setMousePosition = useSetAtom(mousePositionAtom);
  const setIsLoadingMap = useSetAtom(loadingMapAtom);
  const [hoveredZone, setHoveredZone] = useAtom(hoveredZoneAtom);
  const [hoveredDistributor, setHoveredDistributor] = useAtom(hoveredDistributorAtom);
  const [selectedDatetime] = useAtom(selectedDatetimeIndexAtom);
  const setLeftPanelOpen = useSetAtom(leftPanelOpenAtom);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const location = useLocation();
  const getCo2colorScale = useCo2ColorScale();
  const navigate = useNavigate();
  const theme = useTheme();
  const [currentMode] = useAtom(productionConsumptionAtom);
  const mixMode = currentMode === Mode.CONSUMPTION ? 'consumption' : 'production';

  // Calculate layer styles only when the theme changes
  // To keep the stable and prevent excessive rerendering.
  const styles = useMemo(
    () => ({
      ocean: { 'background-color': theme.oceanColor },
      zonesBorder: {
        'line-color': [
          'case',
          ['boolean', ['feature-state', 'selected'], false],
          'white',
          theme.strokeColor,
        ],
        // Note: if stroke width is 1px, then it is faster to use fill-outline in fill layer
        'line-width': [
          'case',
          ['boolean', ['feature-state', 'selected'], false],
          (theme.strokeWidth as number) * 10,
          theme.strokeWidth,
        ],
      } as mapboxgl.LinePaint,
      zonesClickable: {
        'fill-color': [
          'coalesce',
          ['feature-state', 'color'],
          ['get', 'color'],
          theme.clickableFill,
        ],
      } as mapboxgl.FillPaint,
      zonesHover: {
        'fill-color': '#FFFFFF',
        'fill-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 0.3, 0],
      } as mapboxgl.FillPaint,
      concessionariasFill: {
        'fill-extrusion-color': [
          'case',
          ['boolean', ['feature-state', 'selected'], false],
          '#FF0066', // Magenta
          ['boolean', ['feature-state', 'hover'], false],
          '#FF6600', // Kinetic Orange
          [
            'match',
            ['get', 'ysh_agent_name'],
            ...Object.entries(distributorColors).flat(),
            '#F59E0B',
          ],
        ],
        'fill-extrusion-height': [
          'case',
          ['boolean', ['feature-state', 'selected'], false],
          120000,
          ['boolean', ['feature-state', 'hover'], false],
          80000,
          30000,
        ],
        'fill-extrusion-base': 0,
        'fill-extrusion-opacity': 0.85,
      } as any,
      concessionariasBorder: {
        'line-color': [
          'match',
          ['get', 'ysh_agent_name'],
          ...Object.entries(distributorColors).flat(),
          '#F59E0B',
        ],
        'line-width': [
          'interpolate',
          ['linear'],
          ['zoom'],
          2, 0.5,
          6, 1.2,
          10, 2.0
        ],
        'line-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 1.0, 0.4],
      } as mapboxgl.LinePaint,
      permissionariasFill: {
        'fill-extrusion-color': [
          'case',
          ['boolean', ['feature-state', 'selected'], false],
          '#FF0066', // Magenta
          ['boolean', ['feature-state', 'hover'], false],
          '#FF6600', // Kinetic Orange
          [
            'match',
            ['get', 'ysh_agent_name'],
            ...Object.entries(distributorColors).flat(),
            '#10B981',
          ],
        ],
        'fill-extrusion-height': [
          'case',
          ['boolean', ['feature-state', 'selected'], false],
          120000,
          ['boolean', ['feature-state', 'hover'], false],
          80000,
          30000,
        ],
        'fill-extrusion-base': 0,
        'fill-extrusion-opacity': 0.85,
      } as any,
      permissionariasBorder: {
        'line-color': [
          'match',
          ['get', 'ysh_agent_name'],
          ...Object.entries(distributorColors).flat(),
          '#10B981',
        ],
        'line-width': [
          'interpolate',
          ['linear'],
          ['zoom'],
          2, 0.5,
          6, 1.2,
          10, 2.0
        ],
        'line-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 1.0, 0.4],
      } as mapboxgl.LinePaint,
    }),
    [theme]
  );

  const { isLoading, isSuccess, isError, data } = useGetState();
  const mapReference = useRef<MapRef>(null);
  const geometries = useGetGeometries();

  useEffect(() => {
    // This effect colors the zones based on the co2 intensity
    const map = mapReference.current?.getMap();
    map?.touchZoomRotate.disableRotation();
    map?.touchPitch.disable();
    if (!map || isLoading || isError) {
      return;
    }

    // An issue where the map has not loaded source yet causing map errors
    const isSourceLoaded = map.getSource('zones-clickable') != undefined;
    if (!isSourceLoaded) {
      return;
    }

    for (const feature of geometries.features) {
      const { zoneId } = feature.properties;
      const zone = data.data?.zones[zoneId];
      const co2intensity =
        zone && zone[selectedDatetime.datetimeString]
          ? getCO2IntensityByMode(zone[selectedDatetime.datetimeString], mixMode)
          : undefined;

      const fillColor = co2intensity
        ? getCo2colorScale(co2intensity)
        : theme.clickableFill;

      const existingColor = map.getFeatureState({
        source: 'zones-clickable',
        id: zoneId,
      })?.color;

      if (existingColor !== fillColor) {
        map.setFeatureState(
          {
            source: 'zones-clickable',
            id: zoneId,
          },
          {
            color: fillColor,
          }
        );
      }
    }
  }, [mapReference, geometries, data, getCo2colorScale, selectedDatetime, mixMode]);

  useEffect(() => {
    // Run when path changes
    const map = mapReference.current?.getMap();
    // deselect and dehover zone when navigating to /map (e.g. using back button on mobile panel)
    if (map && location.pathname === '/map' && selectedFeatureId) {
      map.setFeatureState(
        { source: ZONE_SOURCE, id: selectedFeatureId },
        { selected: false, hover: false }
      );
      setSelectedFeatureId(undefined);
      setHoveredZone(null);
    }
  }, [location.pathname]);

  useEffect(() => {
    // Run when there is data
    const map = mapReference.current?.getMap();
    if (!map || isError || !isFirstLoad) {
      return;
    }
    if (data?.callerLocation) {
      map.flyTo({ center: [data.callerLocation[0], data.callerLocation[1]] });
      setIsFirstLoad(false);
    }
  }, [isSuccess]);
  const onClick = (event: mapboxgl.MapLayerMouseEvent) => {
    const map = mapReference.current?.getMap();
    if (!map || !event.features) {
      return;
    }
    const feature = event.features[0];
    const layerId = feature?.layer?.id;

    // Se clicou em uma distribuidora, gerencia a seleção 3D e inclina a câmera
    if (layerId === 'concessionarias-fill-layer' || layerId === 'permissionarias-fill-layer') {
      const sourceId = 'bdgd';
      const sourceLayerId = 'bdgd';

      if (selectedDistributorId) {
        map.setFeatureState(
          { source: sourceId, sourceLayer: sourceLayerId, id: selectedDistributorId },
          { selected: false }
        );
      }

      if (selectedDistributorId === feature.id) {
        setSelectedDistributorId(undefined);
      } else {
        setSelectedDistributorId(feature.id);
        map.setFeatureState(
          { source: sourceId, sourceLayer: sourceLayerId, id: feature.id },
          { selected: true }
        );
      }

      map.flyTo({
        center: [event.lngLat.lng, event.lngLat.lat],
        zoom: map.getZoom() > 5.5 ? map.getZoom() : 5.8,
        pitch: 45,
        bearing: -10,
        duration: 2000
      });
      return;
    }

    // Se clicou fora de distribuidora mas tinha uma selecionada, limpa o estado
    if (selectedDistributorId) {
      map.setFeatureState(
        { source: 'bdgd', sourceLayer: 'bdgd', id: selectedDistributorId },
        { selected: false }
      );
      setSelectedDistributorId(undefined);
    }

    // Remove state from old feature if we are no longer hovering anything,
    // or if we are hovering a different feature than the previous one
    if (selectedFeatureId && (!feature || selectedFeatureId !== feature.id)) {
      map.setFeatureState(
        { source: ZONE_SOURCE, id: selectedFeatureId },
        { selected: false }
      );
    }

    if (hoveredZone && (!feature || hoveredZone.featureId !== feature.id)) {
      map.setFeatureState(
        { source: ZONE_SOURCE, id: hoveredZone.featureId },
        { hover: false }
      );
    }
    setHoveredZone(null);
    if (feature && feature.properties) {
      setSelectedFeatureId(feature.id);
      map.setFeatureState({ source: ZONE_SOURCE, id: feature.id }, { selected: true });
      setLeftPanelOpen(true);

      const center = JSON.parse(feature.properties.center);
      const centerMinusLeftPanelWidth = [center[0] - 10, center[1]] as [number, number];
      map.flyTo({ center: isMobile ? center : centerMinusLeftPanelWidth, zoom: 3.5 });

      const zoneId = feature.properties.zoneId;
      navigate(createToWithState(`/zone/${zoneId}`));
    } else {
      setSelectedFeatureId(undefined);
      navigate(createToWithState('/map'));
    }
  };

  // TODO: Consider if we need to ignore zone hovering if the map is dragging
  const onMouseMove = (event: mapboxgl.MapLayerMouseEvent) => {
    const map = mapReference.current?.getMap();
    if (!map || !event.features) {
      return;
    }
    const feature = event.features[0];
    const layerId = feature?.layer?.id;

    const isDistributor = layerId === 'concessionarias-fill-layer' || layerId === 'permissionarias-fill-layer';

    if (isDistributor) {
      // Limpa hover de zonas primeiro
      if (hoveredZone) {
        map.setFeatureState(
          { source: ZONE_SOURCE, id: hoveredZone.featureId },
          { hover: false }
        );
        setHoveredZone(null);
      }

      const sourceId = 'bdgd';
      const sourceLayerId = 'bdgd';
      const isNewDistributor = hoveredDistributor?.featureId !== feature.id;

      if (isNewDistributor) {
        // Limpa distribuidor anterior
        if (hoveredDistributor) {
          map.setFeatureState(
            { 
              source: hoveredDistributor.source, 
              sourceLayer: hoveredDistributor.sourceLayer, 
              id: hoveredDistributor.featureId 
            },
            { hover: false }
          );
        }

        const { ysh_name, ysh_boundary_type, ysh_area_km2, areaf_km2, nome } = feature.properties || {};
        setHoveredDistributor({
          ysh_name: ysh_name || nome || 'Desconhecida',
          ysh_boundary_type: layerId === 'concessionarias-fill-layer' ? 'concessionaria' : 'permissionaria',
          ysh_area_km2: parseFloat(ysh_area_km2 || areaf_km2) || 0,
          featureId: feature.id as string | number,
          source: sourceId,
          sourceLayer: sourceLayerId
        });
        map.setFeatureState({ source: sourceId, sourceLayer: sourceLayerId, id: feature.id }, { hover: true });
      }

      setMousePosition({
        x: event.point.x,
        y: event.point.y,
      });

      return;
    }

    // Se saiu do distribuidor e foi para uma zona ou vazio
    if (hoveredDistributor) {
      map.setFeatureState(
        { 
          source: hoveredDistributor.source, 
          sourceLayer: hoveredDistributor.sourceLayer, 
          id: hoveredDistributor.featureId 
        },
        { hover: false }
      );
      setHoveredDistributor(null);
    }

    const isHoveringAZone = feature?.id !== undefined;
    const isHoveringANewZone = isHoveringAZone && hoveredZone?.featureId !== feature?.id;

    // Reset currently hovered zone if we are no longer hovering anything
    if (!isHoveringAZone && hoveredZone) {
      setHoveredZone(null);
      map.setFeatureState(
        { source: ZONE_SOURCE, id: hoveredZone?.featureId },
        { hover: false }
      );
    }

    // Do no more if we are not hovering a zone
    if (!isHoveringAZone) {
      return;
    }

    // Update mouse position to help position the tooltip
    setMousePosition({
      x: event.point.x,
      y: event.point.y,
    });

    // Update hovered zone if we are hovering a new zone
    if (isHoveringANewZone) {
      // Reset the old one first
      if (hoveredZone) {
        map.setFeatureState(
          { source: ZONE_SOURCE, id: hoveredZone?.featureId },
          { hover: false }
        );
      }

      setHoveredZone({ featureId: feature.id, zoneId: feature.properties?.zoneId });
      map.setFeatureState({ source: ZONE_SOURCE, id: feature.id }, { hover: true });
    }
  };

  const onMouseOut = () => {
    const map = mapReference.current?.getMap();
    if (!map) {
      return;
    }

    // Reset hovered state when mouse leaves map (e.g. cursor moving into panel)
    if (hoveredZone?.featureId !== undefined) {
      map.setFeatureState(
        { source: ZONE_SOURCE, id: hoveredZone?.featureId },
        { hover: false }
      );
      setHoveredZone(null);
    }

    if (hoveredDistributor) {
      map.setFeatureState(
        { 
          source: hoveredDistributor.source, 
          sourceLayer: hoveredDistributor.sourceLayer, 
          id: hoveredDistributor.featureId 
        },
        { hover: false }
      );
      setHoveredDistributor(null);
    }
  };

  const onError = (event: mapboxgl.ErrorEvent) => {
    console.error(event.error);
    setIsLoadingMap(false);
    // TODO: Show error message to user
    // TODO: Send to Sentry
    // TODO: Handle the "no webgl" error gracefully
  };

  const onLoad = () => {
    setIsLoadingMap(false);
  };

  const onDragOrZoomStart = () => {
    setIsMoving(true);
  };

  const onDragOrZoomEnd = () => {
    setIsMoving(false);
  };

  return (
    <Map
      ref={mapReference}
      initialViewState={{
        latitude: 50.905,
        longitude: 6.528,
        zoom: 2.5,
      }}
      interactiveLayerIds={['zones-clickable-layer', 'zones-hoverable-layer', 'concessionarias-fill-layer', 'permissionarias-fill-layer']}
      cursor={(hoveredZone || hoveredDistributor) ? 'pointer' : 'grab'}
      onClick={onClick}
      onLoad={onLoad}
      onError={onError}
      onMouseMove={onMouseMove}
      onMouseOut={onMouseOut}
      onDragStart={onDragOrZoomStart}
      onZoomStart={onDragOrZoomStart}
      onZoomEnd={onDragOrZoomEnd}
      dragPan={{ maxSpeed: 0 }} // Disables easing effect to improve performance on exchange layer
      onDragEnd={onDragOrZoomEnd}
      dragRotate={false}
      minZoom={0.7}
      maxBounds={[
        [Number.NEGATIVE_INFINITY, SOUTHERN_LATITUDE_BOUND],
        [Number.POSITIVE_INFINITY, NORTHERN_LATITUDE_BOUND],
      ]}
      mapLib={maplibregl}
      style={{ minWidth: '100vw', height: '100vh' }}
      mapStyle={MAP_STYLE as mapboxgl.Style}
    >
      <Layer id="ocean" type="background" paint={styles.ocean} />
      <Source id="zones-clickable" promoteId={'zoneId'} type="geojson" data={geometries}>
        <Layer id="zones-clickable-layer" type="fill" paint={styles.zonesClickable} />
        <Layer id="zones-hoverable-layer" type="fill" paint={styles.zonesHover} />
        <Layer id="zones-border" type="line" paint={styles.zonesBorder} />
      </Source>
      <Source id="bdgd" type="geojson" data="/data/bdgd.geojson" promoteId="ysh_agent_code">
        <Layer
          id="concessionarias-fill-layer"
          type="fill-extrusion"
          paint={styles.concessionariasFill}
          filter={['==', ['get', 'ysh_boundary_type'], 'concessionaria']}
        />
        <Layer
          id="concessionarias-border"
          type="line"
          paint={styles.concessionariasBorder}
          filter={['==', ['get', 'ysh_boundary_type'], 'concessionaria']}
        />
        <Layer
          id="permissionarias-fill-layer"
          type="fill-extrusion"
          paint={styles.permissionariasFill}
          filter={['==', ['get', 'ysh_boundary_type'], 'permissionaria']}
        />
        <Layer
          id="permissionarias-border"
          type="line"
          paint={styles.permissionariasBorder}
          filter={['==', ['get', 'ysh_boundary_type'], 'permissionaria']}
        />
      </Source>
      <CustomLayer>
        <WindLayer />
      </CustomLayer>
      <CustomLayer>
        <ExchangeLayer />
      </CustomLayer>
      <CustomLayer>
        <SolarLayer />
      </CustomLayer>
      <ZoomControls />
    </Map>
  );
}
