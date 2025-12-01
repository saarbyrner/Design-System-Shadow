// @flow
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selections: {
    club: { label: '', value: '' },
    season: { label: '', value: '' },
    window: { label: '', value: '' },
  },
  title: null,
};

const benchmarkTestValidationSlice = createSlice({
  name: 'benchmarkTestValidation',
  initialState,
  reducers: {
    onSelection: (state, action) => {
      state.selections[action.payload.type] = {
        label: action.payload.value,
        value: action.payload.value,
      };
    },
    resetSelections: (state) => {
      state.selections = initialState.selections;
      state.title = initialState.title;
    },
  },
});

export const { onSelection, resetSelections } =
  benchmarkTestValidationSlice.actions;
export default benchmarkTestValidationSlice;
