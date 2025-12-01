/* eslint-disable react/sort-comp */
// @flow
import Highcharts from '@kitman/common/src/utils/HighchartDefaultOptions';
import HighchartsNoDataToDisplay from 'highcharts/modules/no-data-to-display';
import type { Node } from 'react';
import { Component, Fragment } from 'react';
import _isEqual from 'lodash/isEqual';
import { colors } from '@kitman/common/src/variables';
import type { LegendItem } from '@kitman/components/src/types';
import {
  getChartOverlays,
  getOverlayColor,
} from '@kitman/modules/src/analysis/shared/resources/graph/GraphUtils';
import { ChartConfig } from '@kitman/modules/src/analysis/shared/resources/graph/SummaryBarChartConfig';
import { GraphDescriptionTranslated as GraphDescription } from '../GraphDescription';
import type {
  ChartOverlay,
  SummaryBarGraphData,
  SummaryGraphSortConfig,
  GraphType,
} from '../../../types';
import {
  getOverlayName,
  getFullMedicalCategoryName,
  formatFilterNames,
} from '../../../utils';
import { GraphLegendListTranslated as GraphLegendList } from '../GraphLegendList';

HighchartsNoDataToDisplay(Highcharts);

type Props = {
  graphSubType?: 'INJURY_RISK_CONTRIBUTING_FACTORS' | 'INJURY_METRIC_CREATION',
  graphData: SummaryBarGraphData,
  graphType: GraphType,
  showTitle?: boolean,
  sorting?: SummaryGraphSortConfig,
  graphStyle: Object,
  openRenameGraphModal?: Function,
  canSaveGraph?: boolean,
  condensed?: boolean,
};

type State = {
  chartLegendItems: Array<Array<LegendItem>>,
  chartOverlays: {
    [string]: ChartOverlay,
  },
};

class SummaryBarGraph extends Component<Props, State> {
  composedGraph: ?HTMLElement;

  chart: Object;

  constructor(props: Props) {
    super(props);
    this.state = {
      chartLegendItems: [],
      chartOverlays: {},
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
    const chartConfig = ChartConfig(
      this.props.graphData,
      this.props.graphType,
      this.props.graphSubType
    );

    if (this.props.graphData.metrics.length > 0) {
      if (this.props.graphStyle && this.props.graphStyle.colors) {
        chartConfig.colors = this.props.graphStyle.colors;
      }

      this.chart = new Highcharts.Chart(this.composedGraph, chartConfig);
      const seriesColours = this.getSeriesColours(this.chart);
      this.formatChartLegend(seriesColours);

      this.initChartOverlays();
    }
  }

  initChartOverlays() {
    const chartOverlays = getChartOverlays(this.props.graphData.metrics, 0);

    Object.keys(chartOverlays).forEach((overlayId) => {
      this.chart.yAxis[chartOverlays[overlayId].yIndex].addPlotLine(
        chartOverlays[overlayId]
      );
    });

    this.setState({
      chartOverlays,
    });
  }

  getSeriesColours(chart: Object) {
    const colours = [];

    const seriesColours = chart.series.map((item) => item.color);
    this.props.graphData.metrics.forEach((metric, index) => {
      colours[index] = seriesColours.splice(0, metric.series.length);
    });

    return colours;
  }

  formatChartLegend(seriesColours: Array<Array<string>>) {
    const chartLegendItems = [];
    let overlayCounter = 0;
    let seriesCounter = 0;

    this.props.graphData.metrics.forEach((metric, metricIndex) => {
      chartLegendItems[metricIndex] = [];

      metric.series.forEach((item, seriesIndex) => {
        let legendLabel = '';
        if (metric.type === 'medical') {
          legendLabel = item.name;
        } else {
          legendLabel = `${metric.status.name}`;

          const statusUnit = metric.status.localised_unit
            ? `(${metric.status.localised_unit})`
            : null;
          if (statusUnit) {
            legendLabel = `${legendLabel} ${statusUnit}`;
          }

          const formatedFilterNames = formatFilterNames(metric.filter_names);
          if (formatedFilterNames) {
            legendLabel = `${legendLabel} (${formatedFilterNames})`;
          }
        }

        chartLegendItems[metricIndex].push({
          id: seriesCounter.toString(),
          name: legendLabel,
          colour: seriesColours[metricIndex][seriesIndex] || colors.s02,
          isDisabled: false,
          type: 'serie',
          serieIndex: seriesCounter,
        });

        seriesCounter += 1;
      });

      metric.overlays.forEach((overlay, overlayIndex) => {
        chartLegendItems[metricIndex].push({
          id: overlay.name,
          name: getOverlayName(overlay),
          colour: getOverlayColor(overlayCounter),
          isDisabled: false,
          type: 'plotline',
          plotlineId: `plotline-${metricIndex}-${overlayIndex}`,
        });

        overlayCounter += 1;
      });
    });

    this.setState({
      chartLegendItems,
    });
  }

  onClickLegendItem(legendIndex: number, legendItem: LegendItem) {
    const itemIndex =
      this.state.chartLegendItems[legendIndex].indexOf(legendItem);
    const updatedChartLegendItems = this.state.chartLegendItems.slice();

    if (legendItem.type === 'serie') {
      if (legendItem.isDisabled) {
        this.chart.series[legendItem.serieIndex].setVisible(true, false);
        updatedChartLegendItems[legendIndex][itemIndex].isDisabled = false;
      } else {
        this.chart.series[legendItem.serieIndex].setVisible(false, false);
        updatedChartLegendItems[legendIndex][itemIndex].isDisabled = true;
      }
    } else if (legendItem.type === 'plotline') {
      const overlay = this.state.chartOverlays[legendItem.plotlineId];
      if (legendItem.isDisabled) {
        this.chart.yAxis[overlay.yIndex].addPlotLine(overlay);
        updatedChartLegendItems[legendIndex][itemIndex].isDisabled = false;
      } else {
        this.chart.yAxis[overlay.yIndex].removePlotLine(overlay.id);
        updatedChartLegendItems[legendIndex][itemIndex].isDisabled = true;
      }
    }

    this.setState({
      chartLegendItems: updatedChartLegendItems,
    });

    this.chart.redraw();
  }

  chartLegend(): Node {
    const legendList = this.props.graphData.metrics.map((metric, index) => {
      let legendLabel = null;

      if (metric.type === 'medical') {
        legendLabel = getFullMedicalCategoryName(
          metric.category,
          metric.main_category,
          null,
          metric.filter_names
        );
      }
      return {
        label: legendLabel,
        items: this.state.chartLegendItems[index] || [],
      };
    });

    return (
      <GraphLegendList
        legendList={legendList}
        onClick={(index, legendItem) =>
          this.onClickLegendItem(index, legendItem)
        }
        condensed={this.props.condensed}
      />
    );
  }

  render() {
    return (
      <Fragment>
        <GraphDescription
          showTitle={this.props.showTitle}
          graphData={this.props.graphData}
          openRenameGraphModal={this.props.openRenameGraphModal}
          graphGroup="summary_bar"
          canSaveGraph={this.props.canSaveGraph}
          condensed={this.props.condensed}
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

export default SummaryBarGraph;
