import structuredClone from 'core-js/stable/structured-clone';
import uuid from 'uuid';

import { PDF_EXPORT_PROCESSOR } from '@kitman/modules/src/HumanInput/shared/constants';
import { formTypeEnumLike } from '@kitman/modules/src/FormTemplates/shared/enum-likes';
import {
  setMetaDataField,
  formBuilderSlice,
  updateQuestion,
  addMenuGroup,
  addMenuItemToCurrentMenuGroup,
  addQuestionToCurrentMenuItem,
  deleteMenuGroup,
  deleteMenuItem,
  deleteQuestionFromCurrentMenuItem,
  setCurrentMenuGroupIndex,
  setCurrentMenuItemIndex,
  setCurrentMenuItemTitle,
  setCurrentMenuGroupTitle,
  setMenuFormStructure,
  setMenuItemsStructureForMenuGroup,
  setQuestionsStructureForMenuItem,
  resetMetaData,
  setShowFormHeaderModal,
  setSettingsConfig,
  setPostProcessorsConfig,
} from '../formBuilderSlice';
import { initialState, customState } from '../utils/consts';
import {
  createMenuGroup,
  createMenuItem,
  createQuestion,
} from '../utils/helpers';

jest.mock('uuid', () => ({
  v4: jest.fn(),
}));

jest.mock('@kitman/modules/src/FormTemplates/shared/helpers', () => ({
  ...jest.requireActual('@kitman/modules/src/FormTemplates/shared/helpers'),
  generateUniqueNumberId: jest.fn(() => 0),
}));

