import Highcharts from '@kitman/common/src/utils/HighchartDefaultOptions';
import HighchartsNoDataToDisplay from 'highcharts/modules/no-data-to-display';
import i18n from '@kitman/common/src/utils/i18n';
import { colors } from '@kitman/common/src/variables';

HighchartsNoDataToDisplay(Highcharts);

export default () => {
  const squadMoodAndStressChart = document.getElementById(
    'squad_mood_and_stress_chart'
  );

  if (squadMoodAndStressChart) {
    const categories = JSON.parse(squadMoodAndStressChart.dataset.categories);
    const chartData = JSON.parse(squadMoodAndStressChart.dataset.chartData);

    /**
     *
     * Wellbeing Graph
     *
     * Type: Column Chart
     *
     */

    const backgroundColour = colors.p06;
    const plotColour = colors.s13;
    const colours = [colors.s01, colors.s09];

    // eslint-disable-next-line no-unused-vars, camelcase
    const graph_wellbeing = new Highcharts.Chart({
      chart: {
        renderTo: 'graph_wellbeing',
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
          // eslint-disable-next-line object-shorthand, func-names
          formatter: function () {
            if (this.value === 0) {
              return i18n.t('Avg.');
            }
            return `${this.value}%`;
          },
        },
      },
      tooltip: {
        // eslint-disable-next-line object-shorthand, func-names
        formatter: function () {
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
            // eslint-disable-next-line object-shorthand, func-names
            formatter: function () {
              return `${this.y}%`;
            },
          },
        },
      },
      credits: {
        enabled: false,
      },
      series: chartData,
    });
  }
};
