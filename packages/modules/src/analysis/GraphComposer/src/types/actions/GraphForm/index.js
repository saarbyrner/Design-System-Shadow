// @flow
import type {
  AlarmSquadSearchSelection,
  DateRange,
} from '@kitman/common/src/types';
import type { Status } from '@kitman/common/src/types/Status';
import type {
  MainCategory,
  InjuryCategory,
  IllnessCategory,
} from '@kitman/common/src/types/Issues';
import type {
  Game,
  GraphType,
  TrainingSession,
  EventBreakdown,
} from '@kitman/modules/src/analysis/shared/types';
import type { Drill } from '../../../types';

type updateSquadSelection = {
  type: 'UPDATE_SQUAD_SELECTION',
  payload: {
    index: number,
    squadSelection: AlarmSquadSearchSelection,
  },
};

type updateStatus = {
  type: 'UPDATE_STATUS',
  payload: {
    index: number,
    status: Status,
  },
};

type updateTimePeriod = {
  type: 'UPDATE_TIME_PERIOD',
  payload: {
    timePeriod: string,
  },
};

type updateDateRange = {
  type: 'UPDATE_DATE_RANGE',
  payload: {
    dateRange: DateRange,
  },
};

type updateTimePeriodLength = {
  type: 'UPDATE_TIME_PERIOD_LENGTH',
  payload: {
    timePeriodLength: number,
  },
};

type updateLastXTimePeriod = {
  type: 'UPDATE_LAST_X_TIME_PERIOD',
  payload: {
    lastXTimePeriod: 'weeks' | 'days',
  },
};

type updateTimePeriodLengthOffset = {
  type: 'UPDATE_TIME_PERIOD_LENGTH_OFFSET',
  payload: {
    timePeriodLengthOffset: number,
  },
};

type updateLastXTimePeriodOffset = {
  type: 'UPDATE_LAST_X_TIME_PERIOD_OFFSET',
  payload: {
    lastXTimePeriodOffset: 'weeks' | 'days',
  },
};

type updateDrillsOptions = {
  type: 'UPDATE_DRILLS_OPTIONS',
  payload: {
    metricIndex: number,
    drills: Array<?Drill>,
  },
};

type updateTrainingSessionOptions = {
  type: 'UPDATE_TRAINING_SESSION_OPTIONS',
  payload: {
    metricIndex: number,
    trainingSessions: Array<?TrainingSession>,
  },
};

type updateGamesOptions = {
  type: 'UPDATE_GAMES_OPTIONS',
  payload: {
    metricIndex: number,
    games: Array<?Game>,
  },
};

type updateEventTypeTimePeriod = {
  type: 'UPDATE_EVENT_TYPE_TIME_PERIOD',
  payload: {
    metricIndex: number,
    dateRange: DateRange,
    itemKey: string,
  },
};

type updateSelectedGames = {
  type: 'UPDATE_SELECTED_GAMES',
  payload: {
    metricIndex: number,
    gameIds: Array<$PropertyType<Game, 'id'>>,
  },
};

type updateSelectedTrainingSessions = {
  type: 'UPDATE_SELECTED_TRAINING_SESSIONS',
  payload: {
    metricIndex: number,
    trainingSessionIds: Array<$PropertyType<TrainingSession, 'id'>>,
  },
};

type updateEventBreakdown = {
  type: 'UPDATE_EVENT_BREAKDOWN',
  payload: {
    metricIndex: number,
    breakdownTypeId: EventBreakdown,
  },
};

type updateCategory = {
  type: 'UPDATE_CATEGORY',
  payload: {
    metricIndex: number,
    category: InjuryCategory | IllnessCategory,
    mainCategory: MainCategory,
  },
};

type updateCategoryDivision = {
  type: 'UPDATE_CATEGORY_DIVISION',
  payload: {
    metricIndex: number,
    categoryDivision: InjuryCategory | IllnessCategory,
  },
};

type updateCategorySelection = {
  type: 'UPDATE_CATEGORY_SELECTION',
  payload: {
    metricIndex: number,
    categorySelection: string,
  },
};

