// @flow
import i18n from '@kitman/common/src/utils/i18n';
import type { ActionCreator, ModalStatus } from '@kitman/common/src/types';

type ModalState = {
  status: ModalStatus,
  message: string,
  hideButtonText: string,
};

const modal = (state: ModalState = {}, action: ActionCreator) => {
  switch (action.type) {
    case 'SAVE_QUESTIONNAIRE_REQUEST':
      return Object.assign({}, state, {
        status: 'loading',
      });
    case 'SAVE_QUESTIONNAIRE_SUCCESS':
      return Object.assign({}, state, {
        status: 'success',
        message: i18n.t('Success'),
      });
    case 'SAVE_QUESTIONNAIRE_FAILURE':
      return Object.assign({}, state, {
        status: 'error',
      });
    case 'SAVE_QUESTIONNAIRE_UNCHECKED_ERROR':
      return Object.assign({}, state, {
        status: 'validationError',
        message: i18n.t(
          'At least one variable must be selected for each athlete'
        ),
        hideButtonText: i18n.t('Got it'),
      });
    case 'HIDE_CURRENT_MODAL':
      return Object.assign({}, state, {
        status: null,
        message: null,
        hideButtonText: null,
      });
    default:
      return state;
  }
};

export default modal;
