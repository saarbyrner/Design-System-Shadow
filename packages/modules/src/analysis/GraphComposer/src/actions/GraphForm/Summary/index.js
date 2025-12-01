// @flow
import $ from 'jquery';
import type { DateRange } from '@kitman/common/src/types';
import { getDefaultDateRange } from '@kitman/common/src/utils/status_utils';
import type {
  TrainingSession,
  Game,
  EventBreakdown,
} from '@kitman/modules/src/analysis/shared/types';
import type { Drill } from '../../../types';
import type { Action } from '../../../types/actions/GraphForm/Summary';
import type { Action as SharedAction } from '../../../types/actions';
import {
  eventTypeRequest,
  serverRequestError,
  hideAppStatus,
} from '../../index';

export const addPopulation = (): Action => ({
  type: 'formSummary/ADD_POPULATION',
});

export const deletePopulation = (index: number): Action => ({
  type: 'formSummary/DELETE_POPULATION',
  payload: {
    index,
  },
});

export const addMetrics = (addedMetrics: Array<string>): Action => ({
  type: 'formSummary/ADD_METRICS',
  payload: {
    addedMetrics,
  },
});

export const removeMetrics = (removedMetrics: Array<string>): Action => ({
  type: 'formSummary/REMOVE_METRICS',
  payload: {
    removedMetrics,
  },
});

export const addFilter = (populationIndex: number): Action => ({
  type: 'formSummary/ADD_FILTER',
  payload: {
    populationIndex,
  },
});

export const removeFilter = (populationIndex: number): Action => ({
  type: 'formSummary/REMOVE_FILTER',
  payload: {
    populationIndex,
  },
});

export const updateEventTypeFilters = (
  populationIndex: number,
  eventTypeFilters: Array<string>
): Action => ({
  type: 'formSummary/UPDATE_EVENT_TYPE_FILTERS',
  payload: {
    populationIndex,
    eventTypeFilters,
  },
});

export const updateTrainingSessionTypeFilters = (
  populationIndex: number,
  trainingSessionTypeFilters: Array<number>
): Action => ({
  type: 'formSummary/UPDATE_TRAINING_SESSION_TYPE_FILTERS',
  payload: {
    populationIndex,
    trainingSessionTypeFilters,
  },
});

export const updateAthletes = (
  populationIndex: number,
  athletesId: string
): Action => ({
  type: 'formSummary/UPDATE_ATHLETES',
  payload: {
    populationIndex,
    athletesId,
  },
});

export const updateScaleType = (scaleType: string): Action => ({
  type: 'formSummary/UPDATE_SCALE_TYPE',
  payload: {
    scaleType,
  },
});

export const updateCalculation = (
  populationIndex: number,
  calculationId: string
): Action => ({
  type: 'formSummary/UPDATE_CALCULATION',
  payload: {
    populationIndex,
    calculationId,
  },
});

export const updateTimePeriod = (
  populationIndex: number,
  timePeriodId: string
): Action => ({
  type: 'formSummary/UPDATE_TIME_PERIOD',
  payload: {
    populationIndex,
    timePeriodId,
  },
});

export const updateTimePeriodLength = (
  timePeriodLength: number,
  populationIndex: number
): Action => ({
  type: 'formSummary/UPDATE_TIME_PERIOD_LENGTH',
  payload: {
    timePeriodLength,
    populationIndex,
  },
});

export const updateLastXTimePeriod = (
  lastXTimePeriod: 'weeks' | 'days',
  populationIndex: number
): Action => ({
  type: 'formSummary/UPDATE_LAST_X_TIME_PERIOD',
  payload: {
    lastXTimePeriod,
    populationIndex,
  },
});

export const updateTimePeriodLengthOffset = (
  timePeriodLengthOffset: number,
  populationIndex: number
): Action => ({
  type: 'formSummary/UPDATE_TIME_PERIOD_LENGTH_OFFSET',
  payload: {
    timePeriodLengthOffset,
    populationIndex,
  },
});

export const updateLastXTimePeriodOffset = (
  lastXTimePeriodOffset: 'weeks' | 'days',
  populationIndex: number
): Action => ({
  type: 'formSummary/UPDATE_LAST_X_TIME_PERIOD_OFFSET',
  payload: {
    lastXTimePeriodOffset,
    populationIndex,
  },
});

export const updateDateRange = (
  populationIndex: number,
  dateRange: DateRange
): Action => ({
  type: 'formSummary/UPDATE_DATE_RANGE',
  payload: {
    populationIndex,
    dateRange,
  },
});

