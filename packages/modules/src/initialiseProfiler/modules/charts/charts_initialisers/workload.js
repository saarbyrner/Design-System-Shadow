import Highcharts from '@kitman/common/src/utils/HighchartDefaultOptions';
import i18n from '@kitman/common/src/utils/i18n';
import { colors } from '@kitman/common/src/variables';

export default () => {
  const workloadChart = document.getElementById('workloads_chart');

  if (workloadChart) {
    const divId = 'workloads_chart';
    const metricNames = JSON.parse(workloadChart.dataset.metricNames);
    const primaryWorkloadExists = JSON.parse(
      workloadChart.dataset.primaryWorkloadExists
    );
    const xAxisPlotLines = JSON.parse(workloadChart.dataset.xAxisPlotLines);
    const xAxisPlotBands = JSON.parse(workloadChart.dataset.xAxisPlotBands);
    const series = JSON.parse(workloadChart.dataset.series);

    let tooltipPrefix = '';

    // eslint-disable-next-line no-unused-vars, camelcase
    const workload_chart = Highcharts.StockChart(
      {
        lang: {
          noData: i18n.t('No available data for this date range'),
        },
        chart: {
          alignTicks: false,
          zoomType: 'x',
          height: 600,
          renderTo: divId,
          className: divId,
          events: {
            redraw: () => {},
          },
        },

        rangeSelector: {
          enabled: false,
        },

        navigator: {
          enabled: false,
        },

        credits: {
          enabled: false,
        },

        scrollbar: {
          enabled: false,
        },

        legend: {
          enabled: true,
          itemStyle: {
            color: colors.s17,
            cursor: 'pointer',
            fontSize: '11px',
            fontWeight: 'normal',
          },
        },

        tooltip: {
          formatter() {
            let s = `<b>${tooltipPrefix} ${Highcharts.dateFormat(
              '%a %e %B %Y',
              new Date(this.x)
            )}</b><br/>`;
            $.each(this.points, (i, point) => {
              if (point.series.options.stack === 'primary') {
                s += `<br/> <span style="color:${
                  point.series.color
                };">&#9679;</span> ${
                  point.series.name
                }: ${Highcharts.numberFormat(point.y, 1)}`;
              }
              if (point.series.options.stack === 'average') {
                s += `<br/><br/><span style="color:#666;">${i18n.t(
                  'Average'
                )}: ${Highcharts.numberFormat(point.y, 1)}</span>`;
              }
            });

            $.each(this.points, (i, point) => {
              if (point.series.options.stack === 'planned') {
                s += `<br/><br/><span style="color:${
                  point.series.color
                };"></span> ${point.series.name}: ${Highcharts.numberFormat(
                  point.total,
                  1
                )}`;
              }
            });

            s += `<br/><br/><strong>${i18n.t(
              'Total'
            )}: ${Highcharts.numberFormat(this.points[0].total, 1)}</strong>`;

            $.each(this.points, (i, point) => {
              if (point.series.options.stack === 'secondary') {
                s += `<br/><br/> <span style="color:${
                  point.series.color
                };">&#9679;</span> ${
                  point.series.name
                }: ${Highcharts.numberFormat(point.y, 1)}`;
              }
            });

            return s;
          },
          shared: true,
          useHTML: true,
        },

        yAxis: metricNames.map((name, index) => ({
          title: {
            text: name,
            style: {
              color: colors.s22,
            },
          },
          labels: {
            style: {
              color: colors.s22,
            },
          },
          opposite: index === 1,
        })),

        xAxis: {
          type: 'datetime',
          ordinal: false,
          lineColor: colors.s22,
          lineWidth: 1,
          labels: {
            style: {
              color: colors.s22,
            },
          },

          plotLines: xAxisPlotLines.map((plotLine) => ({
            value: plotLine.timestamp,
            width: 1,
            color: colors.s15,
            dashStyle: 'solid',
            zIndex: 1,
            label: {
              text: `<span style="color:#999;"><small>${plotLine.label}</small><span style="color:${plotLine.icon_colour}; padding-left:3px;">&#9679;</span></span>`,
              align: 'left',
              useHTML: true,
              y: 7,
              x: -15,
            },
          })),
          plotBands: xAxisPlotBands.map((unavailability) => ({
            color: '#f7dcdc',
            from: unavailability.from,
            to: unavailability.to,
          })),
        },

        title: {
          text: null,
        },

        plotOptions: {
          column: {
            stacking: 'normal',
            dataLabels: {
              enabled: false,
              color:
                (Highcharts.theme && Highcharts.theme.dataLabelsColor) ||
                'white',
              style: {
                textShadow: '0 0 3px black',
              },
            },

            dataGrouping: {
              approximation: 'sum',
              enabled: true,
              forced: true,
              units: [['day', [1]]],
            },
          },
        },

        series,
      },
      (chart) => {
        const $sampleTurnaround = $('.sample_turnaround');

        if (!primaryWorkloadExists) {
          chart.showLoading(i18n.t('No data to display'));
        }

        chart.xAxis[0].removePlotBand('plot-band-click');
        chart.xAxis[0].addPlotBand({
          from: $('ul#turnaroundTabs li:first-child a').attr('data-start'),
          to: $('ul#turnaroundTabs li:first-child a').attr('data-end'),
          color: '#d2efeb',
          id: 'plot-band-click',
        });

        $sampleTurnaround.on(
          'hover',
          // eslint-disable-next-line func-names
          function () {
            chart.xAxis[0].addPlotBand({
              from: $(this).attr('data-start'),
              to: $(this).attr('data-end'),
              color: '#eff7f6',
              id: 'plot-band-hover',
            });
          },
          () => {
            chart.xAxis[0].removePlotBand('plot-band-hover');
          }
        );

        // eslint-disable-next-line func-names
        $sampleTurnaround.on('click', function () {
          chart.xAxis[0].removePlotBand('plot-band-click');
          chart.xAxis[0].addPlotBand({
            from: $(this).attr('data-start'),
            to: $(this).attr('data-end'),
            color: '#d2efeb',
            id: 'plot-band-click',
          });
          chart.zoomOut();
        });

        const setTimePeriodBtnActiveState = (button) => {
          $(button).siblings().removeClass('active');
          $(button).addClass('active');
        };

        $('#group-month').on('click', (e) => {
          setTimePeriodBtnActiveState(e.target);
          $.each(chart.series, (index, obj) => {
            // eslint-disable-next-line no-param-reassign
            obj.options.dataGrouping.units[0] = ['month', [1]];
            obj.isDirty = true; // eslint-disable-line no-param-reassign
          });
          tooltipPrefix = i18n.t('Month starting');
          chart.redraw();
          chart.zoomOut();
        });

        $('#group-week').on('click', (e) => {
          setTimePeriodBtnActiveState(e.target);
          $.each(chart.series, (index, obj) => {
            // eslint-disable-next-line no-param-reassign
            obj.options.dataGrouping.units[0] = ['week', [1]];
            obj.isDirty = true; // eslint-disable-line no-param-reassign
          });
          tooltipPrefix = i18n.t('Week starting');
          chart.redraw();
          chart.zoomOut();
        });

        $('#group-day').on('click', (e) => {
          setTimePeriodBtnActiveState(e.target);
          $.each(chart.series, (index, obj) => {
            // eslint-disable-next-line no-param-reassign
            obj.options.dataGrouping.units[0] = ['day', [1]];
            obj.isDirty = true; // eslint-disable-line no-param-reassign
          });
          tooltipPrefix = '';
          chart.redraw();
          chart.zoomOut();
        });
      }
    );
  }
};
