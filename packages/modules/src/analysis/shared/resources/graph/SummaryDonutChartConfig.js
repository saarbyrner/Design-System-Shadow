import truncate from 'lodash/truncate';
import { TrackEvent } from '@kitman/common/src/utils';
import { isDrillGraph } from '@kitman/modules/src/analysis/shared/utils';
import BaseConfig from './BaseConfig';
import { buildGraphLink, sortDatapoints } from './GraphUtils';

const ChartConfig = (graphData, graphType) => {
  // As pie has no inbuilt dataSorting support we modify the datapoints order
  const datapoints =
    graphData.metrics[0].series.length > 0
      ? graphData.metrics[0].series[0].datapoints
      : [];

  if (graphData.sorting?.enabled) {
    sortDatapoints(graphData.sorting, datapoints);
  }

  const unit =
    graphData.metrics[0].measurement_type === 'percentage' ? '%' : '';
  return Object.assign({}, BaseConfig(), {
    chart: {
      type: 'pie',
      marginBottom: 20,
    },
    plotOptions: {
      pie: {
        dataSorting: {
          enabled: graphData.sorting?.enabled,
          sortKey: graphData.sorting?.sortKey
            ? graphData.sorting?.sortKey
            : 'y',
        },
        innerSize: graphType === 'donut' ? '60%' : '0%',
        dataLabels: {
          crop: true,
          // eslint-disable-next-line object-shorthand, func-names
          formatter: function () {
            return `
              <div class="AnalyticalGraphLabel">
              <span class="AnalyticalGraphLabel__name">${truncate(
                this.point.name,
                { length: 30 }
              )}<span>
                <span class="AnalyticalGraphLabel__value"> ${
                  this.point.y
                }${unit}<span>
              </div>
            `;
          },
          useHTML: true,
        },
      },
    },
    tooltip: {
      useHTML: true,
      formatter() {
        return `
          <div class="AnalyticalGraphTooltip AnalyticalGraphTooltip--htmlContainer" style="border-color:${this.color}">
            <span class="AnalyticalGraphTooltip__title">${this.key}</span>
            <div class="AnalyticalGraphTooltip__legend">
              <span class="AnalyticalGraphTooltip__circle" style="color:${this.color}">\u25CF</span>
              <span class="AnalyticalGraphTooltip__value"> ${this.y}${unit} </span>
            </div>
          </div>
        `;
      },
      // remove SVG styles as they would appear
      // bellow html elements (exemple: labels)
      backgroundColor: 'rgba(255,255,255,0)',
      borderWidth: 0,
      borderRadius: 0,
      shadow: false,
    },
    series: [
      {
        data: datapoints,

        // Dashboard link
        cursor:
          graphData.metrics[0].linked_dashboard_id && !isDrillGraph(graphData)
            ? 'pointer'
            : null,
        point: {
          events: {
            click: () => {
              const linkedDashboardId =
                graphData.metrics[0].linked_dashboard_id;

              if (linkedDashboardId && !isDrillGraph(graphData)) {
                TrackEvent('Graph Dashboard', 'Click', 'Click data point link');

                const graphLink = buildGraphLink({
                  linkedDashboardId: graphData.metrics[0].linked_dashboard_id,
                  populationType:
                    graphData.metrics[0].series[0].population_type,
                  populationId: graphData.metrics[0].series[0].population_id,
                  timePeriod: graphData.time_period,
                  timePeriodLength: graphData.metrics[0].time_period_length,
                  dateRange: graphData.date_range,
                });

                window.location.assign(graphLink);
              }
            },
          },
        },
      },
    ],
  });
};

export default ChartConfig;
