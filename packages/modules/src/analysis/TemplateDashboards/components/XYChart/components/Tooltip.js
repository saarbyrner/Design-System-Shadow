// @flow
import { Fragment } from 'react';
import { css } from '@emotion/react';
import type { ChartType } from '@kitman/modules/src/analysis/shared/types/charts';
import { Tooltip as VisXTooltip } from '@visx/xychart';
import type { TooltipData } from '@visx/xychart';
import moment from 'moment';
import { CircleShape } from '@visx/legend';
import { formatStandard } from '@kitman/common/src/utils/dateFormatter';
import { valueAccessor, labelAccessor } from '../utils';
import { MAIN_COLORS } from '../constants';

type Props = {
  chartType: ChartType,
  isGrouped: boolean,
  locale: string,
};

const styles = {
  groupedTooltipItem: css`
    display: flex;
    gap: 8px;
    margin: 8px 0;
    align-items: center;
  `,
  label: css`
    font-weight: 400;
    font-size: 11px;
  `,
  value: css`
    font-size: 14px;
  `,
  accent: css`
    background-color: ${MAIN_COLORS[0]};
    width: 2px;
    border-top-right-radius: 2px;
    border-bottom-right-radius: 2px;
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
  `,
};

export const getTooltipRenderer =
  ({ isGrouped, chartType, locale }: Props) =>
  (args: { tooltipData: TooltipData, colorScale: Function }) => {
    const tooltipData = args?.tooltipData || {};
    const dataPoints = tooltipData?.datumByKey || {};
    const nearestPoint = tooltipData?.nearestDatum?.datum;
    const globalLabel = labelAccessor(nearestPoint) || null;
    const formattedLabel =
      chartType === 'line'
        ? formatStandard({ date: moment(globalLabel) })
        : globalLabel;

    const formattedValue = (point) => {
      const value = valueAccessor(point);

      if (value === null) return ' - ';

      return Intl.NumberFormat(locale).format(value);
    };

    if (isGrouped) {
      return (
        <Fragment key={nearestPoint.key}>
          <div>{formattedLabel}</div>
          <>
            {Object.keys(dataPoints).map((key) => {
              const point = dataPoints[key];

              if (!point && !point.datum) {
                return null;
              }
              const value = formattedValue(point.datum);
              const label = labelAccessor(point.datum);

              // If there is no corresponding data for
              // a given date then visx will return the nearest datum
              // in that series, which is misleading, so filtering out
              // any values that might not match the date
              if (label !== globalLabel) {
                return null;
              }

              return (
                <div key={key} css={styles.groupedTooltipItem}>
                  <CircleShape
                    fill={args.colorScale(key)}
                    width={12}
                    height={12}
                  />
                  <span css={styles.label}>{key}</span>
                  <span css={styles.value}>{value}</span>
                </div>
              );
            })}
          </>
        </Fragment>
      );
    }

    return (
      <>
        <div css={styles.label}>{formattedLabel}</div>
        <div
          css={[
            styles.value,
            css`
              margin-top: 8px;
            `,
          ]}
        >
          {formattedValue(nearestPoint) || ' - '}
        </div>
        <div css={styles.accent} />
      </>
    );
  };

function Tooltip(props: Props) {
  return (
    <VisXTooltip
      debounce={1000}
      detectBounds
      renderTooltip={getTooltipRenderer({
        chartType: props.chartType,
        isGrouped: props.isGrouped,
        locale: props.locale,
      })}
      verticalCrosshairStyle={{ strokeDasharray: '4' }}
      horizontalCrosshairStyle={{ strokeDasharray: '4' }}
      showSeriesGlyphs={false}
      showHorizontalCrosshair
      showVerticalCrosshair
      snapTooltipToDatumX
      snapTooltipToDatumY
    />
  );
}

export default Tooltip;
