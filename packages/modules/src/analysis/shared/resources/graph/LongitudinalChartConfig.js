import { colors } from '@kitman/common/src/variables';
import { TrackEvent } from '@kitman/common/src/utils';
import i18n from '@kitman/common/src/utils/i18n';
import moment from 'moment';
import {
  formatYAxisLabel,
  isValueBoolean,
  isValueScale,
  aggregationMethodForHighcharts,
  getYAxisMin,
  getYAxisMax,
} from '@kitman/common/src/utils/statusChart';
import { getFullMedicalCategoryName } from '@kitman/modules/src/analysis/shared/utils';
import BaseConfig, { graphSeriesColors } from './BaseConfig';
import graphDecorator from './GraphDecorator';
import {
  getYAxisList,
  buildGraphLink,
  getDefaultDataLabel,
  getYAxisIndex,
  haveGroupedMetricsTheSameName,
  isGroupedAxis,
} from './GraphUtils';

export const getTitleXOffset = (isLeftSideMetric, graphType) => {
  if (graphType !== 'bar') {
    return isLeftSideMetric ? -5 : 5;
  }

  return null;
};

export const getTitleYOffset = (isLeftSideMetric, graphType) => {
  if (graphType === 'bar') {
    return isLeftSideMetric ? 3 : -7;
  }

  return null;
};

export const shouldAllowDecimal = (metric) => {
  if (metric.type === 'medical') {
    return false;
  }

  return !(isValueBoolean(metric.status) || isValueScale(metric.status));
};

// Ensure line series are at the front and column series at the back
export const getSeriesZIndex = (metricStyle) => {
  switch (metricStyle) {
    case 'column':
      return 0;
    case 'line':
      return 1;
    default:
      return null;
  }
};

