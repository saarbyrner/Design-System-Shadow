// @flow
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { NewHomegrown } from '@kitman/modules/src/LeagueOperations/shared/types/common';

export type HomegrownSlice = {
  homegrownPanel: {
    isOpen: boolean,
  },
  homegrownSubmission: NewHomegrown,
};

export const initialState: HomegrownSlice = {
  homegrownPanel: {
    isOpen: false,
  },
  homegrownSubmission: {
    title: '',
    certified_by: '',
    submitted_by: null,
    date_submitted: '',
    homegrown_document: null,
    certified_document: null,
  },
};

export type OnSetHomegrownModalState = {
  payload: {
    isOpen: boolean,
  },
};

export type OnChangeHomegrownSubmissionState = {
  payload: {
    homegrownSubmission: NewHomegrown,
  },
};

export const REDUCER_KEY: string =
  'LeagueOperations.registration.slice.homegrown';

const homegrownSlice = createSlice({
  name: REDUCER_KEY,
  initialState,
  reducers: {
    onToggleHomegrownPanel: (
      state: HomegrownSlice,
      action: PayloadAction<OnSetHomegrownModalState>
    ) => {
      state.homegrownPanel.isOpen = action.payload.isOpen;
    },
    onHomegrownSubmissionChange: (
      state,
      action: PayloadAction<OnChangeHomegrownSubmissionState>
    ) => {
      state.homegrownSubmission = {
        ...state.homegrownSubmission,
        ...action.payload,
      };
    },
    onResetSubmission: (state) => {
      state.homegrownSubmission = initialState.homegrownSubmission;
    },
    onReset: () => initialState,
  },
});

export const {
  onToggleHomegrownPanel,
  onHomegrownSubmissionChange,
  onResetSubmission,
  onReset,
} = homegrownSlice.actions;
export default homegrownSlice;
