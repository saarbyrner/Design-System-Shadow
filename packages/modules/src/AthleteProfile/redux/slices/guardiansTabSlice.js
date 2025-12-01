// @flow
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type Mode } from '@kitman/modules/src/HumanInput/types/forms';
import { MODES } from '@kitman/modules/src/HumanInput/shared/constants';

export const REDUCER_KEY: string = 'guardiansTabSlice';

export type GuardianForm = {
  id?: string,
  name?: string,
  first_name?: string,
  surname?: string,
  email: string,
};

export type DeleteGuardianForm = {
  id: string,
  name: string,
  email: string,
};

export type GuardianSidePanelState = {
  isOpen: boolean,
  mode: Mode,
  form: GuardianForm | null,
};

export type DeleteGuardianModalState = {
  isOpen: boolean,
  form: DeleteGuardianForm | null,
};

export type GuardiansTabState = {
  guardianSidePanel: GuardianSidePanelState,
  deleteGuardianModal: DeleteGuardianModalState,
};

type OnSetModeAction = {
  payload: {
    mode: Mode,
  },
};

const initialState: GuardiansTabState = {
  guardianSidePanel: {
    isOpen: false,
    mode: MODES.CREATE,
    form: {
      name: '',
      first_name: '',
      surname: '',
      email: '',
    },
  },
  deleteGuardianModal: {
    isOpen: false,
    form: {
      id: '',
      name: '',
      email: '',
    },
  },
};

const guardiansTabSlice = createSlice({
  name: REDUCER_KEY,
  initialState,
  reducers: {
    onOpenGuardianSidePanel: (state: GuardiansTabState) => {
      state.guardianSidePanel.isOpen = true;
    },
    onCloseGuardianSidePanel: (state: GuardiansTabState) => {
      state.guardianSidePanel.isOpen = false;
    },
    onOpenDeleteGuardianModal: (state: GuardiansTabState) => {
      state.deleteGuardianModal.isOpen = true;
    },
    onCloseDeleteGuardianModal: (state: GuardiansTabState) => {
      state.deleteGuardianModal.isOpen = false;
    },
    onUpdateGuardianForm: (
      state: GuardiansTabState,
      action: PayloadAction<$Shape<GuardianForm>>
    ) => {
      if (state.guardianSidePanel.form) {
        state.guardianSidePanel.form = {
          ...state.guardianSidePanel.form,
          ...action.payload,
        };
      }
    },
    onDeleteGuardianForm: (
      state: GuardiansTabState,
      action: PayloadAction<$Shape<GuardianForm>>
    ) => {
      if (state.deleteGuardianModal.form) {
        state.deleteGuardianModal.form = {
          ...state.deleteGuardianModal.form,
          ...action.payload,
        };
      }
    },
    onSetMode: (state: GuardiansTabState, action: OnSetModeAction) => {
      state.guardianSidePanel.mode = action.payload.mode;
    },
    onResetSidePanelForm: (state: GuardiansTabState) => {
      state.guardianSidePanel = initialState.guardianSidePanel;
    },
    onResetDeleteGuardianModalForm: (state: GuardiansTabState) => {
      state.deleteGuardianModal = initialState.deleteGuardianModal;
    },
  },
});

export const {
  onOpenGuardianSidePanel,
  onCloseGuardianSidePanel,
  onOpenDeleteGuardianModal,
  onCloseDeleteGuardianModal,
  onUpdateGuardianForm,
  onDeleteGuardianForm,
  onSetMode,
  onResetSidePanelForm,
  onResetDeleteGuardianModalForm,
} = guardiansTabSlice.actions;
export default guardiansTabSlice;
