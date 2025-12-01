// @flow

import { buildValidationState, validateElement } from './validation';

import {
  getDefaultValue,
  createElementMap,
  parseFormInputElement,
  buildFormState,
  setFormAnswer,
  extractByElementType,
  renderFormElement,
} from './form';

import { getFormFields, parseMenuElement, parseFormMenu } from './menu';

import {
  createFormAnswersRequestBody,
  createPatchAnswersPayload,
} from './common';

export {
  buildValidationState,
  validateElement,
  getDefaultValue,
  createElementMap,
  parseFormInputElement,
  buildFormState,
  getFormFields,
  parseMenuElement,
  parseFormMenu,
  setFormAnswer,
  createFormAnswersRequestBody,
  createPatchAnswersPayload,
  extractByElementType,
  renderFormElement,
};
