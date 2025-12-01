// @flow
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { MessagingState } from '@kitman/modules/src/Messaging/src/types';

export const initialState: MessagingState = {
  totalUnread: 0,
  conversationMap: {},
};

export const REDUCER_KEY = 'messagingSlice';

const messagingSlice = createSlice({
  name: REDUCER_KEY,
  initialState,
  reducers: {
    setConversationUnread: (
      state,
      action: PayloadAction<{ sid: string, count: number }>
    ) => {
      const { sid, count } = action.payload;
      const prevCount = state.conversationMap[sid] ?? 0;

      state.conversationMap[sid] = count;
      // Update totalUnread
      state.totalUnread += count - prevCount;
    },
    removeConversation: (state, action: PayloadAction<{ sid: string }>) => {
      const { sid } = action.payload;
      const prevCount = state.conversationMap[sid];

      if (typeof prevCount === 'number') {
        delete state.conversationMap[sid];
        // Update totalUnread
        state.totalUnread = Math.max(0, state.totalUnread - prevCount);
      }
    },
    reset: () => initialState,
  },
});

export const { setConversationUnread, removeConversation, reset } =
  messagingSlice.actions;

export default messagingSlice;
