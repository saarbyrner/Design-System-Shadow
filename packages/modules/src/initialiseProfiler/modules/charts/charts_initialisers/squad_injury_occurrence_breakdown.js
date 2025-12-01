import Highcharts from '@kitman/common/src/utils/HighchartDefaultOptions';
import HighchartsNoDataToDisplay from 'highcharts/modules/no-data-to-display';
import i18n from '@kitman/common/src/utils/i18n';

HighchartsNoDataToDisplay(Highcharts);

export default () => {
  const squadInjuryoccurrenceBreakdownChart = document.getElementById(
    'squad_injury_occurrence_breakdown_chart'
  );

  if (squadInjuryoccurrenceBreakdownChart) {
    const data = JSON.parse(
      squadInjuryoccurrenceBreakdownChart.dataset.chartData
    );
    const categories = JSON.parse(
      squadInjuryoccurrenceBreakdownChart.dataset.categories
    );

    /* Build the data arrays */
    const occurrenceData = [];
    const detailData = [];
    for (let i = 0; i < data.length; i++) {
      data[i].drilldown.categories = JSON.parse(data[i].drilldown.categories);
      data[i].drilldown.data = JSON.parse(data[i].drilldown.data);

      /* Add Occurrence data */
      occurrenceData.push({
        name: categories[i],
        y: data[i].y,
        color: data[i].color,
      });

      /* Add Detail data */
      for (let j = 0; j < data[i].drilldown.data.length; j++) {
        const brightness = 0.2 - j / data[i].drilldown.data.length / 4;
        detailData.push({
          name: data[i].drilldown.categories[j],
          y: data[i].drilldown.data[j],
          color: Highcharts.Color(data[i].color).brighten(brightness).get(),
        });
      }
    }
    // eslint-disable-next-line no-unused-vars, camelcase
    const chart_occurrence_breakdown = new Highcharts.Chart({
      lang: {
        noData: i18n.t('No available data for this date range'),
      },
      chart: {
        renderTo: 'chart_occurrence_breakdown',
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
      },
      title: {
        text: null,
      },
      tooltip: {
        // eslint-disable-next-line object-shorthand, func-names
        formatter: function () {
          return `<b>${this.point.name}</b>: ${
            Math.round(this.percentage * 10) / 10
          } %`;
        },
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            distance: 10,
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
          pointPadding: 0,
          groupPadding: 0,
          name: i18n.t('Activity'),
          data: occurrenceData,
          size: '60%',
          dataLabels: {
            formatter() {
              return this.y > 3 ? this.point.name : null;
            },
            color: 'white',
            distance: -30,
          },
        },
        {
          type: 'pie',
          pointPadding: 0,
          groupPadding: 0,
          name: i18n.t('OccurrenceDetail'),
          data: detailData,
          innerSize: '60%',
          dataLabels: {
            formatter() {
              /* display only if larger than 1 */
              return `<b>${this.point.name}:</b> ${this.y}`;
            },
          },
        },
      ],
    });
  }
};
