// @flow
import type { Action } from '../types/actions';

export const closeReorderModal = (): Action => ({
  type: 'CLOSE_REORDER_MODAL',
});

export const openReorderModal = (): Action => ({
  type: 'OPEN_REORDER_MODAL',
});
