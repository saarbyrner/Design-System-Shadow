/* eslint-disable no-param-reassign */
// @flow
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { SquadAthletesSelection } from '@kitman/components/src/Athletes/types';
import { EMPTY_SELECTION } from '@kitman/components/src/Athletes/constants';
import { type RowData } from '@kitman/modules/src/analysis/TemplateDashboards/components/Table/Column/types';

import { getLocalStorageKey } from '../../utils';

export type Filters = {
  population: SquadAthletesSelection,
  timescope: {
    time_period: ?string,
    start_time?: string,
    end_time?: string,
    time_period_length?: ?number,
    time_period_length_offset?: ?number,
  },
};
export type FiltersState = {
  isPanelOpen: boolean,
  sortedData: Array<RowData>,
  editable: Filters,
  active: Filters,
};
export type FilterKey = $Keys<Filters>;
export type FiltersValue = $Values<Filters>;

const emptyFilters = {
  population: { ...EMPTY_SELECTION },
  timescope: {
    time_period: null,
  },
};

export const initialState: FiltersState = {
  isPanelOpen: false,
  sortedData: [],
  editable: {
    ...emptyFilters,
  },
  active: {
    ...emptyFilters,
  },
};

type SetFilterActionPayload = {
  key: FilterKey,
  value: FiltersValue,
};

type SetSortedDataPayload = {
  data: Array<RowData>,
};

export type ReducerKeyType = 'templateDashboardsFilter';

export const REDUCER_KEY: ReducerKeyType = 'templateDashboardsFilter';

export function getInitialState() {
  let localStorageVal;

  try {
    localStorageVal = JSON.parse(
      window.localStorage.getItem(getLocalStorageKey())
    );
  } catch {
    return initialState;
  }

  if (!localStorageVal) {
    return initialState;
  }

  return {
    ...initialState,
    editable: localStorageVal,
    active: localStorageVal,
  };
}

const counterSlice = createSlice({
  name: REDUCER_KEY,
  initialState: getInitialState(),
  reducers: {
    resetState() {
      return getInitialState();
    },
    setFilter(
      state: FiltersState,
      action: PayloadAction<SetFilterActionPayload>
    ) {
      state.editable[action.payload.key] = action.payload.value;
    },
    openFilterPanel(state: FiltersState) {
      state.editable = state.active;
      state.isPanelOpen = true;
    },
    closeFilterPanel(state: FiltersState) {
      state.isPanelOpen = false;
      state.editable = state.active;
    },
    applyFilters(state: FiltersState) {
      state.isPanelOpen = false;
      state.active = state.editable;
    },
    clearFilters(state: FiltersState) {
      state.isPanelOpen = false;
      state.editable = emptyFilters;
      state.active = emptyFilters;
    },
    setSortedData(
      state: FiltersState,
      action: PayloadAction<SetSortedDataPayload>
    ) {
      state.sortedData = action.payload.data;
    },
  },
});

export const {
  setFilter,
  openFilterPanel,
  closeFilterPanel,
  applyFilters,
  clearFilters,
  resetState,
  setSortedData,
} = counterSlice.actions;

export default counterSlice.reducer;
