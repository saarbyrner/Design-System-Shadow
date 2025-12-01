// @flow

import $ from 'jquery';
import { getDefaultDateRange } from '@kitman/common/src/utils/status_utils';
import type {
  MainCategory,
  InjuryCategory,
  IllnessCategory,
} from '@kitman/common/src/types/Issues';
import type { Status } from '@kitman/common/src/types/Status';
import type {
  AlarmSquadSearchSelection,
  DateRange,
} from '@kitman/common/src/types';
import type {
  TrainingSession,
  Game,
  GraphType,
  EventBreakdown,
} from '@kitman/modules/src/analysis/shared/types';
import type { Drill } from '../../types';
import type { Action } from '../../types/actions/GraphForm';
import type { Action as SharedAction } from '../../types/actions';
import { eventTypeRequest, serverRequestError, hideAppStatus } from '../index';

export const updateSquadSelection = (
  index: number,
  squadSelection: AlarmSquadSearchSelection
): Action => ({
  type: 'UPDATE_SQUAD_SELECTION',
  payload: {
    index,
    squadSelection,
  },
});

export const updateStatus = (index: number, status: Status): Action => ({
  type: 'UPDATE_STATUS',
  payload: {
    index,
    status,
  },
});

export const updateDrillsOptions = (
  metricIndex: number,
  drills: Array<?Drill>
): Action => ({
  type: 'UPDATE_DRILLS_OPTIONS',
  payload: {
    metricIndex,
    drills,
  },
});

export const updateTrainingSessionOptions = (
  metricIndex: number,
  trainingSessions: Array<?TrainingSession>
): Action => ({
  type: 'UPDATE_TRAINING_SESSION_OPTIONS',
  payload: {
    metricIndex,
    trainingSessions,
  },
});

export const updateGamesOptions = (
  metricIndex: number,
  games: Array<?Game>
): Action => ({
  type: 'UPDATE_GAMES_OPTIONS',
  payload: {
    metricIndex,
    games,
  },
});

export const updateEventTypeTimePeriod = (
  metricIndex: number,
  itemKey: string,
  dateRange: DateRange
): Action => ({
  type: 'UPDATE_EVENT_TYPE_TIME_PERIOD',
  payload: {
    metricIndex,
    dateRange,
    itemKey,
  },
});

export const updateTimePeriod = (timePeriod: string): Action => ({
  type: 'UPDATE_TIME_PERIOD',
  payload: {
    timePeriod,
  },
});

export const updateTimePeriodLength = (timePeriodLength: number): Action => ({
  type: 'UPDATE_TIME_PERIOD_LENGTH',
  payload: {
    timePeriodLength,
  },
});

export const updateLastXTimePeriod = (
  lastXTimePeriod: 'weeks' | 'days'
): Action => ({
  type: 'UPDATE_LAST_X_TIME_PERIOD',
  payload: {
    lastXTimePeriod,
  },
});

export const updateTimePeriodLengthOffset = (
  timePeriodLengthOffset: number
): Action => ({
  type: 'UPDATE_TIME_PERIOD_LENGTH_OFFSET',
  payload: {
    timePeriodLengthOffset,
  },
});

export const updateLastXTimePeriodOffset = (
  lastXTimePeriodOffset: 'weeks' | 'days'
): Action => ({
  type: 'UPDATE_LAST_X_TIME_PERIOD_OFFSET',
  payload: {
    lastXTimePeriodOffset,
  },
});

export const updateDateRange = (dateRange: DateRange): Action => ({
  type: 'UPDATE_DATE_RANGE',
  payload: {
    dateRange,
  },
});

export const populateTrainingSessions =
  (metricIndex: number, dateRange: DateRange) =>
  (dispatch: (action: Action | SharedAction) => void) => {
    dispatch(eventTypeRequest());
    $.ajax({
      method: 'GET',
      url: '/workloads/training_sessions',
      data: { start_date: dateRange.start_date, end_date: dateRange.end_date },
      success: (response) => {
        dispatch(hideAppStatus());
        dispatch(updateTrainingSessionOptions(metricIndex, response));
      },
      error: () => {
        dispatch(serverRequestError());
      },
    });
  };

