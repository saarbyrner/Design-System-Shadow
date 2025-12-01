// @flow
import { type ComponentType } from 'react';
import { useSelector } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import _get from 'lodash/get';
import { CircularProgress, Typography } from '@kitman/playbook/components';
import colors from '@kitman/common/src/variables/colors';
import { DEFAULT_COLORS } from '@kitman/modules/src/analysis/shared/constants';
import {
  getChartValue,
  getValueFormat,
  isChartDataEmpty,
} from '@kitman/modules/src/analysis/Dashboard/components/Chart/utils';
import AnimatedCalculateLoader from '@kitman/modules/src/analysis/shared/components/CachingLoader/AnimatedCalculateLoader';
import Pie from '@kitman/modules/src/analysis/shared/components/PieChart';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import type { ChartWidgetData } from '@kitman/modules/src/analysis/Dashboard/components/ChartWidget/types';
import {
  getChartConfig,
  getLoaderLevelByWidgetId,
} from '@kitman/modules/src/analysis/Dashboard/redux/selectors/chartBuilder';
import { LOADING_LEVEL } from '@kitman/modules/src/analysis/Dashboard/types';
import type {
  ChartData,
  ChartElement,
} from '@kitman/modules/src/analysis/shared/types/charts';

type Props = {
  data: Array<ChartData>,
  chartElements: Array<ChartElement>,
  isEmpty: boolean,
  isLoading: boolean,
  widgetData: ChartWidgetData,
  locale?: string,
};

const style = {
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderPie: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '50px',
    borderRadius: '50%',
    height: '305px',
    width: '305px',
    border: `solid 3px ${colors.neutral_300}`,
    boxShadow: `0 0 0 45px ${colors.neutral_300} inset`,
  },
  placeholderText: {
    position: 'absolute',
    height: '100%',
    left: 0,
    right: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'none',
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '50px',
    borderRadius: '50%',
    height: '305px',
    width: '305px',
  },
  levelTwoLoadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  levelTwoLoaderTitle: {
    color: colors.grey_200,
    fontWeight: 600,
  },
  levelTwoLoaderSubtitle: {
    color: colors.grey_100,
    fontWeight: 400,
  },
};

const PieChart = (props: I18nProps<Props>) => {
  const isChartEmpty = isChartDataEmpty(props.data);
  const isEmpty = props.isEmpty || (props.data && isChartEmpty);

  const chartId = props.widgetData.widget.chart_id;

  const loaderLevel: number = useSelector(
    getLoaderLevelByWidgetId(props.widgetData.id)
  );

  const isDataLoading = loaderLevel > 1;

  const { chartOptions: selectedChartOptions } = useSelector(
    getChartConfig(chartId)
  );

  const chartOptions = selectedChartOptions ??
    props.data?.[0]?.config?.chartOptions ?? {
      show_label: true,
      show_values: false,
      show_percentage: false,
    };
  const chartType = _get(
    props.chartElements,
    '[0].config.render_options.type',
    null
  );
  const calculation = _get(props.chartElements, '[0].calculation', null);

  const colorPallette =
    window.graphColours?.colours ||
    window.graphColours?.default_colours ||
    DEFAULT_COLORS;

  return (
    <div css={style.root}>
      {!props.isLoading && isEmpty && (
        <div css={style.placeholderPie}>
          <div css={style.placeholderText}>
            {props.isEmpty && (
              <>
                <Typography sx={{ fontWeight: '600' }} variant="body1">
                  {props.t('Nothing to see yet')}
                </Typography>
                <Typography variant="body2">
                  {props.t('Add a data type')}
                </Typography>
              </>
            )}
            {!props.isEmpty && (
              <Typography sx={{ fontWeight: '600' }} variant="body1">
                {props.t('No data for parameters')}
              </Typography>
            )}
          </div>
        </div>
      )}
      {loaderLevel === LOADING_LEVEL.INITIAL_LOAD && (
        <div css={style.loading}>
          <CircularProgress />
        </div>
      )}
      {loaderLevel === LOADING_LEVEL.LONG_LOAD && (
        <div css={style.placeholderPie}>
          <div css={style.levelTwoLoadingContainer}>
            <AnimatedCalculateLoader />
            <div css={style.levelTwoLoaderTitle}>
              {props.t('Calculating large dataset')}
            </div>
            <div css={style.levelTwoLoaderSubtitle}>
              {props.t('This may take a while...')}
            </div>
          </div>
        </div>
      )}
      {props.data && !isEmpty && !isDataLoading && (
        <Pie
          data={props.isLoading ? [] : _get(props.data, '[0].chart', [])}
          colors={colorPallette}
          valueAccessor={({ value }) => getChartValue(value, calculation)}
          labelAccessor={(item) => item.label}
          valueFormatter={({ value, addDecorator }) =>
            getValueFormat(
              value,
              calculation,
              addDecorator,
              props.data[0].metadata?.rounding_places
            )
          }
          type={chartType}
          chartOptions={chartOptions}
          sourceName={props.widgetData.widget.name}
        />
      )}
    </div>
  );
};

export const PieChartTranslated: ComponentType<Props> =
  withNamespaces()(PieChart);
export default PieChart;
