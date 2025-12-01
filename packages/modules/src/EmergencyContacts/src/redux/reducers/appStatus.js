// @flow
import i18n from '@kitman/common/src/utils/i18n';
import type { AppStatusState, Action } from '../../types';

export const REDUCER_KEY: string = 'emergencyContactsAppStatus';

export default (state: AppStatusState = {}, action: Action): AppStatusState => {
  switch (action.type) {
    case 'HIDE_APP_STATUS': {
      return {
        ...state,
        status: null,
        message: null,
      };
    }
    case 'LOADING_EMERGENCY_CONTACTS': {
      return {
        ...state,
        status: 'loading',
        message: i18n.t('Loading'),
      };
    }
    case 'SAVING_EMERGENCY_CONTACT': {
      return {
        ...state,
        status: 'loading',
        message: i18n.t('Saving contact'),
      };
    }
    case 'DELETING_EMERGENCY_CONTACT': {
      return {
        ...state,
        status: 'loading',
        message: i18n.t('Deleting contact'),
      };
    }
    default:
      return state;
  }
};
