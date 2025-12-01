// @flow
import { createSlice } from '@reduxjs/toolkit';
import _uniqueId from 'lodash/uniqueId';
import type { State, PayloadAction } from '@reduxjs/toolkit';
import type { ToastId, Toast } from '@kitman/components/src/types';
import type { Dispatch } from '@kitman/common/src/types';

export const toastAddType = 'toasts/add';
export const toastRemoveType = 'toasts/remove';

type ToastsSlice = {
  value: Array<Toast>,
};

const initialState: ToastsSlice = {
  value: [],
};

export const toastsSlice = createSlice({
  name: 'toasts',
  initialState,
  reducers: {
    add: (state: State, action: PayloadAction<Toast>) => {
      state.value.push({
        id: action.payload.id ?? _uniqueId(),
        ...action.payload,
      });
    },
    remove: (state: State, action: PayloadAction<ToastId>) => {
      state.value = state.value.filter(({ id }) => action.payload !== id);
    },
    reset: () => initialState,
  },
});

export const { add, remove, reset } = toastsSlice.actions;
export type ToastDispatch = Dispatch<typeof remove | typeof add | typeof reset>;
export const selectToasts = (state: State) => state.toastsSlice.value;
export default toastsSlice;
