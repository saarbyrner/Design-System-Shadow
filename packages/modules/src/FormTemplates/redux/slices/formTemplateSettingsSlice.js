// @flow
import { createSlice } from '@reduxjs/toolkit';

import type { FormTemplateSettingsState } from './utils/types';

export const REDUCER_KEY = 'formTemplateSettings';

export const initialState: FormTemplateSettingsState = {
  filters: {
    productArea: null,
    searchQuery: '',
  },
  selectedFormCategoryId: null,
  isFormCategoryDrawerOpen: false,
  formCategoryDrawerMode: 'CREATE',
  isDeleteFormCategoryModalOpen: false,
};

export const formTemplateSettingsSlice = createSlice({
  name: REDUCER_KEY,
  initialState,
  reducers: {
    setProductAreaFilter: (
      state,
      action: { payload: null | string | Array<string> }
    ) => {
      state.filters.productArea = action.payload;
    },
    setSearchQueryFilter: (state, action: { payload: string }) => {
      state.filters.searchQuery = action.payload;
    },
    resetFormTemplateSettingsFilters: (state) => {
      state.filters = initialState.filters;
    },
    setIsFormCategoryDrawerOpen: (state, action: { payload: boolean }) => {
      state.isFormCategoryDrawerOpen = action.payload;
    },
    setIsDeleteFormCategoryModalOpen: (state, action: { payload: boolean }) => {
      state.isDeleteFormCategoryModalOpen = action.payload;
    },
    setFormCategoryDrawerMode: (
      state,
      action: { payload: 'CREATE' | 'EDIT' }
    ) => {
      state.formCategoryDrawerMode = action.payload;
    },
    setSelectedFormCategoryId: (state, action: { payload: number | null }) => {
      state.selectedFormCategoryId = action.payload;
    },
  },
});

export const {
  setProductAreaFilter,
  setSearchQueryFilter,
  resetFormTemplateSettingsFilters,
  setIsFormCategoryDrawerOpen,
  setFormCategoryDrawerMode,
  setSelectedFormCategoryId,
  setIsDeleteFormCategoryModalOpen,
} = formTemplateSettingsSlice.actions;

export const formTemplateSettingsReducer = formTemplateSettingsSlice.reducer;
