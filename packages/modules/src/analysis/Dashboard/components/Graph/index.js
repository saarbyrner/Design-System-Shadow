// @flow
import SummaryGraph from '@kitman/modules/src/analysis/shared/components/GraphWidget/SummaryGraph';
import LongitudinalGraph from '@kitman/modules/src/analysis/shared/components/GraphWidget/LongitudinalGraph';
import SummaryBarGraph from '@kitman/modules/src/analysis/shared/components/GraphWidget/SummaryBarGraph';
import SummaryStackBarGraph from '@kitman/modules/src/analysis/shared/components/GraphWidget/SummaryStackBarGraph';
import SummaryDonutGraph from '@kitman/modules/src/analysis/shared/components/GraphWidget/SummaryDonutGraph';
import { ValueVisualisationGraphTranslated as ValueVisualisationGraph } from '@kitman/modules/src/analysis/shared/components/GraphWidget/ValueVisualisationGraph';
import { LongitudinalGraphTableTranslated as LongitudinalGraphTable } from '@kitman/modules/src/analysis/shared/components/GraphWidget/LongitudinalGraphTable';
import { SummaryGraphTableTranslated as SummaryGraphTable } from '@kitman/modules/src/analysis/shared/components/GraphWidget/SummaryGraphTable';
import { SummaryBarGraphTableTranslated as SummaryBarGraphTable } from '@kitman/modules/src/analysis/shared/components/GraphWidget/SummaryBarGraphTable';
import { SummaryDonutGraphTableTranslated as SummaryDonutGraphTable } from '@kitman/modules/src/analysis/shared/components/GraphWidget/SummaryDonutGraphTable';
import { ValueVisualisationTableTranslated as ValueVisualisationTable } from '@kitman/modules/src/analysis/shared/components/GraphWidget/ValueVisualisationTable';
import type {
  SummaryGraphData,
  LongitudinalGraphData,
  SummaryBarGraphData,
  SummaryStackBarGraphData,
  SummaryDonutGraphData,
} from '@kitman/modules/src/analysis/shared/types';
import SummaryDonutDefaultSortConfig from '@kitman/modules/src/analysis/shared/resources/graph/SummaryDonutDefaultSortConfig';
import SummaryStackBarDefaultSortConfig from '@kitman/modules/src/analysis/shared/resources/graph/SummaryStackBarDefaultSortConfig';
import SummaryBarDefaultSortConfig from '@kitman/modules/src/analysis/shared/resources/graph/SummaryBarDefaultSortConfig';

type Props = {
  graphData:
    | SummaryGraphData
    | LongitudinalGraphData
    | SummaryBarGraphData
    | SummaryStackBarGraphData
    | SummaryDonutGraphData,
  condensed: boolean,
  onUpdateAggregationPeriod: Function,
};

const Graph = (props: Props) => {
  const getGraph = () => {
    switch (props.graphData.graphGroup) {
      case 'summary':
        return props.graphData.graphType === 'table' ? (
          <SummaryGraphTable
            graphData={props.graphData}
            condensed={props.condensed}
          />
        ) : (
          <SummaryGraph
            graphData={props.graphData}
            graphType={props.graphData.graphType}
            graphStyle={{ height: '90%' }}
            condensed={props.condensed}
          />
        );
      case 'summary_bar':
        return props.graphData.graphType === 'table' ? (
          <SummaryBarGraphTable
            graphData={props.graphData}
            condensed={props.condensed}
          />
        ) : (
          <SummaryBarGraph
            graphData={props.graphData}
            graphType={props.graphData.graphType}
            graphStyle={{
              height: '85%',
              marginTop: '10px',
              minHeight: '100px',
            }}
            condensed={props.condensed}
            sorting={props.graphData.sorting || SummaryBarDefaultSortConfig}
          />
        );
      case 'summary_stack_bar':
        return props.graphData.graphType === 'table' ? null : ( // TODO: create SummaryStackBarGraphTable component
          <SummaryStackBarGraph
            graphData={props.graphData}
            graphType={props.graphData.graphType}
            graphStyle={{
              height: '85%',
              marginTop: '10px',
              minHeight: '100px',
            }}
            condensed={props.condensed}
            toggleableLegend
            sorting={
              props.graphData.sorting || SummaryStackBarDefaultSortConfig
            }
          />
        );
      case 'summary_donut':
        return props.graphData.graphType === 'table' ? (
          <SummaryDonutGraphTable
            graphData={props.graphData}
            condensed={props.condensed}
          />
        ) : (
          <SummaryDonutGraph
            graphData={props.graphData}
            graphStyle={{ height: '80%', marginTop: '60px' }}
            graphType={props.graphData.graphType}
            condensed={props.condensed}
            sorting={props.graphData.sorting || SummaryDonutDefaultSortConfig}
          />
        );
      case 'longitudinal':
        return props.graphData.graphType === 'table' ? (
          <LongitudinalGraphTable
            graphData={props.graphData}
            condensed={props.condensed}
          />
        ) : (
          <LongitudinalGraph
            graphType={props.graphData.graphType}
            graphData={props.graphData}
            graphStyle={{
              height: '85%',
              marginTop: '10px',
              minHeight: '100px',
            }}
            condensed={props.condensed}
            updateAggregationPeriod={(aggregationPeriod) =>
              props.onUpdateAggregationPeriod(aggregationPeriod)
            }
          />
        );
      case 'value_visualisation':
        return props.graphData.graphType === 'table' ? (
          <ValueVisualisationTable
            graphData={props.graphData}
            condensed={props.condensed}
          />
        ) : (
          <ValueVisualisationGraph
            graphData={props.graphData}
            condensed={props.condensed}
          />
        );
      default:
        return null;
    }
  };

  return getGraph();
};

export default Graph;
