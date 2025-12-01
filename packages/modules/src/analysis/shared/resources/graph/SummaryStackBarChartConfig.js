import { colors } from '@kitman/common/src/variables';
import { TrackEvent } from '@kitman/common/src/utils';
import { getTimePeriodName } from '@kitman/common/src/utils/status_utils';
import uniq from 'lodash/uniq';
import truncate from 'lodash/truncate';
import i18n from '@kitman/common/src/utils/i18n';
import {
  getMedicalCategoryName,
  isDrillGraph,
} from '@kitman/modules/src/analysis/shared/utils';
import BaseConfig, { graphSeriesColors } from './BaseConfig';
import {
  getDefaultDataLabel,
  buildGraphLink,
  getSortedSeriesCategories,
  sortSeriesAlphabetically,
} from './GraphUtils';

const getYaxisName = (metric) => {
  return metric.main_category === 'injury'
    ? i18n.t('No. of Injuries')
    : i18n.t('No. of Illnesses');
};

const buildSeries = (graphData) => {
  const series = [];
  const graphColours = graphSeriesColors();
  let uniqueSeriesList = [];

  if (graphData.metrics.length > 0) {
    const metric = graphData.metrics[0];
    sortSeriesAlphabetically(metric.series);
    uniqueSeriesList = uniq(
      metric.series.map((seriesData) => {
        return seriesData.name;
      })
    );

    metric.series.forEach((item) => {
      let datapoints = item.datapoints;

      // Stack graphs can have multiple series with the same name
      // We want series with the same name to have the same color
      const uniqueSeriesIndex = uniqueSeriesList.indexOf(item.name);
      const seriesColor = graphColours[uniqueSeriesIndex % graphColours.length];

      if (graphData.decorators.hide_nulls) {
        datapoints = datapoints.filter((dp) => dp.y !== null);
      }
      if (graphData.decorators.hide_zeros) {
        datapoints = datapoints.filter((dp) => dp.y !== 0);
      }

      series.push({
        yAxis: 0,
        type: 'column',
        name: item.name,
        stack: item.stack || null,
        color: seriesColor,
        data: datapoints,
        tooltip: {
          headerFormat: null,
          // eslint-disable-next-line object-shorthand, func-names
          pointFormatter: function () {
            const population = metric.category_division
              ? item.stack
              : this.name;

            const mainCategory = metric.category_division
              ? `${getMedicalCategoryName(metric.category)}: ${this.name}`
              : `${getMedicalCategoryName(metric.category)}: ${item.name}`;

            const subCategory = metric.category_division
              ? `${getMedicalCategoryName(metric.category_division)}: ${
                  item.name
                }`
              : '-';

            const timePeriod = getTimePeriodName(graphData.time_period, {
              startDate: graphData.date_range.start_date,
              endDate: graphData.date_range.end_date,
            });

            return `
          <ul class="analyticalStackGraphTooltip">
            <li>
              <span class="analyticalStackGraphTooltip__description">${getYaxisName(
                metric
              )}: </span>
              <span>${this.y}</span>
            </li>
            <li>
              <span class="analyticalStackGraphTooltip__description">${i18n.t(
                'Population'
              )}: </span>
              <span>${population}</span>
            </li>
            <li>
              <span class="analyticalStackGraphTooltip__description">${i18n.t(
                'Date Range'
              )}: </span>
              <span>${timePeriod}</span>
            </li>
            <li>
              <span class="analyticalStackGraphTooltip__description">${i18n.t(
                'Main category'
              )}: </span>
              <span>${mainCategory}</span>
            </li>
            <li>
              <span class="analyticalStackGraphTooltip__description">${i18n.t(
                'Sub category'
              )}: </span>
              <span>${subCategory}</span>
            </li>
          </ul>`;
          },
        },

        // Dashboard link
        cursor:
          metric.linked_dashboard_id && !isDrillGraph(graphData)
            ? 'pointer'
            : null,
        point: {
          events: {
            // eslint-disable-next-line object-shorthand, func-names
            click: function () {
              const linkedDashboardId = metric.linked_dashboard_id;

              if (linkedDashboardId && !isDrillGraph(graphData)) {
                TrackEvent('Graph Dashboard', 'Click', 'Click data point link');

                const graphLink = buildGraphLink({
                  linkedDashboardId: metric.linked_dashboard_id,
                  populationType: item.population_type || this.population_type,
                  populationId: item.population_id || this.population_id,
                  timePeriod: graphData.time_period,
                  timePeriodLength: metric.time_period_length,
                  dateRange: graphData.date_range,
                });

                window.location.assign(graphLink);
              }
            },
          },
        },
      });
    });
  }

  return series;
};

