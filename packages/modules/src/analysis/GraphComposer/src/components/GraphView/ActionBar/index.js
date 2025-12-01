// @flow
import type {
  GraphType,
  GraphGroup,
  SummaryGraphData,
  LongitudinalGraphData,
  SummaryBarGraphData,
  SummaryStackBarGraphData,
  SummaryDonutGraphData,
  ValueVisualisationData,
} from '@kitman/modules/src/analysis/shared/types';
import { isDrillGraph } from '@kitman/modules/src/analysis/shared/utils';
import GraphTypeButtons from './GraphTypeButtons';
import { DecoratorSelectorTranslated as DecoratorSelector } from './DecoratorSelector';
import Actions from './Actions';

type Props = {
  graphType: GraphType,
  graphGroup: GraphGroup,
  updateGraphType: Function,
  graphData:
    | SummaryGraphData
    | LongitudinalGraphData
    | SummaryBarGraphData
    | SummaryStackBarGraphData
    | SummaryDonutGraphData
    | ValueVisualisationData,
  updateDecorators: Function,
  canBuildGraph: boolean,
  openGraphModal: Function,
};

const ActionBar = (props: Props) => {
  const renderDecoratorSelector = () => {
    const shouldShowIssues =
      props.graphData.graphGroup === 'longitudinal' &&
      !isDrillGraph(props.graphData);

    const isFilterableType =
      props.graphData.graphGroup === 'summary_bar' ||
      props.graphData.graphGroup === 'summary_stack_bar';
    const shouldShowNullHide = isFilterableType || false;
    const shouldShowZerosHide = isFilterableType || false;

    return (
      <DecoratorSelector
        // props.graphData.decorators always exists if the element gets rendered
        // $FlowFixMe
        decorators={props.graphData.decorators}
        visible={{
          // props.graphData.injuries and illnesses always exist if the element gets rendered
          // $FlowFixMe
          injuries: shouldShowIssues && props.graphData.injuries.length > 0,
          // $FlowFixMe
          illnesses: shouldShowIssues && props.graphData.illnesses.length > 0,
          data_labels: true,
          hide_nulls: shouldShowNullHide,
          hide_zeros: shouldShowZerosHide,
        }}
        onChange={(decorators) => {
          props.updateDecorators(decorators);
        }}
      />
    );
  };

  return (
    <div className="graphView__controls d-print-none">
      <GraphTypeButtons
        graphGroup={props.graphGroup}
        graphType={props.graphType}
        updateGraphType={props.updateGraphType}
      />
      <div className="graphView__actions">
        {props.graphData.graphGroup === 'longitudinal' ||
        props.graphData.graphGroup === 'summary_bar' ||
        props.graphData.graphGroup === 'summary_stack_bar'
          ? renderDecoratorSelector()
          : null}
        <Actions
          canBuildGraph={props.canBuildGraph}
          graphType={props.graphType}
          expandGraph={props.openGraphModal}
        />
      </div>
    </div>
  );
};

export default ActionBar;
