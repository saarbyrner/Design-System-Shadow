// @flow
import { createSlice } from '@reduxjs/toolkit';
import type { State, PayloadAction } from '@reduxjs/toolkit';
import type {
  ContactsGridFilters,
  GridPagination,
} from '@kitman/modules/src/ElectronicFiles/shared/types';
import { gridPageSize } from '@kitman/modules/src/ElectronicFiles/shared/consts';

type ContactsGridSlice = {
  filters: ContactsGridFilters,
  pagination: GridPagination,
};

export const defaultFilters = {
  query: '',
  archived: false,
};

export const defaultPagination = {
  per_page: gridPageSize,
  page: 1,
};

export const initialState: ContactsGridSlice = {
  filters: defaultFilters,
  pagination: defaultPagination,
};

export const REDUCER_KEY: string = 'contactsGridSlice';

const contactsGridSlice = createSlice({
  name: REDUCER_KEY,
  initialState,
  reducers: {
    updateFilter: (
      state: ContactsGridSlice,
      action: PayloadAction<$Shape<ContactsGridFilters>>
    ) => {
      state.filters = {
        ...state.filters,
        ...action.payload,
      };
      state.pagination.page = 1;
    },
    updatePagination: (
      state: ContactsGridSlice,
      action: PayloadAction<$Shape<GridPagination>>
    ) => {
      state.pagination = {
        ...state.pagination,
        ...action.payload,
      };
    },
    reset: () => initialState,
  },
});

export const { updateFilter, updatePagination, reset } =
  contactsGridSlice.actions;

export const selectFilters = (state: State) => state.contactsGridSlice.filters;
export const selectPagination = (state: State) =>
  state.contactsGridSlice.pagination;

export default contactsGridSlice;