type addFilter = {
  type: 'ADD_FILTER',
  payload: {
    metricIndex: number,
  },
};

type removeFilter = {
  type: 'REMOVE_FILTER',
  payload: {
    metricIndex: number,
  },
};

type updateTimeLossFilters = {
  type: 'UPDATE_TIME_LOSS_FILTERS',
  payload: {
    metricIndex: number,
    timeLossFilters: Array<string>,
  },
};

type updateSessionTypeFilters = {
  type: 'UPDATE_SESSION_TYPE_FILTERS',
  payload: {
    metricIndex: number,
    sessionTypeFilters: Array<string>,
  },
};

type updateEventTypeFilters = {
  type: 'UPDATE_EVENT_TYPE_FILTERS',
  payload: {
    metricIndex: number,
    eventTypeFilters: Array<string>,
  },
};

type updateTrainingSessionTypeFilters = {
  type: 'UPDATE_TRAINING_SESSION_TYPE_FILTERS',
  payload: {
    metricIndex: number,
    trainingSessionTypeFilters: Array<number>,
  },
};

type updateCompetitionFilters = {
  type: 'UPDATE_COMPETITION_FILTERS',
  payload: {
    competitionFilters: Array<string>,
  },
};

type addOverlay = {
  type: 'ADD_OVERLAY',
  payload: {
    metricIndex: number,
  },
};

type deleteOverlay = {
  type: 'DELETE_OVERLAY',
  payload: {
    metricIndex: number,
    overlayIndex: number,
  },
};

type updateOverlaySummary = {
  type: 'UPDATE_OVERLAY_SUMMARY',
  payload: {
    metricIndex: number,
    overlayIndex: number,
    summary: string,
  },
};

type updateOverlayPopulation = {
  type: 'UPDATE_OVERLAY_POPULATION',
  payload: {
    metricIndex: number,
    overlayIndex: number,
    population: string,
  },
};

type updateOverlayTimePeriod = {
  type: 'UPDATE_OVERLAY_TIME_PERIOD',
  payload: {
    timePeriod: string,
  },
};

type updateOverlayDateRange = {
  type: 'UPDATE_OVERLAY_DATE_RANGE',
  payload: {
    dateRange: DateRange,
  },
};

type updateMetricStyle = {
  type: 'UPDATE_METRIC_STYLE',
  payload: {
    metricStyle: GraphType,
  },
};

type updateMeasurementType = {
  type: 'UPDATE_MEASUREMENT_TYPE',
  payload: {
    metricIndex: number,
    measurementType: string,
  },
};

type addMetric = {
  type: 'ADD_METRIC',
};

type deleteMetric = {
  type: 'DELETE_METRIC',
  payload: {
    index: number,
  },
};

type updateDataType = {
  type: 'UPDATE_DATA_TYPE',
  payload: {
    metricIndex: number,
    dataType: 'medical' | 'metric',
  },
};

export type Action =
  | updateSquadSelection
  | updateStatus
  | updateTimePeriod
  | updateDateRange
  | updateTimePeriodLength
  | updateLastXTimePeriod
  | updateTimePeriodLengthOffset
  | updateLastXTimePeriodOffset
  | updateDrillsOptions
  | updateTrainingSessionOptions
  | updateGamesOptions
  | updateEventTypeTimePeriod
  | updateSelectedGames
  | updateSelectedTrainingSessions
  | updateEventBreakdown
  | updateCategory
  | updateCategoryDivision
  | updateCategorySelection
  | addFilter
  | removeFilter
  | updateTimeLossFilters
  | updateSessionTypeFilters
  | updateEventTypeFilters
  | updateTrainingSessionTypeFilters
  | updateCompetitionFilters
  | addOverlay
  | deleteOverlay
  | updateOverlaySummary
  | updateOverlayPopulation
  | updateOverlayTimePeriod
  | updateOverlayDateRange
  | updateMetricStyle
  | updateMeasurementType
  | addMetric
  | deleteMetric
  | updateDataType;
