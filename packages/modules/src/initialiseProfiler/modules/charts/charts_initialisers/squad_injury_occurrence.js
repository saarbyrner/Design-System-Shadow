import Highcharts from '@kitman/common/src/utils/HighchartDefaultOptions';
import HighchartsNoDataToDisplay from 'highcharts/modules/no-data-to-display';
import i18n from '@kitman/common/src/utils/i18n';

HighchartsNoDataToDisplay(Highcharts);

export default () => {
  const squadInjuryOccurrenceChart = document.getElementById(
    'squad_injury_occurrence_chart'
  );

  if (squadInjuryOccurrenceChart) {
    const divId = squadInjuryOccurrenceChart.dataset.divId;
    const height = squadInjuryOccurrenceChart.dataset.height;
    const chartData = JSON.parse(squadInjuryOccurrenceChart.dataset.chartData);

    // eslint-disable-next-line no-unused-vars, camelcase
    const chart_occurrence = new Highcharts.Chart({
      lang: {
        noData: i18n.t('No available data for this date range'),
      },
      chart: {
        renderTo: divId,
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        height,
      },
      title: {
        text: null,
      },
      tooltip: {
        pointFormat: '<b>{point.percentage:.1f}%</b>',
        percentageDecimals: 1,
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            distance: 10,
            style: {
              width: '40px',
            },
          },
          showInLegend: false,
          size: '90%',
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
