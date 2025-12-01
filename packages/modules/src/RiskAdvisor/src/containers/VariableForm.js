import { connect } from 'react-redux';
import { VariableFormTranslated as VariableFormComponent } from '../components/variableForm/index';
import {
  changeDateRange,
  selectExposures,
  selectMechanisms,
  selectBodyArea,
  selectPositionGroups,
  buildVariableGraphs,
  toggleHideVariable,
  selectPipelineArn,
  toggleDataSourcePanel,
  selectSeverities,
} from '../actions';

const mapStateToProps = (state) => ({
  variable: state.injuryVariableSettings.currentVariable,
  squadOptions: state.injuryVariableSettings.staticData.squadOptions,
  bodyAreaOptions: state.injuryVariableSettings.staticData.bodyAreaOptions,
  severityOptions: state.injuryVariableSettings.staticData.severityOptions,
  isKitmanAdmin: state.injuryVariableSettings.staticData.isKitmanAdmin,
  pipelineArnOptions:
    state.injuryVariableSettings.staticData.pipelineArnOptions,
  positionGroupOptions:
    state.injuryVariableSettings.staticData.positionGroupOptions,
});

const mapDispatchToProps = (dispatch) => ({
  onChangeDateRange: (dateRange) => {
    dispatch(changeDateRange(dateRange));
  },
  onSelectExposures: (exposureId) => {
    dispatch(selectExposures(exposureId));
  },
  onSelectMechanisms: (mechanismId) => {
    dispatch(selectMechanisms(mechanismId));
  },
  onSelectBodyArea: (bodyAreaItem) => {
    dispatch(selectBodyArea(bodyAreaItem));
  },
  onSelectPositionGroups: (positionGroupId) => {
    dispatch(selectPositionGroups(positionGroupId));
  },
  onApplyVariableFilters: () => {
    dispatch(buildVariableGraphs());
  },
  onSelectSeverities: (severityId) => {
    dispatch(selectSeverities(severityId));
  },
  onToggleHideVariable: (isChecked) => {
    dispatch(toggleHideVariable(isChecked));
  },
  onSelectPipelineArn: (arn) => {
    dispatch(selectPipelineArn(arn));
  },
  toggleDataSourcePanel: () => {
    dispatch(toggleDataSourcePanel());
  },
});

const VariableForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(VariableFormComponent);

export default VariableForm;
