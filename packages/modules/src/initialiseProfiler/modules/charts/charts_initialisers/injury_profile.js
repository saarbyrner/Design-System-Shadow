import Highcharts from '@kitman/common/src/utils/HighchartDefaultOptions';
import HighchartsNoDataToDisplay from 'highcharts/modules/no-data-to-display';
import i18n from '@kitman/common/src/utils/i18n';
import { colors } from '@kitman/common/src/variables';

HighchartsNoDataToDisplay(Highcharts);

export default () => {
  const injuryProfileChart = document.getElementById('injury_profile_chart');

  if (injuryProfileChart) {
    const divId = injuryProfileChart.dataset.divId;
    const height = injuryProfileChart.dataset.height;
    const categories = JSON.parse(injuryProfileChart.dataset.categories);
    const chartData = JSON.parse(injuryProfileChart.dataset.chartData);

    // eslint-disable-next-line camelcase, no-unused-vars
    const chart_injury_profile = new Highcharts.Chart({
      lang: {
        noData: i18n.t('No available data for this date range'),
      },
      chart: {
        renderTo: divId,
        backgroundColor: colors.p06,
        height,
        type: 'line',
      },
      colors: [colors.s17, colors.p01, colors.s03, colors.s04],
      title: {
        text: null,
      },
      xAxis: {
        categories,
      },
      yAxis: {
        title: {
          text: null,
        },
        min: 0,
        labels: {
          // eslint-disable-next-line object-shorthand, func-names
          formatter: function () {
            return this.value;
          },
        },
      },
      tooltip: {
        // eslint-disable-next-line object-shorthand, func-names
        formatter: function () {
          return `${this.y} ${i18n.t('injuries this turnaround.')}`;
        },
      },
      legend: {
        enabled: true,
        borderWidth: 0,
      },
      plotOptions: {
        column: {
          stacking: null,
          dataLabels: {
            enabled: true,
            color: colors.s17,
            formatter() {
              return this.y;
            },
          },
        },
      },
      credits: {
        enabled: false,
      },
      series: [
        {
          name: i18n.t('#sport_specific__Squad_Injury_Profile'),
          data: chartData,
        },
      ],
    });
  }
};
