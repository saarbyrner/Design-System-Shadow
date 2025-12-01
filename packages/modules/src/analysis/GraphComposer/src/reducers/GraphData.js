/* eslint-disable flowtype/require-valid-file-annotation, max-statements */
const defaultGraphDataState = {
  longitudinal: {
    metrics: [],
    date_range: null,
    decorators: {
      injuries: false,
      illnesses: false,
      data_labels: false,
    },
    graphGroup: 'longitudinal',
    aggregationPeriod: 'day',
  },
  summary: null,
};

const GraphData = (state = defaultGraphDataState, action) => {
  switch (action.type) {
    case 'formLongitudinal/COMPOSE_GRAPH_SUCCESS': {
      const newState = Object.assign({}, state, {
        longitudinal: Object.assign({}, state.longitudinal, {
          metrics: action.payload.graphData.metrics,
          injuries: action.payload.graphData.injuries,
          illnesses: action.payload.graphData.illnesses,
          time_period: action.payload.graphData.time_period,
          date_range: action.payload.graphData.date_range,
          categories: action.payload.graphData.categories,
          decorators: action.payload.graphData.decorators,
          aggregationPeriod: 'day',
        }),
      });

      return newState;
    }
    case 'formSummary/COMPOSE_GRAPH_SUCCESS': {
      return Object.assign({}, state, {
        summary: Object.assign({}, state.summary, {
          illnesses: action.payload.graphData.illnesses,
          injuries: action.payload.graphData.injuries,
          metrics: action.payload.graphData.metrics,
          series: action.payload.graphData.series,
          cmpStdDevs: action.payload.graphData.cmpStdDevs,
          graphGroup: action.payload.graphData.graphGroup,
          scale_type: action.payload.graphData.scale_type,
        }),
      });
    }
    case 'formSummaryBar/COMPOSE_GRAPH_SUCCESS': {
      return Object.assign({}, state, {
        summaryBar: Object.assign({}, state.summaryBar, {
          metrics: action.payload.graphData.metrics,
          time_period: action.payload.graphData.time_period,
          date_range: action.payload.graphData.date_range,
          graphGroup: action.payload.graphData.graphGroup,
          decorators: action.payload.graphData.decorators,
        }),
      });
    }
    case 'formSummaryStackBar/COMPOSE_GRAPH_SUCCESS': {
      return {
        ...state,
        summaryStackBar: {
          ...state.summaryStackBar,
          metrics: action.payload.graphData.metrics,
          time_period: action.payload.graphData.time_period,
          date_range: action.payload.graphData.date_range,
          graphGroup: action.payload.graphData.graphGroup,
          decorators: action.payload.graphData.decorators,
        },
      };
    }
    case 'formSummaryDonut/COMPOSE_GRAPH_SUCCESS': {
      return {
        ...state,
        summaryDonut: {
          ...state.summaryDonut,
          metrics: action.payload.graphData.metrics,
          time_period: action.payload.graphData.time_period,
          date_range: action.payload.graphData.date_range,
          graphGroup: action.payload.graphData.graphGroup,
        },
      };
    }
    case 'formValueVisualisation/COMPOSE_GRAPH_SUCCESS': {
      return {
        ...state,
        valueVisualisation: {
          ...state.valueVisualisation,
          metrics: action.payload.graphData.metrics,
          time_period: action.payload.graphData.time_period,
          date_range: action.payload.graphData.date_range,
          graphGroup: action.payload.graphData.graphGroup,
        },
      };
    }
    case 'UPDATE_DECORATORS': {
      switch (action.payload.graphGroup) {
        case 'longitudinal':
          return {
            ...state,
            longitudinal: {
              ...state.longitudinal,
              decorators: action.payload.decorators,
            },
          };
        case 'summary_bar':
          return {
            ...state,
            summaryBar: {
              ...state.summaryBar,
              decorators: action.payload.decorators,
            },
          };
        case 'summary_stack_bar':
          return {
            ...state,
            summaryStackBar: {
              ...state.summaryStackBar,
              decorators: action.payload.decorators,
            },
          };
        default:
          return state;
      }
    }
    case 'UPDATE_AGGREGATION_PERIOD': {
      return Object.assign({}, state, {
        longitudinal: Object.assign({}, state.longitudinal, {
          aggregationPeriod: action.payload.aggregationPeriod,
        }),
      });
    }
    case 'UPDATE_GRAPH_FORM_TYPE': {
      if (
        action.payload.graphGroup === 'longitudinal' &&
        action.payload.graphType === 'combination'
      ) {
        return {
          ...state,
          longitudinal: {
            ...state.longitudinal,
            metrics: state.longitudinal.metrics.map((metric, index) => ({
              ...metric,
              metric_style: index === 0 ? 'column' : 'line',
            })),
          },
        };
      }

      return state;
    }
    case 'CONFIRM_RENAME_GRAPH': {
      switch (action.payload.graphGroup) {
        case 'longitudinal':
          return {
            ...state,
            longitudinal: {
              ...state.longitudinal,
              name: action.payload.newGraphName,
            },
          };
        case 'summary_bar':
          return {
            ...state,
            summaryBar: {
              ...state.summaryBar,
              name: action.payload.newGraphName,
            },
          };
        case 'summary_donut':
          return {
            ...state,
            summaryDonut: {
              ...state.summaryDonut,
              name: action.payload.newGraphName,
            },
          };
        case 'summary_stack_bar':
          return {
            ...state,
            summaryStackBar: {
              ...state.summaryStackBar,
              name: action.payload.newGraphName,
            },
          };
        case 'summary':
          return {
            ...state,
            summary: {
              ...state.summary,
              name: action.payload.newGraphName,
            },
          };
        case 'value_visualisation':
          return {
            ...state,
            valueVisualisation: {
              ...state.valueVisualisation,
              name: action.payload.newGraphName,
            },
          };
        default:
          return state;
      }
    }
    case 'SHOW_TABLE': {
      const newState = Object.assign({}, state);
      newState.showTable = true;
      return newState;
    }
    case 'SHOW_DIALOGUE':
    default:
      return state;
  }
};

export default GraphData;
