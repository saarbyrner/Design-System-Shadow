/* eslint-disable flowtype/require-valid-file-annotation, max-statements */
import { TIME_PERIODS } from '@kitman/modules/src/analysis/shared/constants';

const defaultGraphFormSummaryState = {
  scale_type: 'normalized',
  metrics: [],
  population: [
    {
      athletes: null,
      calculation: null,
      timePeriod: null,
      dateRange: {},
    },
  ],
  comparisonGroupIndex: 0,
};

const GraphFormSummary = (state = defaultGraphFormSummaryState, action) => {
  let newPopulation;

  switch (action.type) {
    case 'formSummary/ADD_POPULATION':
      newPopulation = state.population.slice();
      if (state.population.length >= 1) {
        newPopulation.push({
          athletes: null,
          calculation: null,
          timePeriod: state.population[0].timePeriod,
          dateRange: state.population[0].dateRange,
          event_type_time_period:
            state.population[0].event_type_time_period || null,
          games: state.population[0].games || [],
          training_sessions: state.population[0].training_sessions || [],
          drills: state.population[0].drills || [],
          selected_games: state.population[0].selected_games || [],
          selected_training_sessions:
            state.population[0].selected_training_sessions || [],
          event_breakdown: state.population[0].event_breakdown || null,
          last_x_time_period: state.population[0].last_x_time_period || 'days',
          time_period_length: state.population[0].time_period_length || null,
          last_x_time_period_offset:
            state.population[0].last_x_time_period_offset || 'days',
          time_period_length_offset:
            state.population[0].time_period_length_offset || null,
        });
      } else {
        newPopulation.push({
          athletes: null,
          calculation: null,
          timePeriod: null,
          dateRange: {},
        });
      }
      return {
        ...state,
        population: newPopulation,
      };
    case 'formSummary/DELETE_POPULATION': {
      const populationIndex = action.payload.index;

      let comparisonGroupIndex;
      if (populationIndex < state.comparisonGroupIndex) {
        // If the user deletes a population before the comparison group in the list
        // update the comparison group index.
        comparisonGroupIndex = state.comparisonGroupIndex - 1;
      } else if (populationIndex === state.comparisonGroupIndex) {
        // If the user deletes the comparison group population,
        // set the first population as comparison group
        comparisonGroupIndex = 0;
      } else {
        comparisonGroupIndex = state.comparisonGroupIndex;
      }

      return {
        ...state,
        population: [
          ...state.population.slice(0, populationIndex),
          ...state.population.slice(populationIndex + 1),
        ], // immutable splice with ES6
        metrics: state.metrics,
        comparisonGroupIndex,
      };
    }
    case 'formSummary/ADD_METRICS':
      return {
        ...state,
        metrics: [
          ...state.metrics,
          ...action.payload.addedMetrics.map((metricSourceKey) => ({
            source_key: metricSourceKey,
          })),
        ],
      };
    case 'formSummary/REMOVE_METRICS':
      return {
        ...state,
        metrics: [...state.metrics].filter(
          (metric) => !action.payload.removedMetrics.includes(metric.source_key)
        ),
      };
    case 'formSummary/ADD_FILTER': {
      const populationIndex = action.payload.populationIndex;

      const newState = { ...state };
      newState.population = state.population.slice();
      newState.population[populationIndex] = {
        ...newState.population[populationIndex],
        filters: { event_types: [], training_session_types: [] },
      };

      return newState;
    }
    case 'formSummary/REMOVE_FILTER': {
      const populationIndex = action.payload.populationIndex;

      const newState = { ...state };
      newState.population = state.population.slice();
      delete newState.population[populationIndex].filters;

      return newState;
    }
    case 'formSummary/UPDATE_EVENT_TYPE_FILTERS': {
      const populationIndex = action.payload.populationIndex;

      newPopulation = state.population.slice();
      newPopulation[populationIndex] = {
        ...newPopulation[populationIndex],
        filters: {
          ...newPopulation[populationIndex].filters,
          event_types: action.payload.eventTypeFilters,
        },
      };

      return {
        ...state,
        population: newPopulation,
      };
    }
    case 'formSummary/UPDATE_TRAINING_SESSION_TYPE_FILTERS': {
      const populationIndex = action.payload.populationIndex;

      newPopulation = state.population.slice();
      newPopulation[populationIndex] = {
        ...newPopulation[populationIndex],
        filters: {
          ...newPopulation[populationIndex].filters,
          training_session_types: action.payload.trainingSessionTypeFilters,
        },
      };

      return {
        ...state,
        population: newPopulation,
      };
    }
    case 'formSummary/UPDATE_ATHLETES': {
      const populationIndex = action.payload.populationIndex;
      newPopulation = state.population.slice();
      newPopulation[populationIndex].athletes = action.payload.athletesId;
      return {
        ...state,
        population: newPopulation,
      };
    }
    case 'formSummary/UPDATE_SCALE_TYPE':
      return {
        ...state,
        population: state.population.map((population) => ({
          ...population,
          calculation:
            action.payload.scaleType === 'normalized' &&
            population.calculation === 'last'
              ? null
              : population.calculation,
        })),
        scale_type: action.payload.scaleType,
        comparisonGroupIndex:
          action.payload.scaleType === 'denormalized' ? null : 0,
      };
    case 'formSummary/UPDATE_CALCULATION': {
      const populationIndex = action.payload.populationIndex;
      newPopulation = state.population.slice();
      newPopulation[populationIndex].calculation = action.payload.calculationId;
      return {
        ...state,
        population: newPopulation,
      };
    }
    case 'formSummary/UPDATE_TIME_PERIOD': {
      const populationIndex = action.payload.populationIndex;
      newPopulation = state.population.slice();

      newPopulation[populationIndex].timePeriod = action.payload.timePeriodId;

      const dateRange =
        action.payload.timePeriodId === TIME_PERIODS.lastXDays ||
        action.payload.timePeriodId === TIME_PERIODS.customDateRange
          ? state.population[populationIndex].dateRange
          : {};
      newPopulation[populationIndex].dateRange = dateRange;

      newPopulation[populationIndex].time_period_length = null;
      newPopulation[populationIndex].time_period_length_offset = null;

      return {
        ...state,
        population: newPopulation,
      };
    }
    case 'formSummary/UPDATE_TIME_PERIOD_LENGTH': {
      const populationIndex = action.payload.populationIndex;
      newPopulation = state.population.slice();

      newPopulation[populationIndex].time_period_length =
        action.payload.timePeriodLength;
      return {
        ...state,
        population: newPopulation,
      };
    }
    case 'formSummary/UPDATE_LAST_X_TIME_PERIOD': {
      const populationIndex = action.payload.populationIndex;
      newPopulation = state.population.slice();

      newPopulation[populationIndex].last_x_time_period =
        action.payload.lastXTimePeriod;
      return {
        ...state,
        population: newPopulation,
      };
    }
    case 'formSummary/UPDATE_TIME_PERIOD_LENGTH_OFFSET': {
      const populationIndex = action.payload.populationIndex;
      newPopulation = state.population.slice();

      newPopulation[populationIndex].time_period_length_offset =
        action.payload.timePeriodLengthOffset;
      return {
        ...state,
        population: newPopulation,
      };
    }
    case 'formSummary/UPDATE_LAST_X_TIME_PERIOD_OFFSET': {
      const populationIndex = action.payload.populationIndex;
      newPopulation = state.population.slice();

      newPopulation[populationIndex].last_x_time_period_offset =
        action.payload.lastXTimePeriodOffset;
      return {
        ...state,
        population: newPopulation,
      };
    }
    case 'formSummary/UPDATE_DATE_RANGE': {
      const populationIndex = action.payload.populationIndex;
      newPopulation = state.population.slice();
      newPopulation[populationIndex].dateRange = {
        start_date: action.payload.dateRange.start_date,
        end_date: action.payload.dateRange.end_date,
      };
      newPopulation[populationIndex].selected_games = [];
      newPopulation[populationIndex].selected_training_sessions = [];

      return {
        ...state,
        population: newPopulation,
      };
    }
    case 'formSummary/UPDATE_COMPARISON_GROUP':
      return {
        ...state,
        comparisonGroupIndex: action.payload.populationIndex,
      };
    case 'formSummary/UPDATE_EVENT_TYPE_TIME_PERIOD': {
      const populationIndex = action.payload.populationIndex;
      newPopulation = state.population.slice();

      newPopulation[populationIndex].time_period_length = null;
      newPopulation[populationIndex].time_period_length_offset = null;
      newPopulation[populationIndex].timePeriod = action.payload.itemKey;
      newPopulation[populationIndex].event_type_time_period =
        action.payload.itemKey;
      newPopulation[populationIndex].dateRange = action.payload.dateRange;
      newPopulation[populationIndex].games = [];
      newPopulation[populationIndex].training_sessions = [];
      newPopulation[populationIndex].drills = [];
      newPopulation[populationIndex].selected_games = [];
      newPopulation[populationIndex].selected_training_sessions = [];
      newPopulation[populationIndex].event_breakdown = null;

      return Object.assign({}, state, {
        population: newPopulation,
      });
    }
    case 'formSummary/UPDATE_GAMES_OPTIONS': {
      const populationIndex = action.payload.populationIndex;
      newPopulation = state.population.slice();

      newPopulation[populationIndex].games = action.payload.games;

      return Object.assign({}, state, {
        population: newPopulation,
      });
    }
    case 'formSummary/UPDATE_TRAINING_SESSION_OPTIONS': {
      const populationIndex = action.payload.populationIndex;
      newPopulation = state.population.slice();

      newPopulation[populationIndex].training_sessions =
        action.payload.trainingSessions;

      return Object.assign({}, state, {
        population: newPopulation,
      });
    }
    case 'formSummary/UPDATE_DRILLS_OPTIONS': {
      const populationIndex = action.payload.populationIndex;
      newPopulation = state.population.slice();

      newPopulation[populationIndex].drills = action.payload.drills;

      return Object.assign({}, state, {
        population: newPopulation,
      });
    }
    case 'formSummary/UPDATE_EVENT_BREAKDOWN': {
      const populationIndex = action.payload.populationIndex;
      newPopulation = state.population.slice();

      newPopulation[populationIndex].event_breakdown =
        action.payload.breakdownTypeId;

      return Object.assign({}, state, {
        population: newPopulation,
      });
    }
    case 'formSummary/UPDATE_SELECTED_GAMES': {
      const populationIndex = action.payload.populationIndex;
      newPopulation = state.population.slice();

      if (action.payload.selectionType === 'SINGLE_SELECT') {
        const newSelection = newPopulation[populationIndex].games.find(
          (game) => game.id === parseInt(action.payload.gameIds[0], 10)
        );
        newPopulation[populationIndex].selected_games = [newSelection];
      } else {
        newPopulation[populationIndex].selected_games = newPopulation[
          populationIndex
        ].games.filter((game) => game.id === action.payload.gameIds[0]);
      }

      newPopulation[populationIndex].event_breakdown = 'SUMMARY';

      return Object.assign({}, state, {
        population: newPopulation,
      });
    }
    case 'formSummary/UPDATE_SELECTED_TRAINING_SESSIONS': {
      const populationIndex = action.payload.populationIndex;
      newPopulation = state.population.slice();

      if (action.payload.selectionType === 'SINGLE_SELECT') {
        const newSelection = newPopulation[
          populationIndex
        ].training_sessions.find(
          (session) =>
            session.id === parseInt(action.payload.trainingSessionIds[0], 10)
        );
        newPopulation[populationIndex].selected_training_sessions = [
          newSelection,
        ];
      } else {
        newPopulation[populationIndex].selected_training_sessions =
          newPopulation[populationIndex].training_sessions.filter(
            (session) => session.id === action.payload.trainingSessionIds[0]
          );
      }
      newPopulation[populationIndex].event_breakdown = 'SUMMARY';

      return Object.assign({}, state, {
        population: newPopulation,
      });
    }
    default:
      return state;
  }
};

export default GraphFormSummary;
