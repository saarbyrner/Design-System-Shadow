import { connect } from 'react-redux';
import { AppTranslated as AppComponent } from '../components/App';
import {
  selectInjuryVariable,
  addNewInjuryVariable,
  cancelEditInjuryVariable,
  saveButtonClick,
  buildVariableGraphs,
} from '../actions';

const mapStateToProps = (state) => ({
  allVariables: state.injuryVariableSettings.allVariables,
  currentVariable: state.injuryVariableSettings.currentVariable,
  graphData: state.injuryVariableSettings.graphData,
  canCreateMetric: state.injuryVariableSettings.staticData.canCreateMetric,
  canViewMetrics: state.injuryVariableSettings.staticData.canViewMetrics,
});

const mapDispatchToProps = (dispatch) => ({
  onSelectInjuryVariable: (variableId) => {
    dispatch(selectInjuryVariable(variableId));
  },
  onAddNewInjuryVariable: () => {
    dispatch(addNewInjuryVariable());
  },
  onCancelEditInjuryVariable: () => {
    dispatch(cancelEditInjuryVariable());
  },
  onSaveVariable: () => {
    dispatch(saveButtonClick());
  },
  buildVariableGraphs: () => {
    dispatch(buildVariableGraphs());
  },
});

const App = connect(mapStateToProps, mapDispatchToProps)(AppComponent);

export default App;
