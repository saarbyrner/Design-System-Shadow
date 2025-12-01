/* eslint-disable react/sort-comp */
// @flow
import Highcharts from '@kitman/common/src/utils/HighchartDefaultOptions';
import HighchartsMore from 'highcharts/highcharts-more';
import HighchartsNoDataToDisplay from 'highcharts/modules/no-data-to-display';
import HighchartsParallelCoordinates from 'highcharts/modules/parallel-coordinates';
import _isEqual from 'lodash/isEqual';
import { Component, Fragment } from 'react';
import type { LegendItem } from '@kitman/components/src/types';
import { colors } from '@kitman/common/src/variables';
import ChartConfig from '@kitman/modules/src/analysis/shared/resources/graph/SummaryChartConfig';
import type { SummaryGraphData, GraphType } from '../../../types';
import { GraphDescriptionTranslated as GraphDescription } from '../GraphDescription';
import { GraphLegendListTranslated as GraphLegendList } from '../GraphLegendList';

HighchartsMore(Highcharts);
HighchartsNoDataToDisplay(Highcharts);
HighchartsParallelCoordinates(Highcharts);

type Props = {
  graphData: SummaryGraphData,
  graphType: GraphType,
  graphStyle: Object,
  showTitle?: boolean,
  openRenameGraphModal?: Function,
  condensed?: boolean,
  canSaveGraph?: boolean,
};

type State = {
  chartLegendItems: Array<LegendItem>,
};

class SummaryGraph extends Component<Props, State> {
  composedGraph: ?HTMLElement;

  chart: Object;

  constructor(props: Props) {
    super(props);
    this.state = {
      chartLegendItems: [],
    };
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (
      this.props.graphType !== prevProps.graphType ||
      !_isEqual(this.props.graphData.metrics, prevProps.graphData.metrics)
    ) {
      this.initChart();
    }

    // Once we've built the legend, we need to reflow the chart as
    // there is less space available.
    if (
      this.state.chartLegendItems.length !== prevState.chartLegendItems.length
    ) {
      this.chart.reflow();
    }
  }

  getSeriesColours(chart: Object) {
    return chart.series.map((item) => item.color);
  }

  componentDidMount() {
    this.initChart();
    this.chartLegend = this.chartLegend.bind(this);
  }

  initChart() {
    const chartConfig = ChartConfig(this.props.graphData, this.props.graphType);
    this.chart = new Highcharts.Chart(this.composedGraph, chartConfig);

    const seriesColours = this.getSeriesColours(this.chart);
    this.formatChartLegend(seriesColours, chartConfig);
  }

  formatChartLegend(seriesColours: Array<string>, chartConfig: Object) {
    const chartLegendItems = [];
    chartConfig.series.forEach((item, index) => {
      chartLegendItems.push({
        id: `${index}`,
        name: item.name,
        colour: seriesColours[index] || colors.s02,
        isDisabled: false,
        type: 'serie',
        serieIndex: index,
      });
    });

    this.setState({
      chartLegendItems,
    });
  }

  onClickLegendItem(legendItem: LegendItem) {
    const itemIndex = this.state.chartLegendItems.indexOf(legendItem);
    const updatedChartLegendItems = this.state.chartLegendItems.slice();

    if (legendItem.type === 'serie') {
      if (legendItem.isDisabled) {
        this.chart.series[legendItem.serieIndex].setVisible(true, false);
        updatedChartLegendItems[itemIndex].isDisabled = false;
      } else {
        this.chart.series[legendItem.serieIndex].setVisible(false, false);
        updatedChartLegendItems[itemIndex].isDisabled = true;
      }
    }

    this.setState({
      chartLegendItems: updatedChartLegendItems,
    });
  }

  chartLegend = () => {
    const legendList = [
      {
        label: null,
        items: this.state.chartLegendItems || [],
      },
    ];
    return (
      <GraphLegendList
        legendList={legendList}
        onClick={(index, legendItem) => this.onClickLegendItem(legendItem)}
        condensed={this.props.condensed}
      />
    );
  };

  render() {
    return (
      <Fragment>
        <GraphDescription
          graphData={this.props.graphData}
          openRenameGraphModal={this.props.openRenameGraphModal}
          graphGroup={this.props.graphData.graphGroup}
          showTitle={this.props.showTitle}
          condensed={this.props.condensed}
          canSaveGraph={this.props.canSaveGraph}
        />
        {this.chartLegend()}
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

export default SummaryGraph;