const buildYAxis = (graphData, graphType, graphContainsMoreThanOneStack) => {
  const yAxis = [];

  const metric = graphData.metrics[0];

  yAxis.push({
    startOnTick: false,
    stackLabels: {
      allowOverlap: true,
      rotation: graphType === 'column' ? -45 : 0,
      textAlign: graphType === 'column' ? 'center' : null,
      crop: false,
      verticalAlign: graphType === 'column' ? 'bottom' : null,
      y: graphType === 'column' ? 90 : null,
      enabled: graphContainsMoreThanOneStack,
      // eslint-disable-next-line object-shorthand, func-names
      formatter: function () {
        return truncate(this.stack, { length: 20 });
      },
      style: {
        'font-size': '12px',
        color: colors.s18,
        fontWeight: 400,
      },
      overflow: 'allow',
    },
    title: {
      text: getYaxisName(metric),
      x: graphType === 'column' ? -5 : null,
      y: graphType === 'bar' ? 3 : null,
    },
    gridLineColor: 'rgba(222, 222, 222, 0.5)',
    gridLineWidth: 1,
    allowDecimals: false,
    labels: {
      style: {
        'font-size': '12px',
        color: colors.s18,
      },
      y: graphType === 'column' ? 3 : null,
      // eslint-disable-next-line object-shorthand, func-names
      formatter: function () {
        return this.value;
      },
    },
    showLastLabel: true,
  });

  return yAxis;
};

const ChartConfig = (graphData, graphType) => {
  const stackList = graphData.metrics[0].series
    .map((item) => item.stack)
    .filter((item) => item);
  const graphContainsMoreThanOneStack = uniq(stackList).length > 1;

  const series = buildSeries(graphData);

  let sortedCategories = null;
  if (graphData.sorting?.enabled) {
    // Graph builder will NOT let you create a Multi-Metric stacked chart
    const isMultiMetric = false;
    sortedCategories = getSortedSeriesCategories(
      graphData.sorting,
      series,
      isMultiMetric
    );
  }

  const yAxis = buildYAxis(graphData, graphType, graphContainsMoreThanOneStack);

  return Object.assign({}, BaseConfig(), {
    chart: {
      plotBorderColor: 'rgba(222, 222, 222, 0.5)',
      plotBorderWidth: 1,
      inverted: graphType === 'bar' || false,
      events: {
        // eslint-disable-next-line object-shorthand, func-names
        load: function () {
          if (graphContainsMoreThanOneStack) {
            const stackLabelHeight = document
              .querySelectorAll('.highcharts-stack-labels')[0]
              .getBoundingClientRect().height;

            this.update({
              chart: {
                marginBottom:
                  graphType === 'column' ? stackLabelHeight + 20 : 15,
              },
            });
          }
        },
      },
    },
    xAxis: {
      ordinal: false,
      minorGridLineColor: colors.p01,
      type: 'category',
      categories: sortedCategories,
      tickLength: 0,
      lineWidth: 0,
      opposite: graphContainsMoreThanOneStack && graphType === 'column',
      labels: {
        style: {
          'font-size': '12px',
          color: colors.s18,
        },
      },
    },
    yAxis,
    series,
    plotOptions: {
      column: {
        stacking: 'normal',
      },
      series: {
        dataLabels: {
          ...getDefaultDataLabel(),
          enabled: graphData.decorators.data_labels,
        },
      },
    },
  });
};

export default ChartConfig;
