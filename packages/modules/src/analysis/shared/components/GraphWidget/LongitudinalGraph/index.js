/* eslint-disable react/sort-comp */
// @flow
import Highcharts from '@kitman/common/src/utils/HighchartDefaultOptions';
import HighchartsMore from 'highcharts/highcharts-more';
import HighchartsNoDataToDisplay from 'highcharts/modules/no-data-to-display';
import type { Node } from 'react';
import { Component } from 'react';
import $ from 'jquery';
import _isEqual from 'lodash/isEqual';
import type { LegendItem } from '@kitman/components/src/types';
import { colors } from '@kitman/common/src/variables';
import {
  getChartOverlays,
  getOverlayColor,
} from '@kitman/modules/src/analysis/shared/resources/graph/GraphUtils';
import { ChartConfig } from '@kitman/modules/src/analysis/shared/resources/graph/LongitudinalChartConfig';
import { GraphDescriptionTranslated as GraphDescription } from '../GraphDescription';
import {
  isDrillGraph,
  getOverlayName,
  getFullMedicalCategoryName,
  formatFilterNames,
} from '../../../utils';
import type {
  ChartOverlay,
  LongitudinalGraphData,
  AggregationPeriod,
  GraphType,
} from '../../../types';
import { ChartPeriodSelectorTranslated as ChartPeriodSelector } from './ChartPeriodSelector';
import { GraphLegendListTranslated as GraphLegendList } from '../GraphLegendList';

HighchartsMore(Highcharts);
HighchartsNoDataToDisplay(Highcharts);

type Props = {
  graphData: LongitudinalGraphData,
  showTitle?: boolean,
  graphType: GraphType,
  updateAggregationPeriod?: Function,
  openRenameGraphModal?: Function,
  canSaveGraph?: boolean,
  graphStyle: Object,
  condensed?: boolean,
};

type State = {
  chartLegendItems: Array<Array<LegendItem>>,
  chartOverlays: {
    [string]: ChartOverlay,
  },
  aggregationPeriod: AggregationPeriod,
};

class LongitudinalGraph extends Component<Props, State> {
  composedGraph: ?HTMLElement;

  chart: Object;

  barsContainer: Object;

  constructor(props: Props) {
    super(props);
    this.state = {
      chartLegendItems: [],
      chartOverlays: {},
      aggregationPeriod: this.props.graphData.aggregationPeriod,
    };
  }

