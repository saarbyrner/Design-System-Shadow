// @flow
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import type { KitMatrix } from '@kitman/services/src/services/kitMatrix/searchKitMatrices';

export type KitManagementState = {
  panel: {
    isOpen: boolean,
  },
  modal: {
    isOpen: boolean,
    mode: string,
  },
  selectedRow: ?KitMatrix,
  selectedRows: Array<KitMatrix>,
};

export const initialState: KitManagementState = {
  panel: {
    isOpen: false,
  },
  modal: {
    isOpen: false,
    mode: '',
  },
  selectedRow: null,
  selectedRows: [],
};

export type OnSetPanelState = {
  payload: {
    isOpen: boolean,
  },
};

export type OnSetModalState = {
  payload: {
    isOpen: boolean,
    mode: string,
  },
};

export type OnSetSelectedRow = {
  payload: {
    selectedRow: ?KitMatrix,
  },
};

export type OnSetSelectedRows = {
  payload: {
    selectedRows: Array<KitMatrix>,
  },
};

export const REDUCER_KEY: string = 'kitManagement.slice';

export type Store = {
  'kitManagement.slice': KitManagementState,
};

const kitManagementSlice = createSlice({
  name: REDUCER_KEY,
  initialState,
  reducers: {
    onTogglePanel: (
      state: KitManagementState,
      action: PayloadAction<OnSetPanelState>
    ) => {
      state.panel = {
        ...state.panel,
        ...action.payload,
      };
    },
    onToggleModal: (
      state: KitManagementState,
      action: PayloadAction<OnSetModalState>
    ) => {
      state.modal = {
        ...state.modal,
        ...action.payload,
      };
    },
    onSetSelectedRow: (
      state: KitManagementState,
      action: PayloadAction<OnSetSelectedRow>
    ) => {
      state.selectedRow = action.payload.selectedRow;
    },
    onSetSelectedRows: (
      state: KitManagementState,
      action: PayloadAction<OnSetSelectedRows>
    ) => {
      state.selectedRows = action.payload.selectedRows;
    },
    onReset: () => initialState,
  },
});
export const {
  onTogglePanel,
  onToggleModal,
  onSetSelectedRow,
  onSetSelectedRows,
  onReset,
} = kitManagementSlice.actions;
export default kitManagementSlice;
