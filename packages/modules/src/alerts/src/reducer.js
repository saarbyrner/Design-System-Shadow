// @flow
import i18n from '@kitman/common/src/utils/i18n';
import type { Store, AppStatusState, Action } from '../types';

export const alerts = (state: Store = {}, action: Action): Store => {
  const resetAlert = {
    id: null,
    name: '',
    alert_training_variables: [
      {
        condition: 'less_than',
        id: null,
        training_variable_id: null,
        value: null,
      },
    ],
    training_variable_ids: [],
    notification_recipient_ids: [],
    notification_message: '',
    active: true,
  };

  switch (action.type) {
    case 'CLOSE_ALERT_MODAL': {
      return {
        ...state,
        openModal: 'none',
        currentAlert: { ...resetAlert },
      };
    }
    case 'OPEN_ALERT_MODAL': {
      let newCurrentAlert;
      if (action.payload.alertId) {
        newCurrentAlert = state.alertList.find(
          // $FlowFixMe alert must exist here
          (alert) => alert.id === action.payload.alertId
        );
      } else {
        newCurrentAlert = { ...resetAlert };
      }

      return {
        ...state,
        openModal: action.payload.type,
        // $FlowFixMe alert must exist here
        currentAlert: { ...newCurrentAlert },
      };
    }
    case 'SELECT_ALERT_USERS': {
      let newUsers = [...state.currentAlert.notification_recipient_ids];
      if (!action.payload.userItem.checked && newUsers.length > 0) {
        newUsers = newUsers.filter(
          // $FlowFixMe newUsers length is checked
          (userId) => `${userId}` !== action.payload.userItem.id
        );
      } else {
        newUsers.push(JSON.parse(action.payload.userItem.id));
      }
      return {
        ...state,
        currentAlert: {
          ...state.currentAlert,
          notification_recipient_ids: newUsers,
        },
      };
    }
    case 'SELECT_ALERT_VARIABLES': {
      let newVariables = [...state.currentAlert.training_variable_ids];
      if (!action.payload.variableItem.checked && newVariables.length > 0) {
        newVariables = newVariables.filter(
          // $FlowFixMe newVariables length is checked
          (variableId) => `${variableId}` !== action.payload.variableItem.id
        );
      } else {
        newVariables.push(JSON.parse(action.payload.variableItem.id));
      }
      return {
        ...state,
        currentAlert: {
          ...state.currentAlert,
          training_variable_ids: newVariables,
        },
      };
    }
    case 'UPDATE_ALERT_VARIABLES': {
      const newAlertTrainingVariables = [
        ...state.currentAlert.alert_training_variables,
      ];
      newAlertTrainingVariables[action.payload.index].training_variable_id =
        parseInt(action.payload.variableId, 10);
      return {
        ...state,
        currentAlert: {
          ...state.currentAlert,
          alert_training_variables: newAlertTrainingVariables,
        },
      };
    }
    case 'UPDATE_VARIABLE_CONDITION': {
      const newAlertTrainingVariables = [
        ...state.currentAlert.alert_training_variables,
      ];
      newAlertTrainingVariables[action.payload.index].condition =
        action.payload.conditionId;
      return {
        ...state,
        currentAlert: {
          ...state.currentAlert,
          alert_training_variables: newAlertTrainingVariables,
        },
      };
    }
    case 'UPDATE_VARIABLE_UNIT': {
      const newAlertTrainingVariables = [
        ...state.currentAlert.alert_training_variables,
      ];
      newAlertTrainingVariables[action.payload.index].value = parseInt(
        action.payload.unitValue,
        10
      );
      return {
        ...state,
        currentAlert: {
          ...state.currentAlert,
          alert_training_variables: newAlertTrainingVariables,
        },
      };
    }
    case 'UPDATE_ALERT_NAME': {
      return {
        ...state,
        currentAlert: {
          ...state.currentAlert,
          name: action.payload.alertName,
        },
      };
    }
    case 'UPDATE_ALERT_MESSAGE': {
      return {
        ...state,
        currentAlert: {
          ...state.currentAlert,
          notification_message: action.payload.alertMessage,
        },
      };
    }
    case 'ADD_NEW_VARIABLE': {
      const newVariables = [...state.currentAlert.alert_training_variables];
      newVariables.push({
        condition: 'less_than',
        id: null,
        training_variable_id: null,
        value: null,
      });
      return {
        ...state,
        currentAlert: {
          ...state.currentAlert,
          alert_training_variables: newVariables,
        },
      };
    }
    case 'DELETE_VARIABLE': {
      const newVariables = [
        ...state.currentAlert.alert_training_variables,
      ].filter((variable, index) => index !== action.payload.index);

      return {
        ...state,
        currentAlert: {
          ...state.currentAlert,
          alert_training_variables: newVariables,
        },
      };
    }
    case 'FETCH_ALERTS': {
      return {
        ...state,
        alertList: action.payload.alertList,
      };
    }
    case 'HIDE_APP_STATUS': {
      return {
        ...state,
        currentAlert: { ...resetAlert },
      };
    }
    case 'SHOW_CONFIRM_DELETE_ALERT':
      return {
        ...state,
        currentAlert: action.payload.alert,
      };
    case 'IS_LOADING_SQUADS':
      return {
        ...state,
        staticData: {
          ...state.staticData,
          squads: {
            ...state.staticData.squads,
            hasErrored: false,
            isLoading: true,
          },
        },
      };
    case 'SQUADS_HAS_ERRORED':
      return {
        ...state,
        staticData: {
          ...state.staticData,
          squads: {
            ...state.staticData.squads,
            isLoading: false,
            hasErrored: true,
          },
        },
      };

    case 'SQUAD_SUCCESS':
      return {
        ...state,
        staticData: {
          ...state.staticData,
          squads: {
            isLoading: false,
            hasErrored: false,
            data: action.payload.squads,
          },
        },
      };
    default:
      return state;
  }
};

export const appStatus = (state: AppStatusState = {}, action: Action) => {
  switch (action.type) {
    case 'SERVER_REQUEST':
      return {
        status: 'loading',
        message: null,
      };
    case 'HIDE_APP_STATUS': {
      return {
        status: null,
        message: null,
      };
    }
    case 'EDIT_ALERT_ACTIVITY_FAILURE':
    case 'DELETE_ALERT_FAILURE':
    case 'SAVE_ALERT_FAILURE': {
      return {
        status: 'error',
        message: null,
      };
    }
    case 'DUPLICATE_ALERT_FAILURE': {
      return {
        status: 'error',
        message: action.payload.message,
      };
    }
    case 'SAVE_ALERT_SUCCESS':
      return {
        status: 'success',
        message: i18n.t('Alert saved successfully'),
      };
    case 'DUPLICATE_ALERT_SUCCESS':
      return {
        status: 'success',
        message: i18n.t('Alert duplicated'),
      };
    case 'DELETE_ALERT_SUCCESS':
      return {
        status: 'success',
        message: i18n.t('Alert deleted successfully'),
      };
    case 'EDIT_ALERT_ACTIVITY_SUCCESS':
      return {
        status: 'success',
        message: i18n.t('Alert {{isActive}} successfully', {
          isActive: action.payload.isActive ? 'activated' : 'deactivated',
        }),
      };
    case 'SHOW_CONFIRM_DELETE_ALERT':
      return {
        status: 'confirm',
        message: i18n.t(
          'Are you sure you want to delete the alert {{alertName}}?',
          { alertName: action.payload.alert.name }
        ),
      };
    default:
      return state;
  }
};
