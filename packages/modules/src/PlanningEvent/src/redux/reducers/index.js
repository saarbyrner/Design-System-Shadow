// @flow

import { combineReducers } from 'redux';
import coachingPrinciples from '@kitman/common/src/reducers/coaching_principles_reducer';
import planningEventRtkReducers from '@kitman/modules/src/PlanningEvent/src/redux/reducers/rtk/index';
import comments from './comments';
import grid from './grid';
import gridDetails from './gridDetails';
import appState from './appState';
import assessmentTemplates from './assessmentTemplates';
import eventAssessments from './eventAssessments';
import gameActivitiesSlice from '../slices/gameActivitiesSlice';
import eventPeriodsSlice from '../slices/eventPeriodsSlice';
import athletePlayTimesSlice from '../slices/athletePlayTimesSlice';
import pitchViewSlice from '../slices/pitchViewSlice';
import athleteEventsSlice from '../slices/athleteEventsSlice';
import planningEventSlice from '../slices/planningEventSlice';


export default combineReducers({
  comments,
  grid,
  gridDetails,
  appState,
  assessmentTemplates,
  eventAssessments,
  coachingPrinciples,
  gameActivities: gameActivitiesSlice.reducer,
  eventPeriods: eventPeriodsSlice.reducer,
  athleteEvents: athleteEventsSlice.reducer,
  athletePlayTimes: athletePlayTimesSlice.reducer,
  pitchView: pitchViewSlice.reducer,
  gameEvent: planningEventSlice.reducer,
  ...planningEventRtkReducers.reducers,
});
