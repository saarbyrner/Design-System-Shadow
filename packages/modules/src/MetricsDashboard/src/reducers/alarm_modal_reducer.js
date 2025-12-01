// @flow
import i18n from '@kitman/common/src/utils/i18n';
import type { State } from '../../types/state';
import type { Action } from '../../types/actions';

const initialState = {
  isVisible: false,
  modalStatus: null,
  modalMessage: i18n.t('Are you sure you want to exit before saving?'),
  changesMade: false,
  confirmActionId: 'hideModal',
};

const alarmsModal = (
  state: $PropertyType<State, 'alarmsModal'> = initialState,
  action: Action
) => {
  if (action.type !== 'SHOW_MODAL' && state.isVisible === false) {
    // we're not showing the modal and not visible so just ignore any other
    // actions.
    return state;
  }

  switch (action.type) {
    case 'SHOW_MODAL':
      if (action.modalType !== 'alarms') {
        return state;
      }
      return Object.assign({}, state, { isVisible: true });
    case 'CONFIRM_CLOSE_MODAL':
      return Object.assign({}, state, { modalStatus: 'confirm' });
    case 'CONFIRM_DELETE_ALL_ALARM_DEFINITIONS_FOR_STATUS':
      return Object.assign({}, state, {
        modalStatus: 'warning',
        modalMessage: i18n.t('Delete all alarms?'),
        confirmActionId: 'deleteAllAlarms',
      });
    case 'CANCEL_CLOSE_MODAL':
      return Object.assign({}, state, { modalStatus: null });
    case 'HIDE_CURRENT_MODAL':
      return initialState;
    case 'ADD_ALARM_DEFINITION_FOR_STATUS':
    case 'DELETE_ALARM_DEFINITION_FOR_STATUS':
    case 'SET_ALARM_CONDITION':
    case 'SET_ALARM_VALUE':
    case 'SET_ALARM_COLOUR':
    case 'ADD_ENTIRE_SQUAD_TO_ALARM':
    case 'ADD_POSITION_TO_ALARM':
    case 'ADD_POSITION_GROUP_TO_ALARM':
    case 'ADD_ATHLETE_TO_ALARM':
    case 'REMOVE_ENTIRE_SQUAD_FROM_ALARM':
    case 'REMOVE_POSITION_FROM_ALARM':
    case 'REMOVE_POSITION_GROUP_FROM_ALARM':
    case 'REMOVE_ATHLETE_FROM_ALARM':
    case 'UPDATE_SHOW_ALARM_ON_MOBILE':
    case 'TOGGLE_SELECT_ALL_FOR_MOBILE':
    case 'SET_ALARM_TYPE':
    case 'SET_ALARM_CALCULATION':
    case 'SET_ALARM_PERCENTAGE':
    case 'SET_ALARM_PERIOD_SCOPE':
      return Object.assign({}, state, { changesMade: true });
    case 'DELETE_ALL_ALARM_DEFINITIONS_FOR_STATUS':
      return Object.assign({}, state, {
        modalStatus: null,
        confirmActionId: 'hideModal',
        modalMessage: i18n.t('Are you sure you want to exit before saving?'),
        changesMade: true,
      });
    case 'SAVE_ALARM_DEFINITIONS_REQUEST':
      return Object.assign({}, state, {
        modalStatus: 'loading',
        modalMessage: i18n.t('Saving...'),
      });
    case 'SAVE_ALARM_DEFINITIONS_SUCCESS':
      return Object.assign({}, state, {
        modalStatus: 'success',
        modalMessage: i18n.t('Success'),
      });
    case 'SAVE_ALARM_DEFINITIONS_FAILURE':
      return Object.assign({}, state, { modalStatus: 'error' });
    default:
      return state;
  }
};

export default alarmsModal;