export const updateComparisonGroup = (populationIndex: number): Action => ({
  type: 'formSummary/UPDATE_COMPARISON_GROUP',
  payload: {
    populationIndex,
  },
});

export const updateEventTypeTimePeriod = (
  populationIndex: number,
  itemKey: string,
  dateRange: DateRange
): Action => ({
  type: 'formSummary/UPDATE_EVENT_TYPE_TIME_PERIOD',
  payload: {
    populationIndex,
    itemKey,
    dateRange,
  },
});

export const updateGamesOptions = (
  populationIndex: number,
  games: Array<?Game>
): Action => ({
  type: 'formSummary/UPDATE_GAMES_OPTIONS',
  payload: {
    populationIndex,
    games,
  },
});

export const populateGames =
  (populationIndex: number, dateRange: DateRange) =>
  (dispatch: (action: Action | SharedAction) => void) => {
    dispatch(eventTypeRequest());
    $.ajax({
      method: 'GET',
      url: '/workloads/games',
      data: { start_date: dateRange.start_date, end_date: dateRange.end_date },
      success: (response) => {
        dispatch(hideAppStatus());
        dispatch(updateGamesOptions(populationIndex, response));
      },
      error: () => {
        dispatch(serverRequestError());
      },
    });
  };

export const updateTrainingSessionOptions = (
  populationIndex: number,
  trainingSessions: Array<?TrainingSession>
): Action => ({
  type: 'formSummary/UPDATE_TRAINING_SESSION_OPTIONS',
  payload: {
    populationIndex,
    trainingSessions,
  },
});

export const populateTrainingSessions =
  (populationIndex: number, dateRange: DateRange) =>
  (dispatch: (action: Action | SharedAction) => void) => {
    dispatch(eventTypeRequest());
    $.ajax({
      method: 'GET',
      url: '/workloads/training_sessions',
      data: { start_date: dateRange.start_date, end_date: dateRange.end_date },
      success: (response) => {
        dispatch(hideAppStatus());
        dispatch(updateTrainingSessionOptions(populationIndex, response));
      },
      error: () => {
        dispatch(serverRequestError());
      },
    });
  };

export const updateDrillsOptions = (
  populationIndex: number,
  drills: Array<?Drill>
): Action => ({
  type: 'formSummary/UPDATE_DRILLS_OPTIONS',
  payload: {
    populationIndex,
    drills,
  },
});

export const populateDrills =
  (populationIndex: number, eventIds: Array<$PropertyType<Drill, 'id'>>) =>
  (dispatch: (action: Action | SharedAction) => void) => {
    dispatch(eventTypeRequest());
    $.ajax({
      method: 'GET',
      url: '/workloads/drills/drill_types',
      data: { event_type: 'training_session', event_id: eventIds[0] },
      success: (response) => {
        dispatch(hideAppStatus());
        dispatch(updateDrillsOptions(populationIndex, response));
      },
      error: () => {
        dispatch(serverRequestError());
      },
    });
  };

export const populateDrillsForm =
  (populationIndex: number, itemKey: string) =>
  (dispatch: (action: Function) => void) => {
    const newDateRange = getDefaultDateRange(itemKey);
    if (itemKey === 'game') {
      dispatch(populateGames(populationIndex, newDateRange));
    }
    if (itemKey === 'training_session') {
      dispatch(populateTrainingSessions(populationIndex, newDateRange));
    }
    dispatch(
      updateEventTypeTimePeriod(populationIndex, itemKey, {
        start_date: newDateRange.start_date,
        end_date: newDateRange.end_date,
      })
    );
  };

export const updateEventBreakdown = (
  populationIndex: number,
  breakdownTypeId: EventBreakdown
): Action => ({
  type: 'formSummary/UPDATE_EVENT_BREAKDOWN',
  payload: {
    populationIndex,
    breakdownTypeId,
  },
});

export const updateSelectedGames = (
  populationIndex: number,
  gameIds: Array<$PropertyType<Game, 'id'>>,
  selectionType: ?'SINGLE_SELECT'
): Action => ({
  type: 'formSummary/UPDATE_SELECTED_GAMES',
  payload: {
    populationIndex,
    gameIds,
    selectionType,
  },
});

export const updateSelectedTrainingSessions = (
  populationIndex: number,
  trainingSessionIds: Array<$PropertyType<TrainingSession, 'id'>>,
  selectionType: ?'SINGLE_SELECT'
): Action => ({
  type: 'formSummary/UPDATE_SELECTED_TRAINING_SESSIONS',
  payload: {
    populationIndex,
    trainingSessionIds,
    selectionType,
  },
});
