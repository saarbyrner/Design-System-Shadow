import { TrackEvent } from '@kitman/common/src/utils';
import { isDrillGraph } from '@kitman/modules/src/analysis/shared/utils';
import BaseConfig from './BaseConfig';
import { buildGraphLink } from './GraphUtils';

// We show the first yAxis label if:
// - The graph is normalized. In this case we have only one yAxis, so no risk of label overlaping.
// - The graph is denormalized and all metrics min are the same.
// We don't show the first yAxis label if:
// - The graph is denormalized and the metrics have a different min. In this case, the different labels would overlap.
export const shouldShowFirstLabel = (graphData) => {
  if (graphData.scale_type === 'normalized') {
    return true;
  }

  const metricsMin = graphData.metrics.map((metric) => metric.min);
  const haveAllMetricsTheSameMin = metricsMin.every(
    (metricMin) => metricMin === metricsMin[0]
  );

  return haveAllMetricsTheSameMin;
};

const SummaryChartConfig = (graphData, graphType) => {
  return Object.assign({}, BaseConfig(), {
    chart: {
      polar: true,
      type: graphType === 'spider' ? 'line' : 'area',
      parallelCoordinates: graphData.scale_type === 'denormalized',
    },
    pane: {
      size: '80%',
    },
    xAxis: {
      categories: graphData.metrics.map((metric) => metric.name),
      tickmarkPlacement: 'on',
      lineWidth: 0,
      labels: {
        style: { 'font-size': '12px' },
        distance: 25,
      },
    },
    yAxis: graphData.metrics.map((metric, index) => ({
      gridLineInterpolation: graphType === 'spider' ? 'polygon' : 'circle',
      lineWidth: 0,
      min:
        graphData.scale_type === 'denormalized' &&
        (metric.min === 0 || metric.min)
          ? metric.min
          : null,
      max:
        graphData.scale_type === 'denormalized' &&
        (metric.max === 0 || metric.max)
          ? metric.max
          : null,
      softMin: graphData.scale_type === 'normalized' ? -3 : null,
      softMax: graphData.scale_type === 'normalized' ? 3 : null,
      tickInterval: graphData.scale_type === 'normalized' ? 1 : null,
      endOnTick: true,
      startOnTick: true,
      tickAmount: graphData.scale_type === 'denormalized' ? 5 : undefined,
      showLastLabel: true,
      showFirstLabel: index === 0 && shouldShowFirstLabel(graphData),
      labels: {
        style: { 'pointer-events': 'none', opacity: 1 },
      },
    })),
    plotOptions: {
      series: {
        stickyTracking: false,
      },
    },
    series: graphData.series.map((item) => ({
      name: item.name,
      data:
        graphData.scale_type === 'denormalized' ? item.values : item.zScores,
      pointPlacement: graphData.scale_type === 'denormalized' ? null : 'on',
      tooltip: {
        shared: false,
        headerFormat:
          '<span class="AnalyticalGraphTooltip__title">{point.key}</span>',
        // eslint-disable-next-line object-shorthand, func-names
        pointFormatter: function () {
          return `
        <table class="AnalyticalGraphTooltip__stats">
          <tr>
            <th class="AnalyticalGraphTooltip__circle" style="color:${
              this.color
            }">\u25CF</th>
            <th class="AnalyticalGraphTooltip__statsValue">${
              item.values[this.index]
            }</th>
            <th class="AnalyticalGraphTooltip__statUnit">Value</th>
          </tr>
          <tr>
            <th class="AnalyticalGraphTooltip__circle" style="color: #FFF">\u25CF</th>
            <th class="AnalyticalGraphTooltip__statsValue">${
              graphData.scale_type === 'denormalized' ? '-' : this.y
            }</th>
            <th class="AnalyticalGraphTooltip__statUnit">Z Score</th>
          </tr>
          <tr>
            <th class="AnalyticalGraphTooltip__circle" style="color: #FFF">\u25CF</th>
            <th class="AnalyticalGraphTooltip__statsValue">${
              graphData.scale_type === 'denormalized'
                ? '-'
                : graphData.cmpStdDevs[this.index]
            }</th>
            <th class="AnalyticalGraphTooltip__statUnit">Std. Dev</th>
          </tr>
        </table>`;
        },
      },
      point: {
        events: {
          // eslint-disable-next-line object-shorthand, func-names
          mouseOver: function () {
            const metric = graphData.metrics[this.index];

            if (metric.linked_dashboard_id && !isDrillGraph(graphData)) {
              $(this.graphic.element).css('cursor', 'pointer');
            }
          },
          // eslint-disable-next-line object-shorthand, func-names
          click: function () {
            const metric = graphData.metrics[this.index];

            if (metric.linked_dashboard_id && !isDrillGraph(graphData)) {
              TrackEvent('Graph Dashboard', 'Click', 'Click data point link');

              const graphLink = buildGraphLink({
                linkedDashboardId: metric.linked_dashboard_id,
                populationType: item.population_type,
                populationId: item.population_id,
                timePeriod: item.timePeriod,
                timePeriodLength: item.time_period_length,
                dateRange: {
                  start_date: item.dateRange.startDate,
                  end_date: item.dateRange.endDate,
                },
              });

              window.location.assign(graphLink);
            }
          },
        },
      },
    })),
  });
};

export default SummaryChartConfig;
