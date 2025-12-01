// @flow
import i18n from '@kitman/common/src/utils/i18n';
import type { Action, Template } from './types';

type TemplatesState = Array<Template>;

export const templates = (
  state: TemplatesState = [],
  action: Action
): Array<Template> => {
  let index;
  let newState;

  switch (action.type) {
    case 'ADD_TEMPLATE_SUCCESS':
    case 'DUPLICATE_TEMPLATE_SUCCESS':
      return state.concat(action.payload.template);
    case 'DELETE_TEMPLATE_SUCCESS': {
      const templateIndex = state.indexOf(action.payload.template);
      return [
        ...state.slice(0, templateIndex),
        ...state.slice(templateIndex + 1),
      ]; // immutable splice with ES6
    }
    case 'RENAME_TEMPLATE_SUCCESS':
      index = state.indexOf(action.payload.oldTemplate);
      newState = [...state];
      newState[index] = action.payload.newTemplate;
      return newState;
    default:
      return state;
  }
};

export const modals = (state: Object = {}, action: Action) => {
  switch (action.type) {
    case 'SHOW_ADD_MODAL':
      return {
        addTemplateVisible: true,
        duplicateTemplateVisible: false,
        renameTemplateVisible: false,
        confirmDeleteVisible: false,
      };
    case 'SHOW_DUPLICATE_MODAL':
      return {
        addTemplateVisible: false,
        duplicateTemplateVisible: true,
        renameTemplateVisible: false,
        confirmDeleteVisible: false,
        templateToDuplicate: action.payload.template,
      };
    case 'UPDATE_TEMPLATE_NAME':
      return Object.assign({}, state, {
        templateName: action.payload.templateName,
      });
    case 'SHOW_RENAME_MODAL':
      return {
        addTemplateVisible: false,
        duplicateTemplateVisible: false,
        renameTemplateVisible: true,
        confirmDeleteVisible: false,
        templateToRename: action.payload.template,
        templateName: action.payload.template.name,
      };
    case 'SHOW_CONFIRM_DELETE_TEMPLATE':
      return {
        addTemplateVisible: false,
        duplicateTemplateVisible: false,
        renameTemplateVisible: false,
        confirmDeleteVisible: true,
        templateToDelete: action.payload.template,
      };
    case 'CLOSE_MODAL':
    case 'ADD_TEMPLATE_SUCCESS':
    case 'DUPLICATE_TEMPLATE_SUCCESS':
    case 'RENAME_TEMPLATE_SUCCESS':
    case 'SERVER_REQUEST':
      return {
        addTemplateVisible: false,
        duplicateTemplateVisible: false,
        renameTemplateVisible: false,
        confirmDeleteVisible: false,
      };
    default:
      return state;
  }
};

export const appStatus = (state: Object = {}, action: Action) => {
  switch (action.type) {
    case 'SERVER_REQUEST':
      return {
        status: 'loading',
      };
    case 'SERVER_REQUEST_ERROR':
      return {
        status: 'error',
      };
    case 'ADD_TEMPLATE_SUCCESS':
      return {
        status: 'loading',
      };
    case 'DUPLICATE_TEMPLATE_SUCCESS':
      return {
        status: 'loading',
      };
    case 'DELETE_TEMPLATE_SUCCESS':
      return {
        status: 'success',
        message: i18n.t('Success'),
      };
    case 'RENAME_TEMPLATE_SUCCESS':
      return {
        status: 'success',
        message: i18n.t('Success'),
      };
    case 'HIDE_APP_STATUS': {
      return {
        status: null,
        message: null,
      };
    }
    default:
      return state;
  }
};
