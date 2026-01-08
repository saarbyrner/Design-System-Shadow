/* eslint-disable no-param-reassign */
// @flow

import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import { reducerKey } from '../consts';
import type { Filters, SetFilterActionPayload } from '../types';
import { initialFilters } from '../../utils/consts';
import { readFiltersFromLocalStorage } from '../../utils/helpers';

export const getInitialState = () => {
  const filtersFromLocalStorage = readFiltersFromLocalStorage();

  if (!filtersFromLocalStorage) {
    return initialFilters;
  }
  return { ...initialFilters, ...filtersFromLocalStorage };
};

export const filtersSlice = createSlice({
  name: reducerKey,
  initialState: getInitialState(),
  reducers: {
    setFilter: (
      state: Filters,
      { payload: { key, value } }: PayloadAction<SetFilterActionPayload>
    ) => {
      state[key] = value;
    },
  },
});

export const { setFilter } = filtersSlice.actions;

export default filtersSlice.reducer;
