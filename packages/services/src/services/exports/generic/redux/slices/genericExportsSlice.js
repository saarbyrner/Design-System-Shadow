// @flow

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Field } from '@kitman/services/src/services/exports/generic/redux/services/types';

export type GenericExportsState = {
  exportableFields: Array<Field>,
};

export const REDUCER_KEY: string = 'genericExportsSlice';

type OnBuildExportableFieldsStateAction = {
  payload: Array<Field>,
};

const initialState: GenericExportsState = {
  exportableFields: [],
};

const genericExportsSlice = createSlice({
  name: REDUCER_KEY,
  initialState,
  reducers: {
    onReset: () => initialState,
    onBuildExportableFieldsState: (
      state: GenericExportsState,
      action: PayloadAction<OnBuildExportableFieldsStateAction>
    ) => {
      state.exportableFields = action.payload;
    },
  },
});

export const { onReset, onBuildExportableFieldsState } =
  genericExportsSlice.actions;
export default genericExportsSlice;
