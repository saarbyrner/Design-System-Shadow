import Highcharts from '@kitman/common/src/utils/HighchartDefaultOptions';
import HighchartsNoDataToDisplay from 'highcharts/modules/no-data-to-display';
import i18n from '@kitman/common/src/utils/i18n';

HighchartsNoDataToDisplay(Highcharts);

export default () => {
  const daysAbsenceInjuryChart = document.getElementById(
    'days_absence_injury_chart'
  );

  if (daysAbsenceInjuryChart) {
    const divId = daysAbsenceInjuryChart.dataset.divId;
    const height = daysAbsenceInjuryChart.dataset.height;
    const chartData = JSON.parse(daysAbsenceInjuryChart.dataset.chartData);

    // eslint-disable-next-line camelcase, no-unused-vars
    const chart_days_absence_injury = new Highcharts.Chart({
      lang: {
        noData: i18n.t('No available data for this date range'),
      },
      chart: {
        renderTo: divId,
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        height,
        spacingBottom: 40,
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
            formatter() {
              return `<b>${this.point.name}</b><br />${i18n.t(
                '{{yValue}} Days',
                { yValue: this.point.y }
              )}`;
            },
            style: {
              width: '50px',
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
