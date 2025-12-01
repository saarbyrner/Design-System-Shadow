import Highcharts from '@kitman/common/src/utils/HighchartDefaultOptions';
import HighchartsNoDataToDisplay from 'highcharts/modules/no-data-to-display';
import i18n from '@kitman/common/src/utils/i18n';
import { colors } from '@kitman/common/src/variables';

HighchartsNoDataToDisplay(Highcharts);

export default () => {
  const squadSitAndReachChart = document.getElementById(
    'squad_sit_and_reach_chart'
  );

  if (squadSitAndReachChart) {
    const categories = JSON.parse(squadSitAndReachChart.dataset.categories);
    const chartData = JSON.parse(squadSitAndReachChart.dataset.chartData);

    /**
     *
     * Sit & Reach Graph
     *
     * Type: Column Chart
     *
     */

    const backgroundColour = colors.p06;
    const plotColour = colors.s13;
    const colours = [colors.s01];

    // eslint-disable-next-line no-unused-vars, camelcase
    const graph_sit_reach = new Highcharts.Chart({
      chart: {
        renderTo: 'squad_chart_sit_and_reach',
        backgroundColor: backgroundColour,
        height: 200,
        type: 'column',
        style: {
          fontFamily: 'Open Sans',
        },
      },
      colors: colours,
      title: {
        text: null,
      },
      xAxis: {
        categories,
        labels: {
          rotation: -45,
          align: 'right',
        },
        plotBands: [
          {
            color: plotColour,
            from: 2.5,
            to: 4,
          },
        ],
      },
      yAxis: {
        title: {
          text: null,
        },
        labels: {
          formatter() {
            if (this.value === 0) {
              return i18n.t('Avg.');
            }
            return `${this.value}%`;
          },
        },
      },
      tooltip: {
        formatter() {
          return `${this.series.name}: ${this.y}%`;
        },
      },
      legend: {
        enabled: false,
      },
      plotOptions: {
        column: {
          stacking: null,
          dataLabels: {
            enabled: true,
            color: '#666675',
            formatter() {
              return `${this.y}%`;
            },
          },
        },
      },
      credits: {
        enabled: false,
      },
      series: [
        {
          name: i18n.t('Sit &amp; Reach'),
          data: chartData,
        },
      ],
    });
  }
};
