import { connect } from 'react-redux';
import { VariableVisualisationTranslated as VariableVisualisationComponent } from '../components/variableVisualisation/index';
import {
  addNewInjuryVariable,
  openRenameVariableModal,
  updateVariable,
  buildVariableGraphs,
  triggerManualRun,
  fetchTCFGraphData,
} from '../actions';

const mapStateToProps = (state) => ({
  variable: state.injuryVariableSettings.currentVariable,
  graphData: state.injuryVariableSettings.graphData,
  canCreateMetric: state.injuryVariableSettings.staticData.canCreateMetric,
  canEditMetrics: state.injuryVariableSettings.staticData.canEditMetrics,
  tcfGraphData: state.injuryVariableSettings.tcfGraphData.graphData,
  isTcfGraphLoading: state.injuryVariableSettings.tcfGraphData.isLoading,
});

const mapDispatchToProps = (dispatch) => ({
  onAddNewInjuryVariable: () => {
    dispatch(addNewInjuryVariable());
  },
  onOpenRenameVariableModal: (isTriggeredBySave, variableName) => {
    dispatch(openRenameVariableModal(isTriggeredBySave, variableName));
  },
  onUpdateVariable: (calledFrom) => {
    dispatch(updateVariable(calledFrom));
  },
  buildVariableGraphs: () => {
    dispatch(buildVariableGraphs());
  },
  onClickManualRun: () => {
    dispatch(triggerManualRun());
  },
  fetchTCFGraphData: (injuryRiskVariableUuid) => {
    dispatch(fetchTCFGraphData(injuryRiskVariableUuid));
  },
});

const VariableVisualisation = connect(
  mapStateToProps,
  mapDispatchToProps
)(VariableVisualisationComponent);

export default VariableVisualisation;
