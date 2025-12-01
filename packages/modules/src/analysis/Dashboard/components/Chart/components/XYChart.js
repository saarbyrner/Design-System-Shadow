// @flow
import { type ComponentType, useMemo } from 'react';
import { withNamespaces } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useOrganisation } from '@kitman/common/src/contexts/OrganisationContext';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import colors from '@kitman/common/src/variables/colors';
import { CircularProgress, Typography } from '@kitman/playbook/components';
import Chart, {
  BackgroundZone,
  CategorySeries,
  Axes,
  Tooltip,
  DateTimeSeries,
} from '@kitman/modules/src/analysis/shared/components/XYChart';
import ReferenceLine from '@kitman/modules/src/analysis/shared/components/XYChart/components/ReferenceLine';
import {
  AGGREGATE_PERIOD,
  AXIS_CONFIG,
  FORMATTING_RULE_TYPES,
  SERIES_TYPES,
} from '@kitman/modules/src/analysis/shared/components/XYChart/constants';
import { useUpdateChartWidgetMutation } from '@kitman/modules/src/analysis/Dashboard/redux/services/chartBuilder';
import {
  isWidgetInEditModeFactory,
  getChartConfig,
  getLoaderLevelByWidgetId,
} from '@kitman/modules/src/analysis/Dashboard/redux/selectors/chartBuilder';
import {
  getChartValue,
  getValueFormat,
  sortChartElements,
  sortChartDataByChartElements,
  isChartDataEmpty,
  getDefaultAxisLabel,
  getDefaultSortFunctionByGrouping,
  getFormattingRuleByType,
  handleBackgroundZoneRanges,
} from '@kitman/modules/src/analysis/Dashboard/components/Chart/utils';
import { updateChartConfig } from '@kitman/modules/src/analysis/Dashboard/redux/slices/chartBuilder';
import { processDataToAddMissingValues } from '@kitman/modules/src/analysis/shared/utils';
import { editWidgetSuccess } from '@kitman/modules/src/analysis/Dashboard/redux/actions/widgets';
import type { ChartWidgetData } from '@kitman/modules/src/analysis/Dashboard/components/ChartWidget/types';
import type { AxisConfig } from '@kitman/modules/src/analysis/shared/components/XYChart/types';
import type {
  ChartData,
  ChartElement,
} from '@kitman/modules/src/analysis/shared/types/charts';
import { LOADING_LEVEL } from '@kitman/modules/src/analysis/Dashboard/types';
import AnimatedCalculateLoader from '@kitman/modules/src/analysis/shared/components/CachingLoader/AnimatedCalculateLoader';
import { formatVerticalAxisTicks } from '@kitman/modules/src/analysis/TemplateDashboards/components/XYChart/utils';

type Props = {
  data: Array<ChartData>,
  chartElements: Array<ChartElement>,
  isEmpty: boolean,
  isLoading: boolean,
  widgetData: ChartWidgetData,
  locale?: string,
};

