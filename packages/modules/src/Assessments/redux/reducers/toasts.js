// @flow
import i18n from '@kitman/common/src/utils/i18n';
import type { Store } from '../types/store';
import type { Action } from '../types/actions';

export default function (
  state: $PropertyType<Store, 'toasts'> = [],
  action: Action
) {
  switch (action.type) {
    case 'UPDATE_TEMPLATE_PENDING': {
      return [
        ...state,
        {
          text: i18n.t(`Update "{{templateName}}"`, {
            templateName: action.payload.assessmentTemplate.name,
            interpolation: { escapeValue: false },
          }),
          status: 'PROGRESS',
          id: action.payload.assessmentTemplate.id,
        },
      ];
    }
    case 'UPDATE_TEMPLATE_SUCCESS': {
      const toasts: $PropertyType<Store, 'toasts'> = state.map((toast) =>
        toast.id === action.payload.assessmentTemplateId
          ? {
              ...toast,
              status: 'SUCCESS',
            }
          : toast
      );
      return toasts;
    }
    case 'UPDATE_TEMPLATE_FAILURE': {
      const toasts: $PropertyType<Store, 'toasts'> = state.map((toast) =>
        toast.id === action.payload.assessmentTemplateId
          ? {
              ...toast,
              status: 'ERROR',
            }
          : toast
      );
      return toasts;
    }
    case 'REMOVE_TOAST': {
      const toasts: $PropertyType<Store, 'toasts'> = state.filter(
        (toast) => toast.id !== action.payload.toastId
      );
      return toasts;
    }
    default:
      return state;
  }
}
