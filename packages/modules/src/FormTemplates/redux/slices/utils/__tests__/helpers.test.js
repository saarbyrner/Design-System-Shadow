import uuid from 'uuid';

import {
  dummyFormElementData,
  createMenuGroup,
  createMenuItem,
  createQuestion,
  createContentElement,
  createGroupLayoutElement,
  duplicateElementTree,
  initialQuestionItems,
} from '../helpers';

jest.mock('uuid', () => ({
  v4: jest.fn(),
}));

jest.mock('@kitman/modules/src/FormTemplates/shared/helpers', () => ({
  ...jest.requireActual('@kitman/modules/src/FormTemplates/shared/helpers'),
  generateUniqueNumberId: jest.fn(() => 0),
}));

describe('helpers', () => {
  const uuidValue = '0bf2bec8-8872-4c66-9ab8-39796b7a49fa';
  uuid.v4.mockReturnValue(uuidValue);

  const expectedQuestion = {
    ...dummyFormElementData,
    config: {
      element_id: uuidValue,
      optional: true,
      items: initialQuestionItems,
      custom_params: {},
    },
    element_type: 'Forms::Elements::Inputs::SingleChoice',
    form_elements: [],
  };

  const expectedMenuItem = {
    ...dummyFormElementData,
    config: {
      element_id: uuidValue,
      title: 'Sub-section 1.1',
    },
    element_type: 'Forms::Elements::Layouts::MenuItem',
    form_elements: [],
  };

  const expectedMenuGroup = {
    ...dummyFormElementData,
    config: {
      element_id: uuidValue,
      title: 'Section 1',
    },
    element_type: 'Forms::Elements::Layouts::MenuGroup',
    form_elements: [expectedMenuItem],
  };

  const expectedContentElement = {
    ...dummyFormElementData,
    config: {
      element_id: uuidValue,
      title: 'Paragraph 2',
      custom_params: {
        content_type: 'html',
      },
      optional: true,
    },
    element_type: 'Forms::Elements::Layouts::Content',
    form_elements: [],
  };

  const expectedGroupLayoutElement = {
    ...dummyFormElementData,
    config: {
      element_id: uuidValue,
      optional: false,
      title: 'Group 1',
      custom_params: {
        show_title: true,
      },
    },
    element_type: 'Forms::Elements::Layouts::Group',
    form_elements: [],
  };

  it('should create a question', () => {
    expect(createQuestion()).toEqual(expectedQuestion);
  });

  it('should create a menu item', () => {
    expect(createMenuItem({ menuGroupIndex: 0, menuItemIndex: 0 })).toEqual(
      expectedMenuItem
    );
  });

  it('should create a menu group', () => {
    expect(createMenuGroup({ menuGroupIndex: 0 })).toEqual(expectedMenuGroup);
  });

  it('should create a content paragraph', () => {
    expect(createContentElement({ elementIndex: 1 })).toEqual(
      expectedContentElement
    );
  });

  it('should create a group layout element', () => {
    expect(createGroupLayoutElement({ elementIndex: 0 })).toEqual(
      expectedGroupLayoutElement
    );
  });

  it('should duplicate a menu group element and lower tree', () => {
    const expectStructure = {
      ...expectedMenuGroup,
      config: {
        ...expectedMenuGroup.config,
        title: `${expectedMenuGroup.config.title} - Copy`,
      },
      form_elements: [
        {
          ...expectedMenuGroup.form_elements[0],
          config: {
            ...expectedMenuGroup.form_elements[0].config,
            title: `${expectedMenuGroup.form_elements[0].config.title} - Copy`,
          },
        },
      ],
    };

    expect(duplicateElementTree(expectedMenuGroup)).toEqual(expectStructure);
  });

  it('should duplicate a menu item element and lower tree', () => {
    const menuItem = {
      ...expectedMenuItem,
      form_elements: [
        {
          ...expectedQuestion,
          config: {
            ...expectedQuestion.config,
            title: 'Is it raining?',
          },
        },
      ],
    };

    const expectStructure = {
      ...menuItem,
      config: {
        ...menuItem.config,
        title: `${menuItem.config.title} - Copy`,
      },
      form_elements: [
        {
          ...menuItem.form_elements[0],
          config: {
            ...menuItem.form_elements[0].config,
            title: menuItem.form_elements[0].config.title,
          },
        },
      ],
    };

    expect(duplicateElementTree(menuItem)).toEqual(expectStructure);
  });
});
