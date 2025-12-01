// @flow
import { handler as fetchAssessmentTrainingVariables } from './fetchAssessmentTrainingVariables';
import { handler as fetchAthleteTabHandler } from './fetchAthleteTab';
import { handler as fetchWorkloadGridHandler } from './fetchWorkloadGrid';
import { handler as fetchNotifications } from './fetchNotifications';
import { handler as getFormationPositionsCoordinatesHandler } from './getFormationPositionsCoordinates';
import { handler as getGameFieldsHandler } from './getGameFields';
import { handler as getSeasonMarkerRange } from './getSeasonMarkerRange';
import { handler as getEventAthletesGrid } from './getEventAthletesGrid';
import {
  postHandler as saveNewEvent,
  patchHandler as saveExistingEvent,
} from './saveEvent';
import { handler as saveAllPeriodGameActivities } from './saveAllPeriodGameActivities';
import {
  postHandler as createCustomOppositionName,
  patchHandler as updateCustomOppositionName,
  deleteHandler as deleteCustomOppositionName,
} from './customOppositionHandler';
import { handlers as bulkUpdateAthletePlayTimesHandlers } from './bulkUpdateAthletePlayTimesHandler';
import { handlers as getAthletePlayTimesHandlers } from './getAthletePlayTimesHandler';
import { handler as parseFile } from './parseFile';

export default [
  fetchAssessmentTrainingVariables,
  fetchAthleteTabHandler,
  fetchWorkloadGridHandler,
  fetchNotifications,
  getFormationPositionsCoordinatesHandler,
  getGameFieldsHandler,
  getSeasonMarkerRange,
  getEventAthletesGrid,
  saveAllPeriodGameActivities,
  saveNewEvent,
  saveExistingEvent,
  createCustomOppositionName,
  updateCustomOppositionName,
  deleteCustomOppositionName,
  parseFile,
  ...bulkUpdateAthletePlayTimesHandlers,
  ...getAthletePlayTimesHandlers,
];
