// @flow
import type { SelectOption, ToastItem } from '@kitman/components/src/types';
import type { InjuryVariable } from '@kitman/common/src/types/RiskAdvisor';

export type TcfGraphDataResponse = {
  name: string,
  parts: {
    name: Array<string>,
    data_source: Array<string>,
    aggregation: Array<string>,
    period_1: Array<string>,
    period_2: ?Array<string>,
  },
  y: number,
  restricted: boolean,
  risk_bands: Array<{
    xstart: number,
    xend: number,
    zone: string,
  }>,
  normalized_risk_bands: {
    bands: Array<{
      xstart: number,
      xend: number,
      zone: string,
    }>,
    value: ?number,
    x_min: number,
    x_max: number,
  },
  x_labels: Array<number>,
  status_value: ?string,
  status_unit: string,
};

export type TcfGraphData = {
  injury_risk_status: string,
  shap_value: number,
  parts: $PropertyType<TcfGraphDataResponse, 'parts'>,
  normalized_risk_bands: $PropertyType<
    TcfGraphDataResponse,
    'normalized_risk_bands'
  >,
  risk_bands: $PropertyType<TcfGraphDataResponse, 'risk_bands'>,
  x_labels: $PropertyType<TcfGraphDataResponse, 'x_labels'>,
};

export type injuryVariableSettingsState = {
  allVariables: Array<InjuryVariable>,
  currentVariable: InjuryVariable,
  staticData: {
    tsStart: string,
    tsEnd: string,
    squadOptions: Array<Object>,
    bodyAreaOptions: Array<Object>,
    positionGroupOptions: Array<Object>,
    severityOptions: Array<SelectOption>,
    isKitmanAdmin: boolean,
    pipelineArnOptions: Array<SelectOption>,
    defaultPipelineArn: ?string,
    canCreateMetric: boolean,
    canEditMetrics: boolean,
    canViewMetrics: boolean,
  },
  renameVariableModal: {
    isOpen: boolean,
    isTriggeredBySave: boolean,
    variableName: ?string,
  },
  dataSourcePanel: {
    isOpen: boolean,
  },
  toast: {
    statusItem: ?ToastItem,
  },
  graphData: {
    isLoading: boolean,
    summary: ?Object,
    value: ?Object,
    totalInjuries: ?number,
  },
  tcfGraphData: {
    isLoading: boolean,
    graphData: Array<TcfGraphDataResponse>,
  },
};

export type AppStatusState = {
  status: ?string,
  message: ?string,
};

export type GenerateMetricStatusState = {
  status: ?string,
  message: ?string,
  title: ?string,
};

type selectInjuryVariable = {
  type: 'SELECT_INJURY_VARIABLE',
  payload: {
    variableId: string,
  },
};

type addNewInjuryVariable = {
  type: 'ADD_NEW_INJURY_VARIABLE',
};

type cancelEditInjuryVariable = {
  type: 'CANCEL_EDIT_INJURY_VARIABLE',
};

type confirmCancelEditInjuryVariable = {
  type: 'CONFIRM_CANCEL_EDIT_INJURY_VARIABLE',
};

type openRenameVariableModal = {
  type: 'OPEN_RENAME_VARIABLE_MODAL',
  payload: {
    isTriggeredBySave: boolean,
    variableName: string,
  },
};

type toggleDataSourcePanel = {
  type: 'TOGGLE_DATA_SOURCE_PANEL',
};

type saveDataSources = {
  type: 'SAVE_DATA_SOURCES',
  payload: {
    excludedSources: Array<string>,
  },
};

type closeRenameVariableModal = {
  type: 'CLOSE_RENAME_VARIABLE_MODAL',
};

type changeDateRange = {
  type: 'CHANGE_DATE_RANGE',
  payload: {
    dateRange: {
      start_date: string,
      end_date: string,
    },
  },
};

type selectPositionGroups = {
  type: 'SELECT_POSITION_GROUPS',
  payload: {
    positionGroupId: Array<number>,
  },
};

type selectSeverities = {
  type: 'SELECT_SEVERITIES',
  payload: {
    severityId: Array<string>,
  },
};

type selectExposures = {
  type: 'SELECT_EXPOSURES',
  payload: {
    exposureId: Array<'game' | 'training_session'>,
  },
};

type selectMechanisms = {
  type: 'SELECT_MECHANISMS',
  payload: {
    mechanismId: Array<'contact' | 'non_contact' | 'all'>,
  },
};

type selectBodyArea = {
  type: 'SELECT_BODY_AREA',
  payload: {
    bodyAreaId: Array<string>,
  },
};

type updateVariableName = {
  type: 'UPDATE_VARIABLE_NAME',
  payload: {
    variableName: string,
  },
};

