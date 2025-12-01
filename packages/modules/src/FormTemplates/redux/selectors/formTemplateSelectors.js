// @flow

import {
  REDUCER_KEY,
  type FormTemplatesState,
  type FormAssignments,
  type FormTemplateDrawerMode,
  type FormTemplatesMap,
} from '../slices/formTemplatesSlice';

type Store = {
  [typeof REDUCER_KEY]: FormTemplatesState,
};

export const getFilterCategory = (state: Store): string => {
  return state[REDUCER_KEY].filters.category;
};

export const getFilterFormCategoryId = (state: Store): number => {
  return state[REDUCER_KEY].filters.formCategoryId || 0;
};

export const getSearchQuery = (state: Store): string => {
  return state[REDUCER_KEY].searchQuery;
};

export const getIsFormTemplateDrawerOpen = (state: Store): boolean => {
  return state[REDUCER_KEY].isFormTemplateDrawerOpen;
};

export const getIsScheduleDrawerOpen = (state: Store): boolean => {
  return state[REDUCER_KEY].isScheduleDrawerOpen;
};

export const getSelectedFormId = (state: Store): number | null => {
  return state[REDUCER_KEY].selectedFormId;
};

export const getSelectedFormTemplateId = (state: Store): number | null => {
  return state[REDUCER_KEY].selectedFormTemplateId;
};

export const getSelectedFormName = (state: Store): string | null => {
  return state[REDUCER_KEY].selectedFormName;
};

export const getIsAssignAthletesDrawerOpen = (state: Store): boolean => {
  return state[REDUCER_KEY].isAssignAthletesDrawerOpen;
};

export const getIsAssignFreeAgentsDrawerOpen = (state: Store): boolean => {
  return state[REDUCER_KEY].isAssignFreeAgentsDrawerOpen;
};

export const getFormAssignments = (state: Store): FormAssignments => {
  return state[REDUCER_KEY].formAssignments;
};

export const getFormTemplateDrawerMode = (
  state: Store
): FormTemplateDrawerMode => {
  return state[REDUCER_KEY].formTemplateDrawerMode;
};

export const getFormTemplatesMap = (state: Store): FormTemplatesMap => {
  return state[REDUCER_KEY].formTemplatesMap;
};

export const getIsFormTemplateDeleteModalOpen = (state: Store): boolean => {
  return state[REDUCER_KEY].isFormTemplateDeleteModalOpen;
};
