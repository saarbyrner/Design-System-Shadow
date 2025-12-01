// @flow
import { useContext, useMemo, useState, Fragment } from 'react';
import type { ComponentType } from 'react';
import { withNamespaces } from 'react-i18next';

import type {
  ChartType,
  ChartConfig,
  WidgetColors,
  ChartData,
} from '@kitman/modules/src/analysis/shared/types/charts';
import { ParentSize } from '@visx/responsive';
import {
  lightTheme,
  AnimatedLineSeries,
  AnimatedBarSeries,
  XYChart,
  AnimatedAxis,
  Axis,
  AnimatedGrid,
  AnimatedBarStack,
  DataContext,
  DataProvider,
  GlyphSeries,
} from '@visx/xychart';
import { LegendItem, LegendLabel, LegendOrdinal } from '@visx/legend';
import { colors } from '@kitman/common/src/variables';
import type { I18nProps } from '@kitman/common/src/types/i18n';
import { EmptyStateTranslated as EmptyState } from '@kitman/modules/src/analysis/shared/components/EmptyState';
import ScrollControls from '@kitman/modules/src/analysis/shared/components/XYChart/components/ScrollControls';
import { convertLabelsToDates } from '@kitman/modules/src/analysis/shared/components/XYChart/utils';
import useScroll from './hooks/useScroll';
import {
  valueAccessor,
  labelAccessor,
  getMinAndMax,
  getValueScale,
  getLabelScale,
  mapSummaryStackData,
  getLabelAxisTickFormatter,
  getLabelAxisNumTicks,
  isDataGrouped,
  processData,
  getChartHeight,
  getTimeDomain,
  getLineColor,
  getMargin,
  formatValueTick,
} from './utils';
import {
  MAIN_COLORS,
  OVERLAY_PREFIX,
  HORIZONTAL_PX_PER_LABEL,
} from './constants';
import Tooltip from './components/Tooltip';

type DataProps = {
  chartData: ChartData,
  chartType: ChartType,
  isColorCoded: boolean,
  widgetColors: WidgetColors,
  hideEmptyState: boolean,
  config?: ChartConfig,
  locale: string,
};

type ChartLegendProps = {
  updateVisiblityItems: Function,
  visibleItems: Object[],
};

const styles = {
  customLegend: {
    display: 'flex',
    maxHeight: '30px',
    overflowY: 'auto',
    overflowX: 'hidden',
    flexWrap: 'wrap',
    fontSize: '11px',
    cursor: 'pointer',
  },
  getCustomCircleStyling: (color) => ({
    width: '12px',
    height: '12px',
    backgroundColor: color,
    borderRadius: '50%',
  }),
  getLegendStyling: (isSelected: boolean, containsSelectedItems: boolean) => {
    if (isSelected) {
      return { fontWeight: 'bold' };
    }

    if (!isSelected && containsSelectedItems) {
      return { opacity: '0.5' };
    }

    return {};
  },
};

const ChartLegend = (props: ChartLegendProps) => {
  const { colorScale } = useContext(DataContext);

  const handleLegendClick = (category) => {
    let updatedData;
    const isSelected = props.visibleItems.find(
      (c) => c.index === category.index
    );
    if (isSelected) {
      updatedData = props.visibleItems.filter(
        (c) => c.index !== category.index
      );
    } else {
      updatedData = [...props.visibleItems, category];
    }
    props.updateVisiblityItems(updatedData);
  };

  return (
    <LegendOrdinal direction="row" itemMargin="4px" scale={colorScale}>
      {(labels) => (
        <div css={styles.customLegend}>
          {labels.map((label, index) => {
            const hideLegend = label.text.includes(OVERLAY_PREFIX);

            if (hideLegend) {
              return null;
            }

            const isSelected: boolean = !!props.visibleItems.find(
              (cat) => cat.index === index
            );
            const containsSelectedItems: boolean = !!props.visibleItems.length;

            return (
              <LegendItem key={label.index} margin="0 0 0 10px">
                <div css={styles.getCustomCircleStyling(label.value)} />
                <LegendLabel
                  data-testid={`Chart|Legend-${label.text}`}
                  onClick={() => handleLegendClick(label)}
                  css={styles.getLegendStyling(
                    isSelected,
                    containsSelectedItems
                  )}
                  align="left"
                  margin="0 0 0 5px"
                >
                  {label.text}
                </LegendLabel>
              </LegendItem>
            );
          })}
        </div>
      )}
    </LegendOrdinal>
  );
};

