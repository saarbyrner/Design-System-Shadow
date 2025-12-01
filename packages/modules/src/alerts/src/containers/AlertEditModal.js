// @flow
import { connect } from 'react-redux';
import { AlertEditModalTranslated as AlertEditModalComponent } from '../components/alertEditModal';
import {
  closeAlertModal,
  selectAlertUsers,
  selectAlertVariables,
  editAlert,
  createAlert,
  updateAlertName,
  updateAlertMessage,
  updateAlertVariables,
  updateVariableCondition,
  updateVariableUnit,
  addNewVariable,
  deleteVariable,
} from '../actions';

const mapStateToProps = (state) => ({
  isOpen:
    state.alerts.openModal === 'edit' || state.alerts.openModal === 'create',
  alert: state.alerts.currentAlert,
  users: state.alerts.staticData.users,
  variables: state.alerts.staticData.variables,
});

const mapDispatchToProps = (dispatch) => ({
  close: () => {
    dispatch(closeAlertModal());
  },
  onSaveEditAlert: () => {
    dispatch(editAlert());
  },
  onSaveCreateAlert: () => {
    dispatch(createAlert());
  },
  selectAlertUsers: (userItem) => {
    dispatch(selectAlertUsers(userItem));
  },
  selectAlertVariables: (variableItem) => {
    dispatch(selectAlertVariables(variableItem));
  },
  updateAlertName: (alertName) => {
    dispatch(updateAlertName(alertName));
  },
  updateAlertMessage: (alertMessage) => {
    dispatch(updateAlertMessage(alertMessage));
  },
  updateAlertVariables: (variableId, index) => {
    dispatch(updateAlertVariables(variableId, index));
  },
  updateVariableCondition: (conditionId, index) => {
    dispatch(updateVariableCondition(conditionId, index));
  },
  updateVariableUnit: (unitValue, index) => {
    dispatch(updateVariableUnit(unitValue, index));
  },
  onAddNewVariable: () => {
    dispatch(addNewVariable());
  },
  onDeleteVariable: (index) => {
    dispatch(deleteVariable(index));
  },
});

const AlertEditModal = connect(
  mapStateToProps,
  mapDispatchToProps
)(AlertEditModalComponent);

export default AlertEditModal;
