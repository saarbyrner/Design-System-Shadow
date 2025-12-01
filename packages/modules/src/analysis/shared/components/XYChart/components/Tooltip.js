// @flow
import { Fragment } from 'react';
import { Tooltip as VisXTooltip } from '@visx/xychart';
import type { TooltipData } from '@visx/xychart';
import { CircleShape } from '@visx/legend';
import { Typography } from '@kitman/playbook/components';
import useChartContext from '../hooks/useChartContext';
import { AGGREGATE_PERIOD, getTooltipTranslations } from '../constants';
import { type ChartContextType } from './Context';
import { formatDateValue, getScaleType } from '../utils';

const styles = {
  label: { fontWeight: 400, fontSize: '11px' },
  value: { fontSize: '14px', marginTop: '8px' },
  groupedValue: { fontSize: '14px' },
  groupedTooltipItem: {
    display: 'flex',
    gap: '8px',
    margin: '8px 0',
    alignItems: 'center',
  },
};

type RendererConfig = {
  series: $PropertyType<ChartContextType, 'series'>,
  locale: ?string,
};

export const getTooltipRenderer =
  ({ series, locale }: RendererConfig) =>
  (args: { tooltipData: TooltipData, colorScale: Function }) => {
    const { tooltipData } = args;
    const seriesIds = Object.keys(series);

    if (!seriesIds || seriesIds.length === 0) {
      return null;
    }

    const isMultiSeries = seriesIds?.length > 1;
    const { isGrouped } = series[seriesIds[0]];
    const scaleType = getScaleType(series);
    const isDate = scaleType === 'time';
    const tooltipMessaging = getTooltipTranslations();

    if (isGrouped || isMultiSeries) {
      const { categoryAccessor, aggregateValues } = series[seriesIds[0]];
      const category = categoryAccessor(tooltipData.nearestDatum.datum);
      const getValueFormatter = (seriesId: string) =>
        series?.[seriesId]?.valueFormatter;

      return (
        <Fragment>
          <div css={styles.label}>
            {aggregateValues?.aggregatePeriod === AGGREGATE_PERIOD.weekly && (
              <Typography sx={styles.label}>
                {tooltipMessaging.weekly}
              </Typography>
            )}

            {aggregateValues?.aggregatePeriod === AGGREGATE_PERIOD.monthly && (
              <Typography sx={styles.label}>
                {tooltipMessaging.monthly}
              </Typography>
            )}
            {isDate ? formatDateValue(category, series, locale) : category}
          </div>

          {tooltipData.datumByKey &&
            // $FlowIgnore[incompatible-use] datum is expected here as visx will return it in the shape
            Object.entries(tooltipData.datumByKey).map(([label, { datum }]) => {
              // filtering out any datums that are not in the current category

              if (categoryAccessor(datum) !== category) {
                return null;
              }

              const seriesId = label.split('-')?.[0];
              const labelGrouping = label.split('-')?.[1];
              const seriesName = series?.[seriesId]?.name;
              // Get the valueFormatter corresponding to the current series
              const valueFormatter = getValueFormatter(seriesId);
              const value = series?.[seriesId]?.valueAccessor(datum);

              return (
                <div key={label} css={styles.groupedTooltipItem}>
                  <CircleShape
                    width={12}
                    height={12}
                    fill={args.colorScale(label)}
                  />
                  {seriesName && <span css={styles.label}>{seriesName}</span>}
                  {labelGrouping && (
                    <span css={styles.label}> {` - ${labelGrouping}`}</span>
                  )}
                  <span css={styles.groupedValue}>
                    {valueFormatter({ value, addDecorator: true })}
                  </span>
                </div>
              );
            })}
        </Fragment>
      );
    }

    const { categoryAccessor, valueAccessor, valueFormatter, aggregateValues } =
      series?.[tooltipData.nearestDatum.key] || {};

    const category = categoryAccessor(tooltipData.nearestDatum.datum);
    const value = valueAccessor(tooltipData.nearestDatum.datum);

    return (
      <>
        <div css={styles.label}>
          {aggregateValues?.aggregatePeriod === AGGREGATE_PERIOD.weekly && (
            <Typography sx={styles.label}>{tooltipMessaging.weekly}</Typography>
          )}

          {aggregateValues?.aggregatePeriod === AGGREGATE_PERIOD.monthly && (
            <Typography sx={styles.label}>
              {tooltipMessaging.monthly}
            </Typography>
          )}

          {isDate ? formatDateValue(category, series, locale) : category}
        </div>
        <div css={styles.value}>
          {valueFormatter({ value, addDecorator: true })}
        </div>
      </>
    );
  };

function Tooltip() {
  const { series, locale } = useChartContext();
  return (
    <VisXTooltip
      detectBounds
      renderTooltip={getTooltipRenderer({ series, locale })}
      verticalCrosshairStyle={{ strokeDasharray: '4' }}
      showSeriesGlyphs={false}
      showHorizontalCrosshair
      showVerticalCrosshair
      snapTooltipToDatumX
      snapTooltipToDatumY
    />
  );
}

export default Tooltip;
