import Highcharts from '@kitman/common/src/utils/HighchartDefaultOptions';
import HighchartsNoDataToDisplay from 'highcharts/modules/no-data-to-display';
import toggleVerticalPlotLabels from '../utils/toggleVerticalPlotLabels';

HighchartsNoDataToDisplay(Highcharts);

export default () => {
  const initChart = (splineLrChart) => {
    const divId = splineLrChart.dataset.divId;
    const height = splineLrChart.dataset.height;
    const startDate = parseInt(splineLrChart.dataset.startDate, 10);
    const endDate = parseInt(splineLrChart.dataset.endDate, 10);
    const turnarounds = JSON.parse(splineLrChart.dataset.turnarounds);
    const yAxis = JSON.parse(splineLrChart.dataset.yAxis);
    const isLegendEnabled = splineLrChart.dataset.isLegendEnabled === 'true'; // convert string to boolean
    const series = JSON.parse(splineLrChart.dataset.series);

    window[`${divId}`] = new Highcharts.Chart({
      chart: {
        renderTo: divId,
        type: 'areaspline',
        inverted: true,
        zoomType: 'x',
        height,
        events: {
          selection: (event) => {
            setTimeout(() => {
              toggleVerticalPlotLabels(event, divId);
            }, 50);
          },
          load: (event) => {
            toggleVerticalPlotLabels(event, divId);
          },
        },
        resetZoomButton: {
          theme: {
            fill: 'white',
            stroke: 'silver',
            r: 0,
            states: {
              hover: {
                fill: '#41739D',
                style: {
                  color: 'white',
                },
              },
            },
          },
        },
      },
      title: {
        text: null,
      },
      plotOptions: {
        areaspline: {
          color: '#FCECA6',
          lineColor: '#FFA70F',
          marker: {
            fillColor: '#FFA70F',
          },
        },
      },
      xAxis: {
        type: 'datetime',
        reversed: false,
        dateTimeLabelFormats: {
          millisecond: '%H:%M:%S.%L',
          second: '%H:%M:%S',
          minute: '%H:%M',
          hour: '%H:%M',
          day: '%e. %b',
          week: '%e %b',
          month: "%b '%y",
          year: '%Y',
        },
        lineColor: '#eee',
        lineWidth: 1,
        min: startDate,
        max: endDate,
        labels: {
          style: { color: '#999999' },
        },
        plotLines: turnarounds.map((turnaround) => ({
          color: '#eeeeee',
          value: turnaround.end_date,
          width: 1,
          label: {
            text: `<span style="color:#ccc;" class="chart_plot_label"><small>${turnaround.value}</small></span>`,
            useHTML: true,
            align: 'right',
            x: -5,
          },
        })),
      },
      yAxis: {
        reversed: false,
        title: {
          text: null,
        },
        gridLineColor: '#dddddd',
        labels: {
          style: { color: '#999999' },
          // eslint-disable-next-line object-shorthand, func-names
          formatter: function () {
            return (
              Highcharts.numberFormat(Math.abs(this.value), 0) +
              (yAxis.unit !== 'null' ? '' : yAxis.unit)
            );
          },
        },
        plotLines: yAxis.data.map((data) => ({
          value: data.value,
          color: '#F7DD5B',
          dashStyle: 'shortdash',
          width: 1,
          zIndex: 10,
          label: {
            text: `<span style="color:#777;"><small>Baseline ${data.text_value}</small></span>`,
            useHTML: true,
          },
        })),
      },
      tooltip: {
        shared: true,
        crosshairs: {
          color: '#FFA70F',
        },
        style: {
          zIndex: 9999,
        },
        // eslint-disable-next-line object-shorthand, func-names
        formatter: function () {
          const points = this.points;
          const pointsLength = points.length;
          let tooltipMarkup = pointsLength
            ? `<span style="font-size: 10px; color:#999;">${Highcharts.dateFormat(
                '%e %b %Y - %H:%m',
                new Date(this.x)
              )}</span><br/>`
            : '';
          let yValue = null;

          for (let index = 0; index < pointsLength; index += 1) {
            yValue = Highcharts.numberFormat(Math.abs(points[index].y), 1);
            const label = points[index].series.name;
            const n = points[index].series.name.indexOf('-');
            const unit = ` ${yAxis.unit} `; // eslint-disable-line no-unused-vars
            tooltipMarkup += `<span style="color:${
              points[index].series.color
            }">\u25CF</span> ${label
              .substring(n + 1)
              .trim()}: <b>${yValue}</b><%= data["unit"] %><br />`;
          }
          return tooltipMarkup;
        },
      },
      credits: {
        enabled: false,
      },
      legend: {
        enabled: isLegendEnabled,
        itemStyle: {
          color: '#666666',
          fontSize: 11,
          fontWeight: 'normal',
        },
      },
      series: series.map((serie) => ({
        name: serie.name,
        unit: serie.unit,
        zIndex: 2,
        data: serie.data.map((currentData) => [
          currentData.date,
          currentData.value,
        ]),
      })),
    });
  };

  $(() => {
    const splineLrCharts = document.getElementsByClassName('spline_lr_chart');

    if (splineLrCharts.length > 0) {
      for (let i = 0; i < splineLrCharts.length; i++) {
        initChart(splineLrCharts.item(i));
      }
    }
  });
};
