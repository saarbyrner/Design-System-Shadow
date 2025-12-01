// @flow

import type { Action } from '../types/actions';

export const showCancelConfirm = (): Action => ({
  type: 'SHOW_CANCEL_CONFIRM',
});

export const hideAppStatus = (): Action => ({
  type: 'HIDE_APP_STATUS',
});
