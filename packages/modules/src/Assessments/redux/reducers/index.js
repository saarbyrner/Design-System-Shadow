// @flow

import { combineReducers } from 'redux';
import athletes from './athletes';
import assessments from './assessments';
import assessmentTemplates from './assessmentTemplates';
import organisationTrainingVariables from './organisationTrainingVariables';
import statusVariables from './statusVariables';
import currentSquad from './currentSquad';
import users from './users';
import appState from './appState';
import appStatus from './appStatus';
import toasts from './toasts';
import turnaroundList from './turnaroundList';
import viewType from './viewType';

export default combineReducers({
  athletes,
  assessments,
  assessmentTemplates,
  organisationTrainingVariables,
  statusVariables,
  currentSquad,
  users,
  appState,
  appStatus,
  toasts,
  turnaroundList,
  viewType,
});
