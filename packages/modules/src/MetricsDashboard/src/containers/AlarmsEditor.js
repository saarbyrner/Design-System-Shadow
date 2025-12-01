import uuid from 'uuid';
import { connect } from 'react-redux';
import {
  hideCurrentModal,
  cancelCloseModal,
  confirmCloseModal,
  saveAlarmDefinitions,
  addAlarmDefinitionForStatus,
  toggleSelectAllForMobile,
  deleteAllAlarmDefinitionsForStatus,
  confirmDeleteAllAlarmDefinitionsForStatus,
} from '../actions';
import { AlarmsEditorTranslated as AlarmsEditor } from '../components/AlarmsEditor';

const mapStateToProps = (state) => {
  let status;

  if (state.modal.modalProps.statusId) {
    status = state.statuses.byId[state.modal.modalProps.statusId];
  } else {
    // blank status
    status = {
      name: null,
      localised_unit: null,
      description: null,
      type: null,
    };
  }

  return {
    statusId: state.modal.modalProps.statusId || null,
    alarms: state.alarmDefinitionsForStatus.alarms,
    status,
    modalIsOpen: state.alarmsModal.isVisible,
    modalStatus: state.alarmsModal.modalStatus,
    modalMessage: state.alarmsModal.modalMessage,
    changesMade: state.alarmsModal.changesMade,
    confirmActionId: state.alarmsModal.confirmActionId,
  };
};

const mapDispatchToProps = (dispatch) => ({
  closeModal: () => {
    dispatch(hideCurrentModal());
  },
  cancelCloseModal: () => {
    dispatch(cancelCloseModal());
  },
  createNewAlarm: () => {
    dispatch(addAlarmDefinitionForStatus(uuid.v4()));
  },
  confirmCloseModal: () => {
    dispatch(confirmCloseModal());
  },
  saveAlarmDefinitions: (statusId, alarmDefinitionsForStatus) => {
    dispatch(saveAlarmDefinitions(statusId, alarmDefinitionsForStatus));
  },
  toggleSelectAllForMobile: (alarmIdsWithShowOnMobile) => {
    dispatch(toggleSelectAllForMobile(alarmIdsWithShowOnMobile));
  },
  confirmDeleteAllAlarms: () => {
    dispatch(confirmDeleteAllAlarmDefinitionsForStatus());
  },
  deleteAllAlarms: () => {
    dispatch(deleteAllAlarmDefinitionsForStatus());
  },
});

// This is needed as whether to confirm or just close depends on whether the
// user has made changes to the order. This information is stored in the state
// so it's not accessible to mapDispatchToProps. It is in the props so we can
// use mergeProps to get that information and then replace the confirmCloseModal
// dispatch with the closeModal one if required.
const mergeProps = (stateProps, dispatchProps, ownProps) => {
  let confirmOverride = {};
  if (!stateProps.changesMade) {
    confirmOverride = { confirmCloseModal: dispatchProps.closeModal };
  }
  return Object.assign(
    {},
    ownProps,
    stateProps,
    dispatchProps,
    confirmOverride
  );
};

const AlarmsEditorContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(AlarmsEditor);

export default AlarmsEditorContainer;
