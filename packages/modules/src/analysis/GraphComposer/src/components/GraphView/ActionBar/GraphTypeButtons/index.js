// @flow
import { TrackEvent } from '@kitman/common/src/utils';
import { IconButton } from '@kitman/components';
import type { GraphType, GraphGroup } from '@kitman/common/src/types/Graphs';

type Props = {
  graphGroup: GraphGroup,
  graphType: GraphType,
  updateGraphType: Function,
};

const GraphTypeButtons = (props: Props) => {
  const graphTypeButton = (iconName, graphType) => (
    <div key={graphType} className="graphView__graphTypeBtn">
      <IconButton
        icon={iconName}
        isActive={props.graphType === graphType}
        onClick={() => {
          TrackEvent('Graph Builder', 'Click', `${graphType} Graph Icon`);
          props.updateGraphType(graphType);
        }}
      />
    </div>
  );

  const lineGraphButton = graphTypeButton('icon-line-graph', 'line');
  const columnGraphButton = graphTypeButton('icon-column-graph', 'column');
  const barGraphButton = graphTypeButton('icon-bar-graph', 'bar');
  const combinationGraphButton = graphTypeButton(
    'icon-combination-graph',
    'combination'
  );
  const stackcolumnGraphButton = graphTypeButton(
    'icon-stack-column-graph',
    'column'
  );
  const stackBarGraphButton = graphTypeButton('icon-stack-bar-graph', 'bar');
  const radarGraphButton = graphTypeButton('icon-radar-graph', 'radar');
  const spiderGraphButton = graphTypeButton('icon-spider-graph', 'spider');
  const donutGraphButton = graphTypeButton('icon-donut-graph', 'donut');
  const pieGraphButton = graphTypeButton('icon-pie-graph', 'pie');
  const valueVisualisationButton = graphTypeButton('icon-value-graph', 'value');
  const tableGraphButton = graphTypeButton('icon-table', 'table');

  let graphTypeButtonsList = [];
  switch (props.graphGroup) {
    case 'longitudinal':
      graphTypeButtonsList = [
        lineGraphButton,
        columnGraphButton,
        barGraphButton,
        combinationGraphButton,
        tableGraphButton,
      ];
      break;
    case 'summary':
      graphTypeButtonsList = [
        radarGraphButton,
        spiderGraphButton,
        tableGraphButton,
      ];
      break;
    case 'summary_bar':
      graphTypeButtonsList = [
        columnGraphButton,
        barGraphButton,
        tableGraphButton,
      ];
      break;
    case 'summary_donut':
      graphTypeButtonsList = [
        donutGraphButton,
        pieGraphButton,
        tableGraphButton,
      ];
      break;
    case 'summary_stack_bar':
      graphTypeButtonsList = [stackcolumnGraphButton, stackBarGraphButton];
      break;
    case 'value_visualisation':
      graphTypeButtonsList = [valueVisualisationButton, tableGraphButton];
      break;
    default:
      graphTypeButtonsList = [];
  }

  return (
    <div className="graphView__graphTypeOptions">{graphTypeButtonsList}</div>
  );
};

export default GraphTypeButtons;
