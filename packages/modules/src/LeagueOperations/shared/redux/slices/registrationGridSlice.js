// @flow
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export type ApprovalStatus = 'approved' | 'unapproved' | typeof undefined;
export type ReasonId = number | typeof undefined;
export type Annotation = string;
export type ApprovalState = {
  status: ApprovalStatus,
  reasonId: ReasonId,
  annotation: Annotation,
};

export type BulkActionsState = {
  selectedAthleteIds: Array<{ id: number, userId: number }>,
  selectedLabelIds: Array<number>,
  originalSelectedLabelIds: Array<number>,
};
export type RegistrationGridState = {
  grids: Object,
  modal: {
    isOpen: boolean,
    action?: string,
    text?: {
      header?: string,
      body?: string,
      secondaryBody?: string,
      ctaText?: string,
    },
  },
  panel: {
    isOpen: boolean,
  },
  approvalState: ApprovalState,
  selectedRow: {} | null,
  bulkActions: BulkActionsState,
};

export const initialState: RegistrationGridState = {
  grids: null,
  modal: {
    isOpen: false,
    action: '',
    text: {},
  },
  panel: {
    isOpen: false,
  },
  approvalState: {
    status: undefined,
    reasonId: undefined,
    annotation: '',
  },
  selectedRow: {},
  bulkActions: {
    selectedAthleteIds: [],
    originalSelectedLabelIds: [],
    selectedLabelIds: [],
  },
};
type OnSetGrids = {
  payload: {
    grids: Object,
  },
};

export type ModalAction =
  | 'expire_registration'
  | 'change_approval_status'
  | 'update_unapproval_status_annotation'
  | 'register_non_reg_player';

export type OnSetModalState = {
  payload: {
    isOpen: boolean,
    action?: ModalAction,
    text?: {
      header?: string,
      body?: string,
      secondaryBody?: string,
      ctaText?: string,
    },
  },
};
export type OnSetSelectedAthleteIds = {
  payload: {
    selectedAthleteIds: Array<{ id: number, userId: number }>,
  },
};

export type OnSetSelectedLabelIds = {
  payload: {
    selectedLabelIds: Array<number>,
  },
};
export type OnSetOriginalSelectedLabelIds = {
  payload: {
    originalSelectedLabelIds: Array<number>,
  },
};

export type OnSetPanelState = {
  payload: {
    isOpen: boolean,
  },
};

export type OnSetApprovalState = {
  payload: {
    status: ApprovalStatus,
    reasonId: ReasonId,
    annotation: Annotation,
  },
};

export type OnSetSelectedRows = {
  payload: {
    selectedRow: {},
  },
};

export const REDUCER_KEY: string = 'LeagueOperations.registration.slice.grids';

const registrationGridSlice = createSlice({
  name: REDUCER_KEY,
  initialState,
  reducers: {
    onSetGrids: (
      state: RegistrationGridState,
      action: PayloadAction<OnSetGrids>
    ) => {
      state.grids = action.payload.grids;
    },
    onToggleModal: (
      state: RegistrationGridState,
      action: PayloadAction<OnSetModalState>
    ) => {
      state.modal.isOpen = action.payload.isOpen;
      state.modal.text = action.payload?.text;
      state.modal.action = action.payload?.action;
    },
    onTogglePanel: (
      state: RegistrationGridState,
      action: PayloadAction<OnSetPanelState>
    ) => {
      state.panel.isOpen = action.payload.isOpen;
    },
    onSetApprovalState: (
      state: RegistrationGridState,
      action: PayloadAction<OnSetApprovalState>
    ) => {
      state.approvalState = action.payload;
    },
    setSelectedRow: (
      state: RegistrationGridState,
      action: PayloadAction<OnSetSelectedRows>
    ) => {
      state.selectedRow = action.payload;
    },
    onSetSelectedLabelIds: (
      state: RegistrationGridState,
      action: PayloadAction<OnSetSelectedLabelIds>
    ) => {
      state.bulkActions.selectedLabelIds = action.payload;
    },
    onSetOriginalSelectedLabelIds: (
      state: RegistrationGridState,
      action: PayloadAction<OnSetOriginalSelectedLabelIds>
    ) => {
      state.bulkActions.originalSelectedLabelIds = action.payload;
    },
    onSetSelectedAthleteIds: (
      state: RegistrationGridState,
      action: PayloadAction<OnSetSelectedAthleteIds>
    ) => {
      state.bulkActions.selectedAthleteIds = action.payload;
    },
    onReset: () => initialState,
  },
});

export const {
  onSetGrids,
  onReset,
  onToggleModal,
  onTogglePanel,
  setSelectedRow,
  onSetApprovalState,
  onSetSelectedLabelIds,
  onSetOriginalSelectedLabelIds,
  onSetSelectedAthleteIds,
} = registrationGridSlice.actions;
export default registrationGridSlice;
