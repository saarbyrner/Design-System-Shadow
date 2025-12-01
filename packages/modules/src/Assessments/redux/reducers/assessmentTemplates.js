// @flow
import type { Store } from '../types/store';
import type { Action } from '../types/actions';
import type { AssessmentTemplate } from '../../types';

export default function (
  state: $PropertyType<Store, 'assessmentTemplates'> = [],
  action: Action
) {
  switch (action.type) {
    case 'SAVE_TEMPLATE_SUCCESS': {
      const templatesSortedByName: Array<AssessmentTemplate> = [
        ...state,
        action.payload.template,
      ].sort((templateA, templateB) =>
        templateA.name.localeCompare(templateB.name)
      );

      return templatesSortedByName;
    }
    case 'DELETE_TEMPLATE_SUCCESS': {
      const templates: Array<AssessmentTemplate> = state.filter(
        (template) => template.id !== action.payload.templateId
      );

      return templates;
    }
    case 'RENAME_TEMPLATE_SUCCESS': {
      const templates: Array<AssessmentTemplate> = state
        .map((template) => {
          if (template.id === action.payload.templateId) {
            return { ...template, name: action.payload.templateName };
          }
          return template;
        })
        .sort((templateA, templateB) =>
          templateA.name.localeCompare(templateB.name)
        );

      return templates;
    }
    default:
      return state;
  }
}
