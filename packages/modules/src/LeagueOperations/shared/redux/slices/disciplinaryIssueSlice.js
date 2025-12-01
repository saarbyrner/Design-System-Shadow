// @flow
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  DisciplinaryIssueMode,
  DisciplineProfile,
  DisciplineActiveIssue,
} from '@kitman/modules/src/LeagueOperations/shared/types/discipline';
import { CREATE_DISCIPLINARY_ISSUE } from '@kitman/modules/src/LeagueOperations/shared/consts';

export type DisciplinaryIssueState = {
  panel: {
    isOpen: boolean,
    profile: ?DisciplineProfile,
    userToBeDisciplined: ?DisciplineProfile,
    mode: DisciplinaryIssueMode,
  },
  modal: {
    isOpen: boolean,
    text: string,
  },
  issue: {
    user_id: ?number,
    reason_ids: ?Array<number>,
    competition_ids: ?Array<number>,
    start_date: ?string,
    end_date: ?string,
    note: ?string,
    kind?: ?string,
    squad_id?: ?number,
    number_of_games?: ?number,
  },
  active_discipline: ?DisciplineActiveIssue,
};

export const initialState: DisciplinaryIssueState = {
  panel: {
    isOpen: false,
    profile: null,
    userToBeDisciplined: null,
    mode: CREATE_DISCIPLINARY_ISSUE,
  },
  modal: {
    isOpen: false,
    text: '',
  },
  issue: {
    user_id: null,
    reason_ids: [],
    competition_ids: [],
    start_date: null,
    end_date: null,
    note: '',
    kind: 'date_range',
    squad_id: null,
    number_of_games: null,
  },
  active_discipline: null,
};

export type OnSetPanelState = {
  payload: {
    isOpen: boolean,
    mode?: string,
  },
};

export type OnSetModalState = {
  payload: {
    isOpen: boolean,
    text?: string,
  },
};

export type OnSetDisciplineProfile = {
  payload: {
    profile: DisciplineProfile,
  },
};

export type OnSetUserToBeDisciplined = {
  payload: {
    userToBeDisciplined: DisciplineProfile,
  },
};

type OnSetDisciplinaryIssueDetails = {
  payload: {
    user_id?: number,
    reason_ids?: Array<number>,
    start_date?: string,
    end_date?: string,
    note?: string,
    kind?: string,
    squad_id?: number,
    number_of_games?: number,
  },
};

export type OnSetActiveDiscipline = {
  payload: {
    active_discipline: DisciplineActiveIssue,
  },
};

export const REDUCER_KEY: string = 'LeagueOperations.discipline.slice.manage';

const disciplinaryIssueSlice = createSlice({
  name: REDUCER_KEY,
  initialState,
  reducers: {
    onTogglePanel: (
      state: DisciplinaryIssueState,
      action: PayloadAction<OnSetPanelState>
    ) => {
      state.panel.isOpen = action.payload.isOpen;
      state.panel.mode = action.payload?.mode || CREATE_DISCIPLINARY_ISSUE;
    },
    onToggleModal: (
      state: DisciplinaryIssueState,
      action: PayloadAction<OnSetModalState>
    ) => {
      state.modal.isOpen = action.payload.isOpen;
      state.modal.text = action.payload?.text;
    },
    onSetDisciplineProfile: (
      state: DisciplinaryIssueState,
      action: PayloadAction<OnSetDisciplineProfile>
    ) => {
      state.panel.profile = action.payload.profile;
    },
    onSetUserToBeDisciplined: (
      state: DisciplinaryIssueState,
      action: PayloadAction<OnSetUserToBeDisciplined>
    ) => {
      state.panel.userToBeDisciplined = action.payload.userToBeDisciplined;
    },
    onSetDisciplinaryIssueDetails: (
      state: DisciplinaryIssueState,
      action: PayloadAction<OnSetDisciplinaryIssueDetails>
    ) => {
      state.issue = {
        ...state.issue,
        ...action.payload,
      };
    },
    onSetActiveDisciplineIssue: (
      state: DisciplinaryIssueState,
      action: PayloadAction<OnSetActiveDiscipline>
    ) => {
      state.active_discipline = action.payload.active_discipline;
    },
    onReset: () => initialState,
  },
});

export const {
  onTogglePanel,
  onToggleModal,
  onSetDisciplineProfile,
  onSetUserToBeDisciplined,
  onSetDisciplinaryIssueDetails,
  onSetActiveDisciplineIssue,
  onReset,
} = disciplinaryIssueSlice.actions;
export default disciplinaryIssueSlice;
