// @flow
import _cloneDeep from 'lodash/cloneDeep';
import { formTypeEnumLike } from '@kitman/modules/src/FormTemplates/shared/enum-likes';
import type { HumanInputFormElement } from '@kitman/modules/src/HumanInput/types/forms';
import { generateUniqueNumberId } from '@kitman/modules/src/FormTemplates/shared/helpers';
import { createQuestion } from '@kitman/modules/src/FormTemplates/redux/slices/utils/helpers';
import {
  createMenuElement,
  createMenuItem,
  createMenuGroup,
  dummyFormElementData,
} from './helpers';

import type { FormBuilderState } from './types';

const emptySection: HumanInputFormElement = {
  ...dummyFormElementData,
  id: generateUniqueNumberId(),
  config: {
    element_id: 'section', // we will always have one, no need to create an actual UUID
  },
  element_type: 'Forms::Elements::Layouts::Section',
  form_elements: [createMenuElement()],
};

export const initialState: FormBuilderState = {
  metaData: {
    title: '',
    type: formTypeEnumLike.survey,
    productArea: '',
    formCategoryId: 0,
    formCategoryName: '',
    category: '',
    createdAt: '',
    creator: '',
    description: '',
  },
  structure: {
    id: 0,
    name: '',
    form_elements: [emptySection],
    config: null,
  },
  elements: {},
  currentMenuGroupIndex: 0,
  currentMenuItemIndex: 0,
  showFormBuilder: false,
  originalStructure: {
    id: 0,
    name: '',
    form_elements: [_cloneDeep(emptySection)],
    config: null,
  },
  conditionalElements: {},
  showFormHeaderModal: false,
};

export const customState = {
  ...initialState,
  structure: {
    ...initialState.structure,
    form_elements: [
      {
        ...initialState.structure.form_elements[0],
        form_elements: [
          {
            ...initialState.structure.form_elements[0].form_elements[0],
            form_elements: [
              {
                ...initialState.structure.form_elements[0].form_elements[0]
                  .form_elements[0],
                form_elements: [
                  {
                    ...initialState.structure.form_elements[0].form_elements[0]
                      .form_elements[0].form_elements[0],
                    form_elements: [createQuestion()],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
};

export const multiMenuItemState = {
  ...initialState,
  structure: {
    ...initialState.structure,
    form_elements: [
      {
        ...initialState.structure.form_elements[0],
        form_elements: [
          {
            ...initialState.structure.form_elements[0].form_elements[0],
            form_elements: [
              {
                ...createMenuGroup({ menuGroupIndex: 1 }),
                form_elements: [
                  {
                    ...createMenuItem({ menuGroupIndex: 1, menuItemIndex: 1 }),
                    form_elements: [createQuestion()],
                  },
                  {
                    ...createMenuItem({ menuGroupIndex: 1, menuItemIndex: 2 }),
                    form_elements: [createQuestion()],
                  },
                ],
              },
              {
                ...createMenuGroup({ menuGroupIndex: 2 }),
                form_elements: [
                  {
                    ...createMenuItem({ menuGroupIndex: 2, menuItemIndex: 1 }),
                    form_elements: [createQuestion()],
                  },
                  {
                    ...createMenuItem({ menuGroupIndex: 2, menuItemIndex: 2 }),
                    form_elements: [createQuestion()],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
};
