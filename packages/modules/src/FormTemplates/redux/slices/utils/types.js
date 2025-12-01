// @flow
import type {
  FormType,
  FormStructure,
} from '@kitman/modules/src/FormTemplates/shared/types';

import type {
  ElementState,
  HumanInputFormElement,
  Condition,
} from '@kitman/modules/src/HumanInput/types/forms';

export type FormMetaData = {
  title: string,
  type: FormType,
  productArea: string,
  formCategoryId: number,
  formCategoryName: string,
  category: string,
  createdAt: string,
  creator: string,
  description: string,
};

export type FollowUpQuestion = {
  condition: Condition,
  followUpQuestion: HumanInputFormElement,
};

export type FollowUpQuestions = {
  initialQuestion: HumanInputFormElement,
  followUpQuestions: Array<FollowUpQuestion>,
};

export type ConditionalElements = {
  [key: number]: FollowUpQuestions,
};

export type FormTemplateSettingsFilters = {
  productArea: null | string | Array<string>,
  searchQuery: null | string,
};

export type FormCategoryDrawerMode = 'CREATE' | 'EDIT' | 'VIEW';

export type FormTemplateSettingsState = {
  filters: FormTemplateSettingsFilters,
  selectedFormCategoryId: number | null,
  isFormCategoryDrawerOpen: boolean,
  formCategoryDrawerMode: FormCategoryDrawerMode,
  isDeleteFormCategoryModalOpen: boolean,
};

export type FormBuilderState = {
  metaData: FormMetaData,
  // we need to keep a copy of the original structure to detect changes
  originalStructure: FormStructure,
  structure: FormStructure,
  elements: ElementState,
  currentMenuGroupIndex: number,
  currentMenuItemIndex: number,
  showFormBuilder: boolean,
  conditionalElements: ConditionalElements,
  showFormHeaderModal: boolean,
};