const buildSeries = (graphData, graphType, isEventGraph) => {
  const yAxisList = getYAxisList(graphData);
  const graphColours = graphSeriesColors();
  const series = [];
  let serieCounter = 0;

  let allSeries = [];
  graphData.metrics.forEach((metric) => {
    allSeries = allSeries.concat(metric.series);
  });

  graphData.metrics.forEach((metric, metricIndex) =>
    metric.series.forEach((item) => {
      const metricConfig = {
        yAxis: getYAxisIndex(yAxisList, metricIndex, 1),
        type: graphType === 'combination' ? metric.metric_style : graphType,
        zIndex:
          graphType === 'combination'
            ? getSeriesZIndex(metric.metric_style)
            : null,
        name: item.fullname,
        // The datapoints must be sorted by category index, otherwise, the lines
        // would not follow a chronological order.
        data: item.datapoints.sort(
          (datapointA, datapointB) => datapointA[0] - datapointB[0]
        ),
        // We enforce the colour of the series on the longitudinal charts
        // because serie 1 and 2 are the injury decorators. So the colours are offset
        // by two. Setting them manually ensure the consistency with other graphs.
        // It should be removed once we remove the injury decorators.
        color: graphColours[serieCounter % graphColours.length],
        marker: {
          enabled: true,
          symbol: 'circle',
          radius: 4,
        },
        tooltip: {
          shared: true,
          stickOnContact: true,
          snap: 50,
          headerFormat: null,
          // eslint-disable-next-line object-shorthand, func-names
          pointFormatter: function () {
            let tooltipTitle = '';

            if (isEventGraph) {
              tooltipTitle = this.category;
            } else {
              let datePrefix = '';

              // Boolean values are not aggregated
              if (metric.type === 'medical' || !isValueBoolean(metric.status)) {
                switch (this.series.currentDataGrouping.unitName) {
                  case 'month':
                    datePrefix = i18n.t('Month starting');
                    break;
                  case 'week':
                    datePrefix = i18n.t('Week starting');
                    break;
                  default:
                    break;
                }
              }

              tooltipTitle = `${datePrefix} ${this.key}`;
            }

            const yValue =
              metric.type === 'medical'
                ? this.y
                : formatYAxisLabel(this.y, metric.status);

            const metricName =
              metric.type === 'medical'
                ? getFullMedicalCategoryName(
                    metric.category,
                    metric.main_category
                  )
                : metric.status.name;

            const unixTimeSeconds = moment(this.key).valueOf() / 1000;
            // index 0 and 1 are injury and illness overlays, we ignore those
            const currentSeries = allSeries[this.series.index - 2];
            const baseUrl = window.featureFlags['side-nav-update']
              ? '/analytics/injury_risk_contributing_factors'
              : '/settings/injury_risk_contributing_factors';
            const targetUrl = `${baseUrl}?athlete_id=${
              currentSeries?.population_id
            }&injury_risk_variable_uuid=${
              metric.status?.variables
                ? metric.status?.variables[0].variable
                : ''
            }&prediction_timestamp=${unixTimeSeconds}`;
            if (
              graphData.id !== null &&
              metric.status?.variables &&
              metric.status?.variables[0].source === 'kitman:injury_risk' &&
              currentSeries.population_type === 'athlete' &&
              window.getFlag('injury-risk-metrics-contributing-factors')
            ) {
              return `
                <div class="AnalyticalGraphTooltip__content">
                    <div class="AnalyticalGraphTooltip__legend">
                      <span class="AnalyticalGraphTooltip__circle" style="color:${
                        this.color
                      }">\u25CF</span>
                      <span class="AnalyticalGraphTooltip__metricName">${
                        this.series.name
                      } </span>
                      <span class="AnalyticalGraphTooltip__value"> ${
                        this.y
                      } </span>
                    </div>
                    <div class="AnalyticalGraphTooltip__footer">
                      <a href=${targetUrl}>${i18n.t('Contributing Factors')}</a>
                    </div>
                  </div>
              `;
            }

            return `
            <div>
              <span class="AnalyticalGraphTooltip__title">${tooltipTitle}</span>
              <div class="AnalyticalGraphTooltip__legend">
                <span class="AnalyticalGraphTooltip__circle" style="color:${this.color}">\u25CF</span>
                <span class="AnalyticalGraphTooltip__metricName">${metricName} </span>
                <span class="AnalyticalGraphTooltip__value"> ${yValue} </span>
              </div>
            </div>`;
          },
        },
        style: {
          pointerEvents: 'auto',
        },
        dataLabels: {
          // eslint-disable-next-line object-shorthand, func-names
          formatter: function () {
            return metric.type === 'medical'
              ? this.y
              : formatYAxisLabel(this.y, metric.status);
          },
        },
      };

      if (!isEventGraph) {
        metricConfig.dataGrouping = {
          dateTimeLabelFormats: {
            millisecond: ['%e %b %Y', '%e %b %Y', '%e %b %Y'],
            second: ['%e %b %Y', '%e %b %Y', '%e %b %Y'],
            minute: ['%e %b %Y', '%e %b %Y', '%e %b %Y'],
            hour: ['%e %b %Y', '%e %b %Y', '%e %b %Y'],
            day: ['%e %b %Y', '%e %b %Y', '%e %b %Y'],
            week: ['%e %b %Y', '%e %b %Y', '%e %b %Y'],
            month: ['%e %b %Y', '%e %b %Y', '%e %b %Y'],
            year: ['%e %b %Y', '%e %b %Y', '%e %b %Y'],
          },
          approximation: aggregationMethodForHighcharts(
            metric.type === 'medical' ? 'sum' : metric.status.aggregation_method
          ),
          enabled: metric.type === 'medical' || !isValueBoolean(metric.status),
          forced: true,
          units: [[graphData.aggregationPeriod, [1]]],
        };

        // Add dashboard link
        const linkedDashboardId = metric.linked_dashboard_id;

        if (linkedDashboardId) {
          metricConfig.cursor = 'pointer';
          metricConfig.point = {
            events: {
              click: () => {
                TrackEvent('Graph Dashboard', 'Click', 'Click data point link');

                const graphLink = buildGraphLink({
                  linkedDashboardId: metric.linked_dashboard_id,
                  populationType: item.population_type,
                  populationId: item.population_id,
                  timePeriod: graphData.time_period,
                  timePeriodLength: metric.status
                    ? metric.status.time_period_length
                    : metric.time_period_length,
                  dateRange: graphData.date_range,
                });

                window.location.assign(graphLink);
              },
            },
          };
        }
      }

      series.push(metricConfig);

      serieCounter += 1;
    })
  );

  /*
   * We need the injury series and the illness series
   * to be at the beginning of the series array.
   * We show and hide the decorators based on the array index
   * in Graph.js
   */
  series.unshift(graphDecorator(graphData.injuries, 'INJURY', graphType));
  series.unshift(graphDecorator(graphData.illnesses, 'ILLNESS', graphType));

  return series;
};

