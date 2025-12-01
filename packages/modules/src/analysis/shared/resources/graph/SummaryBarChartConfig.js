import { colors } from '@kitman/common/src/variables';
import i18n from '@kitman/common/src/utils/i18n';
import { TrackEvent } from '@kitman/common/src/utils';
import moment from 'moment';
import {
  formatYAxisLabel,
  getYAxisMin,
  getYAxisMax,
  isValueScale,
  isValueBoolean,
} from '@kitman/common/src/utils/statusChart';
import {
  getFullMedicalCategoryName,
  isDrillGraph,
} from '@kitman/modules/src/analysis/shared/utils';
import BaseConfig from './BaseConfig';
import {
  getYAxisList,
  getYAxisIndex,
  isGroupedAxis,
  getDefaultDataLabel,
  haveGroupedMetricsTheSameName,
  buildGraphLink,
  getSortedSeriesCategories,
  sortSeriesAlphabetically,
} from './GraphUtils';

let isContributingFactorsGraph = false;
let isMarkerOnChart = true;
let valueOnChart = 0;

const buildSeries = (graphData, graphType, graphSubType) => {
  const yAxisList = getYAxisList(graphData);
  const series = [];
  isContributingFactorsGraph =
    graphSubType && graphSubType === 'INJURY_RISK_CONTRIBUTING_FACTORS';

  const getAthleteValueMarker = (isOnChart, value) => {
    return isOnChart
      ? `<div class="riskLevelBandsTooltip__valueMarker" style="left: ${value}px"></div>`
      : ``;
  };

  const getOutsideRangeNote = (isOnChart) => {
    return !isOnChart
      ? `<span class="riskLevelBandsTooltip__outsideRangeMarker"> ${i18n.t(
          'Value outside range'
        )}</span>`
      : ``;
  };

  const getContributingFactorsHeader = (point) => {
    const getFirstPeriod = () => {
      return point.parts.period_1
        ? `<div class="riskLevelBandsTooltip__subTitleItem">
                <span>${point.parts.period_1[0]}:</span>
                <span>${point.parts.period_1[1]}</span>
            </div>`
        : '';
    };

    const getSecondPeriod = () => {
      return point.parts.period_2
        ? `<div class="riskLevelBandsTooltip__subTitleItem">
          <span>${point.parts.period_2[0]}:</span>
          <span>${point.parts.period_2[1]}</span>
        </div>`
        : '';
    };

    return `<div class="riskLevelBandsTooltip__titleContainer">
        <span class="riskLevelBandsTooltip__title">${point.parts.name[1]}</span>
        <div class="riskLevelBandsTooltip__subTitle">
            <div class="riskLevelBandsTooltip__subTitleItem">
                <span>${point.parts.aggregation[0]}:</span>
                <span>${point.parts.aggregation[1]}</span>
            </div>
            ${getFirstPeriod()}
            ${getSecondPeriod()}
            <div class="riskLevelBandsTooltip__subTitleItem">
                <span>${point.parts.data_source[0]}:</span>
                <span>${point.parts.data_source[1]}</span>
            </div>
        </div>
      </div>`;
  };

  const riskLevelBandsContent = (point) => {
    const containerWidth = 500;
    const separatorLeft = containerWidth / 6;

    valueOnChart = point.normalized_risk_bands.value * containerWidth;
    isMarkerOnChart =
      point.normalized_risk_bands.value >= 0 &&
      point.normalized_risk_bands.value <= 1;

    const bands = () =>
      point.normalized_risk_bands.bands.map((band, index) => {
        const leftValue = Math.round(band.xstart * containerWidth);
        const rightValue =
          index === point.normalized_risk_bands.length - 1
            ? Math.round(band.xend * containerWidth)
            : Math.round(band.xend * containerWidth) + 2;
        return `<div class="riskLevelBandsTooltip__band riskLevelBandsTooltip__band--${
          band.zone
        }" style="left: ${leftValue}px; right: ${
          containerWidth - rightValue
        }px"></div>`;
      });
    return point.status_value === null
      ? `<div class="riskLevelBandsTooltip">
            ${getContributingFactorsHeader(point)}
<span class="riskLevelBandsTooltip__tag">${i18n.t('Null Value')}</span>
<p>${i18n.t(
          'There is no value on the given day, but this contributing factor is typically important.'
        )}</p>
<p>${i18n.t(
          'Learn more about'
        )} <a href="https://help.injuryprofiler.com/en/articles/5496669-risk-advisor-null-values" target="_blank">${i18n.t(
          'null value'
        )}</a>.</p>
</div>`
      : `<div class="riskLevelBandsTooltip">
                ${getContributingFactorsHeader(point)}
                <div class="riskLevelBandsTooltip__athleteValue">
                    <span class="riskLevelBandsTooltip__valueText">${i18n.t(
                      'Value:'
                    )} <span class="riskLevelBandsTooltip__valueTextValue">${
          point.status_value
        }</span> ${
          point.status_unit
            ? `<span class="riskLevelBandsTooltip__valueTextUnit">(${point.status_unit})</span>`
            : ``
        }</span>
                    ${getOutsideRangeNote(isMarkerOnChart)}
                </div>
                <div class="riskLevelBandsTooltip__legend">
                    <div>${i18n.t('Influence on injury risk')}:</div>
                    <span class="riskLevelBandsTooltip__legendItem riskLevelBandsTooltip__legendItem--severe">${i18n.t(
                      'Increasing'
                    )}</span>
                    <span class="riskLevelBandsTooltip__legendItem riskLevelBandsTooltip__legendItem--moderate">${i18n.t(
                      'Likely increasing'
                    )}</span>
                    <span class="riskLevelBandsTooltip__legendItem riskLevelBandsTooltip__legendItem--minor">${i18n.t(
                      'Likely reducing'
                    )}</span>
                    <span class="riskLevelBandsTooltip__legendItem riskLevelBandsTooltip__legendItem--low">${i18n.t(
                      'Reducing'
                    )}</span>
                    <span class="riskLevelBandsTooltip__legendItem riskLevelBandsTooltip__legendItem--athlete">${i18n.t(
                      'Athlete'
                    )}</span>
                </div>
                <div class="riskLevelBandsTooltip__chartBackground">
                    <div class="riskLevelBandsTooltip__separator" style="left: ${separatorLeft}px"><span>${
          point.x_labels[0]
        }</span></div>
                    <div class="riskLevelBandsTooltip__separator" style="left: ${
                      separatorLeft * 2
                    }px"><span>${point.x_labels[1]}</span></div>
                    <div class="riskLevelBandsTooltip__separator" style="left: ${
                      separatorLeft * 3
                    }px"><span>${point.x_labels[2]}</span></div>
                    <div class="riskLevelBandsTooltip__separator" style="left: ${
                      separatorLeft * 4
                    }px"><span>${point.x_labels[3]}</span></div>
                    <div class="riskLevelBandsTooltip__separator" style="left: ${
                      separatorLeft * 5
                    }px"><span>${point.x_labels[4]}</span></div>

                    ${getAthleteValueMarker(isMarkerOnChart, valueOnChart)}

                    ${bands()}
                </div>
            </div>`;
  };

  if (graphData.metrics.length > 0) {
    const firstMetric = graphData.metrics[0];
    sortSeriesAlphabetically(firstMetric.series);

    graphData.metrics.forEach((metric, metricIndex) =>
      metric.series.forEach((item) => {
        let datapoints = item.datapoints;

        if (graphData.decorators.hide_nulls) {
          datapoints = datapoints.filter((dp) => dp.y !== null);
        }
        if (graphData.decorators.hide_zeros) {
          datapoints = datapoints.filter((dp) => dp.y !== 0);
        }

        series.push({
          yAxis: getYAxisIndex(yAxisList, metricIndex, 0),
          type: graphType,
          name: item.name,
          data: datapoints,
          tooltip:
            graphSubType === 'INJURY_METRIC_CREATION'
              ? false
              : {
                  shared: true,
                  stickOnContact: true,
                  snap: 50,
                  headerFormat: isContributingFactorsGraph
                    ? '<div class="riskLevelBandsTooltip__hiddenTitle" />'
                    : '<span class="AnalyticalGraphTooltip__title">{point.key}</span>',
                  // eslint-disable-next-line object-shorthand, func-names
                  pointFormatter: function () {
                    if (isContributingFactorsGraph) {
                      return riskLevelBandsContent(this);
                    }

                    const unixEndTimeSeconds =
                      moment(graphData.date_range.end_date).valueOf() / 1000;
                    const unixStartTimeSeconds =
                      moment(graphData.date_range.start_date).valueOf() / 1000;
                    const isOneDayRange =
                      unixStartTimeSeconds - unixEndTimeSeconds <= 3600 * 24;
                    const baseUrl = window.featureFlags['side-nav-update']
                      ? '/analytics/injury_risk_contributing_factors'
                      : '/settings/injury_risk_contributing_factors';
                    let targetUrl = '';

                    if (
                      graphData.id !== null &&
                      metric?.status?.variables[0].source ===
                        'kitman:injury_risk' &&
                      this.options.population_type === 'athlete' &&
                      isOneDayRange &&
                      window.getFlag('injury-risk-metrics-contributing-factors')
                    ) {
                      targetUrl = `${baseUrl}?athlete_id=${this.options.population_id}&injury_risk_variable_uuid=${metric.status.variables[0].variable}&prediction_timestamp=${unixEndTimeSeconds}`;
                      return `<div class="AnalyticalGraphTooltip__content">
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
                            <a href=${targetUrl}>${i18n.t(
                        'Contributing Factors'
                      )}</a>
                          </div>
                        </div>`;
                    }

                    return `<div class="AnalyticalGraphTooltip__legend">
                    <span class="AnalyticalGraphTooltip__circle" style="color:${this.color}">\u25CF</span>
                    <span class="AnalyticalGraphTooltip__metricName">${this.series.name} </span>
                    <span class="AnalyticalGraphTooltip__value"> ${this.y} </span>
                  </div>`;
                  },
                  style: {
                    pointerEvents: 'auto',
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
                  TrackEvent(
                    'Graph Dashboard',
                    'Click',
                    'Click data point link'
                  );
                  const graphLink = buildGraphLink({
                    linkedDashboardId: metric.linked_dashboard_id,
                    populationType: this.population_type,
                    populationId: this.population_id,
                    timePeriod: graphData.time_period,
                    timePeriodLength: metric.status
                      ? metric.status.time_period_length
                      : metric.time_period_length,
                    dateRange: graphData.date_range,
                  });

                  window.location.assign(graphLink);
                }
              },
            },
          },
        });
      })
    );
  }

  return series;
};

