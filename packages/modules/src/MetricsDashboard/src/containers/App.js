import { connect } from 'react-redux';
import {
  showAlarmsEditorModal,
  hideCurrentModal,
  hideConfirmation,
  groupAthletes,
} from '../actions';
import { AppTranslated as App } from '../components/App';

const fullStatuses = (statuses) => statuses.ids.map((id) => statuses.byId[id]);

const mapStateToProps = (state) => ({
  dashboards: state.dashboards.all,
  currentDashboardId: state.dashboards.currentId,
  athletes: state.athletes.all,
  noSearchResults: state.athletes.currentlyVisible === null,
  groupBy: state.athletes.groupBy,
  statuses: fullStatuses(state.statuses),
  canManageDashboard: state.canManageDashboard,
  availableStatuses: state.statuses.available,
  alarmDefinitions: state.alarmDefinitions,
  statusModal: state.statusModal,
  confirmationMessage: state.confirmationMessage,
  isFilterShown: state.showDashboardFilters,
});

const mapDispatchToProps = (dispatch) => ({
  dispatch,
  groupAthletes: (athletes, groupBy) => {
    dispatch(groupAthletes(athletes, groupBy));
  },
  showAlarmsEditorModal: (statusId) => {
    dispatch(showAlarmsEditorModal(statusId));
  },
  hideCurrentModal: () => {
    dispatch(hideCurrentModal());
  },
  hideConfirmation: () => {
    dispatch(hideConfirmation());
  },
});

const AppContainer = connect(mapStateToProps, mapDispatchToProps)(App);

export default AppContainer;
