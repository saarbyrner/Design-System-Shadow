// @flow

import { combineReducers } from 'redux';
import app from './app';
import sessionAssessments from './sessionAssessments';
import gameTemplates from './gameTemplates';

export default combineReducers({
  app,
  sessionAssessments,
  gameTemplates,
});
