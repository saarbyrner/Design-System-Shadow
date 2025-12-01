/* eslint-disable flowtype/require-valid-file-annotation */
import { combineReducers } from 'redux';
// alarm reducers
import athletes from '@kitman/common/src/reducers/athletes_reducer';
import {
  alarmDefinitions,
  alarmDefinitionsForStatus,
  alarmSquadSearch,
  canManageDashboard,
  canViewAvailability,
  canManageAvailability,
  showDashboardFilters,
  canViewGraph,
  alarmsEditorModal,
  groupingLabels,
  indicationTypes,
} from './reducer';
import alarmsModal from './reducers/alarm_modal_reducer';
import modal from './reducers/modal_reducer';
import confirmationMessage from './reducers/confirmation_message_reducer';

// We don't need a reducer for dashboard yet as we change state by changing the page
const dashboards = (state = {}) => state;
// We don't need a reducer for the statuses
const statuses = (state = {}) => state;

const StateTree = combineReducers({
  alarmDefinitions,
  alarmDefinitionsForStatus,
  alarmSquadSearch,
  groupingLabels,
  statuses,
  dashboards,
  athletes,
  canManageDashboard,
  canViewAvailability,
  canManageAvailability,
  showDashboardFilters,
  alarmsEditorModal,
  modal,
  confirmationMessage,
  alarmsModal,
  canViewGraph,
  indicationTypes,
});

export default StateTree;
