/* eslint-disable flowtype/require-valid-file-annotation, max-statements */
import _last from 'lodash/last';
import _cloneDeep from 'lodash/cloneDeep';
import { blankStatus } from '@kitman/common/src/utils/status_utils';
import { TIME_PERIODS } from '@kitman/modules/src/analysis/shared/constants';

const getDefaultSquadSelection = (graphGroup, metricType) => {
  const squadSelection = {
    applies_to_squad: false,
    position_groups: [],
    positions: [],
    athletes: [],
  };

  return metricType === 'medical'
    ? { ...squadSelection, all_squads: false, squads: [] }
    : squadSelection;
};

const getDefaultMetricData = (graphGroup) => {
  const defaultMetric = {
    type: 'metric',
    squad_selection: getDefaultSquadSelection(graphGroup, 'metric'),
    status: blankStatus(),
  };

  if (graphGroup === 'longitudinal' || graphGroup === 'summary_bar') {
    defaultMetric.overlays = [];
  }

  if (graphGroup === 'longitudinal') {
    defaultMetric.metric_style = 'line';
  }

  return defaultMetric;
};

const getDefaultMedicalData = (graphGroup) => {
  const defaultMedicalData = {
    type: 'medical',
    squad_selection: getDefaultSquadSelection(graphGroup, 'medical'),
  };

  if (graphGroup === 'value_visualisation') {
    defaultMedicalData.calculation = 'count';
  }

  return defaultMedicalData;
};

const getDefaultGraphForm = (graphGroup = 'longitudinal') => {
  const defaultMetric =
    graphGroup === 'longitudinal' ||
    graphGroup === 'summary_bar' ||
    graphGroup === 'value_visualisation'
      ? getDefaultMetricData(graphGroup)
      : getDefaultMedicalData(graphGroup);

  return {
    metrics: [defaultMetric],
    graphGroup,
  };
};

const defaultMedicalFilter = {
  filters: { time_loss: [], session_type: [], competitions: [] },
};
const defaultMetricFilter = {
  filters: { event_types: [], training_session_types: [] },
};

