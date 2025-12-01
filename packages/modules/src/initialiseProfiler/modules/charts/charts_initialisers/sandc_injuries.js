import Highcharts from '@kitman/common/src/utils/HighchartDefaultOptions';
import HighchartsNoDataToDisplay from 'highcharts/modules/no-data-to-display';
import i18n from '@kitman/common/src/utils/i18n';

HighchartsNoDataToDisplay(Highcharts);

export default () => {
  const sandcInjuriesChart = document.getElementById('sandc_injuries_chart');

  if (sandcInjuriesChart) {
    const divId = sandcInjuriesChart.dataset.divId;
    const height = sandcInjuriesChart.dataset.height;
    const chartData = JSON.parse(sandcInjuriesChart.dataset.chartData);

    // eslint-disable-next-line camelcase, no-unused-vars
    const chart_sandc_injuries = new Highcharts.Chart({
      lang: {
        noData: i18n.t('No available data for this date range'),
      },
      chart: {
        renderTo: divId,
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        height,
        spacingBottom: 30,
      },
      title: {
        text: null,
      },
      tooltip: false,
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          showInLegend: false,
          size: '90%',
          dataLabels: {
            enabled: true,
            // eslint-disable-next-line object-shorthand, func-names
            formatter: function () {
              return `<b>${this.point.name}</b><br />${i18n.t('Injuries')}: ${
                this.point.y
              }`;
            },
          },
        },
      },
      credits: {
        enabled: false,
      },
      series: [
        {
          type: 'pie',
          name: i18n.t('Availability'),
          pointPadding: 0,
          groupPadding: 0,
          data: chartData,
        },
      ],
    });
  }
};
