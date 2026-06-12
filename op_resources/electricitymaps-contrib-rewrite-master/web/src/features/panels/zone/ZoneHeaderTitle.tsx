import Badge from 'components/Badge';
import { CountryFlag } from 'components/Flag';
import { TimeDisplay } from 'components/TimeDisplay';
import TooltipWrapper from 'components/tooltips/TooltipWrapper';
import { HiArrowLeft } from 'react-icons/hi2';
import { Link } from 'react-router-dom';
import { getCountryName, getZoneName, useTranslation } from 'translation/translation';
import { createToWithState } from 'utils/helpers';
import { getDisclaimer } from './util';

interface ZoneHeaderTitleProps {
  zoneId: string;
  isEstimated?: boolean;
  isAggregated?: boolean;
}

export default function ZoneHeaderTitle({
  zoneId,
  isAggregated,
  isEstimated,
}: ZoneHeaderTitleProps) {
  const { __ } = useTranslation();
  const title = getZoneName(zoneId);
  const isSubZone = zoneId.includes('-');
  const returnToMapLink = createToWithState('/map');
  const countryName = getCountryName(zoneId);
  const disclaimer = getDisclaimer(zoneId);
  return (
    <div className="flex w-full grow flex-row pl-2">
      <Link
        className="text-3xl mr-4 self-center"
        to={returnToMapLink}
        data-test-id="left-panel-back-button"
      >
        <HiArrowLeft />
      </Link>

      <div className="w-full">
        <div className="flex  flex-row justify-between">
          <div className="mb-0.5 flex  w-full  justify-between">
            <div className="flex  flex-row items-center ">
              <CountryFlag
                zoneId={zoneId}
                size={18}
                className="mr-2 shadow-[0_0px_3px_rgba(0,0,0,0.2)]"
              />
              <div className="flex flex-row">
                <h2
                  className="max-w-[300px] overflow-hidden truncate text-xl font-bold tracking-[-0.01em] leading-tight text-zinc-900 dark:text-zinc-50 sm:max-w-[230px] md:max-w-[270px]"
                  data-test-id="zone-name"
                >
                  {title}
                </h2>
                {isSubZone && (
                  <p className="ml-2 flex w-auto items-center whitespace-nowrap bg-zinc-100 py-0.5 px-2 text-[11px] font-bold text-zinc-500 tracking-[0.05em] uppercase font-mono dark:bg-zinc-900">
                    {countryName || zoneId}
                  </p>
                )}
              </div>
            </div>
            {disclaimer && (
              <TooltipWrapper side="bottom" tooltipContent={disclaimer}>
                <div className="mr-1 flex h-6 w-6 items-center justify-center select-none bg-zinc-100 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-50 font-mono text-xs font-bold sm:mr-0">
                  <span>i</span>
                </div>
              </TooltipWrapper>
            )}
          </div>
        </div>
        <div className="flex h-3 flex-wrap items-center gap-1 text-center">
          {isEstimated && (
            <Badge type="warning" key={'badge-est'}>
              {__('country-panel.estimated')}
            </Badge>
          )}
          {isAggregated && (
            <Badge key={'badge-agg'}>{__('country-panel.aggregated')}</Badge>
          )}
          <TimeDisplay className="whitespace-nowrap text-sm" />
        </div>
      </div>
    </div>
  );
}
