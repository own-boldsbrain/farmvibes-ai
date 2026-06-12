import * as Portal from '@radix-ui/react-portal';
import { useAtom } from 'jotai';

import useGetState from 'api/getState';
import CarbonIntensitySquare from 'components/CarbonIntensitySquare';
import { CircularGauge } from 'components/CircularGauge';
import { ZoneName } from 'components/ZoneName';
import { getSafeTooltipPosition } from 'components/tooltips/utilities';
import { useTranslation } from 'translation/translation';
import { StateZoneData } from 'types';
import { Mode } from 'utils/constants';
import { formatDate } from 'utils/formatting';
import {
  productionConsumptionAtom,
  selectedDatetimeIndexAtom,
  timeAverageAtom,
} from 'utils/state/atoms';
import { hoveredZoneAtom, mapMovingAtom, mousePositionAtom, hoveredDistributorAtom } from './mapAtoms';

function TooltipInner({
  zoneData,
  date,
  zoneId,
}: {
  date: string;
  zoneId: string;
  zoneData: StateZoneData;
}) {
  const {
    co2intensity,
    co2intensityProduction,
    fossilFuelRatio,
    fossilFuelRatioProduction,
    renewableRatio,
    renewableRatioProduction,
  } = zoneData;
  const { __ } = useTranslation();

  const [currentMode] = useAtom(productionConsumptionAtom);
  const isConsumption = currentMode === Mode.CONSUMPTION;
  const fossilFuel = (isConsumption ? fossilFuelRatio : fossilFuelRatioProduction) ?? 0;
  return (
    <div className="w-full text-center">
      <div className="pl-2">
        <ZoneName zone={zoneId} textStyle="text-base font-medium" />
        <div className="flex self-start text-xs">{date}</div>{' '}
      </div>
      <div className="flex w-full flex-grow py-1 sm:pr-2">
        <div className="flex w-full flex-grow flex-row justify-start">
          <CarbonIntensitySquare
            intensity={isConsumption ? co2intensity : co2intensityProduction}
          />
          <div className="px-4">
            <CircularGauge name={__('country-panel.lowcarbon')} ratio={1 - fossilFuel} />
          </div>
          <CircularGauge
            name={__('country-panel.renewable')}
            ratio={isConsumption ? renewableRatio : renewableRatioProduction}
          />
        </div>
      </div>
    </div>
  );
}

export default function MapTooltip() {
  const [mousePosition] = useAtom(mousePositionAtom);
  const [hoveredZone] = useAtom(hoveredZoneAtom);
  const [hoveredDistributor] = useAtom(hoveredDistributorAtom);
  const [selectedDatetime] = useAtom(selectedDatetimeIndexAtom);
  const [timeAverage] = useAtom(timeAverageAtom);
  const [isMapMoving] = useAtom(mapMovingAtom);
  const { i18n, __ } = useTranslation();
  const { data } = useGetState();

  if (isMapMoving) {
    return null;
  }

  const { x, y } = mousePosition;
  const screenWidth = window.innerWidth;

  // Renderiza Tooltip da Distribuidora se estiver em Hover nela
  if (hoveredDistributor) {
    const isConc = hoveredDistributor.ysh_boundary_type === 'concessionaria';
    const accentColor = isConc ? 'text-amber-500' : 'text-emerald-500';
    const accentBg = isConc ? 'bg-amber-500/10' : 'bg-emerald-500/10';
    const borderAccent = isConc ? 'border-amber-500/20' : 'border-emerald-500/20';
    const pos = getSafeTooltipPosition(x, y, screenWidth, 220, 120);

    return (
      <Portal.Root className="absolute left-0 top-0 h-0 w-0">
        <div
          className={`relative w-[220px] rounded border ${borderAccent} bg-zinc-900/95 p-3 text-zinc-100 shadow-xl backdrop-blur-md transition-all duration-150`}
          style={{ left: pos.x, top: pos.y }}
        >
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-1">
              <span className="text-xs font-mono uppercase tracking-widest text-zinc-500">Distribuidora</span>
              <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase ${accentBg} ${accentColor}`}>
                {isConc ? 'Concessão' : 'Permissão'}
              </span>
            </div>
            <h4 className="text-base font-bold tracking-tight text-zinc-100">{hoveredDistributor.ysh_name}</h4>
            <div className="flex flex-col text-xs text-zinc-400 font-mono mt-1 gap-0.5">
              <div className="flex justify-between">
                <span>ÁREA:</span>
                <span className="text-zinc-200">{hoveredDistributor.ysh_area_km2.toLocaleString('pt-BR', { maximumFractionDigits: 1 })} km²</span>
              </div>
              <div className="flex justify-between">
                <span>STATUS:</span>
                <span className="text-zinc-200 font-semibold">ATIVO (BDGD)</span>
              </div>
            </div>
          </div>
        </div>
      </Portal.Root>
    );
  }

  if (!hoveredZone) {
    return null;
  }

  const hoveredZoneData = data?.data?.zones[hoveredZone.zoneId] ?? undefined;
  const zoneData = hoveredZoneData
    ? data?.data?.zones[hoveredZone.zoneId][selectedDatetime.datetimeString]
    : undefined;

  const tooltipWithDataPositon = getSafeTooltipPosition(x, y, screenWidth, 290, 176);
  const emptyTooltipPosition = getSafeTooltipPosition(x, y, screenWidth, 176, 80);

  const formattedDate = formatDate(
    new Date(selectedDatetime.datetimeString),
    i18n.language,
    timeAverage
  );

  if (zoneData) {
    return (
      <Portal.Root className="absolute left-0 top-0 h-0 w-0">
        <div
          className="relative h-[176px] w-[276px] rounded border bg-zinc-50 p-3  text-sm shadow-lg dark:border-0 dark:bg-gray-900"
          style={{ left: tooltipWithDataPositon.x, top: tooltipWithDataPositon.y }}
        >
          <div>
            <TooltipInner
              zoneData={zoneData}
              zoneId={hoveredZone.zoneId}
              date={formattedDate}
            />
          </div>
        </div>
      </Portal.Root>
    );
  }
  return (
    <Portal.Root className="absolute left-0 top-0 h-0 w-0">
      <div
        className="relative h-[80px] w-[176px] rounded border bg-zinc-50 p-3 text-center text-sm drop-shadow-sm dark:border-0 dark:bg-gray-900"
        style={{ left: emptyTooltipPosition.x, top: emptyTooltipPosition.y }}
      >
        <div>
          <ZoneName zone={hoveredZone.zoneId} textStyle="font-medium" />
          <div className="flex self-start text-xs">{formattedDate}</div>
          <p className="text-start">{__('tooltips.noParserInfo')}</p>
        </div>
      </div>
    </Portal.Root>
  );
}