  componentDidMount() {
    this.initChart();
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (!_isEqual(this.props.graphData.metrics, prevProps.graphData.metrics)) {
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

  getSeriesColours(chart: Object) {
    const colours = [];
    // we slice the array because we want to ignore the
    // first two series (injuries and illnesses)
    const seriesColours = chart.series.slice(2).map((item) => item.color);
    this.props.graphData.metrics.forEach((metric, index) => {
      colours[index] = seriesColours.splice(0, metric.series.length);
    });

    return colours;
  }

  showHideDecorators(
    isInjuryDecoratorVisible: boolean,
    isIllnessDecoratorVisible: boolean
  ) {
    /*
     * series[0]: Injury decorator
     * series[1]: Illness decorator
     * series[x]: Other series
     */
    if (isInjuryDecoratorVisible) {
      this.showSeries(0);
    } else if (!isInjuryDecoratorVisible) {
      this.hideSeries(0);
    }
    if (isIllnessDecoratorVisible) {
      this.showSeries(1);
    } else if (!isIllnessDecoratorVisible) {
      this.hideSeries(1);
    }
    // #8333: We need to redraw the graph when hiding the decorators
    // Highchart will optimize the graph rendering
    // because there is less element on the graph
    this.chart.redraw();
  }

  showSeries(index: number) {
    if (this.chart) {
      this.chart.series[index].setVisible(true, false);
    }
  }

  hideSeries(index: number) {
    if (this.chart) {
      this.chart.series[index].setVisible(false, false);
    }
  }

  isEventGraph() {
    return (
      this.props.graphData.metrics.length > 0 &&
      this.props.graphData.metrics[0].status &&
      (this.props.graphData.metrics[0].status.event_type_time_period ===
        'game' ||
        this.props.graphData.metrics[0].status.event_type_time_period ===
          'training_session')
    );
  }

  initChart() {
    const chartConfig = ChartConfig(
      this.props.graphData,
      this.props.graphType,
      this.isEventGraph()
    );

    if (this.props.graphData.metrics.length > 0) {
      this.chart = new Highcharts.Chart(this.composedGraph, chartConfig);

      const seriesColours = this.getSeriesColours(this.chart);
      this.formatChartLegend(seriesColours);

      this.initChartOverlays();

      this.showHideDecorators(
        this.props.graphData.decorators.illnesses,
        this.props.graphData.decorators.injuries
      );
    }
  }

  initChartOverlays() {
    const chartOverlays = getChartOverlays(this.props.graphData.metrics, 1);

    Object.keys(chartOverlays).forEach((overlayId) => {
      this.chart.yAxis[chartOverlays[overlayId].yIndex].addPlotLine(
        chartOverlays[overlayId]
      );
    });

    this.setState({
      chartOverlays,
    });
  }

  setAggregationPeriod(period: AggregationPeriod) {
    $.each(this.chart.series, (index) => {
      if (index > 1) {
        this.chart.series[index].options.dataGrouping.units[0] = [period, [1]];
        this.chart.series[index].isDirty = true;
      }
    });
    this.chart.zoomOut();
  }

  formatChartLegend(seriesColours: Array<Array<string>>) {
    const chartLegendItems = [];
    let overlayCounter = 0;
    let seriesCounter = 0;

    this.props.graphData.metrics.forEach((metric, metricIndex) => {
      chartLegendItems[metricIndex] = [];

      metric.series.forEach((item, seriesIndex) => {
        chartLegendItems[metricIndex].push({
          id: seriesCounter.toString(),
          name: item.fullname,
          colour: seriesColours[metricIndex][seriesIndex] || colors.s02,
          isDisabled: false,
          type: 'serie',
          /*
           * Series indexes are offset by 2
           * because the first serie is the injury serie
           * and the second serie is the illness serie
           *
           * series[0]: Injury decorator
           * series[1]: Illness decorator
           * series[x]: Other series
           */
          serieIndex: seriesCounter + 2,
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
        this.showSeries(legendItem.serieIndex);
        updatedChartLegendItems[legendIndex][itemIndex].isDisabled = false;
      } else {
        this.hideSeries(legendItem.serieIndex);
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
  }

  chartLegend(): Node {
    let shouldHideLegendLabel =
      this.props.graphData.metrics.length === 1 &&
      this.props.graphData.metrics[0].type === 'metric';

    const legendList = this.props.graphData.metrics.map((metric, index) => {
      let legendLabel = null;

      if (metric.type === 'medical') {
        legendLabel = getFullMedicalCategoryName(
          metric.category,
          metric.main_category,
          null,
          metric.filter_names
        );
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
          shouldHideLegendLabel = false;
          legendLabel = `${legendLabel} (${formatedFilterNames})`;
        }
      }

      return {
        label: shouldHideLegendLabel ? null : legendLabel,
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

  renderChartPeriodSelector() {
    const chartPeriodSelector = (
      <ChartPeriodSelector
        onChange={(period) => {
          if (this.props.updateAggregationPeriod) {
            this.props.updateAggregationPeriod(period);
          }
          this.setState({ aggregationPeriod: period });
          this.setAggregationPeriod(period);
        }}
        period={this.state.aggregationPeriod}
        condensed={this.props.condensed}
      />
    );

    return !isDrillGraph(this.props.graphData) && chartPeriodSelector;
  }

  render() {
    if (this.chart) {
      this.showHideDecorators(
        this.props.graphData.decorators.illnesses,
        this.props.graphData.decorators.injuries
      );
    }

    return (
      <>
        <div className="graphComposer__graphHeader">
          <div className="graphComposer__graphDetails">
            <GraphDescription
              showTitle={this.props.showTitle}
              graphData={this.props.graphData}
              graphGroup="longitudinal"
              openRenameGraphModal={this.props.openRenameGraphModal}
              canSaveGraph={this.props.canSaveGraph}
              condensed={this.props.condensed}
            />
          </div>
          {this.renderChartPeriodSelector()}
        </div>
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

export default LongitudinalGraph;
