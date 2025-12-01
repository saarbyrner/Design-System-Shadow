// @flow
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RegistrationStatus } from '@kitman/modules/src/LeagueOperations/shared/types/common';
import type { ApplicationStatusesType } from '@kitman/modules/src/LeagueOperations/shared/services/fetchApplicationStatuses';

export type RegistrationApprovalState = {
  panel: {
    isOpen: boolean,
  },
  approval: {
    status: ?RegistrationStatus,
    annotation: string,
  },
  statuses: ?ApplicationStatusesType
};

export const initialState: RegistrationApprovalState = {
  panel: {
    isOpen: false,
  },
  approval: {
    status: null,
    annotation: '',
  },
  statuses: null
};

type OnSetPanelState = {
  payload: {
    isOpen: boolean,
  },
};

type OnSetApprovalStatus = {
  payload: {
    status: RegistrationStatus,
  },
};

type OnSetApprovalAnnotation = {
  payload: {
    annotation: string,
  },
};

type OnSetApplicationStatuses = {
  payload: {
    statuses: ApplicationStatusesType,
  },
};

export const REDUCER_KEY: string =
  'LeagueOperations.registration.slice.approval';

const registrationApprovalSlice = createSlice({
  name: REDUCER_KEY,
  initialState,
  reducers: {
    onTogglePanel: (
      state: RegistrationApprovalState,
      action: PayloadAction<OnSetPanelState>
    ) => {
      state.panel.isOpen = action.payload.isOpen;
    },
    onSetApprovalStatus: (
      state: RegistrationApprovalState,
      action: PayloadAction<OnSetApprovalStatus>
    ) => {
      state.approval.status = action.payload.status;
    },
    onSetApprovalAnnotation: (
      state: RegistrationApprovalState,
      action: PayloadAction<OnSetApprovalAnnotation>
    ) => {
      state.approval.annotation = action.payload.annotation;
    },
    onSetApplicationStatuses: (
      state: RegistrationApprovalState,
      action: PayloadAction<OnSetApplicationStatuses>
    ) => {
      state.statuses = action.payload.statuses;
    },
    onReset: () => initialState,
  },
});

export const {
  onReset,
  onTogglePanel,
  onSetApprovalStatus,
  onSetApprovalAnnotation,
  onSetApplicationStatuses,
} = registrationApprovalSlice.actions;
export default registrationApprovalSlice;
