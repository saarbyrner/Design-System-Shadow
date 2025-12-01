// @flow
import i18n from '@kitman/common/src/utils/i18n';
import type { ToastAction } from '@kitman/components/src/types';
import type { InjuryVariable } from '@kitman/common/src/types/RiskAdvisor';
import type {
  injuryVariableSettingsState,
  AppStatusState,
  GenerateMetricStatusState,
  Action,
} from './types';

export const injuryVariableSettings = (
  state: injuryVariableSettingsState = {},
  action: Action | ToastAction
): injuryVariableSettingsState => {
  const resetVariable = {
    id: null,
    name: '',
    date_range: {
      start_date: '',
      end_date: '',
    },
    filter: {
      position_group_ids: [],
      exposure_types: [],
      mechanisms: [],
      osics_body_area_ids: [],
      severity: [],
    },
    excluded_sources: [],
    excluded_variables: [],
    enabled_for_prediction: true,
    created_by: {
      id: null,
      fullname: null,
    },
    created_at: null,
    archived: false,
    status: null,
    last_prediction_status: null,
    is_hidden: false,
    pipeline_arn: '',
  };

  switch (action.type) {
    case 'ADD_NEW_INJURY_VARIABLE': {
      return {
        ...state,
        currentVariable: {
          id: null,
          name: i18n.t('Untitled Metric'),
          date_range: {
            start_date: state.staticData.tsStart,
            end_date: state.staticData.tsEnd,
          },
          filter: {
            position_group_ids: [],
            exposure_types: [],
            mechanisms: [],
            osics_body_area_ids: [],
            severity: [],
          },
          excluded_sources: [],
          excluded_variables: [],
          enabled_for_prediction: true,
          created_by: {
            id: null,
            fullname: null,
          },
          created_at: null,
          archived: false,
          status: null,
          last_prediction_status: null,
          is_hidden: false,
          pipeline_arn: state.staticData.defaultPipelineArn,
        },
      };
    }
    case 'CONFIRM_CANCEL_EDIT_INJURY_VARIABLE': {
      const currentVariable =
        state.allVariables.length > 0
          ? // $FlowFixMe length is already checked
            state.allVariables[0]
          : {
              ...resetVariable,
              date_range: {
                start_date: state.staticData.tsStart,
                end_date: state.staticData.tsEnd,
              },
              snapshot: {
                summary: null,
                value: null,
                totalInjuries: null,
              },
              pipeline_arn: state.staticData.defaultPipelineArn,
            };
      return {
        ...state,
        // $FlowFixMe currentVariable cannot be null here
        currentVariable,
        graphData: {
          ...state.graphData,
          summary: currentVariable?.snapshot?.summary || null,
          value: currentVariable?.snapshot?.value || null,
          totalInjuries: currentVariable?.snapshot?.totalInjuries || null,
        },
      };
    }
    case 'OPEN_RENAME_VARIABLE_MODAL': {
      return {
        ...state,
        renameVariableModal: {
          isOpen: true,
          isTriggeredBySave: action.payload.isTriggeredBySave,
          variableName: action.payload.variableName,
        },
      };
    }
    case 'TOGGLE_DATA_SOURCE_PANEL': {
      return {
        ...state,
        dataSourcePanel: {
          ...state.dataSourcePanel,
          isOpen: !state.dataSourcePanel.isOpen,
        },
      };
    }
    case 'SAVE_DATA_SOURCES': {
      return {
        ...state,
        currentVariable: {
          ...state.currentVariable,
          excluded_sources: action.payload.excludedSources,
        },
      };
    }
    case 'CLOSE_RENAME_VARIABLE_MODAL': {
      return {
        ...state,
        renameVariableModal: {
          isOpen: false,
          isTriggeredBySave: false,
          variableName: null,
        },
      };
    }
    case 'SELECT_INJURY_VARIABLE': {
      // $FlowFixMe selected id must refer to an existing variable
      const selectedVariable: InjuryVariable = state.allVariables.find(
        // $FlowFixMe id must exist at this point
        (variable) => variable.id === action.payload.variableId
      );
      return {
        ...state,
        currentVariable: { ...selectedVariable },
        graphData: {
          ...state.graphData,
          summary: selectedVariable.snapshot?.summary || null,
          value: selectedVariable.snapshot?.value || null,
          totalInjuries: selectedVariable.snapshot?.totalInjuries || null,
        },
      };
    }
    case 'CHANGE_DATE_RANGE': {
      return {
        ...state,
        currentVariable: {
          ...state.currentVariable,
          date_range: action.payload.dateRange,
        },
      };
    }
    case 'SELECT_POSITION_GROUPS': {
      return {
        ...state,
        currentVariable: {
          ...state.currentVariable,
          filter: {
            ...state.currentVariable.filter,
            position_group_ids: action.payload.positionGroupId,
          },
        },
      };
    }
    case 'SELECT_SEVERITIES': {
      return {
        ...state,
        currentVariable: {
          ...state.currentVariable,
          filter: {
            ...state.currentVariable.filter,
            severity: action.payload.severityId,
          },
        },
      };
    }
    case 'SELECT_EXPOSURES': {
      return {
        ...state,
        currentVariable: {
          ...state.currentVariable,
          filter: {
            ...state.currentVariable.filter,
            exposure_types: action.payload.exposureId,
          },
        },
      };
    }
    case 'SELECT_MECHANISMS': {
      return {
        ...state,
        currentVariable: {
          ...state.currentVariable,
          filter: {
            ...state.currentVariable.filter,
            mechanisms: action.payload.mechanismId,
          },
        },
      };
    }
    case 'SELECT_BODY_AREA': {
      return {
        ...state,
        currentVariable: {
          ...state.currentVariable,
          filter: {
            ...state.currentVariable.filter,
            osics_body_area_ids: action.payload.bodyAreaId,
          },
        },
      };
    }
    case 'TOGGLE_HIDE_VARIABLE': {
      return {
        ...state,
        currentVariable: {
          ...state.currentVariable,
          is_hidden: action.payload.isChecked,
        },
      };
    }
    case 'SELECT_PIPELINE_ARN': {
      return {
        ...state,
        currentVariable: {
          ...state.currentVariable,
          pipeline_arn: action.payload.arn,
        },
      };
    }
    case 'UPDATE_VARIABLE_NAME': {
      return {
        ...state,
        currentVariable: {
          ...state.currentVariable,
          name: action.payload.variableName,
        },
      };
    }
    case 'UPDATE_RENAME_VARIABLE_NAME': {
      return {
        ...state,
        renameVariableModal: {
          ...state.renameVariableModal,
          variableName: action.payload.variableName,
        },
      };
    }
    case 'TRIGGER_TOAST_PROGRESS': {
      return {
        ...state,
        toast: {
          ...state.toast,
          statusItem: {
            text: i18n.t('Injury Risk metric is being set up'),
            status: 'PROGRESS',
            id: 0,
          },
        },
      };
    }
    case 'TRIGGER_TOAST_ERROR': {
      return {
        ...state,
        toast: {
          ...state.toast,
          statusItem: {
            text: i18n.t('There was an error when saving the metric.'),
            status: 'ERROR',
            id: 0,
          },
        },
      };
    }
    case 'CLOSE_TOAST_ITEM': {
      return {
        ...state,
        toast: {
          ...state.toast,
          statusItem: null,
        },
      };
    }
    case 'SET_VARIABLE_STATUS': {
      return {
        ...state,
        currentVariable: {
          ...state.currentVariable,
          status: action.payload.status,
        },
      };
    }
    case 'BUILD_VARIABLE_GRAPHS_LOADING': {
      return {
        ...state,
        graphData: {
          ...state.graphData,
          isLoading: true,
        },
      };
    }
    case 'BUILD_VARIABLE_GRAPHS_SUCCESS': {
      return {
        ...state,
        graphData: {
          ...state.graphData,
          isLoading: false,
          summary: action.payload.graphData.summary,
          value: action.payload.graphData.value,
          totalInjuries: action.payload.graphData.total_injuries_no_filtering,
        },
      };
    }
    case 'FETCH_TCF_GRAPH_DATA_SUCCESS': {
      return {
        ...state,
        tcfGraphData: {
          ...state.tcfGraphData,
          isLoading: false,
          graphData: action.payload.graphData,
        },
      };
    }
    case 'FETCH_TCF_GRAPH_DATA_LOADING': {
      return {
        ...state,
        tcfGraphData: {
          ...state.tcfGraphData,
          isLoading: true,
        },
      };
    }
    case 'FETCH_TCF_GRAPH_DATA_ERROR': {
      return {
        ...state,
        tcfGraphData: {
          ...state.tcfGraphData,
          isLoading: false,
        },
      };
    }
    case 'UPDATE_VARIABLE_SUCCESS': {
      return {
        ...state,
        currentVariable: {
          ...state.currentVariable,
          archived: action.payload.isArchived,
          name: action.payload.newVariableName,
        },
      };
    }
    case 'FETCH_VARIABLES_SUCCESS': {
      const newVariable = action.payload.responseVariable
        ? {
            ...action.payload.responseVariable,
          }
        : { ...state.currentVariable };
      return {
        ...state,
        allVariables: action.payload.newVariables,
        currentVariable: newVariable,
      };
    }
    default:
      return state;
  }
};

