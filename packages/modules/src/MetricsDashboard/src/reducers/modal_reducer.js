// @flow
import type { State } from '../../types/state';
import type { Action } from '../../types/actions';

const initialState = {
  modalType: null,
  modalProps: {},
};

const modal = (
  state: $PropertyType<State, 'modal'> = initialState,
  action: Action
) => {
  switch (action.type) {
    case 'SHOW_MODAL':
      return {
        modalType: action.modalType,
        modalProps: action.modalProps,
      };
    case 'HIDE_CURRENT_MODAL':
      return initialState;
    default:
      return state;
  }
};

export default modal;
