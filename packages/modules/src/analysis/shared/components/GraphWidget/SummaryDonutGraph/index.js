// @flow
import Highcharts from '@kitman/common/src/utils/HighchartDefaultOptions';
import HighchartsNoDataToDisplay from 'highcharts/modules/no-data-to-display';
import { Component, Fragment } from 'react';
import _isEqual from 'lodash/isEqual';
import ChartConfig from '@kitman/modules/src/analysis/shared/resources/graph/SummaryDonutChartConfig';
import type {
  SummaryDonutGraphData,
  SummaryGraphSortConfig,
  GraphType,
} from '../../../types';
import { GraphDescriptionTranslated as GraphDescription } from '../GraphDescription';

HighchartsNoDataToDisplay(Highcharts);

type Props = {
  graphData: SummaryDonutGraphData,
  graphType: GraphType,
  showTitle?: boolean,
  sorting?: SummaryGraphSortConfig,
  openRenameGraphModal?: Function,
  graphStyle: Object,
  canSaveGraph?: boolean,
  condensed?: boolean,
};

class SummaryDonutGraph extends Component<Props> {
  composedGraph: ?HTMLElement;

  chart: Object;

  componentDidMount() {
    this.initChart();
  }

  componentDidUpdate(prevProps: Props) {
    if (
      this.props.graphType !== prevProps.graphType ||
      !_isEqual(this.props.graphData.metrics, prevProps.graphData.metrics) ||
      this.props.sorting !== prevProps.sorting
    ) {
      this.initChart();
    }
  }

  initChart() {
    const chartConfig = ChartConfig(this.props.graphData, this.props.graphType);

    if (this.props.graphData.metrics) {
      this.chart = new Highcharts.Chart(this.composedGraph, chartConfig);
    }
  }

  render() {
    return (
      <Fragment>
        <GraphDescription
          showTitle={this.props.showTitle}
          graphData={this.props.graphData}
          graphGroup="summary_donut"
          openRenameGraphModal={this.props.openRenameGraphModal}
          canSaveGraph={this.props.canSaveGraph}
          condensed={this.props.condensed}
        />
        <div
          style={this.props.graphStyle}
          ref={(composedGraph) => {
            this.composedGraph = composedGraph;
          }}
        />
      </Fragment>
    );
  }
}

export default SummaryDonutGraph;
