// @flow
import type { Toast } from '@kitman/components/src/types';
import type { Action } from '../types/actions';

export default (state: Array<Toast> = [], action: Action) => {
  switch (action.type) {
    case 'ADD_TOAST': {
      return [...state, action.payload.toast];
    }
    case 'REMOVE_TOAST': {
      const toasts: Array<Toast> = state.filter(
        ({ id }) => id !== action.payload.toastId
      );
      return toasts;
    }
    case 'UPDATE_TOAST': {
      const toasts: Array<Toast> = state.map((toast) =>
        toast.id === action.payload.toastId
          ? // $FlowFixMe attributes match toast type
            { ...toast, ...action.payload.attributes }
          : toast
      );
      return toasts;
    }
    default:
      return state;
  }
};
