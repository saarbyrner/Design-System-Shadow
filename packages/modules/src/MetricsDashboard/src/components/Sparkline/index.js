// @flow
/* eslint-disable react/sort-comp */

import Highcharts from 'highcharts/highstock';
import HighchartsNoDataToDisplay from 'highcharts/modules/no-data-to-display';
import { Component } from 'react';
import $ from 'jquery';
import classNames from 'classnames';
import { withNamespaces } from 'react-i18next';
import moment from 'moment';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import type { Status } from '@kitman/common/src/types/Status';
import {
  formatYAxisLabel,
  isValueBoolean,
} from '@kitman/common/src/utils/statusChart';
import { colors } from '@kitman/common/src/variables';
import type { I18nProps } from '@kitman/common/src/types/i18n';

HighchartsNoDataToDisplay(Highcharts);

type Props = {
  isVisible: boolean,
  athleteId: string,
  status: Status,
  alarmColour: ?string,
  numberOfDatapoints: ?number,
};

type State = {
  loading: boolean,
  error: boolean,
};

type ChartData = Array<number> | { x: ?number, y: ?number, color: ?string };

class Sparkline extends Component<I18nProps<Props>, State> {
  sparkline: ?HTMLElement;

  getSparklineXHR: Object; // $.ajax()

  chart: Object; // Highchart()