export const populateGames =
  (metricIndex: number, dateRange: DateRange) =>
  (dispatch: (action: Action | SharedAction) => void) => {
    dispatch(eventTypeRequest());
    $.ajax({
      method: 'GET',
      url: '/workloads/games',
      data: { start_date: dateRange.start_date, end_date: dateRange.end_date },
      success: (response) => {
        dispatch(hideAppStatus());
        dispatch(updateGamesOptions(metricIndex, response));
      },
      error: () => {
        dispatch(serverRequestError());
      },
    });
  };

export const populateDrills =
  (metricIndex: number, eventIds: Array<$PropertyType<Drill, 'id'>>) =>
  (dispatch: (action: Action | SharedAction) => void) => {
    dispatch(eventTypeRequest());
    $.ajax({
      method: 'GET',
      url: '/workloads/drills/drill_types',
      data: { event_type: 'training_session', event_id: eventIds[0] },
      success: (response) => {
        dispatch(hideAppStatus());
        dispatch(updateDrillsOptions(metricIndex, response));
      },
      error: () => {
        dispatch(serverRequestError());
      },
    });
  };

export const updateSelectedGames = (
  metricIndex: number,
  gameIds: Array<$PropertyType<Game, 'id'>>,
  selectionType: ?'SINGLE_SELECT'
): Action => ({
  type: 'UPDATE_SELECTED_GAMES',
  payload: {
    metricIndex,
    gameIds,
    selectionType,
  },
});

export const updateSelectedTrainingSessions = (
  metricIndex: number,
  trainingSessionIds: Array<$PropertyType<TrainingSession, 'id'>>,
  selectionType: ?'SINGLE_SELECT'
): Action => ({
  type: 'UPDATE_SELECTED_TRAINING_SESSIONS',
  payload: {
    metricIndex,
    trainingSessionIds,
    selectionType,
  },
});

export const updateEventBreakdown = (
  metricIndex: number,
  breakdownTypeId: EventBreakdown
): Action => ({
  type: 'UPDATE_EVENT_BREAKDOWN',
  payload: {
    metricIndex,
    breakdownTypeId,
  },
});

export const populateDrillsForm =
  (metricIndex: number, itemKey: string) =>
  (dispatch: (action: Function) => void) => {
    const newDateRange = getDefaultDateRange(itemKey);
    if (itemKey === 'game') {
      dispatch(populateGames(metricIndex, newDateRange));
    }
    if (itemKey === 'training_session') {
      dispatch(populateTrainingSessions(metricIndex, newDateRange));
    }
    dispatch(
      updateEventTypeTimePeriod(metricIndex, itemKey, {
        start_date: newDateRange.start_date,
        end_date: newDateRange.end_date,
      })
    );
  };

export const updateCategory = (
  metricIndex: number,
  category: InjuryCategory | IllnessCategory,
  mainCategory: MainCategory
): Action => ({
  type: 'UPDATE_CATEGORY',
  payload: {
    metricIndex,
    category,
    mainCategory,
  },
});

export const updateCategoryDivision = (
  metricIndex: number,
  categoryDivision: InjuryCategory | IllnessCategory
): Action => ({
  type: 'UPDATE_CATEGORY_DIVISION',
  payload: {
    metricIndex,
    categoryDivision,
  },
});

export const updateCategorySelection = (
  metricIndex: number,
  categorySelection: string
): Action => ({
  type: 'UPDATE_CATEGORY_SELECTION',
  payload: {
    metricIndex,
    categorySelection,
  },
});

export const addFilter = (metricIndex: number): Action => ({
  type: 'ADD_FILTER',
  payload: {
    metricIndex,
  },
});

