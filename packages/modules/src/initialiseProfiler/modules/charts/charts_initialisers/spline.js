import Highcharts from '@kitman/common/src/utils/HighchartDefaultOptions';
import HighchartsNoDataToDisplay from 'highcharts/modules/no-data-to-display';
import toggleVerticalPlotLabels from '../utils/toggleVerticalPlotLabels';

HighchartsNoDataToDisplay(Highcharts);

export default () => {
  /**
   *
   * Kitman Spine Chart
   *
   * Type: Spline
   *
   */

  const initChart = (splineChart) => {
    const divId = splineChart.dataset.divId;
    const height = splineChart.dataset.height;
    const unit = splineChart.dataset.unit;
    const variableTypeId = splineChart.dataset.variableTypeId;
    const variableTypes = JSON.parse(splineChart.dataset.variableTypes);
    const startDate = parseInt(splineChart.dataset.startDate, 10);
    const endDate = parseInt(splineChart.dataset.endDate, 10);
    const turnarounds = JSON.parse(splineChart.dataset.turnarounds);
    const yAxis = JSON.parse(splineChart.dataset.yAxis);
    const isLegendEnabled = splineChart.dataset.isLegendEnabled === 'true'; // convert string to boolean
    const series = JSON.parse(splineChart.dataset.series);

    const formatValue = (value, decimalPoints) => {
      let hours = null;
      let minutes = null;

      switch (variableTypeId) {
        case variableTypes.scale_id:
          return value;
        case variableTypes.sleep_duration:
          hours = Math.floor(value / 60);
          minutes = value % 60;
          return `${hours}h ${minutes}m`;
        default:
          return Highcharts.numberFormat(Math.abs(value), decimalPoints);
      }
    };

    const formatUnit = () => {
      switch (variableTypeId) {
        case variableTypes.scale_id:
        case variableTypes.sleep_duration:
          return '';
        default:
          return unit;
      }
    };

    window[`${divId}`] = new Highcharts.Chart({
      chart: {
        renderTo: divId,
        height,
        type: 'spline',
        zoomType: 'x',
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
      },
      title: {
        text: null,
      },
      xAxis: {
        type: 'datetime',
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
        lineColor: '#eeeeee',
        lineWidth: 1,
        min: startDate,
        max: endDate,
        labels: {
          style: { color: '#999999' },
        },
        tickLength: 5,
        plotLines: turnarounds.map((turnaround) => ({
          color: '#eeeeee',
          value: turnaround.end_date,
          width: 1,
          label: {
            text: `<span style="color:#ccc;" class="chart_plot_label"><small>${turnaround.value}</small></span>`,
            useHTML: true,
          },
        })),
      },
      yAxis: {
        title: {
          text: null,
        },
        labels: {
          style: { color: '#999999' },
          formatter() {
            const decimalPoints = this.axis.max - this.axis.min > 3 ? 0 : 1;
            return `<small>${formatValue(this.value, decimalPoints)}</small>`;
          },
        },
        gridLineColor: '#dddddd',
        min: yAxis.min,
        max: yAxis.max,

        tickInterval: yAxis.tick_interval,

        plotLines: yAxis.data.map((data) => ({
          value: data.value,
          color: data.colour,
          dashStyle: 'shortdash',
          width: 1,
          zIndex: 10,
          label: {
            text: `<span style="color:#777;"><small>Baseline ${
              data.value
            }${formatUnit()}</small></span>`,
            useHTML: true,
          },
        })),
      },
      tooltip: {
        useHTML: true,
        shared: true,
        formatter() {
          const points = this.points;
          const pointsLength = points.length;
          let index;
          let tooltipMarkup;
          for (index = 0; index < pointsLength; index += 1) {
            if (!tooltipMarkup) {
              tooltipMarkup = pointsLength
                ? `<div class="tooltipHeader">${Highcharts.dateFormat(
                    '%e %b %Y - %H:%m',
                    new Date(this.x)
                  )}</div>`
                : '';
            }
            tooltipMarkup += '<div class="tooltip-item">';
            tooltipMarkup += `<span style="color:${
              points[index].series.color
            }">\u25CF</span> ${points[index].series.name}:<b>&nbsp;${
              points[index].y === 0 ? 'N/A' : formatValue(points[index].y, 1)
            }</b> ${formatUnit()}`;
            tooltipMarkup += '</div>';
          }
          return tooltipMarkup;
        },
      },
      legend: {
        enabled: isLegendEnabled,
        itemStyle: {
          color: '#666666',
          fontSize: 11,
          fontWeight: 'normal',
        },
      },
      plotOptions: {
        column: {
          stacking: null,
          dataLabels: {
            enabled: true,
            color: '#666675',
            formatter: () => this.y + formatUnit(),
          },
        },
      },
      credits: {
        enabled: false,
      },
      series: series.map((serie) => ({
        name: serie.name,
        unit: serie.unit,
        color: serie.colour,
        zIndex: 2,
        data: serie.data.map((currentData) => [
          currentData.date,
          currentData.value,
        ]),
      })),
    });
  };

  $(() => {
    const splineCharts = document.getElementsByClassName('spline_chart');

    if (splineCharts.length > 0) {
      for (let i = 0; i < splineCharts.length; i++) {
        initChart(splineCharts.item(i));
      }
    }
  });
};