describe('formBuilderSlice', () => {
  uuid.v4.mockReturnValue('0bf2bec8-8872-4c66-9ab8-39796b7a49fa');
  it('should have an initial state', () => {
    const action = { type: 'unknown' };
    const expectedState = initialState;

    expect(formBuilderSlice.reducer(initialState, action)).toEqual(
      expectedState
    );
  });

  describe('should correctly update state on setMetaDataField', () => {
    it.each([
      { field: 'title', value: 'Pikachu' },
      { field: 'type', value: formTypeEnumLike.policy },
      { field: 'category', value: 'Training' },
      { field: 'createdAt', value: '2024-07-10T00:00:00+00:00' },
      { field: 'creator', value: 'Ash Ketchum' },
      { field: 'description', value: 'How to train a Pikachu' },
      { field: 'formCategoryId', value: 1 },
    ])('should update the $field field', ({ field, value }) => {
      const action = setMetaDataField({ field, value });

      expect(formBuilderSlice.reducer(initialState, action)).toEqual({
        ...initialState,
        metaData: {
          ...initialState.metaData,
          [field]: value,
        },
      });
    });
  });

  it('should reset metaData', () => {
    const state = {
      ...initialState,
      metaData: {
        ...initialState.metaData,
        title: 'Ash',
      },
    };
    expect(formBuilderSlice.reducer(state, resetMetaData())).toEqual(
      initialState
    );
  });

  describe('adding elements', () => {
    it('should correctly add a menu group', () => {
      const action = addMenuGroup();

      const stateClone = structuredClone(initialState);

      stateClone.structure.form_elements[0].form_elements[0].form_elements.push(
        createMenuGroup({ menuGroupIndex: 1 })
      );

      expect(formBuilderSlice.reducer(initialState, action)).toEqual(
        stateClone
      );
    });

    it('should correctly add a menu item to the current menu group', () => {
      const action = addMenuItemToCurrentMenuGroup();

      const stateClone = structuredClone(initialState);

      stateClone.structure.form_elements[0].form_elements[0].form_elements[
        stateClone.currentMenuGroupIndex
      ].form_elements.push(
        createMenuItem({ menuGroupIndex: 0, menuItemIndex: 1 })
      );

      expect(formBuilderSlice.reducer(initialState, action)).toEqual(
        stateClone
      );
    });

    it('should correctly add a question to the current menu item', () => {
      const action = addQuestionToCurrentMenuItem();

      const stateClone = structuredClone(initialState);

      stateClone.structure.form_elements[0].form_elements[0].form_elements[
        stateClone.currentMenuGroupIndex
      ].form_elements[stateClone.currentMenuItemIndex].form_elements.push(
        createQuestion()
      );

      expect(formBuilderSlice.reducer(initialState, action)).toEqual(
        stateClone
      );
    });
  });

  describe('deleting elements', () => {
    it('should correctly delete a menu group', () => {
      formBuilderSlice.reducer(initialState, addMenuGroup());

      expect(
        formBuilderSlice.reducer(initialState, deleteMenuGroup(1))
      ).toEqual(initialState);
    });

    it('should correctly delete a menu item from the current menu group', () => {
      formBuilderSlice.reducer(initialState, addMenuItemToCurrentMenuGroup());

      expect(
        formBuilderSlice.reducer(
          initialState,
          deleteMenuItem({ menuGroupIndex: 0, menuItemIndex: 1 })
        )
      ).toEqual(initialState);
    });

    it('should correctly delete a question from the current menu item', () => {
      formBuilderSlice.reducer(initialState, addQuestionToCurrentMenuItem());

      expect(
        formBuilderSlice.reducer(
          initialState,
          deleteQuestionFromCurrentMenuItem(1)
        )
      ).toEqual(initialState);
    });
  });

  it('should correctly update state on updateQuestion', () => {
    const questionIndex = 0;
    const field = 'element_type';
    const value = 'Forms::Elements::Inputs::MultipleChoice';
    const action = updateQuestion({
      questionIndex,
      field,
      value,
    });

    const stateClone = structuredClone(customState);

    const menuGroup =
      stateClone.structure.form_elements[0].form_elements[0].form_elements[
        stateClone.currentMenuGroupIndex
      ];
    const menuItem = menuGroup.form_elements[stateClone.currentMenuItemIndex];
    const question = menuItem.form_elements[questionIndex];
    question[field] = value;

    expect(formBuilderSlice.reducer(customState, action)).toEqual(stateClone);
  });

  it('should correctly update state on setSettingsConfig', () => {
    const settings = {
      can_edit_submitted_forms: true,
      can_save_drafts: true,
      input_method: {
        athlete_app: true,
        kiosk_app: true,
        web: false,
      },
    };

    const action = setSettingsConfig({
      settings,
    });

    const stateClone = structuredClone(customState);

    expect(formBuilderSlice.reducer(customState, action)).toEqual({
      ...stateClone,
      structure: {
        ...stateClone.structure,
        config: {
          settings,
        },
      },
    });
  });

  it('should correctly update state on setPostProcessorsConfig', () => {
    const action = setPostProcessorsConfig({
      postProcessors: [PDF_EXPORT_PROCESSOR],
    });

    const stateClone = structuredClone(customState);

    expect(formBuilderSlice.reducer(customState, action)).toEqual({
      ...stateClone,
      structure: {
        ...stateClone.structure,
        config: {
          post_processors: [PDF_EXPORT_PROCESSOR],
        },
      },
    });
  });

  it('should correctly update state on setCurrentMenuGroupTitle', () => {
    const newTitle = 'Pikachu';
    const action = setCurrentMenuGroupTitle(newTitle);
    const stateClone = structuredClone(initialState);

    const menuGroup =
      stateClone.structure.form_elements[0].form_elements[0].form_elements[
        stateClone.currentMenuGroupIndex
      ];
    menuGroup.config.title = newTitle;
    expect(formBuilderSlice.reducer(initialState, action)).toEqual(stateClone);
  });

  it('should correctly update state on setCurrentMenuItemTitle', () => {
    const newTitle = 'Charmander';
    const action = setCurrentMenuItemTitle(newTitle);
    const stateClone = structuredClone(initialState);

    const menuGroup =
      stateClone.structure.form_elements[0].form_elements[0].form_elements[
        stateClone.currentMenuGroupIndex
      ];
    const menuItem = menuGroup.form_elements[stateClone.currentMenuItemIndex];
    menuItem.config.title = newTitle;
    expect(formBuilderSlice.reducer(initialState, action)).toEqual(stateClone);
  });

  it('should correctly update state on setCurrentMenuGroupIndex', () => {
    const newMenuGroupIndex = 2;
    const action = setCurrentMenuGroupIndex(newMenuGroupIndex);
    expect(formBuilderSlice.reducer(initialState, action)).toEqual({
      ...initialState,
      currentMenuGroupIndex: newMenuGroupIndex,
    });
  });

  it('should correctly update state on setCurrentMenuItemIndex', () => {
    const newMenuItemIndex = 2;
    const action = setCurrentMenuItemIndex(newMenuItemIndex);
    expect(formBuilderSlice.reducer(initialState, action)).toEqual({
      ...initialState,
      currentMenuItemIndex: newMenuItemIndex,
    });
  });

  it('should correctly update state on setShowFormHeaderModal', () => {
    const action = setShowFormHeaderModal(true);
    expect(formBuilderSlice.reducer(initialState, action)).toEqual({
      ...initialState,
      showFormHeaderModal: true,
    });
  });

  it('should correctly update state on setMenuFormStructure', () => {
    const newMenuFormStructure = [
      {
        id: 1,
        config: {
          element_id: uuid.v4(),
        },
        element_type: 'Forms::Elements::Layouts::MenuGroup',
        form_elements: [],
      },
      {
        id: 2,
        config: {
          element_id: uuid.v4(),
        },
        element_type: 'Forms::Elements::Layouts::MenuGroup',
        form_elements: [],
      },
    ];

    const action = setMenuFormStructure(newMenuFormStructure);
    expect(formBuilderSlice.reducer(initialState, action)).toEqual({
      ...initialState,
      structure: {
        ...initialState.structure,
        form_elements: [
          {
            ...initialState.structure.form_elements[0],
            form_elements: [
              {
                ...initialState.structure.form_elements[0].form_elements[0],
                form_elements: newMenuFormStructure,
              },
            ],
          },
        ],
      },
    });
  });

  it('should correctly update state on setMenuItemsStructureForMenuGroup', () => {
    const updatedMenuItemsStructure = [
      {
        id: 1,
        config: {
          element_id: uuid.v4(),
        },
        element_type: 'Forms::Elements::Layouts::MenuItem',
        form_elements: [],
      },
      {
        id: 2,
        config: {
          element_id: uuid.v4(),
        },
        element_type: 'Forms::Elements::Layouts::MenuItem',
        form_elements: [],
      },
    ];

    const menuGroupIndex = 0;

    const action = setMenuItemsStructureForMenuGroup({
      updatedMenuItemsStructure,
      menuGroupIndex,
    });

    expect(formBuilderSlice.reducer(initialState, action)).toEqual({
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
                      .form_elements[menuGroupIndex],
                    form_elements: updatedMenuItemsStructure,
                  },
                ],
              },
            ],
          },
        ],
      },
    });
  });

  it('should correctly update state on setQuestionsStructureForMenuItem', () => {
    const updatedQuestionsStructure = [
      {
        id: 1,
        config: {
          element_id: uuid.v4(),
        },
        element_type: 'Forms::Elements::Inputs::Boolean',
        form_elements: [],
      },
      {
        id: 2,
        config: {
          element_id: uuid.v4(),
        },
        element_type: 'Forms::Elements::Layouts::SingleChoice',
        form_elements: [],
      },
    ];

    const menuGroupIndex = 0;
    const menuItemIndex = 0;

    const action = setQuestionsStructureForMenuItem({
      updatedQuestionsStructure,
      menuGroupIndex,
      menuItemIndex,
    });

    expect(formBuilderSlice.reducer(initialState, action)).toEqual({
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
                        ...initialState.structure.form_elements[0]
                          .form_elements[0].form_elements[menuGroupIndex]
                          .form_elements[menuItemIndex],
                        form_elements: updatedQuestionsStructure,
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    });
  });
});
