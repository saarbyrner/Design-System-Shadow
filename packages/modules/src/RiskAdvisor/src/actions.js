// @flow
import $ from 'jquery';
import type { InjuryVariable } from '@kitman/common/src/types/RiskAdvisor';
import type { Action, ThunkAction, TcfGraphDataResponse } from './types';

export const selectInjuryVariable = (variableId: string): Action => ({
  type: 'SELECT_INJURY_VARIABLE',
  payload: {
    variableId,
  },
});

export const addNewInjuryVariable = (): Action => ({
  type: 'ADD_NEW_INJURY_VARIABLE',
});

export const cancelEditInjuryVariable = (): Action => ({
  type: 'CANCEL_EDIT_INJURY_VARIABLE',
});

export const confirmCancelEditInjuryVariable = (): Action => ({
  type: 'CONFIRM_CANCEL_EDIT_INJURY_VARIABLE',
});

export const openRenameVariableModal = (
  isTriggeredBySave: boolean,
  variableName: string
): Action => ({
  type: 'OPEN_RENAME_VARIABLE_MODAL',
  payload: {
    isTriggeredBySave,
    variableName,
  },
});

export const toggleDataSourcePanel = (): Action => ({
  type: 'TOGGLE_DATA_SOURCE_PANEL',
});

export const saveDataSources = (excludedSources: Array<string>): Action => ({
  type: 'SAVE_DATA_SOURCES',
  payload: {
    excludedSources,
  },
});

export const closeRenameVariableModal = (): Action => ({
  type: 'CLOSE_RENAME_VARIABLE_MODAL',
});

export const changeDateRange = (dateRange: {
  start_date: string,
  end_date: string,
}): Action => ({
  type: 'CHANGE_DATE_RANGE',
  payload: {
    dateRange,
  },
});

export const selectPositionGroups = (
  positionGroupId: Array<number>
): Action => ({
  type: 'SELECT_POSITION_GROUPS',
  payload: {
    positionGroupId,
  },
});

export const selectSeverities = (severityId: Array<string>): Action => ({
  type: 'SELECT_SEVERITIES',
  payload: {
    severityId,
  },
});

export const selectExposures = (
  exposureId: Array<'game' | 'training_session'>
): Action => ({
  type: 'SELECT_EXPOSURES',
  payload: {
    exposureId,
  },
});

export const selectMechanisms = (
  mechanismId: Array<'contact' | 'non_contact' | 'all'>
): Action => ({
  type: 'SELECT_MECHANISMS',
  payload: {
    mechanismId,
  },
});

export const selectBodyArea = (bodyAreaId: Array<string>): Action => ({
  type: 'SELECT_BODY_AREA',
  payload: {
    bodyAreaId,
  },
});

export const updateVariableName = (variableName: string): Action => ({
  type: 'UPDATE_VARIABLE_NAME',
  payload: {
    variableName,
  },
});

export const updateRenameVariableName = (variableName: string): Action => ({
  type: 'UPDATE_RENAME_VARIABLE_NAME',
  payload: {
    variableName,
  },
});

export const toggleHideVariable = (isChecked: boolean): Action => ({
  type: 'TOGGLE_HIDE_VARIABLE',
  payload: {
    isChecked,
  },
});

export const selectPipelineArn = (arn: string): Action => ({
  type: 'SELECT_PIPELINE_ARN',
  payload: {
    arn,
  },
});

export const generateMetricLoading = (): Action => ({
  type: 'GENERATE_METRIC_LOADING',
});

export const updateVariableLoading = (): Action => ({
  type: 'UPDATE_VARIABLE_LOADING',
});

export const generateMetricSuccess = (): Action => ({
  type: 'GENERATE_METRIC_SUCCESS',
});

export const updateVariableSuccess = (
  isArchived: boolean,
  newVariableName: string
): Action => ({
  type: 'UPDATE_VARIABLE_SUCCESS',
  payload: {
    isArchived,
    newVariableName,
  },
});

export const generateMetricError = (): Action => ({
  type: 'GENERATE_METRIC_ERROR',
});

export const updateVariableError = (): Action => ({
  type: 'UPDATE_VARIABLE_ERROR',
});

export const buildVariableGraphsLoading = (): Action => ({
  type: 'BUILD_VARIABLE_GRAPHS_LOADING',
});

export const fetchVariablesLoading = (): Action => ({
  type: 'FETCH_VARIABLES_LOADING',
});

export const buildVariableGraphsSuccess = (graphData: {
  summary: Object,
  value: Object,
  total_injuries_no_filtering: number,
}): Action => ({
  type: 'BUILD_VARIABLE_GRAPHS_SUCCESS',
  payload: {
    graphData,
  },
});

export const fetchVariablesSuccess = (
  newVariables: Array<InjuryVariable>,
  responseVariable: ?InjuryVariable
): Action => ({
  type: 'FETCH_VARIABLES_SUCCESS',
  payload: {
    newVariables,
    responseVariable,
  },
});

export const buildVariableGraphsError = (): Action => ({
  type: 'BUILD_VARIABLE_GRAPHS_ERROR',
});

