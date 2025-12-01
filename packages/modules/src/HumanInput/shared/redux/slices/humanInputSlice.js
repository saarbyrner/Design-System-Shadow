// @flow
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export const REDUCER_KEY: string = 'humanInputSlice';

export type Field = {
  object: string,
  field: string,
  address?: string,
  group: string,
};
export type ExportFormState = {
  filename: string,
  fields: Array<Field>,
  ids: Array<number>,
};

type OnUpdateExportFormAction = {
  payload: $Shape<ExportFormState>,
};
export type ExportSidePanelState = {
  isOpen: boolean,
  form: ExportFormState,
};

export type HumanInputState = {
  exportSidePanel: ExportSidePanelState,
};

export const initialState: HumanInputState = {
  exportSidePanel: {
    isOpen: false,
    form: {
      filename: '',
      fields: [],
      ids: [],
    },
  },
};

const humanInputSlice = createSlice({
  name: REDUCER_KEY,
  initialState,
  reducers: {
    onOpenExportSidePanel: (state: HumanInputState) => {
      state.exportSidePanel.isOpen = true;
    },
    onCloseExportSidePanel: (state: HumanInputState) => {
      state.exportSidePanel.isOpen = false;
    },
    onUpdateExportForm: (
      state: HumanInputState,
      action: PayloadAction<OnUpdateExportFormAction>
    ) => {
      state.exportSidePanel.form = {
        ...state.exportSidePanel.form,
        ...action.payload,
      };
    },
  },
});

export const {
  onOpenExportSidePanel,
  onCloseExportSidePanel,
  onUpdateExportForm,
} = humanInputSlice.actions;
export default humanInputSlice;
