import { connect } from 'react-redux';
import { GraphViewTranslated as GraphView } from '../../components/GraphView';
import {
  saveGraph,
  openDashboardSelectorModal,
  updateGraphFormType,
  closeRenameGraphModal,
  onRenameGraphValueChange,
  confirmRenameGraph,
  openRenameGraphModal,
} from '../../actions';
import {
  updateDecorators,
  updateAggregationPeriod,
} from '../../actions/GraphView';

const hasGraphData = (allGraphData) => {
  let hasData = false;
  if (
    (allGraphData.longitudinal &&
      allGraphData.longitudinal.metrics.length > 0) ||
    (allGraphData.summary && allGraphData.summary.metrics.length > 0) ||
    (allGraphData.summaryBar && allGraphData.summaryBar.metrics.length > 0) ||
    (allGraphData.summaryStackBar &&
      allGraphData.summaryStackBar.metrics.length > 0) ||
    (allGraphData.summaryDonut &&
      allGraphData.summaryDonut.metrics.length > 0) ||
    (allGraphData.valueVisualisation &&
      allGraphData.valueVisualisation.metrics.length > 0)
  ) {
    hasData = true;
  }

  return hasData;
};

const geGraphData = (graphGroup, graphData) => {
  switch (graphGroup) {
    case 'longitudinal':
      return graphData.longitudinal;
    case 'summary':
      return graphData.summary;
    case 'summary_bar':
      return graphData.summaryBar;
    case 'summary_stack_bar':
      return graphData.summaryStackBar;
    case 'summary_donut':
      return graphData.summaryDonut;
    case 'value_visualisation':
      return graphData.valueVisualisation;
    default:
      return null;
  }
};

const mapStateToProps = (state) => ({
  graphType: state.GraphFormType,
  canBuildGraph: state.StaticData.canBuildGraph,
  canSaveGraph: state.StaticData.canSaveGraph,
  graphData: geGraphData(state.GraphGroup, state.GraphData),
  isEditingDashboard: state.StaticData.isEditingDashboard,
  isEditingGraph: state.StaticData.isEditingGraph,
  hasGraphData: hasGraphData(state.GraphData),
  graphGroup: state.GraphGroup,
  renameModal: state.RenameGraphModal,
  containerType: state.StaticData.containerType,
});

const mapDispatchToProps = (dispatch) => ({
  saveGraph: () => {
    dispatch(saveGraph());
  },
  openDashboardSelectorModal: () => {
    dispatch(openDashboardSelectorModal());
  },
  updateGraphType: (graphType, graphGroup) => {
    dispatch(updateGraphFormType(graphType, graphGroup));
  },
  updateDecorators: (graphGroup, decorators) => {
    dispatch(updateDecorators(graphGroup, decorators));
  },
  closeRenameGraphModal: () => {
    dispatch(closeRenameGraphModal());
  },
  onRenameValueChange: (value) => {
    dispatch(onRenameGraphValueChange(value));
  },
  onRenameConfirm: (newGraphName, graphGroup) => {
    dispatch(confirmRenameGraph(newGraphName, graphGroup));
  },
  updateAggregationPeriod: (aggregationPeriod) => {
    dispatch(updateAggregationPeriod(aggregationPeriod));
  },
  openRenameGraphModal: () => {
    dispatch(openRenameGraphModal());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(GraphView);
