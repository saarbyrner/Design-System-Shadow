// @flow
import type { DateRange } from '@kitman/common/src/types';
import type {
  TrainingSession,
  Game,
  EventBreakdown,
} from '@kitman/modules/src/analysis/shared/types';
import type { Drill, SummaryGraphState } from '../../../../types';

type deletePopulation = {
  type: 'formSummary/DELETE_POPULATION',
  payload: {
    index: number,
  },
};

type addPopulation = {
  type: 'formSummary/ADD_POPULATION',
};

type addMetrics = {
  type: 'formSummary/ADD_METRICS',
  payload: {
    addedMetrics: Array<string>,
  },
};

type removeMetrics = {
  type: 'formSummary/REMOVE_METRICS',
  payload: {
    removedMetrics: Array<string>,
  },
};

type addFilter = {
  type: 'formSummary/ADD_FILTER',
  payload: {
    populationIndex: number,
  },
};

type removeFilter = {
  type: 'formSummary/REMOVE_FILTER',
  payload: {
    populationIndex: number,
  },
};

type updateEventTypeFilters = {
  type: 'formSummary/UPDATE_EVENT_TYPE_FILTERS',
  payload: {
    populationIndex: number,
    eventTypeFilters: Array<string>,
  },
};

type updateTrainingSessionTypeFilters = {
  type: 'formSummary/UPDATE_TRAINING_SESSION_TYPE_FILTERS',
  payload: {
    populationIndex: number,
    trainingSessionTypeFilters: Array<number>,
  },
};

type updateAthletes = {
  type: 'formSummary/UPDATE_ATHLETES',
  payload: {
    populationIndex: number,
    athletesId: string,
  },
};

type updateScaleType = {
  type: 'formSummary/UPDATE_SCALE_TYPE',
  payload: {
    scaleType: string,
  },
};

type updateCalculation = {
  type: 'formSummary/UPDATE_CALCULATION',
  payload: {
    populationIndex: number,
    calculationId: string,
  },
};

type updateTimePeriod = {
  type: 'formSummary/UPDATE_TIME_PERIOD',
  payload: {
    populationIndex: number,
    timePeriodId: string,
  },
};

type updateDateRange = {
  type: 'formSummary/UPDATE_DATE_RANGE',
  payload: {
    populationIndex: number,
    dateRange: DateRange,
  },
};

type updateComparisonGroup = {
  type: 'formSummary/UPDATE_COMPARISON_GROUP',
  payload: {
    populationIndex: number,
  },
};

type createGraphSuccess = {
  type: 'formSummary/COMPOSE_GRAPH_SUCCESS',
  payload: SummaryGraphState,
};

type updateEventTypeTimePeriod = {
  type: 'formSummary/UPDATE_EVENT_TYPE_TIME_PERIOD',
  payload: {
    populationIndex: number,
    itemKey: string,
    dateRange: DateRange,
  },
};

type updateGamesOptions = {
  type: 'formSummary/UPDATE_GAMES_OPTIONS',
  payload: {
    populationIndex: number,
    games: Array<?Game>,
  },
};

type updateTrainingSessionOptions = {
  type: 'formSummary/UPDATE_TRAINING_SESSION_OPTIONS',
  payload: {
    populationIndex: number,
    trainingSessions: Array<?TrainingSession>,
  },
};

type updateDrillsOptions = {
  type: 'formSummary/UPDATE_DRILLS_OPTIONS',
  payload: {
    populationIndex: number,
    drills: Array<?Drill>,
  },
};

type updateEventBreakdown = {
  type: 'formSummary/UPDATE_EVENT_BREAKDOWN',
  payload: {
    populationIndex: number,
    breakdownTypeId: EventBreakdown,
  },
};

type updateSelectedGames = {
  type: 'formSummary/UPDATE_SELECTED_GAMES',
  payload: {
    populationIndex: number,
    gameIds: Array<$PropertyType<Game, 'id'>>,
  },
};

type updateSelectedTrainingSessions = {
  type: 'formSummary/UPDATE_SELECTED_TRAINING_SESSIONS',
  payload: {
    populationIndex: number,
    trainingSessionIds: Array<$PropertyType<TrainingSession, 'id'>>,
  },
};

type updateTimePeriodLength = {
  type: 'formSummary/UPDATE_TIME_PERIOD_LENGTH',
  payload: {
    timePeriodLength: number,
  },
};

type updateLastXTimePeriod = {
  type: 'formSummary/UPDATE_LAST_X_TIME_PERIOD',
  payload: {
    lastXTimePeriod: 'weeks' | 'days',
    populationIndex: number,
  },
};

type updateTimePeriodLengthOffset = {
  type: 'formSummary/UPDATE_TIME_PERIOD_LENGTH_OFFSET',
  payload: {
    timePeriodLengthOffset: number,
  },
};

type updateLastXTimePeriodOffset = {
  type: 'formSummary/UPDATE_LAST_X_TIME_PERIOD_OFFSET',
  payload: {
    lastXTimePeriodOffset: 'weeks' | 'days',
    populationIndex: number,
  },
};

export type Action =
  | addPopulation
  | deletePopulation
  | addMetrics
  | removeMetrics
  | addFilter
  | removeFilter
  | updateEventTypeFilters
  | updateTrainingSessionTypeFilters
  | updateAthletes
  | updateScaleType
  | updateCalculation
  | updateTimePeriod
  | updateDateRange
  | updateComparisonGroup
  | updateEventTypeTimePeriod
  | updateGamesOptions
  | updateTrainingSessionOptions
  | updateDrillsOptions
  | updateEventBreakdown
  | updateSelectedGames
  | updateSelectedTrainingSessions
  | updateTimePeriodLength
  | updateLastXTimePeriod
  | updateTimePeriodLengthOffset
  | updateLastXTimePeriodOffset
  | createGraphSuccess;
