// @flow

import { createSelector } from '@reduxjs/toolkit';
import {
  initialState,
  REDUCER_KEY,
} from '@kitman/modules/src/Messaging/src/redux/slices/messagingSlice';

const getMessagingSlice = (state) => state[REDUCER_KEY] ?? initialState;

export const getTotalUnreadCount = createSelector(
  [getMessagingSlice],
  (messagingSlice) => {
    return messagingSlice.totalUnread;
  }
);
