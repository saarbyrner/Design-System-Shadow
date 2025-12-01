// @flow

import type { HumanInputFormElement } from '@kitman/modules/src/HumanInput/types/forms';

import type {
  CreateFormTemplatesForm,
  CreateFormTemplateRequestBody,
} from '@kitman/services/src/services/formTemplates/api/formTemplates/create';

const createFormTemplateFormMock: CreateFormTemplatesForm = {
  category: 'medical',
  group: 'group',
  form_type: 'assessment',
  key: 'key',
  name: 'Wellbeing survey',
  fullname: 'Weekly wellbeing survey for team',
  config: null,
  enabled: true,
};

const formElements: Array<HumanInputFormElement> = [
  {
    id: 1,
    order: 1,
    element_type: 'Forms::Elements::Layouts::Section',
    config: {
      title: 'Wellbeing Survey',
      element_id: 'section1',
      repeatable: false,
      optional: false,
    },
    visible: true,
    form_elements: [
      {
        id: 2,
        order: 1,
        element_type: 'Forms::Elements::Layouts::Menu',
        config: {
          type: 'overview',
          title: 'Wellbeing Survey',
          element_id: 'menu1',
          repeatable: false,
          optional: false,
        },
        visible: true,
        form_elements: [
          {
            id: 3,
            order: 1,
            element_type: 'Forms::Elements::Layouts::MenuGroup',
            config: {
              title: 'Wellbeing Survey',
              element_id: 'menugroup1',
              repeatable: false,
              optional: false,
            },
            visible: true,
            form_elements: [
              {
                id: 4,
                order: 1,
                element_type: 'Forms::Elements::Layouts::MenuItem',
                config: {
                  title: 'Test Title',
                  element_id: 'menuitem1',
                  repeatable: false,
                  optional: false,
                },
                visible: true,
                form_elements: [
                  {
                    id: 5,
                    order: 1,
                    element_type: 'Forms::Elements::Inputs::Text',
                    config: {
                      text: 'First name',
                      data_point: false,
                      element_id: 'firstname',
                      repeatable: false,
                      optional: false,
                    },
                    visible: true,
                    form_elements: [],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];

const createFormTemplateMock: CreateFormTemplateRequestBody = {
  form: createFormTemplateFormMock,
  form_template: {
    name: 'Wellbeing survey',
  },
  form_template_version: {
    name: 'Wellbeing survey',
    config: null,
    form_elements: formElements,
  },
  form_elements: formElements,
  form_category_id: 1,
};

export { createFormTemplateMock };
