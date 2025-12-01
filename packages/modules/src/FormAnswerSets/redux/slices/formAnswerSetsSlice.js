// @flow

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export const REDUCER_KEY = 'formAnswerSetsSlice';

export type DateRange = {
  start_date: string,
  end_date: string,
};

export type FormAnswerSetsState = {
  category: string,
  form_id?: number | Array<number>,
  athlete_id?: number | Array<number>,
  statuses: Array<string>,
  date_range?: DateRange,
  form_category_id?: number,
  athlete_status?: 'active' | 'free_agent',
};

export const initialState = {
  category: 'medical,general',
  form_id: undefined,
  athlete_id: undefined,
  statuses: [],
  date_range: undefined,
  form_category_id: undefined,
  athlete_status: 'active',
};

export const formAnswerSetsSlice = createSlice({
  name: REDUCER_KEY,
  initialState,
  reducers: {
    onReset: () => initialState,
    setCategoryFilter: (
      state: FormAnswerSetsState,
      action: PayloadAction<string>
    ) => {
      state.category = action.payload;
    },
    setFormFilter: (
      state: FormAnswerSetsState,
      action: PayloadAction<string>
    ) => {
      state.form_id = action.payload;
    },
    setAthleteFilter: (
      state: FormAnswerSetsState,
      action: PayloadAction<string>
    ) => {
      state.athlete_id = action.payload;
    },
    setStatusesFilter: (
      state: FormAnswerSetsState,
      action: PayloadAction<string>
    ) => {
      state.statuses = action.payload;
    },
    setDateRangeFilter: (
      state: FormAnswerSetsState,
      action: PayloadAction<string>
    ) => {
      state.date_range = action.payload;
    },
    setFormCategoryFilter: (
      state: FormAnswerSetsState,
      action: PayloadAction<number>
    ) => {
      state.form_category_id = action.payload;
    },
    setAthleteStatusFilter: (
      state: FormAnswerSetsState,
      action: PayloadAction<'active' | 'free_agent'>
    ) => {
      // Reset all filters when athlete status changes
      state.category = initialState.category;
      state.form_id = initialState.form_id;
      state.athlete_id = initialState.athlete_id;
      state.statuses = initialState.statuses;
      state.date_range = initialState.date_range;
      state.form_category_id = initialState.form_category_id;
      state.athlete_status = action.payload;
    },
  },
});

export const {
  onReset,
  setCategoryFilter,
  setFormFilter,
  setAthleteFilter,
  setStatusesFilter,
  setDateRangeFilter,
  setFormCategoryFilter,
  setAthleteStatusFilter,
} = formAnswerSetsSlice.actions;
