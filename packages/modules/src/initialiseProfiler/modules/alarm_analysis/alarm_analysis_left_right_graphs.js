import Highcharts from '@kitman/common/src/utils/HighchartDefaultOptions';
import HighchartsNoDataToDisplay from 'highcharts/modules/no-data-to-display';
import { colors } from '@kitman/common/src/variables';
import i18n from '@kitman/common/src/utils/i18n';

HighchartsNoDataToDisplay(Highcharts);

export default () => {
  const initAlarmAnalysisLeftRightGraphs = ($) => {
    /*
     * For each rectangle in the injurRateColumnGroup
     * we want to create a line attach to the top of each bar to allow us
     * have a dashed line indicating the avg injury rate.
     */
    const addInjuryRateColumnBorders = (graphId) => {
      $(`#${graphId} .injuryRateColumnsGroup rect`).each((index, rect) => {
        const line = document.createElementNS(
          'http://www.w3.org/2000/svg',
          'line'
        );
        const rectX = parseInt(rect.getAttribute('x'), 10);
        const rectY = parseInt(rect.getAttribute('y'), 10);
        const rectWidth = parseInt(rect.getAttribute('width'), 10);

        $(line).attr({
          x1: rectX,
          y1: rectY,
          x2: rectX + rectWidth,
          y2: rectY,
          'stroke-dasharray': '5, 5',
        });

        $(line).css({
          stroke: colors.p01,
          'stroke-width': 2,
        });

        $(line).appendTo(`#${graphId} svg .injuryRateColumnsGroup`);
      });
    };

    /*
     * In this case, the pin is at the edge of the chart.
     * Highcharts doesn't allow the label of the pin to
     * be outside of the chart zone. To prevent that, the library
     * pushes the label back in the chart zone which uncenters the label.
     * We need this function to adjust the position of the label.
     */
    const centerPinLabel = (graphId, side) => {
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

      const newTransformX =
        side === 'left'
          ? labelTransformX + labelWidth / 2
          : labelTransformX - labelWidth / 2;
      pinLabel.attr(
        'transform',
        `translate(${newTransformX},${labelTransformY})`
      );
    };

    const adjustGraph = (graph, side) => {
      const graphId = graph.renderTo.getAttribute('id');
      addInjuryRateColumnBorders(graphId);
      centerPinLabel(graphId, side);
    };

    const initGraph = (graphId, side) => {
      if (document.getElementById(graphId)) {
        /*
         * injuryRateLeft - injury value for the left part of the chart
         * injuryRateRight - injury value for the right part of the chart
         * Need this to calculate the pin position height.
         */
        const chartData = $(`#${graphId}`);
        const bins = chartData.data('bins');
        const injuryRates = chartData.data('injuryrates');
        const statusType = chartData.data('statustype');

        // target element to create chart inside
        const chartHtmlId = graphId;

        const labelStyle = { color: colors.s18, fontSize: '12px' };
        const axisTitleStyle = {
          color: colors.s15,
          fontSize: '12px',
          textTransform: 'uppercase',
        };

        // Our exposure chart renders our bins and their exposures.
        // We want to hide the y-axis because that is for our injury rate, it has nothing to
        // do with our bins and exposures.
        const exposureChart = {
          xAxis: {
            visible: true,
            // Having categories allows us to render the bins without having any
            // extra space/padding at the end.
            categories: bins,
            title: {
              text: chartData.data('xaxislegend'),
              rotation: 0,
              y: 20,
              style: axisTitleStyle,
            },
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
            id: 'rightExposureChartSeries',
            data: injuryRates,
            pointPadding: 0,
            color: colors.p01_Opacity15,
            borderColor: colors.p01_Opacity15,
            type: 'column',
            groupPadding: 0,
            animation: false,
            maxPointWidth: 35,
            enableMouseTracking: false, // disable the tooltip
            xAxis: 0,
            yAxis: 0,
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

        const injuryRateChart = {
          xAxis: {
            visible: false,
            // Having categories allows us to render the bins without having any
            // extra space/padding at the end.
            categories: bins,
          },
          yAxis: { visible: false },
          series: {
            id: 'rightInjuryRateChartSeries',
            data: injuryRates,
            className: 'injuryRateColumnsGroup',
            maxPointWidth: 35,
            color: colors.p01_Opacity15,
            type: 'column',
            animation: false,
            xAxis: 1,
            yAxis: 1,
          },
        };

        const pinPosition = side === 'right' ? 0.001 : 0.999;
        const pinHeadPosition = side === 'right' ? 0.0015 : 0.9985;

        const chartSpacingRight = side === 'left' ? 30 : 0;

        // The threshold pin chart draws the pin on the chart. We only want to draw the
        // pin here we don't need to show either axis.
        const thresholdPinChart = {
          xAxis: {
            visible: false,
            min: 0,
            max: 1,
          },
          yAxis: {
            min: 0,
            max: 1,
            visible: false,
          },
          thresholdLine: {
            series: {
              id: 'thresholdPinLineChartSeries',
              data: [[pinPosition, 1]],
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
              data: [[pinHeadPosition, 1]],
              type: 'line',
              animation: false,
              enableMouseTracking: false, // disable the tooltip
              events: {
                // eslint-disable-next-line object-shorthand, func-names
                afterAnimate: function () {
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
                format: chartData.data('threshold').toString(),
              },
              xAxis: 2,
              yAxis: 2,
            },
          },
        };

        Highcharts.chart(chartHtmlId, {
          credits: { enabled: false },
          tooltip: { enabled: false },
          legend: { enabled: false },
          plotOptions: {
            alignTicks: false,
            column: {
              grouping: false,
              states: {
                hover: {
                  enabled: false,
                },
              },
            },
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
          },
          chart: {
            alignTicks: false,
            spacingTop: 70,
            spacingBottom: 30,
            spacingRight: chartSpacingRight,
            height: 450,
            events: {
              // eslint-disable-next-line object-shorthand, func-names
              load: function () {
                adjustGraph(this, side);
              },
            },
          },
          title: { text: '' },
          xAxis: [
            exposureChart.xAxis,
            injuryRateChart.xAxis,
            thresholdPinChart.xAxis,
          ],
          yAxis: [
            exposureChart.yAxis,
            injuryRateChart.yAxis,
            thresholdPinChart.yAxis,
          ],
          series: [
            exposureChart.series,
            injuryRateChart.series,
            thresholdPinChart.thresholdPinHead.series,
            thresholdPinChart.thresholdLine.series,
          ],
        });
      }
    };

    $(document).ready(() => {
      initGraph('alarm-analysis-left-graph', 'left');
      initGraph('alarm-analysis-right-graph', 'right');
    });
  };

  initAlarmAnalysisLeftRightGraphs($);
};
