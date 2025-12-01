import Highcharts from '@kitman/common/src/utils/HighchartDefaultOptions';
import HighchartsNoDataToDisplay from 'highcharts/modules/no-data-to-display';
import i18n from '@kitman/common/src/utils/i18n';
import { colors } from '@kitman/common/src/variables';

HighchartsNoDataToDisplay(Highcharts);

export default () => {
  const setExposureColours = (injuryRates) =>
    injuryRates.map((injuryRate) => ({
      y: injuryRate,
      color: colors.s14,
      borderColor: colors.s14,
    }));

  const initCompleteAlarmAnalysisGraph = ($) => {
    const adjustThresholdForScaleVariable = (threshold, condition) =>
      condition === 'less_than' ? threshold - 1 : threshold;

    $(document).ready(() => {
      const alarmAnalysisDemo = document.getElementById(
        'alarm-analysis-complete-graph'
      );

      if (alarmAnalysisDemo) {
        /**
         * binMax (Int) - the max value of the bins
         * binMin (Int) - the min value of the bins
         * exposures (Array) - contains all the exposure values
         * injuryRateLeft - injury value for the left part of the chart
         * injuryRateRight - injury value for the right part of the chart
         * threshold - the threshold value for the alarm
         */
        const chartData = $('#alarm-analysis-complete-graph');
        const binMax = parseFloat(chartData.data('binmax'));
        let binMin = parseFloat(chartData.data('binmin'));
        const injuryRates = chartData.data('injuryrates');
        const injuryRateLeft = parseFloat(chartData.data('injuryrateleft'));
        const injuryRateRight = parseFloat(chartData.data('injuryrateright'));
        let threshold = chartData.data('threshold');
        const effectSide = chartData.data('effectside');
        const statusType = chartData.data('statustype');

        const labelStyle = { color: colors.s18, fontSize: '12px' };
        const axisTitleStyle = {
          color: colors.s15,
          fontSize: '12px',
          textTransform: 'uppercase',
        };

        // if the status type is of scale, we need to shift the threshold value
        // either down or up, so it looks correct on the graphs (i.e not falling directly
        // on the threshold value, but either to the left (less than) or to the right (greater than)
        // of the value)
        if (statusType === 'scale') {
          threshold = adjustThresholdForScaleVariable(
            parseInt(threshold, 10),
            chartData.data('alarmcondition')
          );
        }

        /*
         * In this case, the pin is at the edge of the chart.
         * Highcharts doesn't allow the label of the pin to
         * be outside of the chart zone. To prevent that, the library
         * pushes the label back in the chart zone which uncenters the label.
         * We need this function to adjust the position of the label.
         */
        const centerPinLabel = (graphId) => {
          const pinLabel = $(`#${graphId}`).find('.pinLabel');
          const labelWidth = pinLabel[0].getBoundingClientRect().width;
          const labelTransformX = parseInt(
            pinLabel.attr('transform').split(/[(,)]/)[1],
            10
          );
          const labelTransformY = parseInt(
            pinLabel.attr('transform').split(/[(,)]/)[2],
            10
          );

          let newTransformX = null;

          if (parseFloat(threshold) === binMin) {
            newTransformX = labelTransformX - labelWidth / 2;
          } else if (parseFloat(threshold) === binMax) {
            newTransformX = labelTransformX + labelWidth / 2;
          } else {
            return;
          }

          pinLabel.attr(
            'transform',
            `translate(${newTransformX},${labelTransformY})`
          );
        };

        const adjustGraph = (graph) => {
          const graphId = graph.renderTo.getAttribute('id');
          centerPinLabel(graphId);
        };

        if (statusType === 'scale') {
          binMin -= 1;
        }

        // Our exposure chart renders our injury rates and their exposures.
        // We want to hide the y-axis because that is for our injury rate
        // IMPORTANT: We are not specifiying a max value for the y-axis because High Charts is smart
        // enough to let the data do that and add some padding to the top.
        const exposureChart = {
          xAxis: {
            // Having categories allows us to render the bins without having any
            // extra space/padding at the end.
            categories: chartData.data('binlabels'),
            labels: {
              // eslint-disable-next-line object-shorthand, func-names
              formatter: function () {
                if (this.isFirst) {
                  return statusType === 'scale'
                    ? this.value
                    : `<=${this.value[1]}`;
                }
                if (this.isLast) {
                  return statusType === 'scale'
                    ? this.value
                    : `>=${this.value[0]}`;
                }
                return statusType === 'scale'
                  ? this.value
                  : `${this.value[0]} to ${this.value[1]}`;
              },
              style: labelStyle,
            },
            title: {
              text: chartData.data('xaxislegend'),
              rotation: 0,
              y: 20,
              style: axisTitleStyle,
            },
          },
          yAxis: {
            min: 0,
            gridLineColor: colors.s14,
            labels: {
              format: '{value}',
              style: labelStyle,
            },
            title: {
              text: i18n.t('INJURY RATE (%)'),
              align: 'middle',
              rotation: -90,
              x: -13,
              style: axisTitleStyle,
            },
          },
          series: {
            id: 'exposureChartSeries',
            data: setExposureColours(injuryRates),
            pointPadding: 0,
            type: 'column',
            groupPadding: 0,
            animation: false,
            maxPointWidth: 35,
            xAxis: 0,
            yAxis: 0,
            enableMouseTracking: false, // disable the tooltip
            dataLabels: {
              align: 'center',
              enabled: true,
              className: 'alarmAnalysisChart__exposureLabel icon-user ',
              // eslint-disable-next-line object-shorthand, func-names
              formatter: function () {
                return chartData.data('exposures')[this.point.index];
              },
              useHTML: true,
              crop: false,
              overflow: 'none',
            },
          },
        };

        // These two vars make up the background areas in our chart to show the average injury rate
        // left and right of the pin.
        // You can see they are made up of four coordinates depicting the corners of the areas.
        const inJuryRateThresholdLeft = [
          { id: 'inJuryRateThreshold_left_1', x: binMin, y: injuryRateLeft }, // top left
          { id: 'inJuryRateThreshold_left_2', x: threshold, y: injuryRateLeft }, // top right
        ];
        const inJuryRateThresholdRight = [
          // I've had to add 0.01 so I can separate the areas a tiny bit because
          // the tooltips were not rendering correctly.
          {
            id: 'inJuryRateThreshold_right_1',
            x: threshold,
            y: injuryRateRight,
          }, // top left
          { id: 'inJuryRateThreshold_right_2', x: binMax, y: injuryRateRight }, // top right
        ];

        // The injury rate threshold chart holds all the information required to draw the
        // average injury rate either side of the pin. We hide the x-axis because it's
        // not needed.
        const leftRightInjuryRateThresholdChart = {
          xAxis: {
            visible: false,
            min: binMin,
            max: binMax,
          },
          yAxis: {
            visible: false,
          },
          thresholdLeftSeries: {
            id: 'leftInjuryRateThesholdChartSeries',
            data: inJuryRateThresholdLeft,
            color: effectSide === 'left' ? colors.s09 : colors.p01,
            fillOpacity: 0.05,
            lineColor: effectSide === 'left' ? colors.s09 : colors.p01,
            type: 'area',
            animation: false,
            xAxis: 1,
            yAxis: 0,
            enableMouseTracking: false, // disable the tooltip
          },
          thresholdRightSeries: {
            id: 'rightInjuryRateThesholdChartSeries',
            data: inJuryRateThresholdRight,
            color: effectSide === 'right' ? colors.s09 : colors.p01,
            fillOpacity: 0.05,
            lineColor: effectSide === 'right' ? colors.s09 : colors.p01,
            type: 'area',
            animation: false,
            xAxis: 1,
            yAxis: 0,
            enableMouseTracking: false, // disable the tooltip
          },
        };

        // The threshold pin chart draws the pin on the chart. We only want to draw the
        // pin here we don't need to show either axis.
        const thresholdPinChart = {
          xAxis: {
            visible: false,
            min: binMin,
            max: binMax,
          },
          yAxis: {
            min: 0,
            max: 1,
            visible: false,
          },
          thresholdLine: {
            series: {
              id: 'thresholdPinLineChartSeries',
              data: [[parseFloat(threshold), 1]],
              borderWidth: 0,
              pointPadding: 0,
              type: 'column',
              color: colors.s18,
              groupPadding: 0,
              pointWidth: 2,
              animation: false,
              xAxis: 2,
              yAxis: 2,
              enableMouseTracking: false, // disable the tooltip
            },
          },
          thresholdPinHead: {
            series: {
              id: 'thresholdPinHeadChartSeries',
              data: [[parseFloat(threshold), 1]],
              type: 'line',
              animation: false,
              enableMouseTracking: false, // disable the tooltip
              events: {
                afterAnimate() {
                  this.data[0].setState('hover');
                },
              },
              dataLabels: {
                enabled: true,
                color: colors.s18,
                className: 'pinLabel',
                x: 0,
                y: -43,
                style: {
                  fontSize: '12px',
                  textShadow: 'unset',
                },
                format: threshold.toString(),
              },
              xAxis: 2,
              yAxis: 2,
            },
          },
        };

        const initInjuryRateLabel = (chart) => {
          // initiate the usefull variables for the label positioning
          const leftInjuryRateX1 = chart.series[1].points[0].plotX;
          const leftInjuryRateX2 = chart.series[1].points[1].plotX;
          const leftInjuryRateCenter =
            chart.plotLeft + (leftInjuryRateX2 - leftInjuryRateX1) / 2;
          const leftInjuryRateY = chart.series[1].points[1].plotY;

          const rightInjuryRateX1 = chart.series[2].points[0].plotX;
          const rightInjuryRateX2 = chart.series[2].points[1].plotX;
          const rightInjuryRateCenter =
            chart.plotLeft +
            leftInjuryRateX2 +
            (rightInjuryRateX2 - rightInjuryRateX1) / 2;
          const rightInjuryRateY = chart.series[2].points[1].plotY;

          // If the label doesn't fit in 1 line
          // wrap it in two lines (add a class and adapt the position)
          const oneLineLabelWidth = 170;
          const twoLinesLabelWidth = 100;
          const useLeftShortLabel = leftInjuryRateX2 < oneLineLabelWidth;
          const useRightShortLabel =
            chart.plotWidth - rightInjuryRateX1 < oneLineLabelWidth;

          const leftInjuryRateLabelX = useLeftShortLabel
            ? leftInjuryRateCenter - twoLinesLabelWidth / 2
            : leftInjuryRateCenter - oneLineLabelWidth / 2;

          const leftInjuryRateLabelClass = useLeftShortLabel
            ? ' injuryRateLabel injuryRateLabel--wrapped'
            : ' injuryRateLabel';

          const rightInjuryRateLabelX = useRightShortLabel
            ? rightInjuryRateCenter - twoLinesLabelWidth / 2
            : rightInjuryRateCenter - oneLineLabelWidth / 2;

          const rightInjuryRateLabelClass = useRightShortLabel
            ? ' injuryRateLabel injuryRateLabel--wrapped'
            : ' injuryRateLabel';

          // Add the labels to the chart
          // Only if the alarm doesn't sit on edge of graph
          if (parseFloat(threshold) > binMin) {
            chart.renderer
              .label(
                i18n.t('{{injuryRate}}% Average Injury Rate', {
                  injuryRate: injuryRateLeft,
                }),
                leftInjuryRateLabelX,
                45 + leftInjuryRateY,
                null,
                null,
                null,
                true /* useHTML */,
                null,
                leftInjuryRateLabelClass
              )
              .css({
                color: effectSide === 'left' ? colors.s09 : colors.p01,
              })
              .add();
          }

          if (parseFloat(threshold) < binMax) {
            chart.renderer
              .label(
                i18n.t('{{injuryRate}}% Average Injury Rate', {
                  injuryRate: injuryRateRight,
                }),
                rightInjuryRateLabelX,
                45 + rightInjuryRateY,
                null,
                null,
                null,
                true /* useHTML */,
                null,
                rightInjuryRateLabelClass
              )
              .css({
                color: effectSide === 'right' ? colors.s09 : colors.p01,
              })
              .add();
          }
        };

        const initTooltips = () => {
          const leftTooltip = $(
            '.injuryRate__tooltip.injuryRate__tooltip--left'
          );
          const rightTooltip = $(
            '.injuryRate__tooltip.injuryRate__tooltip--right'
          );

          // show/hide
          const $highChartsArea = $('.highcharts-area');
          const leftThresholdArea = $highChartsArea.eq(0);
          const rightThresholdArea = $highChartsArea.eq(1);

          leftThresholdArea.mouseenter(() => {
            leftTooltip.show();
          });
          leftThresholdArea.mouseleave(() => {
            leftTooltip.hide();
          });

          rightThresholdArea.mouseenter(() => {
            rightTooltip.show();
          });
          rightThresholdArea.mouseleave(() => {
            rightTooltip.hide();
          });
        };

        const initExtraElements = (chart) => {
          initInjuryRateLabel(chart);
          initTooltips();
        };

        Highcharts.chart(
          'alarm-analysis-complete-graph',
          {
            credits: {
              enabled: false,
            },
            legend: { enabled: false },
            plotOptions: {
              alignTicks: false,
              column: { grouping: false },
              line: {
                marker: {
                  fillColor: colors.s18,
                  color: colors.s18,
                  symbol: 'circle',
                  lineColor: 'transparent',
                  radius: 3,
                },
                states: {
                  hover: {
                    halo: {
                      attributes: {
                        fill: colors.s14,
                      },
                      opacity: 1,
                      size: 15,
                    },
                  },
                },
              },
              area: {
                // disable markers
                dashStyle: 'Dash',
                marker: {
                  enabled: false,
                  states: {
                    hover: { enabled: false },
                  },
                },
              },
            },
            chart: {
              alignTicks: false,
              spacingTop: 70,
              spacingBottom: 30,
              height: 450,
              events: {
                load() {
                  adjustGraph(this);
                },
              },
            },
            title: { text: '' },
            xAxis: [
              exposureChart.xAxis,
              leftRightInjuryRateThresholdChart.xAxis,
              thresholdPinChart.xAxis,
            ],
            yAxis: [
              exposureChart.yAxis,
              leftRightInjuryRateThresholdChart.yAxis,
              thresholdPinChart.yAxis,
            ],
            series: [
              exposureChart.series,
              leftRightInjuryRateThresholdChart.thresholdLeftSeries,
              leftRightInjuryRateThresholdChart.thresholdRightSeries,
              thresholdPinChart.thresholdPinHead.series,
              thresholdPinChart.thresholdLine.series,
            ],
          },
          initExtraElements
        );
      }
    });
  };

  initCompleteAlarmAnalysisGraph($);
};
