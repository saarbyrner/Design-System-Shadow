/* eslint-disable react/sort-comp */
// @flow
import Highcharts from '@kitman/common/src/utils/HighchartDefaultOptions';
import HighchartsNoDataToDisplay from 'highcharts/modules/no-data-to-display';
import type { Node } from 'react';
import { Component } from 'react';
import _isEqual from 'lodash/isEqual';
import { colors } from '@kitman/common/src/variables';
import type { LegendItem } from '@kitman/components/src/types';
import uniq from 'lodash/uniq';
import ChartConfig from '@kitman/modules/src/analysis/shared/resources/graph/SummaryStackBarChartConfig';
import { GraphDescriptionTranslated as GraphDescription } from '../GraphDescription';
import type {
  SummaryStackBarGraphData,
  SummaryGraphSortConfig,
  GraphType,
} from '../../../types';
import { getFullMedicalCategoryName } from '../../../utils';
import { GraphLegendListTranslated as GraphLegendList } from '../GraphLegendList';

HighchartsNoDataToDisplay(Highcharts);

type Props = {
  graphData: SummaryStackBarGraphData,
  showTitle?: boolean,
  graphStyle: Object,
  graphType: GraphType,
  openRenameGraphModal?: Function,
  condensed?: boolean,
  canSaveGraph?: boolean,
  toggleableLegend?: boolean,
  sorting?: SummaryGraphSortConfig,
};

type State = {
  chartLegendItems: Array<LegendItem>,
};

class SummaryStackBarGraph extends Component<Props, State> {
  composedGraph: ?HTMLElement;

  chart: Object;

  constructor(props: Props) {
    super(props);
    this.state = {
      chartLegendItems: [],
    };
  }

  componentDidMount() {
    this.initChart();
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (
      this.props.graphType !== prevProps.graphType ||
      !_isEqual(this.props.graphData.metrics, prevProps.graphData.metrics) ||
      this.props.sorting !== prevProps.sorting ||
      this.props.graphData.decorators.hide_nulls !==
        prevProps.graphData.decorators.hide_nulls ||
      this.props.graphData.decorators.hide_zeros !==
        prevProps.graphData.decorators.hide_zeros
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

    if (
      this.props.graphData.decorators.data_labels !==
      prevProps.graphData.decorators.data_labels
    ) {
      this.updateDataLabels();
    }
  }

  updateDataLabels() {
    this.chart.update({
      plotOptions: {
        series: {
          dataLabels: {
            enabled: this.props.graphData.decorators.data_labels,
          },
        },
      },
    });
  }

  initChart() {
    const chartConfig = ChartConfig(this.props.graphData, this.props.graphType);

    if (this.props.graphData.metrics.length > 0) {
      this.chart = new Highcharts.Chart(this.composedGraph, chartConfig);

      const seriesColours = this.getSeriesColours(this.chart);
      this.formatChartLegend(seriesColours);
    }
  }

  getSeriesColours(chart: Object) {
    return chart.series.map((item) => item.color);
  }

  formatChartLegend(seriesColours: Array<string>) {
    const chartLegendItems = [];

    const metric = this.props.graphData.metrics[0];

    // Stack graphs can have multiple series with the same name
    // We are grouping the series with the same name in the legend
    const uniqueSeriesList = uniq(
      metric.series.map((seriesData) => {
        return seriesData.name;
      })
    );

    uniqueSeriesList.forEach((uniqueSeriesName, uniqueSeriesIndex) => {
      const seriesList = [];
      metric.series.forEach((seriesData, seriesIndex) => {
        if (seriesData.name === uniqueSeriesName) {
          seriesList.push(seriesIndex);
        }
      });

      chartLegendItems.push({
        id: `${uniqueSeriesIndex}`,
        name: uniqueSeriesName,
        colour: seriesColours[seriesList[0]] || colors.s02,
        isDisabled: false,
        type: 'stackedSerie',
        seriesIndexes: seriesList,
      });
    });

    this.setState({
      chartLegendItems,
    });
  }

  onClickLegendItem(legendItem: LegendItem) {
    const itemIndex = this.state.chartLegendItems.indexOf(legendItem);
    const updatedChartLegendItems = this.state.chartLegendItems.slice();

    if (legendItem.type === 'stackedSerie') {
      if (legendItem.isDisabled) {
        legendItem.seriesIndexes.forEach((seriesIndex) => {
          this.chart.series[seriesIndex].setVisible(true, false);
        });
        updatedChartLegendItems[itemIndex].isDisabled = false;
      } else {
        legendItem.seriesIndexes.forEach((seriesIndex) => {
          this.chart.series[seriesIndex].setVisible(false, false);
        });
        updatedChartLegendItems[itemIndex].isDisabled = true;
      }
    }

    this.setState({
      chartLegendItems: updatedChartLegendItems,
    });

    this.chart.redraw();
  }

  chartLegend(): Node {
    const metric = this.props.graphData.metrics[0];
    const legendCategory = metric.category_division || metric.category;

    const legendLabel = getFullMedicalCategoryName(
      legendCategory,
      metric.main_category,
      null,
      metric.filter_names
    );

    const legendList = [
      {
        label: legendLabel,
        items: this.state.chartLegendItems || [],
      },
    ];

    return (
      <GraphLegendList
        legendList={legendList}
        onClick={(index, legendItem) => this.onClickLegendItem(legendItem)}
        condensed={this.props.condensed}
        toggleable={this.props.toggleableLegend}
      />
    );
  }

  render() {
    return (
      <>
        <GraphDescription
          showTitle={this.props.showTitle}
          graphData={this.props.graphData}
          graphGroup="summary_stack_bar"
          openRenameGraphModal={this.props.openRenameGraphModal}
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
      </>
    );
  }
}

export default SummaryStackBarGraph;