export const appStatus = (
  state: AppStatusState = {},
  action: Action
): AppStatusState => {
  switch (action.type) {
    case 'TRIGGER_MANUAL_RUN_LOADING': {
      return {
        ...state,
        status: 'loading',
        message: i18n.t('Working...'),
      };
    }
    case 'FETCH_VARIABLES_LOADING':
    case 'UPDATE_VARIABLE_LOADING':
    case 'GENERATE_METRIC_LOADING': {
      return {
        ...state,
        status: 'loading',
      };
    }
    case 'GENERATE_METRIC_SUCCESS': {
      return {
        ...state,
        status: 'success',
        message: i18n.t('Running...'),
      };
    }
    case 'UPDATE_VARIABLE_SUCCESS': {
      return {
        ...state,
        status: 'success',
        message: i18n.t('Metric is updated.'),
      };
    }
    case 'TRIGGER_MANUAL_RUN_SUCCESS': {
      return {
        ...state,
        status: 'success',
        message: i18n.t('Running...'),
      };
    }
    case 'TRIGGER_MANUAL_RUN_ERROR':
    case 'FETCH_VARIABLES_ERROR':
    case 'BUILD_VARIABLE_GRAPHS_ERROR':
    case 'UPDATE_VARIABLE_ERROR':
    case 'GENERATE_METRIC_ERROR': {
      return {
        ...state,
        message: null,
        status: 'error',
      };
    }
    case 'CANCEL_EDIT_INJURY_VARIABLE': {
      return {
        ...state,
        status: 'confirm',
        message: i18n.t('Are you sure you want to exit without saving metric?'),
      };
    }
    case 'HIDE_APP_STATUS': {
      return {
        ...state,
        status: null,
        message: null,
      };
    }
    default:
      return state;
  }
};

export const generateMetricStatus = (
  state: GenerateMetricStatusState = {},
  action: Action
): AppStatusState => {
  switch (action.type) {
    case 'SHOW_GENERATE_METRIC_CONFIRMATION': {
      return {
        ...state,
        status: 'confirmWithTitle',
        title: i18n.t('Generate Injury risk metric'),
        message: i18n.t(
          'This multivariate analysis could take a number of hours. You will not be able to create any metrics whilst the metric is being generated.'
        ),
      };
    }
    case 'HIDE_APP_STATUS': {
      return {
        ...state,
        status: null,
        message: null,
        title: null,
      };
    }
    default:
      return state;
  }
};
