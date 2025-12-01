// @flow
import { useSelector } from 'react-redux';
import _find from 'lodash/find';
import { withNamespaces } from 'react-i18next';
import { type ComponentType } from 'react';
import { TooltipMenu } from '@kitman/components';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { IconButton, Typography } from '@kitman/playbook/components';
import { KitmanIcon, KITMAN_ICON_NAMES } from '@kitman/playbook/icons';
import colors from '@kitman/common/src/variables/colors';
import useChartContext from '@kitman/modules/src/analysis/shared/components/XYChart/hooks/useChartContext';
import {
  getSeriesIds,
  getGranualityOptions,
} from '@kitman/modules/src/analysis/shared/components/XYChart/utils';
import { getChartConfig } from '@kitman/modules/src/analysis/Dashboard/redux/selectors/chartBuilder';

type Props = {};

const styles = {
  container: {
    position: 'absolute',
    top: '40px',
    right: '20px',
  },
  text: {
    margin: '10px 0 10px 10px',
    color: colors.grey_200,
    fontWeight: '600',
    fontSize: '14px',
  },
  addDataCta: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: 'fit-content',
    padding: '5px 10px',
    '&:hover': {
      cursor: 'pointer',
    },
  },
  icon: {
    color: colors.grey_200,
    fontSize: 'large',
    textAlign: 'center',
    padding: '2px',
    opacity: '0.75',
  },
};

const AggregatorSelector = (props: I18nProps<Props>) => {
  const { series } = useChartContext();

  const seriesIds = getSeriesIds(series);

  const chartId = seriesIds[0]?.split('_')[0];
  const chartConfig = useSelector(getChartConfig(Number(chartId)));

  // if no series is defined, return null
  if (!seriesIds || seriesIds.length < 1) {
    return null;
  }

  // aggregatePeriod is at the chart level so when we have multiple data sources, and therefore multiple series,
  // aggregatePeriod will always be the same across all series.
  const { showAggregatorSelector, aggregateValues, onChangeAggregatePeriod } =
    series[seriesIds[0]];

  if (!aggregateValues || !onChangeAggregatePeriod || !showAggregatorSelector) {
    return null;
  }

  const granualityOptions = getGranualityOptions();
  const selectedGranuality = _find(granualityOptions, {
    key: aggregateValues?.aggregatePeriod,
  });

  return (
    <div css={styles.container} data-testid="XYChart|AggregatorSelector">
      <TooltipMenu
        placement="bottom-end"
        menuItems={granualityOptions.map(({ key, label }) => {
          return {
            description: label,
            onClick: () => {
              onChangeAggregatePeriod({
                ...chartConfig,
                aggregation_period: key,
              });
            },
          };
        })}
        tooltipTriggerElement={
          <span css={styles.addDataCta}>
            {selectedGranuality?.label && (
              <Typography css={styles.text}>
                {props.t('View')} {selectedGranuality.label}
              </Typography>
            )}
            <IconButton fontSize="small" sx={styles.icon}>
              <KitmanIcon
                fontSize="small"
                name={KITMAN_ICON_NAMES.ExpandMore}
              />
            </IconButton>
          </span>
        }
        kitmanDesignSystem
      />
    </div>
  );
};

export const AggregatorSelectorTranslated: ComponentType<Props> =
  withNamespaces()(AggregatorSelector);
export default AggregatorSelector;