const style = {
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    zIndex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholder: {
    margin: '20px',
    marginLeft: '50px',
    height: '70%',
    border: `solid 1px ${colors.neutral_300}`,
    borderBottomWidth: '2px',
    borderLeftWidth: '3px',
    borderRight: 'none',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
  },
  placeholderTick: {
    borderBottom: `solid 1px ${colors.neutral_300}`,
    flex: 1,
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
  },
  levelTwoLoadingContainer: {
    inset: 0,
    position: 'absolute',
    zIndex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
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

const PLACEHOLDER_TICKS = [1, 2, 3, 4];

function XYChart(props: I18nProps<Props>) {
  const dispatch = useDispatch();
  const { organisation } = useOrganisation();
  const [updateChartWidget] = useUpdateChartWidgetMutation();

  const { containerType, containerId } = useSelector((state) => ({
    containerType: state.staticData.containerType,
    containerId: state.dashboard.activeDashboard.id,
  }));
  // defined when the user switches the aggregate period
  const isEditModeActive = useSelector(
    isWidgetInEditModeFactory(props.widgetData.id)
  );
  const chartId = props.widgetData.widget.chart_id;
  const loaderLevel: number = useSelector(
    getLoaderLevelByWidgetId(props.widgetData.id)
  );

  const {
    chartOptions,
    sortConfig,
    show_labels: showLabels,
    aggregation_period: selectedAggregatePeriod,
  } = useSelector(getChartConfig(chartId));

  const data = useMemo(() => {
    return processDataToAddMissingValues(props.data);
  }, [props.data]);

  const isChartEmpty = isChartDataEmpty(data);

  const isEmpty = props.isEmpty || (data && isChartEmpty);

  // This should be stored somewhere other than the window object.
  // There is a bigger piece of work in this so using legacy config for now
  const colorPallette =
    window.graphColours?.colours ||
    window.graphColours?.default_colours ||
    null;

  const hasLongitudinal =
    props.chartElements[0]?.config.groupings[0] === 'timestamp';

  const showSortOption: boolean =
    !hasLongitudinal && !isChartEmpty && isEditModeActive;

  const onUpdateChartWidgetConfig = (config: Object) => {
    updateChartWidget({
      widgetId: props.widgetData.id,
      containerType,
      containerId,
      widget: {
        ...props.widgetData.widget,
        config: {
          ...props.widgetData.widget?.config,
          ...config,
        },
      },
    })
      .unwrap()
      .then((response) => {
        dispatch(editWidgetSuccess(response.container_widget));
      });
  };

  const onUpdateChartConfig = (config) => {
    dispatch(
      updateChartConfig({
        chartId: props.widgetData.widget.chart_id,
        partialConfig: config,
      })
    );
    onUpdateChartWidgetConfig(config);
  };

  const [sortedChartElements, sortedChartData] = useMemo(() => {
    const sortedElements = sortChartElements(props.chartElements);
    const sortedData = sortChartDataByChartElements(data, props.chartElements);

    return [sortedElements, sortedData];
  }, [props.chartElements, data]);

  return (
    <>
      {!props.isLoading && isEmpty && (
        <div css={style.placeholder}>
          {PLACEHOLDER_TICKS.map((tickNumber) => (
            <div key={tickNumber} css={style.placeholderTick} />
          ))}
          <div css={style.placeholderText}>
            {props.isEmpty && (
              <>
                <Typography sx={{ fontWeight: '600' }} variant="body1">
                  {props.t('Nothing to see yet')}
                </Typography>
                <Typography variant="body2">
                  {props.t('A data type and time period is required')}
                </Typography>
              </>
            )}
            {!props.isEmpty && (
              <Typography sx={{ fontWeight: '600' }} variant="body1">
                {props.t('No data for selected parameters')}
              </Typography>
            )}
          </div>
        </div>
      )}
      {loaderLevel === LOADING_LEVEL.INITIAL_LOAD && (
        <div css={style.loadingContainer}>
          <CircularProgress />
        </div>
      )}
      {loaderLevel === LOADING_LEVEL.LONG_LOAD && (
        <div css={style.placeholder}>
          {[1, 2, 3, 4].map((tickNumber) => (
            <div key={tickNumber} css={style.placeholderTick} />
          ))}
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
      {data && (
        <Chart
          showSortOption={showSortOption}
          locale={organisation.locale}
          colorPallette={colorPallette}
          onSortChange={onUpdateChartConfig}
          chartId={chartId}
        >
          <Axes
            hasLongitudinal={hasLongitudinal}
            tickFormatterVerticalAxis={(
              value: string | number,
              axisConfig: AxisConfig
            ) => {
              // get the calculation from the correct chart_element
              const chartElementIndex = axisConfig === 'left' ? 0 : 1;
              if (organisation?.locale) {
                return formatVerticalAxisTicks(
                  organisation?.locale,
                  +value,
                  true,
                  sortedChartElements[chartElementIndex]?.calculation
                );
              }
              return value ? `${value}` : '';
            }}
          />
          <Tooltip />
          {sortedChartElements?.length > 0 &&
            sortedChartData?.map((dataSeries, index) => {
              // catch when data has not fully loaded, or chartElement has been removed
              if (!dataSeries || dataSeries.chart?.length < 1) {
                return null;
              }

              /**
               * Check if series is invalid and hides if so
               */
              const isDatasourceInvalid =
                dataSeries.config?.invalid_chart_elements?.[
                  sortedChartElements[index].id
                ]?.length > 0;

              if (isDatasourceInvalid) {
                return null;
              }

              const chartType =
                sortedChartElements[index]?.config?.render_options?.type;

              const groupings = sortedChartElements[index]?.config?.groupings;

              // users can choose stack or group for bars, but area charts are always stacked
              const isStack =
                sortedChartElements[index]?.config?.render_options
                  ?.stack_group_elements || chartType === SERIES_TYPES.area;

              const renderAs = isStack ? 'stack' : 'group';

              // passing name through to utilise in the <Legend/>
              const chartElementName =
                sortedChartElements[index]?.config?.render_options?.name;

              const savedSortConfig = sortedChartData[0]?.config?.sortConfig;
              const effectiveSortConfig = sortConfig || savedSortConfig;
              let finalSortConfig = { sortBy: '', sortOrder: '' };
              if (
                !hasLongitudinal &&
                `${dataSeries.id}_${index}` === effectiveSortConfig?.sortBy
              ) {
                finalSortConfig = {
                  sortBy: `${dataSeries.id}_${index}`,
                  sortOrder: effectiveSortConfig?.sortOrder,
                };
              }

              const defaultSortFunction = getDefaultSortFunctionByGrouping(
                sortedChartElements[index]?.config?.groupings[0]
              );

              const getAxisConfig = () => {
                if (window.getFlag('rep-charts-configure-axis')) {
                  return sortedChartElements[index]?.config?.render_options
                    ?.axis_config;
                }
                // still supporting current functionality until GA release
                return index === 0 ? AXIS_CONFIG.left : AXIS_CONFIG.right;
              };

              const axisConfig = getAxisConfig();

              const primaryAxis = window.getFlag('rep-charts-configure-axis')
                ? sortedChartElements[0]?.config?.render_options?.axis_config
                : AXIS_CONFIG.left;

              const commonProps = {
                key: `${dataSeries.id}_${index}`,
                id: `${dataSeries.id}_${index}`,
                data: props.isLoading ? [] : dataSeries.chart,
                type: chartType,
                name: chartElementName,
                valueAccessor: ({ value }) =>
                  getChartValue(value, sortedChartElements[index]?.calculation),
                valueFormatter: ({ value, addDecorator }) =>
                  getValueFormat(
                    value,
                    sortedChartElements[index]?.calculation,
                    addDecorator,
                    dataSeries.metadata?.rounding_places
                  ),
                categoryAccessor: (category) => category?.label ?? '',
                showLabels:
                  showLabels ?? dataSeries?.config?.show_labels ?? false,
                chartOptions: chartOptions ??
                  dataSeries?.config?.chartOptions ?? {
                    hide_null_values: false,
                    hide_zero_values: false,
                  },
                isGrouped: groupings.length > 1,
                renderAs: groupings.length > 1 ? renderAs : null,
                primaryAxis,
                axisConfig,
                axisLabel: getDefaultAxisLabel(
                  chartElementName,
                  sortedChartElements[index]?.calculation
                ),
              };

              // use aggregatePeriodSelected when defined (user selection)
              // if not, default to backend response or daily
              const selectedPeriod =
                selectedAggregatePeriod ||
                dataSeries?.config?.aggregation_period ||
                AGGREGATE_PERIOD.daily;

              const longitudinalProps = {
                showAggregatorSelector: isEditModeActive,
                aggregateValues: {
                  aggregatePeriod: selectedPeriod,
                  aggregateMethod: dataSeries.metadata.aggregation_method,
                },
                onChangeAggregatePeriod: (config) => {
                  onUpdateChartConfig(config);
                },
              };

              const summaryProps = {
                sortConfig: finalSortConfig,
                defaultSortFunction,
              };

              const backgroundZones = getFormattingRuleByType(
                sortedChartElements[index],
                FORMATTING_RULE_TYPES.background_zone
              );
              const referenceLines = getFormattingRuleByType(
                sortedChartElements[index],
                FORMATTING_RULE_TYPES.reference_line
              );

              return (
                <>
                  {hasLongitudinal ? (
                    <DateTimeSeries {...commonProps} {...longitudinalProps} />
                  ) : (
                    <CategorySeries {...commonProps} {...summaryProps} />
                  )}

                  {backgroundZones?.length > 0 &&
                    backgroundZones.map((zone, zoneIndex) => {
                      const { to, from } = handleBackgroundZoneRanges(zone);
                      return (
                        <BackgroundZone
                          // eslint-disable-next-line react/no-array-index-key
                          key={`${sortedChartElements[index].id}_${zoneIndex}_${zone.color}`}
                          color={zone.color}
                          from={from}
                          to={to}
                          axis={axisConfig}
                          label={zone.textDisplay}
                          condition={zone.condition}
                          isPrimaryAxis={primaryAxis === axisConfig}
                        />
                      );
                    })}

                  {referenceLines?.length > 0 &&
                    referenceLines.map((line, lineIndex) => {
                      const { value } = line;
                      return (
                        <ReferenceLine
                          // eslint-disable-next-line react/no-array-index-key
                          key={`${sortedChartElements[index].id}_${lineIndex}_${line.color}`}
                          condition={line.condition}
                          label={line.textDisplay}
                          color={line.color}
                          value={value}
                          axis={axisConfig}
                          isPrimaryAxis={primaryAxis === axisConfig}
                        />
                      );
                    })}
                </>
              );
            })}
        </Chart>
      )}
    </>
  );
}

export const XYChartTranslated: ComponentType<Props> =
  withNamespaces()(XYChart);
export default XYChart;