function Chart(
  props: I18nProps<
    DataProps & {
      width: number,
      height: number,
    }
  >
) {
  const [visibleItems, setVisibleItems] = useState([]);
  const isLegendSelected = useMemo(() => visibleItems.length, [visibleItems]);

  const chartData = props.chartData.chart || [];
  const overlays = props.chartData.overlays || [];

  let data;
  const orientation = props.config?.orientation || 'vertical';

  if (props.chartType === 'bar' && isDataGrouped(chartData)) {
    // $FlowIgnore chartData is typed in props so has correct structure
    const flattenedData = chartData.flatMap(({ values }) => values);
    data = processData(flattenedData, props.chartType, orientation);
  } else {
    data = processData(chartData, props.chartType, orientation);
  }

  const [, max] = getMinAndMax(
    isLegendSelected ? visibleItems : data,
    valueAccessor
  );
  const isGrouped = isDataGrouped(data);
  const hasLegend = isGrouped;
  const { scroll, setScroll, shouldScroll } = useScroll(
    data.length,
    props.width,
    props.chartType,
    orientation
  );

  const chartHeight = getChartHeight({
    hasLegend,
    isScrollActive: scroll.isActive,
    containerHeight: props.height,
  });

  if (data.length === 0 && !props.hideEmptyState) {
    return (
      <EmptyState
        icon="icon-bar-chart-reporting"
        title={props.t('No data available')}
        infoMessage={props.t(
          'No data available for current selection - Try updating your filters'
        )}
      />
    );
  }

  const onUpdateVisiblityItems = (updatedVisibleItems) => {
    setVisibleItems(
      updatedVisibleItems.map((uData) => {
        return {
          ...data[uData.index],
          index: uData.index,
        };
      })
    );
  };

  // Evaluates if the data/series on the chart will be shown on
  // select/deselect of legend.
  const showSeriesPerLegend = (currentLegendIndex: number): boolean => {
    const isSelected = visibleItems.find(
      (cData) => cData?.index === currentLegendIndex
    );
    return visibleItems.length > 0
      ? !!Object.keys(isSelected || {}).length
      : true;
  };

  const chartMargin = getMargin({
    shouldScroll,
    chartType: props.chartType,
    orientation,
  });

  const labelScale = getLabelScale({
    chartType: props.chartType,
    width: props.width,
    height: chartHeight,
    orientation,
    data,
    scroll,
    margin: chartMargin,
  });
  const valueScale = getValueScale({ chartType: props.chartType, max });
  const axisConfig = {
    vertical: {
      getYScale() {
        return valueScale;
      },
      getXScale() {
        return labelScale;
      },
      getXAccessor() {
        return labelAccessor;
      },
      getYAccessor() {
        return valueAccessor;
      },
      animatedAxisOrientation: 'left',
      axisOrientation: 'bottom',
    },
    horizontal: {
      getYScale() {
        return labelScale;
      },
      getXScale() {
        return valueScale;
      },
      getXAccessor() {
        return valueAccessor;
      },
      getYAccessor() {
        return labelAccessor;
      },
      animatedAxisOrientation: 'top',
      axisOrientation: 'left',
    },
  };
  const isLineChart = props.chartType === 'line';

  return (
    <DataProvider
      yScale={axisConfig[orientation].getYScale()}
      xScale={axisConfig[orientation].getXScale()}
      theme={{
        ...lightTheme,
        colors: MAIN_COLORS,
      }}
    >
      <XYChart width={props.width} margin={chartMargin} height={chartHeight}>
        <AnimatedAxis
          orientation={axisConfig[orientation].animatedAxisOrientation}
          tickFormat={(number) => formatValueTick(props.locale, number)}
          animationTrajectory="min"
          hideAxisLine
          hideTicks
        />
        {/* 
         Not using the animated axis on the value axis so horizontal 
         scroll is smoother
        */}
        <Axis
          orientation={axisConfig[orientation].axisOrientation}
          animationTrajectory="min"
          tickLabelProps={() => {
            if (shouldScroll) {
              return props.chartType === 'bar' &&
                axisConfig[orientation].axisOrientation === 'left'
                ? {
                    angle: 0,
                  }
                : {
                    angle: 300,
                    textAnchor: 'end',
                    dy: '-4',
                  };
            }

            return {};
          }}
          tickFormat={getLabelAxisTickFormatter({
            chartType: props.chartType,
            data,
          })}
          numTicks={getLabelAxisNumTicks(props.width, shouldScroll)}
          hideAxisLine
        />
        <AnimatedGrid
          rows={orientation === 'vertical'}
          columns={orientation === 'horizontal'}
          numTicks={4}
          animationTrajectory="min"
        />

        {isLineChart &&
          isGrouped &&
          // $FlowIgnore the grouped check should make this safe
          data.map(({ label, values }, index) => {
            const showSeries = showSeriesPerLegend(index);

            const glphyStyle = {
              opacity: showSeries ? '1' : '0.2',
            };
            const seriesData = convertLabelsToDates(values);
            return (
              <Fragment key={label}>
                <AnimatedLineSeries
                  key={label}
                  dataKey={label}
                  data={showSeries ? seriesData : []}
                  yAccessor={axisConfig[orientation].getYAccessor()}
                  xAccessor={axisConfig[orientation].getXAccessor()}
                  opacity={showSeries ? '1' : '0.2'}
                />

                <g style={glphyStyle}>
                  <GlyphSeries
                    key={label}
                    dataKey={label}
                    data={showSeries ? seriesData : []}
                    yAccessor={axisConfig[orientation].getYAccessor()}
                    xAccessor={axisConfig[orientation].getXAccessor()}
                    size={5}
                  />
                </g>
              </Fragment>
            );
          })}

        {isLineChart && !isGrouped && (
          <>
            <AnimatedLineSeries
              dataKey="line"
              // $FlowIgnore the grouped check should make this safe
              data={convertLabelsToDates(data)}
              yAccessor={axisConfig[orientation].getYAccessor()}
              xAccessor={axisConfig[orientation].getXAccessor()}
            />
            <GlyphSeries
              dataKey="line"
              size={5}
              // $FlowIgnore the grouped check should make this safe
              data={convertLabelsToDates(data)}
              yAccessor={axisConfig[orientation].getYAccessor()}
              xAccessor={axisConfig[orientation].getXAccessor()}
            />
          </>
        )}

        {props.chartType === 'bar' && props.isColorCoded && (
          <AnimatedBarSeries
            dataKey="bar"
            data={data}
            yAccessor={axisConfig[orientation].getYAccessor()}
            xAccessor={axisConfig[orientation].getXAccessor()}
            colorAccessor={(currentData) =>
              getLineColor(currentData, chartData, props.widgetColors)
            }
          />
        )}

        {props.chartType === 'bar' && !props.isColorCoded && (
          <AnimatedBarSeries
            dataKey="bar"
            data={data}
            yAccessor={axisConfig[orientation].getYAccessor()}
            xAccessor={axisConfig[orientation].getXAccessor()}
          />
        )}

        {props.chartType === 'summary_stack' && (
          <AnimatedBarStack>
            {
              // $FlowIgnore if chartType is summary_stack then data should be correct
              mapSummaryStackData(data).map(({ label, values }, index) => {
                const showSeries = showSeriesPerLegend(index);

                return (
                  <AnimatedBarSeries
                    key={label}
                    dataKey={label}
                    data={showSeries ? values : []}
                    yAccessor={axisConfig[orientation].getYAccessor()}
                    xAccessor={axisConfig[orientation].getXAccessor()}
                    barPadding={0.7}
                    opacity={showSeries ? '1' : '0.2'}
                  />
                );
              })
            }
          </AnimatedBarStack>
        )}
        {overlays.length > 0 &&
          overlays.map((overlay, index) => {
            const key = `${OVERLAY_PREFIX}-${index}`;
            return (
              <AnimatedLineSeries
                id={key}
                dataKey={key}
                data={getTimeDomain(data).map((item) => {
                  return {
                    label: item,
                    value: overlay.value,
                  };
                })}
                yAccessor={axisConfig[orientation].getYAccessor()}
                xAccessor={axisConfig[orientation].getXAccessor()}
                colorAccessor={() => colors.red_100}
                strokeDasharray="3, 5"
              />
            );
          })}
        <Tooltip
          locale={props.locale}
          isGrouped={isGrouped}
          chartType={props.chartType}
        />
      </XYChart>

      {shouldScroll && ['bar', 'summary_stack'].includes(props.chartType) && (
        <ScrollControls
          numItems={data.length}
          width={props.width}
          scroll={scroll}
          setScroll={setScroll}
          maxLabelWidth={HORIZONTAL_PX_PER_LABEL}
        />
      )}
      {isGrouped && (
        <ChartLegend
          visibleItems={visibleItems}
          updateVisiblityItems={onUpdateVisiblityItems}
        />
      )}
    </DataProvider>
  );
}

const XYChartResponsive = (props: DataProps) => (
  <ParentSize>{(sizeProps) => <Chart {...sizeProps} {...props} />}</ParentSize>
);

export const XYChartResponsiveTranslated: ComponentType<DataProps> =
  withNamespaces()(XYChartResponsive);

export const ChartTranslated: ComponentType<DataProps> =
  withNamespaces()(Chart);
export default Chart;