  constructor(props: I18nProps<Props>) {
    super(props);

    this.state = {
      loading: true,
      error: false,
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps: I18nProps<Props>) {
    // Request the data only when the tooltip is visible (after 300ms)
    // and if the data are not loaded
    if (nextProps.isVisible && this.state.loading) {
      this.requestData();
    }
  }

  shouldComponentUpdate(nextProps: I18nProps<Props>, nextState: State) {
    // Rerender the component only if the loading state changes.
    return this.state.loading !== nextState.loading;
  }

  componentWillUnmount() {
    // Abort the ajax request before unmount.
    if (this.getSparklineXHR) {
      this.getSparklineXHR.abort();
    }
    // Destroy chart before unmount.
    if (this.chart) {
      this.chart.destroy();
    }
  }

  requestData() {
    const self = this;
    this.getSparklineXHR = $.ajax({
      url: '/dashboards/sparkline_data',
      method: 'GET',
      data: {
        status_id: this.props.status.status_id,
        athlete_id: this.props.athleteId,
      },
      error: () => {
        this.setState({
          error: true,
          loading: false,
        });
      },
      success: (response) => {
        let min = null;
        let max = null;
        this.setState({
          loading: false,
          error: false,
        });

        const seriesData = response.series_data ? response.series_data : [];

        // if theres no data, we don't want to draw the Y axis
        if (seriesData.length > 0) {
          // For booleans, we need to set the min / max values ourselves
          min = isValueBoolean(this.props.status) ? 0 : response.min;
          max = isValueBoolean(this.props.status) ? 1 : response.max;
        }

        const chartData = this.buildChartData(seriesData);

        // create chart
        const chartConfig = this.chartConfig(min, max, chartData);
        self.initChart(chartConfig);
      },
    });
  }

  buildChartData(seriesData: Array<ChartData> = []): Array<ChartData> {
    const dataLength = seriesData.length;

    if (dataLength <= 0) {
      return [];
    }

    // Adds the alarm colour to the last data
    return seriesData.map((data, index) => {
      const isLastData = index === dataLength - 1;
      return isLastData
        ? {
            x: data ? data[0] : null,
            y: data ? data[1] : null,
            color: this.props.alarmColour,
          }
        : data;
    });
  }

  getNoDataMessage() {
    return this.props.numberOfDatapoints && this.props.numberOfDatapoints > 0
      ? this.props.t('Not Enough Data')
      : this.props.t('No Available Data');
  }

  chartConfig(min: ?number, max: ?number, data: Array<ChartData> = []) {
    const self = this;

    return {
      chart: {
        type: 'line',
        style: {
          fontFamily: 'Open Sans, sans-serif',
        },
        height: 200,
        width: 460,
        spacingLeft: 0,
      },
      lang: {
        noData: this.getNoDataMessage(),
      },
      credits: {
        enabled: false,
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
          day: '%e<br/><span style="font-weight: 600">%b</span>',
          week: '%e<br><span style="font-weight: 600">%b</span>',
          month: "%b '%y",
          year: '%Y',
        },
        tickLength: 0,
        lineWidth: 0,
        labels: {
          style: {
            'font-size': '12px',
            color: colors.s18,
          },
          y: 25,
        },
      },
      yAxis: {
        title: {
          text: null,
        },
        min,
        max,
        lineColor: '#BBB',
        gridLineWidth: 0.5,
        labels: {
          style: {
            'font-size': '12px',
            color: colors.s18,
          },
          x: -8,
          // eslint-disable-next-line object-shorthand, func-names
          formatter: function () {
            // if theres no data, we don't want to draw the Y axis
            return data.length > 0
              ? formatYAxisLabel(this.value, self.props.status)
              : null;
          },
        },
      },
      tooltip: {
        shared: true,
        stickOnContact: true,
        snap: 50,
        borderWidth: 1,
        borderRadius: 10,
        shadow: false,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        useHTML: true,
        padding: 10,
        formatter() {
          // $FlowFixMe
          const formattedDate = window.featureFlags['standard-date-formatting']
            ? DateFormatter.formatStandard({ date: moment(this.x) })
            : moment(this.x).format('DD MMM YYYY');

          const yValue = formatYAxisLabel(this.y, self.props.status) || this.y;
          const unixTimeSeconds = moment(this.x).valueOf() / 1000;

          if (
            self.props.status.variables[0].source === 'kitman:injury_risk' &&
            window.getFlag('injury-risk-metrics-contributing-factors')
          ) {
            const baseUrl = window.featureFlags['side-nav-update']
              ? '/analytics/injury_risk_contributing_factors'
              : '/settings/injury_risk_contributing_factors';
            // $FlowFixMe injury_risk_variable_uuid must exist at this point
            const targetUrl = `${baseUrl}?athlete_id=${self.props.athleteId}&injury_risk_variable_uuid=${self.props.status.injury_risk_variable_uuid}&prediction_timestamp=${unixTimeSeconds}`;
            return `<div class="highcharts-tooltip__legend highcharts-tooltip__legend--riskMetric">
                 <span class="highcharts-tooltip__circle" style="color:${
                   this.color
                 }">\u25CF</span>
                 <span class="highcharts-tooltip__statusName">${
                   self.props.status.name || self.props.t('Injury Risk Metric')
                 }</span>
                 <span class="highcharts-tooltip__value">${yValue}</span>
               </div>
               <div class="highcharts-tooltip__footer"><a href=${targetUrl}>${self.props.t(
              'Contributing Factors'
            )}</a></div>`;
          }

          return `<span class="highcharts-tooltip__date">${formattedDate}</span>
               <div class="highcharts-tooltip__legend">
                 <span class="highcharts-tooltip__circle" style="color:${this.color}">\u25CF</span>
                 <span class="highcharts-tooltip__value"> ${yValue} </span>
               </div>`;
        },
        crosshairs: {
          width: 1,
          color: '#888',
          dashStyle: 'shortdot',
        },
        style: {
          pointerEvents: 'auto',
        },
      },
      plotOptions: {
        line: {
          color: '#00468F',
          marker: {
            enabled: true,
            radius: 4,
            symbol: 'circle',
          },
          states: {
            hover: {
              lineWidth: 2,
            },
          },
        },
        series: {
          stickyTracking: true,
        },
      },
      legend: {
        enabled: false,
      },
      series: [
        {
          data,
        },
      ],
    };
  }

  initChart(chartConfig: Object) {
    this.chart = new Highcharts.Chart(this.sparkline, chartConfig);
  }

  render() {
    const classes = classNames('dashboardSparkline', {
      'dashboardSparkline--loading': this.state.loading,
      'dashboardSparkline--error': this.state.error,
    });
    let text;

    // set the feedback text
    if (this.state.loading) {
      text = this.props.t('Fetching data');
    } else if (this.state.error) {
      text = this.props.t('Something went wrong!');
    } else {
      text = '';
    }

    return (
      <div className={classes}>
        <div className="dashboardSparkline__feedback">
          <p>{text}</p>
        </div>
        <div
          className="dashboardSparkline__graph"
          style={{
            display:
              !this.state.loading && !this.state.error ? 'block' : 'none',
          }}
          ref={(sparkline) => {
            this.sparkline = sparkline;
          }}
        />
      </div>
    );
  }
}

export default Sparkline;
export const SparklineTranslated = withNamespaces()(Sparkline);
