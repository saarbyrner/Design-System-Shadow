// @flow
import $ from 'jquery';
import _find from 'lodash/find';
import i18n from '@kitman/common/src/utils/i18n';
import { getSquads } from '@kitman/services';
import type { Squads } from '@kitman/services/src/services/getSquads';
import type {
  Alert,
  Action,
  ThunkAction,
  AlertTrainingVariable,
  ModalType,
} from '../types';

export const closeAlertModal = (): Action => ({
  type: 'CLOSE_ALERT_MODAL',
});

export const openAlertModal = (alertId: ?number, type: ModalType): Action => ({
  type: 'OPEN_ALERT_MODAL',
  payload: {
    alertId,
    type,
  },
});

export const selectAlertUsers = (userItem: {
  id: string,
  checked: boolean,
}): Action => ({
  type: 'SELECT_ALERT_USERS',
  payload: {
    userItem,
  },
});

export const selectAlertVariables = (variableItem: {
  id: string,
  checked: boolean,
}): Action => ({
  type: 'SELECT_ALERT_VARIABLES',
  payload: {
    variableItem,
  },
});

export const updateAlertVariables = (
  variableId: string,
  index: number
): Action => ({
  type: 'UPDATE_ALERT_VARIABLES',
  payload: {
    variableId,
    index,
  },
});

export const updateVariableCondition = (
  conditionId: $PropertyType<AlertTrainingVariable, 'condition'>,
  index: number
): Action => ({
  type: 'UPDATE_VARIABLE_CONDITION',
  payload: {
    conditionId,
    index,
  },
});

export const updateVariableUnit = (
  unitValue: string,
  index: number
): Action => ({
  type: 'UPDATE_VARIABLE_UNIT',
  payload: {
    unitValue,
    index,
  },
});

export const updateAlertName = (alertName: string): Action => ({
  type: 'UPDATE_ALERT_NAME',
  payload: {
    alertName,
  },
});

export const updateAlertMessage = (alertMessage: string): Action => ({
  type: 'UPDATE_ALERT_MESSAGE',
  payload: {
    alertMessage,
  },
});

export const addNewVariable = (): Action => ({
  type: 'ADD_NEW_VARIABLE',
});

export const deleteVariable = (index: number): Action => ({
  type: 'DELETE_VARIABLE',
  payload: {
    index,
  },
});

export const fetchAlerts = (alertList: Array<?Alert>): Action => ({
  type: 'FETCH_ALERTS',
  payload: {
    alertList,
  },
});

export const serverRequest = (): Action => ({
  type: 'SERVER_REQUEST',
});

export const hideAppStatus = (): Action => ({
  type: 'HIDE_APP_STATUS',
});

export const saveAlertSuccess = (): Action => ({
  type: 'SAVE_ALERT_SUCCESS',
});

export const deleteAlertSuccess = (): Action => ({
  type: 'DELETE_ALERT_SUCCESS',
});

export const editAlertActivitySuccess = (isActive: boolean): Action => ({
  type: 'EDIT_ALERT_ACTIVITY_SUCCESS',
  payload: {
    isActive,
  },
});

export const saveAlertFailure = (): Action => ({
  type: 'SAVE_ALERT_FAILURE',
});

export const editAlertActivityFailure = (): Action => ({
  type: 'EDIT_ALERT_ACTIVITY_FAILURE',
});

export const deleteAlertFailure = (): Action => ({
  type: 'DELETE_ALERT_FAILURE',
});

export const duplicateAlertSuccess = (): Action => ({
  type: 'DUPLICATE_ALERT_SUCCESS',
});

export const duplicateAlertFailure = (message: string | null): Action => ({
  type: 'DUPLICATE_ALERT_FAILURE',
  payload: {
    message,
  },
});

export const showConfirmDeleteAlert = (alert: Alert): Action => ({
  type: 'SHOW_CONFIRM_DELETE_ALERT',
  payload: {
    alert,
  },
});

export const editAlertActivity =
  (alert: Alert): ThunkAction =>
  (dispatch: (action: Action) => Action) => {
    dispatch(serverRequest());
    const alertForRequest = { ...alert, active: !alert.active };
    if (window.getFlag('alerts-numeric-metric')) {
      // $FlowFixMe training_variable_ids is temporary, it will be completely removed
      delete alertForRequest.training_variable_ids;
    }

    $.ajax({
      method: 'PUT',
      // $FlowFixMe alert.id must exist here
      url: `/alerts/${alert.id}`,
      contentType: 'application/json',
      data: JSON.stringify(alertForRequest),
    })
      .done((response) => {
        dispatch(fetchAlerts(response.athlete_alerts));
        dispatch(editAlertActivitySuccess(!alert.active));
        setTimeout(() => {
          dispatch(hideAppStatus());
        }, 1000);
      })
      .fail(() => {
        dispatch(editAlertActivityFailure());
      });
  };

