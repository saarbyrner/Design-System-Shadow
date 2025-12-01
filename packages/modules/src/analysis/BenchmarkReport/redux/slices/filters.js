/* eslint-disable no-param-reassign */
// @flow
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import { DEFAULT_BIO_BAND_RANGE } from '@kitman/modules/src/analysis/BenchmarkReport/consts';

export type CompareToFilter = {
  athlete_ids: Array<number>,
  seasons?: Array<number>,
  testing_window_ids?: Array<number>,
};

export type Filters = {
  training_variable_ids: Array<number>,
  seasons?: Array<number>,
  testing_window_ids?: Array<number>,
  age_group_ids: Array<number> | null,
  bio_band_range: Array<number>,
  maturation_status_ids?: Array<number>,
  position_ids?: Array<number>,
  national_results: boolean,
  club_results: boolean,
  compare_to?: CompareToFilter,
};

export type FiltersState = {
  editable: Filters,
  active: Filters,
};

export type FilterKey = $Keys<Filters>;
export type FiltersValue = $Values<Filters>;

const emptyFilters = {
  training_variable_ids: [],
  seasons: [],
  testing_window_ids: [],
  age_group_ids: null,
  bio_band_range: DEFAULT_BIO_BAND_RANGE,
  maturation_status_ids: [],
  position_ids: [],
  national_results: true,
  club_results: false,
  compare_to: {
    athlete_ids: [],
    seasons: [],
    testing_window_ids: [],
  },
};

export const initialState: FiltersState = {
  editable: {
    ...emptyFilters,
  },
  active: {
    ...emptyFilters,
  },
};

const compareToInitialState: CompareToFilter = { ...emptyFilters.compare_to };

type SetFilterActionPayload = {
  key: FilterKey,
  value: FiltersValue,
};

export type ReducerKeyType = 'benchmarkReportFilters';

export const REDUCER_KEY: ReducerKeyType = 'benchmarkReportFilters';

const benchmarkReportSlice = createSlice({
  name: 'benchmarkReportFilters',
  initialState,
  reducers: {
    setFilter(
      state: FiltersState,
      action: PayloadAction<SetFilterActionPayload>
    ) {
      state.editable[action.payload.key] = action.payload.value;
    },
    applyFilters(state: FiltersState) {
      state.active = state.editable;
    },
    clearFilters(state: FiltersState) {
      state.active = { ...emptyFilters };
      state.editable = { ...emptyFilters };
    },
    clearCompareToFilters(state: FiltersState) {
      state.active.compare_to = { ...compareToInitialState };
      state.editable.compare_to = { ...compareToInitialState };
    },
  },
});

export const { setFilter, applyFilters, clearFilters, clearCompareToFilters } =
  benchmarkReportSlice.actions;

export default benchmarkReportSlice.reducer;