export const removeFilter = (metricIndex: number): Action => ({
  type: 'REMOVE_FILTER',
  payload: {
    metricIndex,
  },
});

export const updateTimeLossFilters = (
  metricIndex: number,
  timeLossFilters: Array<string>
): Action => ({
  type: 'UPDATE_TIME_LOSS_FILTERS',
  payload: {
    metricIndex,
    timeLossFilters,
  },
});

export const updateSessionTypeFilters = (
  metricIndex: number,
  sessionTypeFilters: Array<string>
): Action => ({
  type: 'UPDATE_SESSION_TYPE_FILTERS',
  payload: {
    metricIndex,
    sessionTypeFilters,
  },
});

export const updateEventTypeFilters = (
  metricIndex: number,
  eventTypeFilters: Array<string>
): Action => ({
  type: 'UPDATE_EVENT_TYPE_FILTERS',
  payload: {
    metricIndex,
    eventTypeFilters,
  },
});

export const updateTrainingSessionTypeFilters = (
  metricIndex: number,
  trainingSessionTypeFilters: Array<number>
): Action => ({
  type: 'UPDATE_TRAINING_SESSION_TYPE_FILTERS',
  payload: {
    metricIndex,
    trainingSessionTypeFilters,
  },
});

export const updateCompetitionFilters = (
  metricIndex: number,
  competitionFilters: Array<string>
): Action => ({
  type: 'UPDATE_COMPETITION_FILTERS',
  payload: {
    metricIndex,
    competitionFilters,
  },
});

export const addOverlay = (metricIndex: number): Action => ({
  type: 'ADD_OVERLAY',
  payload: {
    metricIndex,
  },
});

export const deleteOverlay = (
  metricIndex: number,
  overlayIndex: number
): Action => ({
  type: 'DELETE_OVERLAY',
  payload: {
    metricIndex,
    overlayIndex,
  },
});

export const updateOverlaySummary = (
  metricIndex: number,
  overlayIndex: number,
  summary: string
): Action => ({
  type: 'UPDATE_OVERLAY_SUMMARY',
  payload: {
    metricIndex,
    overlayIndex,
    summary,
  },
});

export const updateOverlayPopulation = (
  metricIndex: number,
  overlayIndex: number,
  population: string
): Action => ({
  type: 'UPDATE_OVERLAY_POPULATION',
  payload: {
    metricIndex,
    overlayIndex,
    population,
  },
});

export const updateOverlayTimePeriod = (
  metricIndex: number,
  overlayIndex: number,
  timePeriod: string
): Action => ({
  type: 'UPDATE_OVERLAY_TIME_PERIOD',
  payload: {
    metricIndex,
    overlayIndex,
    timePeriod,
  },
});

export const updateOverlayDateRange = (
  metricIndex: number,
  overlayIndex: number,
  dateRange: DateRange
): Action => ({
  type: 'UPDATE_OVERLAY_DATE_RANGE',
  payload: {
    metricIndex,
    overlayIndex,
    dateRange,
  },
});

export const updateMetricStyle = (
  metricIndex: number,
  metricStyle: GraphType
): Action => ({
  type: 'UPDATE_METRIC_STYLE',
  payload: {
    metricIndex,
    metricStyle,
  },
});

export const updateMeasurementType = (
  metricIndex: number,
  measurementType: string
): Action => ({
  type: 'UPDATE_MEASUREMENT_TYPE',
  payload: {
    metricIndex,
    measurementType,
  },
});

export const addMetric = (): Action => ({
  type: 'ADD_METRIC',
});

export const deleteMetric = (index: number): Action => ({
  type: 'DELETE_METRIC',
  payload: {
    index,
  },
});

export const updateDataType = (
  dataType: 'medical' | 'metric',
  metricIndex: number
): Action => ({
  type: 'UPDATE_DATA_TYPE',
  payload: {
    dataType,
    metricIndex,
  },
});
