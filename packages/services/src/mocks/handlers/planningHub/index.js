import { handler as deleteDevelopmentGoal } from './deleteDevelopmentGoal';
import { handler as deleteEvent } from './deleteEvent';
import { handler as deletePrinciple } from './deletePrinciple';
import { handler as getActivityTypeDeletionAvailability } from './getActivityTypeDeletionAvailability';
import { handler as getActivityTypes } from './getActivityTypes';
import { handler as getAthleteEvents } from './athleteEvents';
import { handler as getCollectionTab } from './getCollectionTab';
import { handler as getDevelopmentGoalCompletionTypes } from './getDevelopmentGoalCompletionTypes';
import { handler as getDevelopmentGoalTypes } from './getDevelopmentGoalTypes';
import { handler as getDrillLabels } from './getDrillLabels';
import { handler as getEvent } from './getEvent';
import { handler as getEventDevelopmentGoals } from './getEventDevelopmentGoals';
import { handler as getEvents } from './getEvents';
import { handler as getPhases } from './getPhases';
import { handler as getPrincipleCategories } from './getPrincipleCategories';
import { handler as getPrincipleDeletionAvailability } from './getPrincipleDeletionAvailability';
import { handler as getPrinciples } from './getPrinciples';
import { handler as getPrincipleTypes } from './getPrincipleTypes';
import { handler as saveActivityTypes } from './saveActivityTypes';
import { handler as saveDevelopmentGoal } from './saveDevelopmentGoal';
import { handler as saveDevelopmentGoalCompletionTypes } from './saveDevelopmentGoalCompletionTypes';
import { handler as saveDevelopmentGoalTypes } from './saveDevelopmentGoalTypes';
import { handler as saveDrillLabels } from './saveDrillLabels';
import { handler as savePrincipleCategories } from './savePrincipleCategories';
import { handler as savePrinciples } from './savePrinciples';
import { handler as updateDevelopmentGoal } from './updateDevelopmentGoal';
import { handler as updateEventDevelopmentGoalsCompletionStatus } from './updateEventDevelopmentGoalsCompletionStatus';
import { handler as deleteEventActivity } from './deleteEventActivity';
import { handler as getEventPeriods } from './getEventPeriods';
import { handler as getGameStatuses } from './getGameStatuses';
import { handler as getRecurrencePreferences } from './getRecurrencePreferences';
import { handler as getEventDeletionPrompt } from './getEventDeletionPrompt';

export default [
  deleteDevelopmentGoal,
  deleteEvent,
  deleteEventActivity,
  deletePrinciple,
  getActivityTypeDeletionAvailability,
  getActivityTypes,
  getAthleteEvents,
  getCollectionTab,
  getDevelopmentGoalCompletionTypes,
  getDevelopmentGoalTypes,
  getEventDevelopmentGoals,
  getEvent,
  getEvents,
  getPhases,
  getPrincipleCategories,
  getPrincipleDeletionAvailability,
  getPrinciples,
  getPrincipleTypes,
  getDrillLabels,
  saveActivityTypes,
  saveDevelopmentGoal,
  saveDevelopmentGoalCompletionTypes,
  saveDevelopmentGoalTypes,
  saveDrillLabels,
  savePrincipleCategories,
  savePrinciples,
  updateDevelopmentGoal,
  updateEventDevelopmentGoalsCompletionStatus,
  getEventPeriods,
  getGameStatuses,
  getRecurrencePreferences,
  getEventDeletionPrompt,
];
