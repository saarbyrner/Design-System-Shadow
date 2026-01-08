// @flow
import type { Action } from './types';

const closeToastItem = (itemId: number): Action => ({
  type: 'CLOSE_TOAST_ITEM',
  payload: {
    itemId,
  },
});

export default closeToastItem;
