// @flow
import { createSlice } from '@reduxjs/toolkit';
import type { State, PayloadAction } from '@reduxjs/toolkit';
import type { AllocationAttribute } from '@kitman/modules/src/ElectronicFiles/shared/types';
import type { Attachment } from '@kitman/modules/src/Medical/shared/types';

type DialogSlice = {
  open: boolean,
  allocations: Array<AllocationAttribute>,
  attachments: Array<Attachment>,
};

export const initialState: DialogSlice = {
  open: false,
  allocations: [],
  attachments: [],
};

export const REDUCER_KEY: string = 'dialogSlice';

const dialogSlice = createSlice({
  name: REDUCER_KEY,
  initialState,
  reducers: {
    updateOpen: (state: DialogSlice, action: PayloadAction<boolean>) => {
      state.open = action.payload;
    },
    updateAttachments: (
      state: DialogSlice,
      action: PayloadAction<Array<Attachment>>
    ) => {
      state.attachments = action.payload;
    },
    updateAllocations: (
      state: DialogSlice,
      action: PayloadAction<Array<AllocationAttribute>>
    ) => {
      state.allocations = action.payload;
    },
    reset: () => initialState,
  },
});

export const { updateOpen, updateAllocations, updateAttachments, reset } =
  dialogSlice.actions;

export const selectOpen = (state: State) => state.dialogSlice.open;
export const selectAttachments = (state: State) =>
  state.dialogSlice.attachments;
export const selectAllocations = (state: State) =>
  state.dialogSlice.allocations;

export default dialogSlice;
