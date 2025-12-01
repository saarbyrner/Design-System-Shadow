// @flow
import uuid from 'uuid';

import { LAYOUT_ELEMENTS } from '@kitman/modules/src/HumanInput/shared/constants';
import {
  generateDefaultMenuGroupTitleByIndex,
  generateDefaultMenuItemTitleByIndex,
  generateDefaultGroupLayoutElementTitleByIndex,
  generateDefaultContentLayoutElementTitleByIndex,
} from '@kitman/modules/src/FormTemplates/FormBuilder/components/Form/utils/helpers';
import type { HumanInputFormElement } from '@kitman/modules/src/HumanInput/types/forms';
import { generateUniqueNumberId } from '@kitman/modules/src/FormTemplates/shared/helpers';
import i18n from '@kitman/common/src/utils/i18n';

export const dummyFormElementData = {
  id: 0, // Will be deleted before being sent to the BE, and created there
  visible: true,
  order: 1,
};

export const dummyQuestionItems = [
  {
    color: '#7ab8c5',
    label: 'Color',
    value: 'color',
    score: 6,
  },
];

export const initialQuestionItems = [
  {
    label: 'Option 1',
    value: 'option_1',
  },
  {
    label: 'Option 2',
    value: 'option_2',
  },
];

export const createQuestionOptionItem = () => ({
  label: 'Option',
  value: 'option',
});

export const createQuestion = () => {
  const question: HumanInputFormElement = {
    ...dummyFormElementData,
    id: generateUniqueNumberId(),
    config: {
      element_id: uuid.v4(),
      optional: true,
      items: initialQuestionItems,
      custom_params: {},
    },
    element_type: 'Forms::Elements::Inputs::SingleChoice',
    form_elements: [],
  };
  return question;
};

export const createConditionalQuestion = () => {
  const question: HumanInputFormElement = {
    ...dummyFormElementData,
    id: generateUniqueNumberId(),
    config: {
      element_id: uuid.v4(),
      optional: true,
      items: initialQuestionItems,
      custom_params: {},
      condition: {
        element_id: 'mental_health_taking_medication_2_yes_no',
        type: '==',
        value_type: 'boolean',
        value: true,
        conditions: [],
      },
    },
    element_type: 'Forms::Elements::Inputs::SingleChoice',
    form_elements: [],
  };
  return question;
};

export const createContentElement = ({
  elementIndex,
}: {
  elementIndex: number,
}) => {
  const contentElement: HumanInputFormElement = {
    ...dummyFormElementData,
    id: generateUniqueNumberId(),
    config: {
      element_id: uuid.v4(),
      optional: true,
      title: generateDefaultContentLayoutElementTitleByIndex({ elementIndex }),
      custom_params: {
        content_type: 'html',
      },
    },
    element_type: 'Forms::Elements::Layouts::Content',
    form_elements: [],
  };
  return contentElement;
};

export const createGroupLayoutElement = ({
  elementIndex,
}: {
  elementIndex: number,
}) => {
  const group: HumanInputFormElement = {
    ...dummyFormElementData,
    id: generateUniqueNumberId(),
    config: {
      element_id: uuid.v4(),
      optional: false,
      title: generateDefaultGroupLayoutElementTitleByIndex({ elementIndex }),
      custom_params: {
        show_title: true,
      },
    },
    element_type: 'Forms::Elements::Layouts::Group',
    form_elements: [],
  };
  return group;
};

export const createMenuItem = ({
  menuGroupIndex,
  menuItemIndex,
}: {
  menuGroupIndex: number,
  menuItemIndex: number,
}) => {
  const menuItem: HumanInputFormElement = {
    ...dummyFormElementData,
    id: generateUniqueNumberId(),
    config: {
      element_id: uuid.v4(),
      title: generateDefaultMenuItemTitleByIndex({
        menuGroupIndex,
        menuItemIndex,
      }),
    },
    element_type: 'Forms::Elements::Layouts::MenuItem',
    form_elements: [],
  };
  return menuItem;
};

export const createMenuGroup = ({
  menuGroupIndex,
}: {
  menuGroupIndex: number,
}) => {
  const menuGroup: HumanInputFormElement = {
    ...dummyFormElementData,
    id: generateUniqueNumberId(),
    config: {
      element_id: uuid.v4(),
      title: generateDefaultMenuGroupTitleByIndex(menuGroupIndex),
    },
    element_type: 'Forms::Elements::Layouts::MenuGroup',
    form_elements: [createMenuItem({ menuGroupIndex, menuItemIndex: 0 })],
  };

  return menuGroup;
};

export const createMenuElement = () => {
  const menuElement: HumanInputFormElement = {
    ...dummyFormElementData,
    id: 1,
    config: {
      element_id: uuid.v4(),
    },
    element_type: 'Forms::Elements::Layouts::Menu',
    form_elements: [createMenuGroup({ menuGroupIndex: 0 })],
  };
  return menuElement;
};

export const createFormElementsMap = (element: HumanInputFormElement) => {
  const key = element?.config?.element_id;

  if (!key) return {};

  const root = element.form_elements;

  if (
    [
      LAYOUT_ELEMENTS.Menu,
      LAYOUT_ELEMENTS.MenuGroup,
      LAYOUT_ELEMENTS.MenuItem,
      LAYOUT_ELEMENTS.Section,
    ].includes(element.element_type)
  ) {
    return Object.assign({}, ...root.map(createFormElementsMap));
  }

  return {
    [key]: element,
  };
};

// Recursive function to find and update an element by ID
export const updateElementById = (
  elements: Array<HumanInputFormElement>,
  idToUpdate: number,
  newConfig: Object
): Array<HumanInputFormElement> => {
  return elements?.map((element) => {
    // If this is the target element, update its config
    if (element.id === idToUpdate) {
      return {
        ...element,
        config: {
          ...element.config,
          ...newConfig,
        },
      };
    }

    // Otherwise, continue recursively checking the form_elements
    if (element.form_elements && element.form_elements.length > 0) {
      return {
        ...element,
        form_elements: updateElementById(
          element.form_elements,
          idToUpdate,
          newConfig
        ),
      };
    }
    // Return the element unchanged if it's not the one to update
    return element;
  });
};

const createElementTitle = (formElement: HumanInputFormElement): string => {
  const elementTitle =
    formElement?.config?.title || formElement?.config?.text || '';

  return [LAYOUT_ELEMENTS.MenuGroup, LAYOUT_ELEMENTS.MenuItem].includes(
    formElement.element_type
  )
    ? `${elementTitle} - ${i18n.t('Copy')}`
    : elementTitle;
};

export const duplicateElementTree = (
  formElement: HumanInputFormElement
): HumanInputFormElement => {
  const elementTitle = createElementTitle(formElement);

  return {
    ...formElement,
    id: generateUniqueNumberId(),
    config: {
      ...formElement?.config,
      title: elementTitle,
      element_id: uuid.v4(),
    },
    form_elements: formElement?.form_elements.map((element) =>
      duplicateElementTree(element)
    ),
  };
};
