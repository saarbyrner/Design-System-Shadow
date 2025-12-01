import Highcharts from '@kitman/common/src/utils/HighchartDefaultOptions';
import HighchartsNoDataToDisplay from 'highcharts/modules/no-data-to-display';
import i18n from '@kitman/common/src/utils/i18n';
import { colors } from '@kitman/common/src/variables';

HighchartsNoDataToDisplay(Highcharts);

export default () => {
  const injuryByActivityChart = document.getElementById(
    'injury_by_activity_chart'
  );

  if (injuryByActivityChart) {
    const divId = injuryByActivityChart.dataset.divId;
    const height = injuryByActivityChart.dataset.height;
    const gameInjuriesData = JSON.parse(
      injuryByActivityChart.dataset.gameInjuriesData
    );
    const trainingInjuriesData = JSON.parse(
      injuryByActivityChart.dataset.trainingInjuriesData
    );
    const categories = JSON.parse(injuryByActivityChart.dataset.categories);

    // eslint-disable-next-line camelcase, no-unused-vars
    const chart_rugby_injury_events = new Highcharts.Chart({
      lang: {
        noData: i18n.t('No available data for this date range'),
      },
      chart: {
        renderTo: divId,
        height,
        type: 'column',
      },
      colors: [colors.s12, colors.s08, colors.s03, colors.p01, colors.s04],
      title: {
        text: null,
      },
      xAxis: {
        categories,
        labels: {
          rotation: -45,
          align: 'right',
        },
      },
      yAxis: {
        title: {
          text: null,
        },
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
          return ` ${this.series.name}: ${this.y}`;
        },
      },
      legend: {
        enabled: true,
        borderWidth: 0,
      },
      plotOptions: {
        column: {
          stacking: 'normal',
          dataLabels: {
            enabled: true,
            color: '#ffffff',
            // eslint-disable-next-line object-shorthand, func-names
            formatter: function () {
              return this.y > 3 ? this.y : null;
            },
          },
        },
      },
      credits: {
        enabled: false,
      },
      series: [
        {
          name: i18n.t('#sport_specific__Game_Injuries'),
          data: gameInjuriesData,
          stack: 0,
        },
        {
          name: i18n.t('Training Injuries'),
          data: trainingInjuriesData,
          stack: 0,
        },
      ],
    });
  }
};