export const buildYAxis = (graphData, graphType) => {
  /*
   * First yAxis: decorators
   * Second and third yAxis: metric series
   */

  const yAxis = [];

  yAxis.push({
    // hidden y axis
    min: 0,
    max: 1,
    visible: false,
    startOnTick: false,
    endOnTick: false,
  });

  const yAxisList = getYAxisList(graphData);

  yAxisList.forEach((axis, index) => {
    const metric = graphData.metrics[axis.metricIndexes[0]];

    const isLeftSideMetric = index === 0;
    const isGrouped = isGroupedAxis(metric);
    const isRightSideMetric = index > 0;

    let metricLabel = '';
    if (metric.type === 'medical') {
      metricLabel = getFullMedicalCategoryName(
        metric.category,
        metric.main_category
      );
    } else {
      const statusUnit = metric.status.localised_unit
        ? `(${metric.status.localised_unit})`
        : '';
      metricLabel = `${metric.status.name} ${statusUnit}`;
    }

    yAxis.push({
      title: {
        text:
          isGrouped && !haveGroupedMetricsTheSameName(metric, graphData.metrics)
            ? ''
            : metricLabel,
        x: getTitleXOffset(isLeftSideMetric, graphType),
        y: getTitleYOffset(isLeftSideMetric, graphType),
      },
      opposite: isRightSideMetric,
      gridLineColor: 'rgba(222, 222, 222, 0.5)',
      gridLineWidth: 1,
      // Enforce Min and Max when the status is a boolean or a scale
      min: metric.type === 'medical' ? null : getYAxisMin(metric.status),
      max: metric.type === 'medical' ? null : getYAxisMax(metric.status),
      allowDecimals: shouldAllowDecimal(metric),
      endOnTick:
        metric.type === 'medical' ||
        !(isValueBoolean(metric.status) || isValueScale(metric.status)),
      startOnTick:
        metric.type === 'medical' ||
        !(isValueBoolean(metric.status) || isValueScale(metric.status)),
      labels: {
        style: {
          'font-size': '12px',
          color: colors.s18,
        },
        y: graphType === 'bar' ? null : 3,
        formatter() {
          return metric.type === 'medical'
            ? this.value
            : formatYAxisLabel(this.value, metric.status);
        },
      },
      showLastLabel: true,
    });
  });

  return yAxis;
};

export const ChartConfig = (graphData, graphType, isEventGraph) => {
  const series = buildSeries(graphData, graphType, isEventGraph);
  const yAxis = buildYAxis(graphData, graphType, isEventGraph);

  const chartConfig = Object.assign({}, BaseConfig(), {
    chart: {
      zoomType: 'x',
      plotBorderColor: 'rgba(222, 222, 222, 0.5)',
      plotBorderWidth: 1,
      spacingRight: graphType === 'bar' ? 50 : null,
    },
    plotOptions: {
      series: {
        dataLabels: {
          ...getDefaultDataLabel(),
          enabled: graphData.decorators.data_labels,
          format: null,
        },
        stickyTracking: true,
      },
    },
    xAxis: {
      ordinal: false,
      minorGridLineColor: '#3a8dee',
      type: isEventGraph ? 'category' : 'datetime',
      tickLength: 0,
      lineWidth: 0,
      labels: {
        style: {
          'font-size': '12px',
          color: colors.s18,
        },
        y: graphType === 'bar' ? null : 25,
      },
    },
    yAxis,
    series,
  });

  chartConfig.tooltip.crosshairs = {
    width: 2,
    color: colors.s14,
    dashStyle: 'ShortDot',
  };

  if (isEventGraph) {
    chartConfig.xAxis.categories = graphData.categories;
    chartConfig.xAxis.max = graphData.categories.length - 1;
  } else {
    chartConfig.xAxis.dateTimeLabelFormats = {
      millisecond: '%H:%M:%S.%L',
      second: '%H:%M:%S',
      minute: '%H:%M',
      hour: '%H:%M',
      day: '%e<br/><span style="font-weight: 600">%b</span>',
      week: '%e<br><span style="font-weight: 600">%b</span>',
      month: "%b '%y",
      year: '%Y',
    };
  }

  return chartConfig;
};

export default ChartConfig;
