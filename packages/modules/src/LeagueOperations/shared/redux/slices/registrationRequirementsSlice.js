// @flow
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import {
  type User,
  type SectionFormElement,
  type RegistrationStatus,
  type RegistrationSystemStatus,
  FALLBACK_REGISTRATION_SYSTEM_STATUS,
} from '@kitman/modules/src/LeagueOperations/shared/types/common';
import type { SectionStatusesType } from '@kitman/modules/src/LeagueOperations/shared/services/fetchSectionStatuses';

export type RegistrationRequirementState = {
  requirementId: ?number,
  userId: ?number,
  profile: ?User,
  panel: {
    isOpen: boolean,
    formElement: ?SectionFormElement,
    status: RegistrationStatus,
    registrationSystemStatus: RegistrationSystemStatus,
    sectionId: ?number,
  },
  approval: {
    status: ?RegistrationStatus,
    annotation: string,
  },
  statuses: ?SectionStatusesType,
};

export const initialState: RegistrationRequirementState = {
  requirementId: null,
  userId: null,
  profile: null,
  panel: {
    isOpen: false,
    formElement: null,
    status: null,
    registrationSystemStatus: FALLBACK_REGISTRATION_SYSTEM_STATUS,
    sectionId: null,
  },
  approval: {
    status: null,
    annotation: '',
  },
  statuses: null,
};

type OnSetRequirementParams = {
  payload: {
    requirementId: number,
    userId: number,
  },
};

type OnSetProfile = {
  payload: {
    profile: User,
  },
};

type OnSetPanelState = {
  payload: {
    isOpen: boolean,
    formElement: ?SectionFormElement,
    status: RegistrationStatus,
    registrationSystemStatus: RegistrationSystemStatus,
    sectionId: ?number,
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

type OnSetSectionStatuses = {
  payload: {
    statuses: SectionStatusesType,
  },
};

export const REDUCER_KEY: string =
  'LeagueOperations.registration.slice.requirements';

const registrationRequirementsSlice = createSlice({
  name: REDUCER_KEY,
  initialState,
  reducers: {
    onSetRequirementParams: (
      state: RegistrationRequirementState,
      action: PayloadAction<OnSetRequirementParams>
    ) => {
      state.requirementId = action.payload.requirementId;
      state.userId = action.payload.userId;
    },
    onSetProfile: (
      state: RegistrationRequirementState,
      action: PayloadAction<OnSetProfile>
    ) => {
      state.profile = action.payload.profile;
    },
    onTogglePanel: (
      state: RegistrationRequirementState,
      action: PayloadAction<OnSetPanelState>
    ) => {
      state.panel.isOpen = action.payload.isOpen;
      state.panel.formElement = action.payload.isOpen
        ? action.payload.formElement
        : null;
      state.panel.status = action.payload.isOpen ? action.payload.status : null;
      state.panel.registrationSystemStatus = action.payload.isOpen
        ? action.payload.registrationSystemStatus ??
          FALLBACK_REGISTRATION_SYSTEM_STATUS
        : FALLBACK_REGISTRATION_SYSTEM_STATUS;
      state.panel.sectionId = action.payload.isOpen
        ? action.payload.sectionId
        : null;
      state.approval = {
        status: null,
        annotation: '',
      };
    },
    // TODO: update this to use registration_system_status
    onSetApprovalStatus: (
      state: RegistrationRequirementState,
      action: PayloadAction<OnSetApprovalStatus>
    ) => {
      state.approval.status = action.payload.status;
    },
    onSetApprovalAnnotation: (
      state: RegistrationRequirementState,
      action: PayloadAction<OnSetApprovalAnnotation>
    ) => {
      state.approval.annotation = action.payload.annotation;
    },
    onSetSectionStatuses: (
      state: RegistrationRequirementState,
      action: PayloadAction<OnSetSectionStatuses>
    ) => {
      state.statuses = action.payload.statuses;
    },
    onReset: () => initialState,
  },
});

export const {
  onSetRequirementParams,
  onSetProfile,
  onReset,
  onTogglePanel,
  onSetApprovalStatus,
  onSetApprovalAnnotation,
  onSetSectionStatuses,
} = registrationRequirementsSlice.actions;
export default registrationRequirementsSlice;
