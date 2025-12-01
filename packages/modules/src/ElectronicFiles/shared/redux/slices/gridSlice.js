// @flow
import { createSlice } from '@reduxjs/toolkit';
import type { State, PayloadAction } from '@reduxjs/toolkit';
import structuredClone from 'core-js/stable/structured-clone';
import type {
  GridFilters,
  GridFiltersGrouped,
  GridPagination,
} from '@kitman/modules/src/ElectronicFiles/shared/types';
import {
  gridPageSize,
  FILTERS_LOCAL_STORAGE_KEY,
} from '@kitman/modules/src/ElectronicFiles/shared/consts';
import { getIsLocalStorageAvailable } from '@kitman/common/src/utils';
import { type MenuItemKey } from '@kitman/modules/src/ElectronicFiles/shared/redux/slices/sidebarSlice';

type GridSlice = {
  filters: {
    stateFilters: GridFiltersGrouped,
    persistedFilters: GridFiltersGrouped,
  },
  pagination: GridPagination,
};

export const defaultFilters = {
  query: '',
  status: null,
  start_date: null,
  end_date: null,
  archived: false,
};

export const defaultPagination = {
  per_page: gridPageSize,
  page: 1,
};

export const defaultFiltersGrouped = {
  inbox: defaultFilters,
  sent: defaultFilters,
};

const getPersistedFilters = () => {
  const isLocalStorageAvailable = getIsLocalStorageAvailable();
  if (isLocalStorageAvailable) {
    try {
      const localStorageFilters = JSON.parse(
        window.localStorage.getItem(FILTERS_LOCAL_STORAGE_KEY)
      );
      if (
        ![
          localStorageFilters,
          localStorageFilters.inbox,
          localStorageFilters.sent,
        ].every(Boolean)
      ) {
        window.localStorage.setItem(
          FILTERS_LOCAL_STORAGE_KEY,
          JSON.stringify(defaultFiltersGrouped)
        );
        return defaultFiltersGrouped;
      }
      return localStorageFilters;
    } catch {
      return defaultFiltersGrouped;
    }
  }
  return defaultFiltersGrouped;
};

export const initialState: GridSlice = {
  filters: {
    stateFilters: {
      inbox: null,
      sent: null,
    },
    persistedFilters: getPersistedFilters(),
  },
  pagination: defaultPagination,
};

export const REDUCER_KEY: string = 'gridSlice';

const gridSlice = createSlice({
  name: REDUCER_KEY,
  initialState,
  reducers: {
    updatePersistedFilter: (
      state: GridSlice,
      action: PayloadAction<{
        selectedMenuItem: MenuItemKey,
        partialFilter: $Shape<GridFilters>,
      }>
    ) => {
      state.filters.persistedFilters[action.payload.selectedMenuItem] = {
        ...state.filters.persistedFilters[action.payload.selectedMenuItem],
        ...action.payload.partialFilter,
      };

      const filtersToPersist = structuredClone(state.filters.persistedFilters);

      // we don't need to persist search query
      delete filtersToPersist.inbox.query;
      delete filtersToPersist.sent.query;

      window.localStorage.setItem(
        FILTERS_LOCAL_STORAGE_KEY,
        JSON.stringify(filtersToPersist)
      );
      state.pagination.page = 1;
    },
    updateStateFilter: (
      state: GridSlice,
      action: PayloadAction<{
        selectedMenuItem: MenuItemKey,
        partialFilter: $Shape<GridFilters>,
      }>
    ) => {
      state.filters.stateFilters[action.payload.selectedMenuItem] = {
        ...state.filters.stateFilters[action.payload.selectedMenuItem],
        ...action.payload.partialFilter,
      };
      state.pagination.page = 1;
    },
    updatePagination: (
      state: GridSlice,
      action: PayloadAction<$Shape<GridPagination>>
    ) => {
      state.pagination = {
        ...state.pagination,
        ...action.payload,
      };
    },
    copyPersistedFiltersToStateFilters: (state: GridSlice) => {
      state.filters.stateFilters = state.filters.persistedFilters;
    },
    resetStateFilters: (state: GridSlice) => {
      state.filters.stateFilters = { inbox: null, sent: null };
      state.pagination = defaultPagination;
    },
    resetPersistedFilters: (state: GridSlice) => {
      const filtersToPersist = structuredClone(defaultFiltersGrouped);

      // we don't need to persist search query
      delete filtersToPersist.inbox.query;
      delete filtersToPersist.sent.query;

      window.localStorage.setItem(
        FILTERS_LOCAL_STORAGE_KEY,
        JSON.stringify(filtersToPersist)
      );

      state.filters.persistedFilters = defaultFiltersGrouped;
      state.pagination = defaultPagination;
    },
  },
});

export const {
  updateStateFilter,
  updatePersistedFilter,
  updatePagination,
  copyPersistedFiltersToStateFilters,
  resetStateFilters,
  resetPersistedFilters,
} = gridSlice.actions;

export const selectStateFilters = (state: State) =>
  state.gridSlice.filters.stateFilters;
export const selectPersistedFilters = (state: State) =>
  state.gridSlice.filters.persistedFilters;
export const selectPagination = (state: State) => state.gridSlice.pagination;

export default gridSlice;