export const hideAppStatus = (): Action => ({
  type: 'HIDE_APP_STATUS',
});

export const triggerToastProgress = (): Action => ({
  type: 'TRIGGER_TOAST_PROGRESS',
});

export const triggerToastError = (): Action => ({
  type: 'TRIGGER_TOAST_ERROR',
});

export const fetchVariablesError = (): Action => ({
  type: 'FETCH_VARIABLES_ERROR',
});

export const setVariableStatus = (
  status: 'in_progress' | 'completed' | 'failed' | null
): Action => ({
  type: 'SET_VARIABLE_STATUS',
  payload: {
    status,
  },
});

export const showGenerateMetricConfirmation = (): Action => ({
  type: 'SHOW_GENERATE_METRIC_CONFIRMATION',
});

export const fetchVariables =
  (responseVariable: ?InjuryVariable): ThunkAction =>
  (dispatch: (action: Action | ThunkAction) => Action) => {
    dispatch(fetchVariablesLoading());
    $.ajax({
      method: 'GET',
      url: window.featureFlags['side-nav-update']
        ? '/administration/analytics'
        : '/settings/injury_risk_variables',
      contentType: 'application/json',
    })
      .done((newVariables) => {
        dispatch(fetchVariablesSuccess(newVariables, responseVariable));
      })
      .fail(() => {
        dispatch(fetchVariablesError());
      });
  };

export const generateMetric =
  (): ThunkAction =>
  (dispatch: (action: Action | ThunkAction) => Action, getState: Function) => {
    dispatch(generateMetricLoading());
    const currentVariable = getState().injuryVariableSettings.currentVariable;
    const isKitmanAdmin =
      getState().injuryVariableSettings.staticData.isKitmanAdmin;

    $.ajax({
      method: 'POST',
      url: window.featureFlags['side-nav-update']
        ? '/administration/analytics'
        : '/settings/injury_risk_variables',
      headers: {
        'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content'),
      },
      contentType: 'application/json',
      data: JSON.stringify({
        name: currentVariable.name,
        excluded_sources: currentVariable.excluded_sources,
        excluded_variables: currentVariable.excluded_variables,
        filter: {
          position_group_ids: currentVariable.filter.position_group_ids,
          exposure_types: currentVariable.filter.exposure_types,
          mechanisms: currentVariable.filter.mechanisms,
          osics_body_area_ids: currentVariable.filter.osics_body_area_ids,
          severity: currentVariable.filter.severity,
        },
        enabled_for_prediction: currentVariable.enabled_for_prediction,
        date_range: {
          start_date: currentVariable.date_range.start_date,
          end_date: currentVariable.date_range.end_date,
        },
        snapshot: {
          filter: null,
          summary: getState().injuryVariableSettings.graphData.summary,
          value: getState().injuryVariableSettings.graphData.value,
          total_injuries_no_filtering:
            getState().injuryVariableSettings.graphData.totalInjuries,
        },
        is_hidden: currentVariable.is_hidden,
        pipeline_arn: isKitmanAdmin ? currentVariable.pipeline_arn : null,
      }),
    })
      .done((response) => {
        dispatch(generateMetricSuccess());
        dispatch(fetchVariables(response.injury_risk_variable));
        dispatch(setVariableStatus('in_progress'));
        dispatch(triggerToastProgress());
        setTimeout(() => {
          dispatch(hideAppStatus());
        }, 1000);
      })
      .fail(() => {
        dispatch(generateMetricError());
        dispatch(setVariableStatus('failed'));
        dispatch(triggerToastError());
      });
  };

export const saveButtonClick =
  (): ThunkAction =>
  (dispatch: (action: Action | ThunkAction) => Action, getState: Function) => {
    if (
      getState().injuryVariableSettings.currentVariable.name ===
      'Untitled Metric'
    ) {
      dispatch(
        openRenameVariableModal(
          true,
          getState().injuryVariableSettings.currentVariable.name
        )
      );
    } else {
      dispatch(showGenerateMetricConfirmation());
    }
  };

export const updateVariable =
  (calledFrom?: 'SET_ARCHIVED'): ThunkAction =>
  (dispatch: (action: Action | ThunkAction) => Action, getState: Function) => {
    dispatch(updateVariableLoading());
    const currentVariable = getState().injuryVariableSettings.currentVariable;
    const newVariableName =
      getState().injuryVariableSettings.renameVariableModal.variableName ||
      currentVariable.name;
    const isArchived =
      calledFrom === 'SET_ARCHIVED'
        ? !currentVariable.archived
        : currentVariable.archived;

    $.ajax({
      method: 'PUT',
      url: window.featureFlags['side-nav-update']
        ? `/administration/analytics/${currentVariable.id}`
        : `/settings/injury_risk_variables/${currentVariable.id}`,
      headers: {
        'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content'),
      },
      contentType: 'application/json',
      data: JSON.stringify({
        archived: isArchived,
        name: newVariableName,
      }),
    })
      .done((response) => {
        dispatch(updateVariableSuccess(isArchived, newVariableName));
        dispatch(fetchVariables(response.injury_risk_variable));
        setTimeout(() => {
          dispatch(hideAppStatus());
        }, 1000);
      })
      .fail(() => {
        dispatch(updateVariableError());
      });
  };