const GraphForm = (state = getDefaultGraphForm(), action) => {
  switch (action.type) {
    case 'UPDATE_GRAPH_FORM_TYPE': {
      if (
        action.payload.graphGroup === state.graphGroup &&
        action.payload.graphType === 'combination'
      ) {
        return {
          ...state,
          metrics: state.metrics.map((metric, index) => ({
            ...metric,
            metric_style:
              metric.metric_style || (index === 0 ? 'column' : 'line'),
          })),
        };
      }

      return action.payload.graphGroup !== state.graphGroup
        ? getDefaultGraphForm(action.payload.graphGroup)
        : state;
    }
    case 'ADD_METRIC': {
      let newStatus = blankStatus();
      if (state.metrics.length >= 1) {
        newStatus =
          state.metrics[0].type === 'metric'
            ? {
                ...newStatus,
                event_type_time_period:
                  state.metrics[0].status.event_type_time_period || null,
                games: state.metrics[0].status.games || [],
                training_sessions:
                  state.metrics[0].status.training_sessions || [],
                drills: state.metrics[0].status.drills || [],
                selected_games: state.metrics[0].status.selected_games || [],
                selected_training_sessions:
                  state.metrics[0].status.selected_training_sessions || [],
                event_breakdown:
                  state.metrics[0].status.event_breakdown || null,
              }
            : {
                ...newStatus,
                event_type_time_period: state.time_period || null,
              };
      }

      if (state.metrics.length >= 1) {
        const firstMetricTimePeriod =
          state.metrics[0].type === 'metric'
            ? {
                last_x_time_period: state.metrics[0].status.last_x_time_period,
                time_period_length: state.metrics[0].status.time_period_length,
                last_x_time_period_offset:
                  state.metrics[0].status.last_x_time_period_offset,
                time_period_length_offset:
                  state.metrics[0].status.time_period_length_offset,
              }
            : {
                last_x_time_period: state.metrics[0].last_x_time_period,
                time_period_length: state.metrics[0].time_period_length,
                last_x_time_period_offset:
                  state.metrics[0].last_x_time_period_offset,
                time_period_length_offset:
                  state.metrics[0].time_period_length_offset,
              };

        newStatus = {
          ...newStatus,
          last_x_time_period:
            firstMetricTimePeriod.last_x_time_period || 'days',
          time_period_length: firstMetricTimePeriod.time_period_length || null,
          last_x_time_period_offset:
            firstMetricTimePeriod.last_x_time_period_offset || 'days',
          time_period_length_offset:
            firstMetricTimePeriod.time_period_length_offset || null,
        };
      }

      // We must remove squads from the population when we replicate the first metric population
      // because metric data type doesn't support squad selection yet
      const replicatedSquadSelection = _cloneDeep(
        _last(state.metrics).squad_selection
      );
      delete replicatedSquadSelection.all_squads;
      delete replicatedSquadSelection.squads;

      return {
        ...state,
        metrics: [
          ...state.metrics,
          {
            ...getDefaultMetricData(state.graphGroup),
            status: newStatus,
            squad_selection: replicatedSquadSelection,
          },
        ],
      };
    }
    case 'DELETE_METRIC': {
      const metricIndex = action.payload.index;
      return {
        ...state,
        metrics: [
          ...state.metrics.slice(0, metricIndex),
          ...state.metrics.slice(metricIndex + 1),
        ],
      };
    }
    case 'UPDATE_DATA_TYPE': {
      const newMetrics = state.metrics.slice();

      if (action.payload.dataType === 'medical') {
        newMetrics[action.payload.metricIndex] = getDefaultMedicalData(
          state.graphGroup
        );
      } else {
        newMetrics[action.payload.metricIndex] = getDefaultMetricData(
          state.graphGroup
        );
      }

      if (action.payload.dataType === 'metric') {
        newMetrics[action.payload.metricIndex].status.event_type_time_period =
          state.metrics[0].status
            ? state.metrics[0].status.event_type_time_period
            : state.time_period;
      }

      if (action.payload.dataType === 'medical') {
        newMetrics[action.payload.metricIndex].last_x_time_period =
          (state.metrics[0].status
            ? state.metrics[0].status.last_x_time_period
            : state.metrics[0].last_x_time_period) || 'days';
        newMetrics[action.payload.metricIndex].time_period_length =
          (state.metrics[0].status
            ? state.metrics[0].status.time_period_length
            : state.metrics[0].time_period_length) || null;
        newMetrics[action.payload.metricIndex].last_x_time_period_offset =
          (state.metrics[0].status
            ? state.metrics[0].status.last_x_time_period_offset
            : state.metrics[0].last_x_time_period_offset) || 'days';
        newMetrics[action.payload.metricIndex].time_period_length_offset =
          (state.metrics[0].status
            ? state.metrics[0].status.time_period_length_offset
            : state.metrics[0].time_period_length_offset) || null;
      }

      if (action.payload.dataType === 'metric') {
        newMetrics[action.payload.metricIndex].status.last_x_time_period =
          (state.metrics[0].status
            ? state.metrics[0].status.last_x_time_period
            : state.metrics[0].last_x_time_period) || 'days';
        newMetrics[action.payload.metricIndex].status.time_period_length =
          (state.metrics[0].status
            ? state.metrics[0].status.time_period_length
            : state.metrics[0].time_period_length) || null;
        newMetrics[
          action.payload.metricIndex
        ].status.last_x_time_period_offset =
          (state.metrics[0].status
            ? state.metrics[0].status.last_x_time_period_offset
            : state.metrics[0].last_x_time_period_offset) || 'days';
        newMetrics[
          action.payload.metricIndex
        ].status.time_period_length_offset =
          (state.metrics[0].status
            ? state.metrics[0].status.time_period_length_offset
            : state.metrics[0].time_period_length_offset) || null;
      }

      if (state.graphGroup === 'longitudinal') {
        newMetrics[action.payload.metricIndex].metric_style =
          state.metrics[action.payload.metricIndex].metric_style || null;
      }

      if (
        state.graphGroup === 'longitudinal' ||
        state.graphGroup === 'summary_bar' ||
        state.graphGroup === 'value_visualisation'
      ) {
        newMetrics[action.payload.metricIndex].linked_dashboard_id =
          state.metrics[action.payload.metricIndex].linked_dashboard_id || null;
      }

      return {
        ...state,
        metrics: newMetrics,
      };
    }
    case 'UPDATE_SQUAD_SELECTION': {
      const metricIndex = action.payload.index;
      const newMetrics = state.metrics.slice();
      newMetrics[metricIndex].squad_selection = action.payload.squadSelection;
      return {
        ...state,
        metrics: newMetrics,
      };
    }
    case 'UPDATE_STATUS': {
      const metricIndex = action.payload.index;
      const newMetrics = state.metrics.slice();
      newMetrics[metricIndex].status = action.payload.status;
      return {
        ...state,
        metrics: newMetrics,
      };
    }
    case 'UPDATE_TIME_PERIOD': {
      const dateRange =
        action.payload.timePeriod === TIME_PERIODS.lastXDays ||
        action.payload.timePeriod === TIME_PERIODS.customDateRange
          ? state.date_range
          : {};

      const newMetrics = state.metrics.map((metric) => {
        return metric.type === 'metric'
          ? {
              ...metric,
              status: {
                ...metric.status,
                time_period_length: null,
                time_period_length_offset: null,
                event_type_time_period: action.payload.timePeriod,
              },
            }
          : {
              ...metric,
              time_period_length: null,
              time_period_length_offset: null,
            };
      });

      return {
        ...state,
        metrics: newMetrics,
        time_period: action.payload.timePeriod,
        date_range: dateRange,
      };
    }
    case 'UPDATE_TIME_PERIOD_LENGTH': {
      const newMetrics = state.metrics.map((metric) => {
        return metric.type === 'metric'
          ? {
              ...metric,
              status: {
                ...metric.status,
                time_period_length: action.payload.timePeriodLength,
              },
            }
          : {
              ...metric,
              time_period_length: action.payload.timePeriodLength,
            };
      });

      return {
        ...state,
        metrics: newMetrics,
      };
    }
    case 'UPDATE_LAST_X_TIME_PERIOD': {
      const newMetrics = state.metrics.map((metric) => {
        return metric.type === 'metric'
          ? {
              ...metric,
              status: {
                ...metric.status,
                last_x_time_period: action.payload.lastXTimePeriod,
              },
            }
          : {
              ...metric,
              last_x_time_period: action.payload.lastXTimePeriod,
            };
      });
      return {
        ...state,
        metrics: newMetrics,
      };
    }
    case 'UPDATE_TIME_PERIOD_LENGTH_OFFSET': {
      const newMetrics = state.metrics.map((metric) => {
        return metric.type === 'metric'
          ? {
              ...metric,
              status: {
                ...metric.status,
                time_period_length_offset:
                  action.payload.timePeriodLengthOffset,
              },
            }
          : {
              ...metric,
              time_period_length_offset: action.payload.timePeriodLengthOffset,
            };
      });

      return {
        ...state,
        metrics: newMetrics,
      };
    }
    case 'UPDATE_LAST_X_TIME_PERIOD_OFFSET': {
      const newMetrics = state.metrics.map((metric) => {
        return metric.type === 'metric'
          ? {
              ...metric,
              status: {
                ...metric.status,
                last_x_time_period_offset: action.payload.lastXTimePeriodOffset,
              },
            }
          : {
              ...metric,
              last_x_time_period_offset: action.payload.lastXTimePeriodOffset,
            };
      });
      return {
        ...state,
        metrics: newMetrics,
      };
    }
    case 'UPDATE_DATE_RANGE': {
      const newMetrics = state.metrics.map((metric) => {
        return metric.type === 'metric'
          ? {
              ...metric,
              status: {
                ...metric.status,
                selected_games: [],
                selected_training_sessions: [],
              },
            }
          : metric;
      });

      return {
        ...state,
        metrics: newMetrics,
        date_range: {
          start_date: action.payload.dateRange.start_date,
          end_date: action.payload.dateRange.end_date,
        },
      };
    }
    case 'UPDATE_SELECTED_GAMES': {
      const newState = Object.assign({}, state);
      newState.metrics = state.metrics.slice();

      for (let i = 0; i < newState.metrics.length; i++) {
        newState.metrics[i].status.selected_games =
          newState.metrics[0].status.games.filter((game) =>
            action.payload.gameIds.includes(game.id)
          );

        if (
          state.graphGroup === 'longitudinal' &&
          newState.metrics[i].status.selected_games.length > 1
        ) {
          newState.metrics[i].status.event_breakdown = 'SUMMARY';
        } else {
          newState.metrics[0].status.event_breakdown = 'SUMMARY';
        }
      }

      return newState;
    }
    case 'UPDATE_SELECTED_TRAINING_SESSIONS': {
      const newState = Object.assign({}, state);
      const sessionId = (session) =>
        action.payload.selectionType === 'SINGLE_SELECT'
          ? session.id.toString()
          : session.id;
      newState.metrics = state.metrics.slice();

      for (let i = 0; i < newState.metrics.length; i++) {
        newState.metrics[i].status.selected_training_sessions =
          newState.metrics[0].status.training_sessions.filter((session) =>
            action.payload.trainingSessionIds.includes(sessionId(session))
          );

        if (
          state.graphGroup === 'longitudinal' &&
          newState.metrics[i].status.selected_training_sessions.length > 1
        ) {
          newState.metrics[i].status.event_breakdown = 'SUMMARY';
        } else {
          newState.metrics[0].status.event_breakdown = 'SUMMARY';
        }
      }

      return newState;
    }
    case 'UPDATE_EVENT_BREAKDOWN': {
      const newState = Object.assign({}, state);
      newState.metrics = state.metrics.slice();

      for (let i = 0; i < newState.metrics.length; i++) {
        newState.metrics[i].status.event_breakdown =
          action.payload.breakdownTypeId;
      }

      return newState;
    }
    case 'UPDATE_TRAINING_SESSION_OPTIONS': {
      const metricIndex = action.payload.metricIndex;
      const newState = Object.assign({}, state);
      newState.metrics = state.metrics.slice();

      newState.metrics[metricIndex].status.training_sessions =
        action.payload.trainingSessions;

      return newState;
    }
    case 'UPDATE_GAMES_OPTIONS': {
      const metricIndex = action.payload.metricIndex;
      const newState = Object.assign({}, state);
      newState.metrics = state.metrics.slice();

      newState.metrics[metricIndex].status.games = action.payload.games;

      return newState;
    }
    case 'UPDATE_DRILLS_OPTIONS': {
      const metricIndex = action.payload.metricIndex;
      const newState = Object.assign({}, state);
      newState.metrics = state.metrics.slice();

      newState.metrics[metricIndex].status.drills = action.payload.drills;

      return newState;
    }
    case 'UPDATE_EVENT_TYPE_TIME_PERIOD': {
      const newState = Object.assign({}, state, {
        date_range: action.payload.dateRange,
        time_period: action.payload.itemKey,
      });
      newState.metrics = state.metrics.slice();

      /* eslint-disable no-param-reassign */
      newState.metrics.forEach((metric) => {
        if (metric.type === 'metric') {
          metric.status.time_period_length = null;
          metric.status.time_period_length_offset = null;
          metric.status.event_type_time_period = action.payload.itemKey;
          metric.status.games = [];
          metric.status.training_sessions = [];
          metric.status.drills = [];
          metric.status.selected_games = [];
          metric.status.selected_training_sessions = [];
          metric.status.event_breakdown = null;

          const isOverlayReset =
            (state.graphGroup === 'longitudinal' ||
              state.graphGroup === 'summary_bar') &&
            (action.payload.itemKey === 'training_session' ||
              action.payload.itemKey === 'game');

          if (isOverlayReset) {
            metric.overlays = [];
          }
        }
        if (metric.type === 'medical') {
          metric.time_period_length = null;
          metric.time_period_length_offset = null;
        }
      });

      return newState;
    }
    case 'UPDATE_CATEGORY': {
      const metricIndex = action.payload.metricIndex;

      const newState = Object.assign({}, state);
      newState.metrics = state.metrics.slice();

      newState.metrics[metricIndex].category = action.payload.category;
      newState.metrics[metricIndex].main_category = action.payload.mainCategory;

      if (state.graphGroup === 'summary_stack_bar') {
        newState.metrics[metricIndex].category_division = null;
      }

      if (state.graphGroup === 'value_visualisation') {
        newState.metrics[metricIndex].category_selection = null;
      }

      if (
        action.payload.mainCategory === 'illness' &&
        newState.metrics[metricIndex].filters
      ) {
        newState.metrics[metricIndex].filters.session_type = [];
      }

      return newState;
    }
    case 'UPDATE_CATEGORY_DIVISION': {
      const newState = Object.assign({}, state);
      newState.metrics = state.metrics.slice();

      newState.metrics[action.payload.metricIndex].category_division =
        action.payload.categoryDivision;

      return newState;
    }
    case 'UPDATE_CATEGORY_SELECTION': {
      const newState = Object.assign({}, state);
      newState.metrics = state.metrics.slice();

      newState.metrics[action.payload.metricIndex].category_selection =
        action.payload.categorySelection;

      return newState;
    }
    case 'ADD_FILTER': {
      const metricIndex = action.payload.metricIndex;

      const newState = { ...state };
      newState.metrics = state.metrics.slice();
      const addedFilter =
        newState.metrics[metricIndex].type === 'metric'
          ? defaultMetricFilter
          : defaultMedicalFilter;
      newState.metrics[metricIndex] = {
        ...newState.metrics[metricIndex],
        ...addedFilter,
      };

      return newState;
    }
    case 'REMOVE_FILTER': {
      const metricIndex = action.payload.metricIndex;

      const newState = { ...state };
      newState.metrics = state.metrics.slice();
      delete newState.metrics[metricIndex].filters;

      return newState;
    }
    case 'UPDATE_TIME_LOSS_FILTERS': {
      const metricIndex = action.payload.metricIndex;

      const newMetrics = state.metrics.slice();
      newMetrics[metricIndex] = {
        ...newMetrics[metricIndex],
        filters: {
          ...newMetrics[metricIndex].filters,
          time_loss: action.payload.timeLossFilters,
        },
      };

      return {
        ...state,
        metrics: newMetrics,
      };
    }
    case 'UPDATE_SESSION_TYPE_FILTERS': {
      const metricIndex = action.payload.metricIndex;

      const newMetrics = state.metrics.slice();
      newMetrics[metricIndex] = {
        ...newMetrics[metricIndex],
        filters: {
          ...newMetrics[metricIndex].filters,
          session_type: action.payload.sessionTypeFilters,
        },
      };

      return {
        ...state,
        metrics: newMetrics,
      };
    }
    case 'UPDATE_EVENT_TYPE_FILTERS': {
      const metricIndex = action.payload.metricIndex;

      const newMetrics = state.metrics.slice();
      newMetrics[metricIndex] = {
        ...newMetrics[metricIndex],
        filters: {
          ...newMetrics[metricIndex].filters,
          event_types: action.payload.eventTypeFilters,
        },
      };

      return {
        ...state,
        metrics: newMetrics,
      };
    }
    case 'UPDATE_TRAINING_SESSION_TYPE_FILTERS': {
      const metricIndex = action.payload.metricIndex;

      const newMetrics = state.metrics.slice();
      newMetrics[metricIndex] = {
        ...newMetrics[metricIndex],
        filters: {
          ...newMetrics[metricIndex].filters,
          training_session_types: action.payload.trainingSessionTypeFilters,
        },
      };

      return {
        ...state,
        metrics: newMetrics,
      };
    }
    case 'UPDATE_COMPETITION_FILTERS': {
      const metricIndex = action.payload.metricIndex;

      const newMetrics = state.metrics.slice();
      newMetrics[metricIndex] = {
        ...newMetrics[metricIndex],
        filters: {
          ...newMetrics[metricIndex].filters,
          competitions: action.payload.competitionFilters,
        },
      };

      return {
        ...state,
        metrics: newMetrics,
      };
    }
    case 'ADD_OVERLAY': {
      const metricIndex = action.payload.metricIndex;

      const newState = Object.assign({}, state);
      newState.metrics = state.metrics.slice();

      newState.metrics[metricIndex].overlays.push({});
      return newState;
    }
    case 'DELETE_OVERLAY': {
      const metricIndex = action.payload.metricIndex;
      const overlayIndex = action.payload.overlayIndex;

      const newState = Object.assign({}, state);
      newState.metrics = state.metrics.slice();

      newState.metrics[metricIndex].overlays = [
        ...state.metrics[metricIndex].overlays.slice(0, overlayIndex),
        ...state.metrics[metricIndex].overlays.slice(overlayIndex + 1),
      ];
      return newState;
    }
    case 'UPDATE_OVERLAY_SUMMARY': {
      const metricIndex = action.payload.metricIndex;
      const overlayIndex = action.payload.overlayIndex;

      const newState = Object.assign({}, state);
      newState.metrics = state.metrics.slice();

      newState.metrics[metricIndex].overlays[overlayIndex].summary =
        action.payload.summary;

      return newState;
    }
    case 'UPDATE_OVERLAY_POPULATION': {
      const metricIndex = action.payload.metricIndex;
      const overlayIndex = action.payload.overlayIndex;

      const newState = Object.assign({}, state);
      newState.metrics = state.metrics.slice();

      newState.metrics[metricIndex].overlays[overlayIndex].population =
        action.payload.population;

      return newState;
    }
    case 'UPDATE_OVERLAY_TIME_PERIOD': {
      const metricIndex = action.payload.metricIndex;
      const overlayIndex = action.payload.overlayIndex;

      const newState = Object.assign({}, state);
      newState.metrics = state.metrics.slice();

      const newDateRange =
        action.payload.timePeriod === TIME_PERIODS.lastXDays ||
        action.payload.timePeriod === TIME_PERIODS.customDateRange
          ? state.metrics[metricIndex].overlays[overlayIndex].dateRange
          : {};
      newState.metrics[metricIndex].overlays[overlayIndex].timePeriod =
        action.payload.timePeriod;
      newState.metrics[metricIndex].overlays[overlayIndex].dateRange =
        newDateRange;

      return newState;
    }
    case 'UPDATE_OVERLAY_DATE_RANGE': {
      const metricIndex = action.payload.metricIndex;
      const overlayIndex = action.payload.overlayIndex;

      const newState = Object.assign({}, state);
      newState.metrics = state.metrics.slice();

      newState.metrics[metricIndex].overlays[overlayIndex].dateRange = {
        start_date: action.payload.dateRange.start_date,
        end_date: action.payload.dateRange.end_date,
      };

      return newState;
    }
    case 'UPDATE_METRIC_STYLE': {
      const metricIndex = action.payload.metricIndex;
      const newMetrics = state.metrics.slice();
      newMetrics[metricIndex].metric_style = action.payload.metricStyle;
      return {
        ...state,
        metrics: newMetrics,
      };
    }
    case 'UPDATE_MEASUREMENT_TYPE': {
      const metricIndex = action.payload.metricIndex;
      const newMetrics = state.metrics.slice();
      newMetrics[metricIndex].measurement_type = action.payload.measurementType;

      return {
        ...state,
        metrics: newMetrics,
      };
    }

    default:
      return state;
  }
};

export default GraphForm;