type updateRenameVariableName = {
  type: 'UPDATE_RENAME_VARIABLE_NAME',
  payload: {
    variableName: string,
  },
};

type generateMetricLoading = {
  type: 'GENERATE_METRIC_LOADING',
};

type updateVariableLoading = {
  type: 'UPDATE_VARIABLE_LOADING',
};

type generateMetricSuccess = {
  type: 'GENERATE_METRIC_SUCCESS',
};

type fetchVariablesSuccess = {
  type: 'FETCH_VARIABLES_SUCCESS',
  payload: {
    newVariables: Array<InjuryVariable>,
    responseVariable: ?InjuryVariable,
  },
};

type fetchVariablesLoading = {
  type: 'FETCH_VARIABLES_LOADING',
};

type fetchVariablesError = {
  type: 'FETCH_VARIABLES_ERROR',
};

type updateVariableSuccess = {
  type: 'UPDATE_VARIABLE_SUCCESS',
  payload: {
    isArchived: boolean,
    newVariableName: string,
  },
};

type fetchTCFGraphDataLoading = {
  type: 'FETCH_TCF_GRAPH_DATA_LOADING',
};

type fetchTCFGraphDataError = {
  type: 'FETCH_TCF_GRAPH_DATA_ERROR',
};

type fetchTCFGraphDataSuccess = {
  type: 'FETCH_TCF_GRAPH_DATA_SUCCESS',
  payload: {
    graphData: Array<TcfGraphDataResponse>,
  },
};

type generateMetricError = {
  type: 'GENERATE_METRIC_ERROR',
};

type updateVariableError = {
  type: 'UPDATE_VARIABLE_ERROR',
};

type buildVariableGraphsLoading = {
  type: 'BUILD_VARIABLE_GRAPHS_LOADING',
};

type buildVariableGraphsSuccess = {
  type: 'BUILD_VARIABLE_GRAPHS_SUCCESS',
  payload: {
    graphData: {
      summary: Object,
      value: Object,
      total_injuries_no_filtering: number,
    },
  },
};

type buildVariableGraphsError = {
  type: 'BUILD_VARIABLE_GRAPHS_ERROR',
};

type hideAppStatus = {
  type: 'HIDE_APP_STATUS',
};

type triggerToastProgress = {
  type: 'TRIGGER_TOAST_PROGRESS',
};

type triggerToastError = {
  type: 'TRIGGER_TOAST_ERROR',
};

type setVariableStatus = {
  type: 'SET_VARIABLE_STATUS',
  payload: {
    status: 'in_progress' | 'completed' | 'failed' | null,
  },
};

type triggerManualRunLoading = {
  type: 'TRIGGER_MANUAL_RUN_LOADING',
};

type triggerManualRunSuccess = {
  type: 'TRIGGER_MANUAL_RUN_SUCCESS',
};

type triggerManualRunError = {
  type: 'TRIGGER_MANUAL_RUN_ERROR',
};

type showGenerateMetricConfirmation = {
  type: 'SHOW_GENERATE_METRIC_CONFIRMATION',
};

type toggleHideVariable = {
  type: 'TOGGLE_HIDE_VARIABLE',
  payload: {
    isChecked: boolean,
  },
};

type selectPipelineArn = {
  type: 'SELECT_PIPELINE_ARN',
  payload: {
    arn: string,
  },
};

export type Action =
  | showGenerateMetricConfirmation
  | selectInjuryVariable
  | addNewInjuryVariable
  | openRenameVariableModal
  | closeRenameVariableModal
  | updateVariableName
  | updateRenameVariableName
  | changeDateRange
  | selectPositionGroups
  | selectExposures
  | selectMechanisms
  | selectBodyArea
  | selectSeverities
  | cancelEditInjuryVariable
  | confirmCancelEditInjuryVariable
  | generateMetricLoading
  | generateMetricSuccess
  | generateMetricError
  | updateVariableLoading
  | updateVariableSuccess
  | updateVariableError
  | buildVariableGraphsLoading
  | buildVariableGraphsSuccess
  | buildVariableGraphsError
  | triggerToastProgress
  | triggerToastError
  | setVariableStatus
  | fetchVariablesSuccess
  | fetchVariablesLoading
  | fetchVariablesError
  | triggerManualRunLoading
  | triggerManualRunSuccess
  | triggerManualRunError
  | toggleHideVariable
  | selectPipelineArn
  | toggleDataSourcePanel
  | saveDataSources
  | fetchTCFGraphDataLoading
  | fetchTCFGraphDataError
  | fetchTCFGraphDataSuccess
  | hideAppStatus;

type Dispatch = (
  // eslint-disable-next-line no-use-before-define
  action: Action | ThunkAction
) => any;
type GetState = () => injuryVariableSettingsState;
export type ThunkAction = (dispatch: Dispatch, getState: GetState) => any;
