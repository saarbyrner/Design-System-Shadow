import Highcharts from '@kitman/common/src/utils/HighchartDefaultOptions';
import HighchartsNoDataToDisplay from 'highcharts/modules/no-data-to-display';
import i18n from '@kitman/common/src/utils/i18n';
import { colors } from '@kitman/common/src/variables';

HighchartsNoDataToDisplay(Highcharts);

export default () => {
  const athletesWorkloadsChart = document.getElementById(
    'workloads_athletes_chart'
  );

  if (athletesWorkloadsChart) {
    const sessionColours = JSON.parse(
      athletesWorkloadsChart.dataset.sessionColours
    );
    const athletes = JSON.parse(athletesWorkloadsChart.dataset.athletes);
    const workloadsAthletesSeries = JSON.parse(
      athletesWorkloadsChart.dataset.workloadsAthletesSeries
    );

    const athleteLinks = [];
    athletes.forEach((athlete) => {
      athleteLinks.push(`<a href=${athlete.path}>${athlete.name}</a>`);
    });

    /**
     *
     * Stacked Workload
     *
     * Type: Column Chart
     *
     */

    const totalAthletes = 45;
    const xAxisLabelFormat = {
      useHTML: true,
      rotation: -45,
      align: 'right',
      y: 20,
      x: 5,
    };

    if (totalAthletes > 55) {
      xAxisLabelFormat.rotation = 270;
      xAxisLabelFormat.y = 10;
      xAxisLabelFormat.x = -1;
    }

    // eslint-disable-next-line no-unused-vars, camelcase
    const athletes_turnaround_workload = new Highcharts.Chart({
      lang: {
        noData: i18n.t('No available data for this date range'),
      },
      chart: {
        renderTo: 'workloads_athletes',
        type: 'column',
        height: 700,
        marginTop: 45,
        stacking: 'normal',
      },
      colors: sessionColours,

      title: {
        style: {
          color: colors.s06,
          font: '16px Lucida Grande, Lucida Sans Unicode, Verdana, Arial, Helvetica, sans-serif',
        },
        text: '',
      },
      subtitle: {
        text: '',
      },
      xAxis: {
        title: {
          text: i18n.t('#sport_specific__Athletes'),
        },
        labels: xAxisLabelFormat,
        categories: athleteLinks,
      },
      yAxis: {
        title: {
          text: null,
        },
        labels: {
          formatter() {
            return this.value;
          },
        },
        stackLabels: {
          enabled: false,
          style: {
            fontWeight: 'bold',
            color: (Highcharts.theme && Highcharts.theme.textColor) || 'grey',
          },
        },
      },

      tooltip: {
        formatter() {
          let s = `<b>${this.x}</b><br/>`;
          // eslint-disable-next-line func-names
          $.each(this.points, function (i, point) {
            s += `<br/><span style="color:${point.series.color};">&#9679;</span> ${point.series.name}: ${point.y}`;
          });
          s += `<br/><br/><strong>${i18n.t('Total')}: ${Highcharts.numberFormat(
            this.points[0].total,
            0
          )}</strong>`;
          return s;
        },
        shared: true,
        useHTML: true,
      },

      plotOptions: {
        column: {
          stacking: 'normal',
          dataLabels: {
            enabled: false,
            color: colors.s06,
            rotation: -90,
            x: 35,
            align: 'left',
          },
        },
      },
      legend: {
        enabled: true,
        align: 'center',
        itemStyle: {
          color: colors.s17,
          cursor: 'pointer',
          fontSize: '11px',
          fontWeight: 'normal',
        },
      },
      credits: {
        enabled: false,
      },
      series: workloadsAthletesSeries,
    });
  }
};
