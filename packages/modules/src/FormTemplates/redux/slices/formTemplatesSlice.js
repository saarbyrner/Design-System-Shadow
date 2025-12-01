// @flow

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { FormTemplate } from '@kitman/services/src/services/formTemplates/api/types';

export const REDUCER_KEY = 'formTemplatesSlice';

export type FormAssignments = {
  athleteIds: Array<number>,
  freeAgentIds: Array<number>,
  athleteIdsToAdd: Array<number>,
  athleteIdsToRemove: Array<number>,
};

export type FormTemplateDrawerMode = 'CREATE' | 'EDIT';

export type FormTemplatesMap = { [key: string]: FormTemplate };

export type FormTemplatesState = {
  filters: {
    category: string,
    formCategoryId?: number | null,
  },
  searchQuery: string,
  isFormTemplateDrawerOpen: boolean,
  isScheduleDrawerOpen: boolean,
  isAssignAthletesDrawerOpen: boolean,
  isAssignFreeAgentsDrawerOpen: boolean,
  selectedFormId: number | null,
  selectedFormTemplateId: number | null,
  selectedFormName: string | null,
  formAssignments: FormAssignments,
  formTemplatesMap: FormTemplatesMap,
  formTemplateDrawerMode: FormTemplateDrawerMode,
  isFormTemplateDeleteModalOpen: boolean,
};

export const initialState: FormTemplatesState = {
  filters: { category: '', formCategoryId: null },
  searchQuery: '',
  isFormTemplateDrawerOpen: false,
  isScheduleDrawerOpen: false,
  isAssignAthletesDrawerOpen: false,
  isAssignFreeAgentsDrawerOpen: false,
  selectedFormId: null,
  selectedFormTemplateId: null,
  selectedFormName: null,
  formAssignments: {
    athleteIds: [],
    freeAgentIds: [],
    athleteIdsToAdd: [],
    athleteIdsToRemove: [],
  },
  formTemplatesMap: {},
  formTemplateDrawerMode: 'CREATE',
  isFormTemplateDeleteModalOpen: false,
};

type SetFormAssignments = $Shape<FormAssignments>;

type OnBuildFormTemplatesMapAction = {
  payload: { formTemplates: Array<FormTemplate> },
};

export const formTemplatesSlice = createSlice({
  name: REDUCER_KEY,
  initialState,
  reducers: {
    setCategoryFilter: (
      state: FormTemplatesState,
      action: PayloadAction<string>
    ) => {
      state.filters.category = action.payload?.name || '';
      state.filters.formCategoryId = action.payload?.id || null;
    },
    setSearchQuery: (
      state: FormTemplatesState,
      action: PayloadAction<string>
    ) => {
      state.searchQuery = action.payload;
    },
    setSelectedFormId: (
      state: FormTemplatesState,
      action: PayloadAction<number | null>
    ) => {
      state.selectedFormId = action.payload;
    },
    setSelectedFormTemplateId: (
      state: FormTemplatesState,
      action: PayloadAction<number | null>
    ) => {
      state.selectedFormTemplateId = action.payload;
    },
    setSelectedFormName: (
      state: FormTemplatesState,
      action: PayloadAction<string | null>
    ) => {
      state.selectedFormName = action.payload;
    },
    setFormTemplateDrawerMode: (
      state: FormTemplatesState,
      action: PayloadAction<FormTemplateDrawerMode>
    ) => {
      state.formTemplateDrawerMode = action.payload;
    },
    toggleIsFormTemplateDrawerOpen: (state: FormTemplatesState) => {
      state.isFormTemplateDrawerOpen = !state.isFormTemplateDrawerOpen;
    },
    toggleIsScheduleDrawerOpen: (state: FormTemplatesState) => {
      state.isScheduleDrawerOpen = !state.isScheduleDrawerOpen;
    },
    toggleIsAssignAthletesDrawerOpen: (state: FormTemplatesState) => {
      state.isAssignAthletesDrawerOpen = !state.isAssignAthletesDrawerOpen;
    },
    toggleIsAssignFreeAgentsDrawerOpen: (state: FormTemplatesState) => {
      state.isAssignFreeAgentsDrawerOpen = !state.isAssignFreeAgentsDrawerOpen;
    },
    setFormAssignments: (
      state: FormTemplatesState,
      action: PayloadAction<SetFormAssignments>
    ) => {
      state.formAssignments = {
        ...state.formAssignments,
        ...action.payload,
      };
    },
    onBuildFormTemplatesMap: (
      state: FormTemplatesState,
      action: PayloadAction<OnBuildFormTemplatesMapAction>
    ) => {
      state.formTemplatesMap = action.payload?.formTemplates?.reduce(
        (map, formTemplate) => {
          const key = formTemplate?.formId;

          if (!map[key]) {
            map[key] = formTemplate;
          }

          return map;
        },
        {}
      );
    },
    toggleIsFormTemplateDeleteModalOpen: (state: FormTemplatesState) => {
      state.isFormTemplateDeleteModalOpen =
        !state.isFormTemplateDeleteModalOpen;
    },
  },
});

export const {
  setCategoryFilter,
  setSearchQuery,
  toggleIsFormTemplateDrawerOpen,
  toggleIsScheduleDrawerOpen,
  toggleIsAssignAthletesDrawerOpen,
  toggleIsAssignFreeAgentsDrawerOpen,
  setSelectedFormId,
  setSelectedFormTemplateId,
  setSelectedFormName,
  setFormAssignments,
  onBuildFormTemplatesMap,
  setFormTemplateDrawerMode,
  toggleIsFormTemplateDeleteModalOpen,
} = formTemplatesSlice.actions;
