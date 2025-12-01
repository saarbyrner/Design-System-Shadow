// @flow

import type {
  FormTemplateSettingsState,
  FormCategoryDrawerMode,
  FormTemplateSettingsFilters,
} from '@kitman/modules/src/FormTemplates/redux/slices/utils/types';

import { REDUCER_KEY } from '../slices/formTemplateSettingsSlice';

type Store = {
  [typeof REDUCER_KEY]: FormTemplateSettingsState,
};

export const getIsFormCategoryDrawerOpen = (state: Store): boolean => {
  return state[REDUCER_KEY].isFormCategoryDrawerOpen;
};

export const getSelectedFormCategoryId = (state: Store): number | null => {
  return state[REDUCER_KEY].selectedFormCategoryId;
};

export const getFormCategoryDrawerMode = (
  state: Store
): FormCategoryDrawerMode => {
  return state[REDUCER_KEY].formCategoryDrawerMode;
};

export const getFormTemplateSettingsFilters = (
  state: Store
): FormTemplateSettingsFilters => state[REDUCER_KEY].filters;

export const getIsDeleteFormCategoryModalOpen = (state: Store): boolean => {
  return state[REDUCER_KEY].isDeleteFormCategoryModalOpen;
};
