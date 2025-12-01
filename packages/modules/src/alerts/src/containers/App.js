// @flow
import { connect } from 'react-redux';
import { AppTranslated as AppComponent } from '../components/App';
import {
  openAlertModal,
  showConfirmDeleteAlert,
  editAlertActivity,
} from '../actions';

const mapStateToProps = (state) => {
  return {
    alerts: state.alerts.alertList,
    users: state.alerts.staticData.users,
    variables: state.alerts.staticData.variables,
  };
};

const mapDispatchToProps = (dispatch) => ({
  onClickEditAlert: (alertId) => {
    dispatch(openAlertModal(alertId, 'edit'));
  },
  onClickDuplicateAlert: (alertId) => {
    dispatch(openAlertModal(alertId, 'duplicate'));
  },
  onClickDeleteAlert: (alert) => {
    dispatch(showConfirmDeleteAlert(alert));
  },
  onClickCreateAlert: (alertId) => {
    dispatch(openAlertModal(alertId, 'create'));
  },
  onClickActivateAlert: (alert) => {
    dispatch(editAlertActivity(alert));
  },
});

const App = connect(mapStateToProps, mapDispatchToProps)(AppComponent);

export default App;