export const shouldAllowDecimal = (metric) => {
  if (metric.type === 'medical') {
    return false;
  }

  return !(isValueBoolean(metric.status) || isValueScale(metric.status));
};

export const getTitleXOffset = (isLeftSideMetric, graphType) => {
  if (graphType === 'column') {
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

export const buildYAxis = (graphData, graphType) => {
  const yAxisList = getYAxisList(graphData);
  const yAxis = [];

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
      endOnTick: shouldAllowDecimal(metric),
      startOnTick: shouldAllowDecimal(metric),
      labels: {
        style: {
          'font-size': '12px',
          color: colors.s18,
        },
        y: graphType === 'column' ? 3 : null,
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

export const ChartConfig = (graphData, graphType, graphSubType) => {
  const series = buildSeries(graphData, graphType, graphSubType);
  let sortedCategories = null;
  if (graphData.sorting?.enabled) {
    const isMultiMetric = graphData.metrics?.length > 1;
    sortedCategories = getSortedSeriesCategories(
      graphData.sorting,
      series,
      isMultiMetric
    );
  }
  const yAxis = buildYAxis(graphData, graphType);

  return Object.assign({}, BaseConfig(), {
    chart: {
      plotBorderColor: 'rgba(222, 222, 222, 0.5)',
      plotBorderWidth: 1,
    },
    tooltip: {
      borderColor: isContributingFactorsGraph ? colors.s13 : colors.s15,
      useHTML: true,
      padding: isContributingFactorsGraph ? 30 : 10,
      backgroundColor: colors.p06,
      shadow: isContributingFactorsGraph
        ? {
            color: colors.neutral_light,
            offsetX: 1,
            offsetY: 1,
            opacity: 0.02,
            width: 12,
          }
        : false,
      borderRadius: isContributingFactorsGraph ? 5 : 8,
      style: {
        pointerEvents: 'auto',
      },
    },
    plotOptions: {
      series: {
        dataLabels: {
          ...getDefaultDataLabel(),
          enabled: graphData.decorators.data_labels,
        },
        stickyTracking: true,
      },
    },
    xAxis: {
      ordinal: false,
      minorGridLineColor: colors.p01,
      type: 'category',
      categories: sortedCategories,
      tickLength: 0,
      lineWidth: 0,
      labels: {
        style: {
          'font-size': '12px',
          color: colors.s18,
        },
        y: graphType === 'column' ? 25 : null,
      },
    },
    yAxis,
    series,
  });
};

export default ChartConfig;