export const renameModalConfirm =
  (): ThunkAction =>
  (dispatch: (action: Action | ThunkAction) => Action, getState: Function) => {
    if (getState().injuryVariableSettings.currentVariable.id) {
      // when metric is saved, we want to update the name in DB
      dispatch(updateVariable());
      dispatch(closeRenameVariableModal());
    } else if (
      getState().injuryVariableSettings.renameVariableModal.isTriggeredBySave
    ) {
      // when metric is not saved, and rename modal is opened when clicking save
      dispatch(
        updateVariableName(
          getState().injuryVariableSettings.renameVariableModal.variableName
        )
      );
      dispatch(closeRenameVariableModal());
      dispatch(showGenerateMetricConfirmation());
    } else {
      // when metric is not saved, and rename modal is opened manually (update only the state)
      dispatch(
        updateVariableName(
          getState().injuryVariableSettings.renameVariableModal.variableName
        )
      );
      dispatch(closeRenameVariableModal());
    }
  };

export const buildVariableGraphs =
  (): ThunkAction =>
  (dispatch: (action: Action | ThunkAction) => Action, getState: Function) => {
    dispatch(buildVariableGraphsLoading());
    const currentVariable = getState().injuryVariableSettings.currentVariable;

    $.ajax({
      method: 'POST',
      url: window.featureFlags['side-nav-update']
        ? '/administration/analytics/build'
        : '/settings/injury_risk_variables/build',
      headers: {
        'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content'),
      },
      contentType: 'application/json',
      data: JSON.stringify({
        filter: {
          position_group_ids: currentVariable.filter.position_group_ids,
          exposure_types: currentVariable.filter.exposure_types,
          mechanisms: currentVariable.filter.mechanisms,
          osics_body_area_ids: currentVariable.filter.osics_body_area_ids,
          severity: currentVariable.filter.severity,
        },
        date_range: {
          start_date: currentVariable.date_range.start_date,
          end_date: currentVariable.date_range.end_date,
        },
      }),
    })
      .done((graphData) => {
        dispatch(buildVariableGraphsSuccess(graphData));
        setTimeout(() => {
          dispatch(hideAppStatus());
        }, 1000);
      })
      .fail(() => {
        dispatch(buildVariableGraphsError());
      });
  };

export const triggerManualRunLoading = (): Action => ({
  type: 'TRIGGER_MANUAL_RUN_LOADING',
});

export const triggerManualRunSuccess = (): Action => ({
  type: 'TRIGGER_MANUAL_RUN_SUCCESS',
});

export const triggerManualRunError = (): Action => ({
  type: 'TRIGGER_MANUAL_RUN_ERROR',
});

export const triggerManualRun =
  (): ThunkAction =>
  (dispatch: (action: Action | ThunkAction) => Action, getState: Function) => {
    dispatch(triggerManualRunLoading());
    const currentVariable = getState().injuryVariableSettings.currentVariable;

    $.ajax({
      method: 'POST',
      url: window.featureFlags['side-nav-update']
        ? `/administration/analytics/${currentVariable.id}/start_prediction`
        : `/settings/injury_risk_variables/${currentVariable.id}/start_prediction`,
      headers: {
        'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content'),
      },
      contentType: 'application/json',
    })
      .done((response) => {
        dispatch(triggerManualRunSuccess());
        dispatch(fetchVariables(response.injury_risk_variable));
        setTimeout(() => {
          dispatch(hideAppStatus());
        }, 1000);
      })
      .fail(() => {
        dispatch(triggerManualRunError());
      });
  };

export const fetchTCFGraphDataLoading = (): Action => ({
  type: 'FETCH_TCF_GRAPH_DATA_LOADING',
});

export const fetchTCFGraphDataSuccess = (
  graphData: Array<TcfGraphDataResponse>
): Action => ({
  type: 'FETCH_TCF_GRAPH_DATA_SUCCESS',
  payload: {
    graphData,
  },
});

export const fetchTCFGraphDataError = (): Action => ({
  type: 'FETCH_TCF_GRAPH_DATA_ERROR',
});

export const fetchTCFGraphData =
  (injuryRiskVariableUuid: string): ThunkAction =>
  (dispatch: (action: Action | ThunkAction) => Action) => {
    dispatch(fetchTCFGraphDataLoading());

    $.ajax({
      method: 'GET',
      url: `/administration/injury_risk_variables/${injuryRiskVariableUuid}/injury_risk_top_contributing_factors`,
      contentType: 'application/json',
    })
      .done((graphData) => {
        dispatch(fetchTCFGraphDataSuccess(graphData));
        setTimeout(() => {
          dispatch(hideAppStatus());
        }, 1000);
      })
      .fail(() => {
        dispatch(fetchTCFGraphDataError());
      });
  };
