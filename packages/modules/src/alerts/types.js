// @flow
import type { MultiSelectDropdownItem } from '@kitman/components/src/types';
import type { Squads } from '@kitman/services/src/services/getSquads';

export type Variable = {
  source_key: string,
  name: string,
  source_name: string,
  type: 'boolean',
  localised_unit: 'Yes/No',
};

export type AlertTrainingVariable = {
  condition: 'equals' | 'less_than' | 'greater_than',
  id: ?number,
  training_variable_id: ?number,
  value: ?number,
};

export type Alert = {
  id: ?number,
  name: string,
  alert_training_variables: Array<AlertTrainingVariable>,
  training_variable_ids: Array<?number>,
  notification_recipient_ids: Array<?number>,
  notification_message: string,
  active: boolean,
};

export type ModalType = 'edit' | 'duplicate' | 'none' | 'create';

export type Store = {
  alertList: Array<?Alert>,
  openModal: ModalType,
  currentAlert: Alert,
  staticData: {
    users: Array<MultiSelectDropdownItem>,
    variables: Array<Variable>,
    squads: {
      isLoading: boolean,
      hasErrored: boolean,
      data: Squads,
    },
  },
};

export type AppStatusState = {
  message: ?string,
  status: ?string,
};

type openAlertModal = {
  type: 'OPEN_ALERT_MODAL',
  payload: {
    alertId: ?number,
    type: ModalType,
  },
};

type closeAlertModal = {
  type: 'CLOSE_ALERT_MODAL',
};

type selectAlertUsers = {
  type: 'SELECT_ALERT_USERS',
  payload: {
    userItem: {
      id: string,
      checked: boolean,
    },
  },
};

type selectAlertVariables = {
  type: 'SELECT_ALERT_VARIABLES',
  payload: {
    variableItem: {
      id: string,
      checked: boolean,
    },
  },
};

type updateAlertVariables = {
  type: 'UPDATE_ALERT_VARIABLES',
  payload: {
    variableId: string,
    index: number,
  },
};

type updateVariableCondition = {
  type: 'UPDATE_VARIABLE_CONDITION',
  payload: {
    conditionId: $PropertyType<AlertTrainingVariable, 'condition'>,
    index: number,
  },
};

type updateVariableUnit = {
  type: 'UPDATE_VARIABLE_UNIT',
  payload: {
    unitValue: string,
    index: number,
  },
};

type updateAlertName = {
  type: 'UPDATE_ALERT_NAME',
  payload: {
    alertName: string,
  },
};

type updateAlertMessage = {
  type: 'UPDATE_ALERT_MESSAGE',
  payload: {
    alertMessage: string,
  },
};

type addNewVariable = {
  type: 'ADD_NEW_VARIABLE',
};

type deleteVariable = {
  type: 'DELETE_VARIABLE',
  payload: {
    index: number,
  },
};

type fetchAlerts = {
  type: 'FETCH_ALERTS',
  payload: {
    alertList: Array<?Alert>,
  },
};

type isLoadingSquads = {
  type: 'IS_LOADING_SQUADS',
};

type squadsHasErrored = {
  type: 'SQUADS_HAS_ERRORED',
};

type squadSuccess = {
  type: 'SQUAD_SUCCESS',
  payload: {
    squads: Squads,
  },
};

type serverRequest = {
  type: 'SERVER_REQUEST',
};

type hideAppStatus = {
  type: 'HIDE_APP_STATUS',
};

type saveAlertSuccess = {
  type: 'SAVE_ALERT_SUCCESS',
};

type deleteAlertSuccess = {
  type: 'DELETE_ALERT_SUCCESS',
};

type saveAlertFailure = {
  type: 'SAVE_ALERT_FAILURE',
};

type deleteAlertFailure = {
  type: 'DELETE_ALERT_FAILURE',
};

type showConfirmDeleteAlert = {
  type: 'SHOW_CONFIRM_DELETE_ALERT',
  payload: {
    alert: Alert,
  },
};

type editAlertActivitySuccess = {
  type: 'EDIT_ALERT_ACTIVITY_SUCCESS',
  payload: {
    isActive: boolean,
  },
};

type editAlertActivityFailure = {
  type: 'EDIT_ALERT_ACTIVITY_FAILURE',
};

type duplicateAlertSuccess = {
  type: 'DUPLICATE_ALERT_SUCCESS',
};

type duplicateAlertFailure = {
  type: 'DUPLICATE_ALERT_FAILURE',
  payload: {
    message: string | null,
  },
};

export type Action =
  | openAlertModal
  | closeAlertModal
  | selectAlertUsers
  | fetchAlerts
  | serverRequest
  | hideAppStatus
  | saveAlertSuccess
  | saveAlertFailure
  | deleteAlertSuccess
  | deleteAlertFailure
  | showConfirmDeleteAlert
  | editAlertActivitySuccess
  | editAlertActivityFailure
  | updateAlertName
  | updateAlertMessage
  | updateAlertVariables
  | updateVariableCondition
  | updateVariableUnit
  | addNewVariable
  | deleteVariable
  | selectAlertVariables
  | isLoadingSquads
  | squadsHasErrored
  | squadSuccess
  | duplicateAlertSuccess
  | duplicateAlertFailure;

type Dispatch = (action: Action) => any;
type GetState = () => Store;
export type ThunkAction = (dispatch: Dispatch, getState: GetState) => any;
