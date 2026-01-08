// @flow
import { createSlice } from '@reduxjs/toolkit';

// Types
import type { State, PayloadAction } from '@reduxjs/toolkit';
import type { Option } from '@kitman/playbook/types';
import type {
  DetailsGridRowData,
  DeleteRowPayload,
  SetupDefaultsPayload,
  UpdateRowPayload,
} from '@kitman/components/src/DocumentSplitter/src/shared/types';

type DetailsGridSlice = {
  defaults: {
    defaultCategories: Array<Option>,
    defaultAssociatedIssues: Array<Option>,
    defaultFileName: string,
    defaultDateOfDocument: string,
    defaultHasConstraintsError: boolean,
  },
  dataRows: Array<DetailsGridRowData>,
  preselectedPlayer: ?Option,
};

export const initialState: DetailsGridSlice = {
  defaults: {
    defaultCategories: [],
    defaultAssociatedIssues: [],
    defaultFileName: '',
    defaultDateOfDocument: '',
    defaultHasConstraintsError: false,
  },
  preselectedPlayer: null,
  dataRows: [],
};

export const REDUCER_KEY: string = 'documentSplitterDetailsGridSlice';

const detailsGridSlice = createSlice({
  name: REDUCER_KEY,
  initialState,
  reducers: {
    reset: (state: DetailsGridSlice, action: PayloadAction<?Option>) => ({
      ...initialState,
      preselectedPlayer: action.payload ?? null,
    }),

    addRow: (state: DetailsGridSlice) => {
      state.dataRows.push({
        id: state.dataRows.length
          ? state.dataRows[state.dataRows.length - 1].id + 1
          : 1,
        pages: '',
        player: state.preselectedPlayer ?? undefined,
        categories: state.defaults.defaultCategories
          ? [...state.defaults.defaultCategories]
          : [],
        fileName: state.defaults.defaultFileName,
        dateOfDocument: state.defaults.defaultDateOfDocument,
        associatedIssues: state.defaults.defaultAssociatedIssues,
        hasConstraintsError: state.defaults.defaultHasConstraintsError,
      });
    },
    deleteRow: (
      state: DetailsGridSlice,
      action: PayloadAction<DeleteRowPayload>
    ) => {
      const index = state.dataRows.findIndex(
        (row) => row.id === action.payload.rowId
      );
      if (index !== -1) {
        state.dataRows.splice(index, 1);
      }
    },
    setRows: (
      state: DetailsGridSlice,
      action: PayloadAction<Array<DetailsGridRowData>>
    ) => {
      state.dataRows = action.payload;
    },
    setupDefaults: (
      state: DetailsGridSlice,
      action: PayloadAction<SetupDefaultsPayload>
    ) => {
      state.defaults = action.payload;
    },
    updateRow: (
      state: DetailsGridSlice,
      action: PayloadAction<UpdateRowPayload>
    ) => {
      const index = state.dataRows.findIndex(
        (row) => row.id === action.payload.rowId
      );
      if (index !== -1) {
        state.dataRows[index] = {
          ...state.dataRows[index],
          ...action.payload.data,
        };
      }
    },
  },
});

export const { setRows, addRow, deleteRow, updateRow, setupDefaults, reset } =
  detailsGridSlice.actions;

export const selectDataRows = (state: State) => state.detailsGridSlice.dataRows;

export default detailsGridSlice;
