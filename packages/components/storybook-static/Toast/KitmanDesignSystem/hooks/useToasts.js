// @flow

import { useReducer } from 'react';
import type {
  Toast,
  ToastId,
  ToastDispatch,
} from '@kitman/components/src/types';

export type ToastAction =
  | { type: 'CREATE_TOAST', toast: Toast }
  | { type: 'UPDATE_TOAST', toast: Toast }
  | { type: 'REMOVE_TOAST_BY_ID', id: ToastId }
  | { type: 'RESET_TOASTS' };

const toastsReducer = (initialState: Toast[], action: ToastAction): Toast[] => {
  const state = new Set(initialState);

  switch (action.type) {
    case 'CREATE_TOAST':
      state.add(action.toast);
      break;
    case 'UPDATE_TOAST':
      state.forEach((toast) => {
        if (toast.id === action.toast.id) {
          state.delete(toast);
        }
      });
      state.add(action.toast);
      break;
    case 'REMOVE_TOAST_BY_ID':
      state.forEach((toast) => {
        if (toast.id === action.id) {
          state.delete(toast);
        }
      });
      break;
    case 'RESET_TOASTS':
    default:
      state.clear();
      break;
  }

  return [...state];
};

const useToasts = (initialToasts: Toast[] = []) => {
  const [toasts, toastDispatch]: [Toast[], ToastDispatch<ToastAction>] =
    useReducer(toastsReducer, initialToasts);

  return {
    toasts,
    toastDispatch,
  };
};

export default useToasts;
