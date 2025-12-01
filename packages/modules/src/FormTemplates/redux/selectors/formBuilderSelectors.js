// @flow
import type {
  HumanInputFormElement,
  BrandingHeaderConfig,
  ElementState,
} from '@kitman/modules/src/HumanInput/types/forms';
import type { FormStructure } from '@kitman/modules/src/FormTemplates/shared/types';
import type { ConditionalElements } from '@kitman/modules/src/FormTemplates/redux/slices/utils/types';
import { REDUCER_KEY } from '../slices/formBuilderSlice';
import type { FormBuilderState, FormMetaData } from '../slices/utils/types';

export type FormBuilderStore = {
  [typeof REDUCER_KEY]: FormBuilderState,
};

export const getCurrentMenuGroupIndex = (state: FormBuilderStore): number => {
  return state[REDUCER_KEY].currentMenuGroupIndex;
};

export const getCurrentMenuItemIndex = (state: FormBuilderStore): number => {
  return state[REDUCER_KEY].currentMenuItemIndex;
};

export const getFormMenu = (
  state: FormBuilderStore
): Array<HumanInputFormElement> => {
  return state[REDUCER_KEY].structure.form_elements[0].form_elements[0]
    .form_elements; // The first form element is always a section
};

export const getFormStructure = (state: FormBuilderStore): FormStructure => {
  return state[REDUCER_KEY].structure;
};

export const getFormElementsMap = (state: FormBuilderStore): ElementState => {
  return state[REDUCER_KEY].elements;
};

export const getConditionalElements = (
  state: FormBuilderStore
): ConditionalElements => {
  return state[REDUCER_KEY].conditionalElements;
};

export const getOriginalFormStructure = (
  state: FormBuilderStore
): FormStructure => {
  return state[REDUCER_KEY].originalStructure;
};

export const getFormMetaData = (state: FormBuilderStore): FormMetaData => {
  return state[REDUCER_KEY].metaData;
};

export const getQuestionByIndex = (
  state: FormBuilderStore,
  questionIndex: number
): HumanInputFormElement => {
  const menu = getFormMenu(state);
  const { currentMenuGroupIndex, currentMenuItemIndex } = state[REDUCER_KEY];

  return menu[currentMenuGroupIndex].form_elements[currentMenuItemIndex]
    .form_elements[questionIndex];
};

export const getShowFormBuilder = (state: FormBuilderStore): boolean => {
  return state[REDUCER_KEY].showFormBuilder;
};

export const getShowFormHeaderModal = (state: FormBuilderStore): boolean => {
  return state[REDUCER_KEY].showFormHeaderModal;
};

export const getFormHeaderBrandingConfig = (
  state: FormBuilderStore
): BrandingHeaderConfig | null => {
  return state[REDUCER_KEY].structure.config?.header || null;
};

export const getMenuGroupCount = (state: FormBuilderStore): number => {
  return state[REDUCER_KEY].structure.form_elements[0].form_elements[0]
    .form_elements.length;
};

export const getMenuItemCount = (state: FormBuilderStore): number => {
  const { currentMenuGroupIndex } = state[REDUCER_KEY];

  return state[REDUCER_KEY].structure.form_elements[0].form_elements[0]
    .form_elements[currentMenuGroupIndex].form_elements.length;
};
