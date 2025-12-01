// @flow
import type { State } from '../../types/state';
import type { Action } from '../../types/actions';
import { hideConfirmation } from '../actions';

const initialState = {
  show: false,
  action: hideConfirmation,
  message: '',
};

const confirmationMessage = (
  state: $PropertyType<State, 'confirmationMessage'> = initialState,
  action: Action
) => {
  switch (action.type) {
    case 'SHOW_CONFIRMATION':
      return {
        show: true,
        action: action.payload.action,
        message: action.payload.message,
      };
    case 'HIDE_CONFIRMATION': {
      return initialState;
    }
    default:
      return state;
  }
};

export default confirmationMessage;