export const createAlert =
  (): ThunkAction =>
  (dispatch: (action: Action) => Action, getState: Function) => {
    dispatch(serverRequest());
    const alertForRequest = getState().alerts.currentAlert;
    if (window.getFlag('alerts-numeric-metric')) {
      // $FlowFixMe training_variable_ids is temporary, it will be completely removed
      delete alertForRequest.training_variable_ids;
    }

    $.ajax({
      method: 'POST',
      url: `/alerts`,
      contentType: 'application/json',
      data: JSON.stringify(alertForRequest),
    })
      .done((response) => {
        dispatch(closeAlertModal());
        dispatch(fetchAlerts(response.athlete_alerts));
        dispatch(saveAlertSuccess());
        setTimeout(() => {
          dispatch(hideAppStatus());
        }, 1000);
      })
      .fail(() => {
        dispatch(saveAlertFailure());
      });
  };

export const editAlert =
  (): ThunkAction =>
  (dispatch: (action: Action) => Action, getState: Function) => {
    dispatch(serverRequest());
    const alertForRequest = getState().alerts.currentAlert;
    if (window.getFlag('alerts-numeric-metric')) {
      // $FlowFixMe training_variable_ids is temporary, it will be completely removed
      delete alertForRequest.training_variable_ids;
    }

    $.ajax({
      method: 'PUT',
      url: `/alerts/${getState().alerts.currentAlert.id}`,
      contentType: 'application/json',
      data: JSON.stringify(alertForRequest),
    })
      .done((response) => {
        dispatch(closeAlertModal());
        dispatch(fetchAlerts(response.athlete_alerts));
        dispatch(saveAlertSuccess());
        setTimeout(() => {
          dispatch(hideAppStatus());
        }, 1000);
      })
      .fail(() => {
        dispatch(saveAlertFailure());
      });
  };

export const deleteAlert =
  (): ThunkAction =>
  (dispatch: (action: Action) => Action, getState: Function) => {
    dispatch(serverRequest());
    $.ajax({
      method: 'DELETE',
      url: `/alerts/${getState().alerts.currentAlert.id}`,
    })
      .done((response) => {
        dispatch(fetchAlerts(response.athlete_alerts));
        dispatch(deleteAlertSuccess());
        setTimeout(() => {
          dispatch(hideAppStatus());
        }, 1000);
      })
      .fail(() => {
        dispatch(deleteAlertFailure());
      });
  };

export const duplicateAlert =
  (squadIds: Array<number>): ThunkAction =>
  (dispatch: (action: Action) => Action, getState: Function) => {
    const currentAlertId = getState().alerts.currentAlert.id;
    const allSquads = getState().alerts.staticData.squads.data;

    dispatch(closeAlertModal());
    dispatch(serverRequest());

    $.ajax({
      method: 'POST',
      url: `/alerts/${currentAlertId}/duplicate`,
      contentType: 'application/json',
      data: JSON.stringify({
        squad_ids: squadIds,
      }),
    })
      .done(() => {
        dispatch(duplicateAlertSuccess());
        setTimeout(() => {
          dispatch(hideAppStatus());
        }, 1000);
      })
      .fail((response) => {
        let responseContent = {};

        try {
          responseContent = JSON.parse(response.responseText);
        } catch {
          responseContent = {};
        }

        if (
          response.status === 400 &&
          responseContent.message === 'duplicate_name'
        ) {
          const squads = responseContent.squad_ids || [];
          const message = i18n.t(
            'An alert with this name exists in the following squads: {{squads}}',
            {
              squads: squads
                .map((id) => {
                  const squad = _find(allSquads, { id });

                  if (!squad) {
                    return '';
                  }

                  return squad.name;
                })
                .join(', '),
            }
          );

          dispatch(duplicateAlertFailure(message));
        } else {
          dispatch(duplicateAlertFailure(null));
        }
      });
  };

export const isLoadingSquads = () => ({ type: 'IS_LOADING_SQUADS' });
export const squadsHasErrored = () => ({ type: 'SQUADS_HAS_ERRORED' });
export const squadSuccess = (squads: Squads) => ({
  type: 'SQUAD_SUCCESS',
  payload: { squads },
});

export const fetchSquads =
  (): ThunkAction => (dispatch: (action: Action) => Action) => {
    dispatch(isLoadingSquads());

    getSquads()
      .then((squads) => {
        dispatch(squadSuccess(squads));
      })
      .catch(() => {
        dispatch(squadsHasErrored());
      });
  };
