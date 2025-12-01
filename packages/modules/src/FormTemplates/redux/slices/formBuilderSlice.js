// @flow

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type {
  HumanInputFormElement,
  BrandingHeaderConfig,
  SettingsConfig,
} from '@kitman/modules/src/HumanInput/types/forms';
import {
  createFormElementsMap,
  updateElementById,
} from '@kitman/modules/src/FormTemplates/redux/slices/utils/helpers';
import { initialState } from './utils/consts';
import type { FormBuilderState } from './utils/types';
import {
  createMenuGroup,
  createMenuItem,
  createQuestion,
  createContentElement,
  createGroupLayoutElement,
  duplicateElementTree,
} from './utils/helpers';

export const REDUCER_KEY = 'formBuilderSlice';

type SetMetaDataFieldInput = {
  field: $Keys<typeof initialState.metaData>,
  value: string,
};

type UpdateQuestionElement = {
  questionIndex: number,
  field: string,
  value: Object, // Will be changed soon, once we have a type for the question
};

type SetMenuItemsStructureForMenuGroup = {
  menuGroupIndex: number,
  updatedMenuItemsStructure: Array<HumanInputFormElement>,
};

type SetQuestionsStructureForMenuItem = {
  menuGroupIndex: number,
  menuItemIndex: number,
  updatedQuestionsStructure: Array<HumanInputFormElement>,
};

type SetQuestionsStructureForLayoutGroup = {
  menuGroupIndex: number,
  menuItemIndex: number,
  groupIndex: number,
  updatedQuestionsStructure: Array<HumanInputFormElement>,
};

type SetFormTemplateStructure = {
  structure: HumanInputFormElement,
};

type UpdateElementsStateAction = {
  payload: {
    elements: Array<HumanInputFormElement>,
  },
};

export const formBuilderSlice = createSlice({
  name: REDUCER_KEY,
  initialState,
  reducers: {
    setMetaDataField: (
      state: FormBuilderState,
      action: PayloadAction<SetMetaDataFieldInput>
    ) => {
      const { field, value } = action.payload;
      state.metaData[field] = value;
    },
    resetMetaData: (state: FormBuilderState) => {
      state.metaData = initialState.metaData;
    },
    addMenuGroup: (state: FormBuilderState) => {
      const index =
        state.structure.form_elements[0].form_elements[0].form_elements.length;
      state.structure.form_elements[0].form_elements[0].form_elements.push(
        createMenuGroup({ menuGroupIndex: index })
      );
    },
    duplicateMenuGroup: (
      state: FormBuilderState,
      action: PayloadAction<{ menuGroupIndex: number }>
    ) => {
      const { menuGroupIndex } = action.payload;

      const dupedMenuGroup = duplicateElementTree(
        state.structure.form_elements[0].form_elements[0].form_elements[
          menuGroupIndex
        ]
      );
      state.structure.form_elements[0].form_elements[0].form_elements.push(
        dupedMenuGroup
      );
    },
    duplicateMenuItem: (
      state: FormBuilderState,
      action: PayloadAction<{ menuGroupIndex: number, menuItemIndex: number }>
    ) => {
      const { menuGroupIndex, menuItemIndex } = action.payload;

      const dupedMenuItem = duplicateElementTree(
        state.structure.form_elements[0].form_elements[0].form_elements[
          menuGroupIndex
        ].form_elements[menuItemIndex]
      );
      state.structure.form_elements[0].form_elements[0].form_elements[
        menuGroupIndex
      ].form_elements.push(dupedMenuItem);
    },
    duplicateLayoutGroup: (
      state: FormBuilderState,
      action: PayloadAction<{
        menuGroupIndex: number,
        menuItemIndex: number,
        layoutGroupIndex: number,
      }>
    ) => {
      const { menuGroupIndex, menuItemIndex, layoutGroupIndex } =
        action.payload;

      const dupedLayoutGroup = duplicateElementTree(
        state.structure.form_elements[0].form_elements[0].form_elements[
          menuGroupIndex
        ].form_elements[menuItemIndex].form_elements[layoutGroupIndex]
      );
      state.structure.form_elements[0].form_elements[0].form_elements[
        menuGroupIndex
      ].form_elements[menuItemIndex].form_elements.push(dupedLayoutGroup);
    },
    addMenuItemToCurrentMenuGroup: (state: FormBuilderState) => {
      const menuItemIndex =
        state.structure.form_elements[0].form_elements[0].form_elements[
          state.currentMenuGroupIndex
        ].form_elements.length;

      state.structure.form_elements[0].form_elements[0].form_elements[
        state.currentMenuGroupIndex
      ].form_elements.push(
        createMenuItem({
          menuGroupIndex: state.currentMenuGroupIndex,
          menuItemIndex,
        })
      );
    },
    addQuestionToCurrentMenuItem: (state: FormBuilderState) => {
      state.structure.form_elements[0].form_elements[0].form_elements[
        state.currentMenuGroupIndex
      ].form_elements[state.currentMenuItemIndex].form_elements.push(
        createQuestion()
      );
    },
    addContentElementToCurrentMenuItem: (state: FormBuilderState) => {
      const elementIndex =
        state.structure.form_elements[0].form_elements[0].form_elements[
          state.currentMenuGroupIndex
        ].form_elements[state.currentMenuItemIndex].form_elements.length;

      state.structure.form_elements[0].form_elements[0].form_elements[
        state.currentMenuGroupIndex
      ].form_elements[state.currentMenuItemIndex].form_elements.push(
        createContentElement({ elementIndex })
      );
    },
    addContentElementToCurrenLayoutGroupElement: (
      state: FormBuilderState,
      action: PayloadAction<{ elementIndex: number }>
    ) => {
      const elementIndex =
        state.structure.form_elements[0].form_elements[0].form_elements[
          state.currentMenuGroupIndex
        ].form_elements[state.currentMenuItemIndex].form_elements[
          action.payload.elementIndex
        ].form_elements.length;

      state.structure.form_elements[0].form_elements[0].form_elements[
        state.currentMenuGroupIndex
      ].form_elements[state.currentMenuItemIndex].form_elements[
        action.payload.elementIndex
      ].form_elements.push(createContentElement({ elementIndex }));
    },
    addGroupLayoutElementToCurrentMenuItem: (state: FormBuilderState) => {
      const elementIndex =
        state.structure.form_elements[0].form_elements[0].form_elements[
          state.currentMenuGroupIndex
        ].form_elements[state.currentMenuItemIndex].form_elements.length;

      state.structure.form_elements[0].form_elements[0].form_elements[
        state.currentMenuGroupIndex
      ].form_elements[state.currentMenuItemIndex].form_elements.push(
        createGroupLayoutElement({ elementIndex })
      );
    },
    addQuestionToCurrentGroupLayoutElement: (
      state: FormBuilderState,
      action: PayloadAction<{ elementIndex: number }>
    ) => {
      state.structure.form_elements[0].form_elements[0].form_elements[
        state.currentMenuGroupIndex
      ].form_elements[state.currentMenuItemIndex].form_elements[
        action.payload.elementIndex
      ].form_elements.push(createQuestion());
    },
    updateQuestionFromGroupLayoutElement: (
      state: FormBuilderState,
      action: PayloadAction<{
        groupIndex: number,
        questionIndex: number,
        field: string,
        value: Object,
      }>
    ) => {
      const { questionIndex, field, value, groupIndex } = action.payload;

      state.structure.form_elements[0].form_elements[0].form_elements[
        state.currentMenuGroupIndex
      ].form_elements[state.currentMenuItemIndex].form_elements[
        groupIndex
      ].form_elements[questionIndex][field] = value;
    },
    deleteMenuGroup: (
      state: FormBuilderState,
      action: PayloadAction<number>
    ) => {
      state.structure.form_elements[0].form_elements[0].form_elements.splice(
        action.payload,
        1
      );
    },
    deleteMenuItem: (
      state: FormBuilderState,
      action: PayloadAction<{ menuGroupIndex: number, menuItemIndex: number }>
    ) => {
      const { menuGroupIndex, menuItemIndex } = action.payload;
      state.structure.form_elements[0].form_elements[0].form_elements[
        menuGroupIndex
      ].form_elements.splice(menuItemIndex, 1);
    },
    deleteLayoutGroup: (
      state: FormBuilderState,
      action: PayloadAction<{
        menuGroupIndex: number,
        menuItemIndex: number,
        groupIndex: number,
      }>
    ) => {
      const { menuGroupIndex, menuItemIndex, groupIndex } = action.payload;
      state.structure.form_elements[0].form_elements[0].form_elements[
        menuGroupIndex
      ].form_elements[menuItemIndex].form_elements.splice(groupIndex, 1);
    },
    deleteQuestionFromCurrentMenuItem: (
      state: FormBuilderState,
      action: PayloadAction<number>
    ) => {
      state.structure.form_elements[0].form_elements[0].form_elements[
        state.currentMenuGroupIndex
      ].form_elements[state.currentMenuItemIndex].form_elements.splice(
        action.payload,
        1
      );
    },
    deleteQuestionFromCurrentGroupLayoutElement: (
      state: FormBuilderState,
      action: PayloadAction<{
        groupIndex: number,
        questionIndex: number,
      }>
    ) => {
      const { questionIndex, groupIndex } = action.payload;

      state.structure.form_elements[0].form_elements[0].form_elements[
        state.currentMenuGroupIndex
      ].form_elements[state.currentMenuItemIndex].form_elements[
        groupIndex
      ].form_elements.splice(questionIndex, 1);
    },
    updateQuestion: (
      state: FormBuilderState,
      action: PayloadAction<UpdateQuestionElement>
    ) => {
      const { questionIndex, field, value } = action.payload;

      state.structure.form_elements[0].form_elements[0].form_elements[
        state.currentMenuGroupIndex
      ].form_elements[state.currentMenuItemIndex].form_elements[questionIndex][
        field
      ] = value;
    },
    setCurrentMenuGroupTitle: (
      state: FormBuilderState,
      action: PayloadAction<string>
    ) => {
      state.structure.form_elements[0].form_elements[0].form_elements[
        state.currentMenuGroupIndex
      ].config.title = action.payload;
    },
    setCurrentMenuItemTitle: (
      state: FormBuilderState,
      action: PayloadAction<string>
    ) => {
      state.structure.form_elements[0].form_elements[0].form_elements[
        state.currentMenuGroupIndex
      ].form_elements[state.currentMenuItemIndex].config.title = action.payload;
    },
    setCurrentMenuGroupIndex: (
      state: FormBuilderState,
      action: PayloadAction<number>
    ) => {
      state.currentMenuGroupIndex = action.payload;
    },
    setCurrentMenuItemIndex: (
      state: FormBuilderState,
      action: PayloadAction<number>
    ) => {
      state.currentMenuItemIndex = action.payload;
    },
    setMenuFormStructure: (
      state: FormBuilderState,
      action: PayloadAction<Array<HumanInputFormElement>>
    ) => {
      state.structure.form_elements[0].form_elements[0].form_elements =
        action.payload;
    },
    setMenuItemsStructureForMenuGroup: (
      state: FormBuilderState,
      action: PayloadAction<SetMenuItemsStructureForMenuGroup>
    ) => {
      state.structure.form_elements[0].form_elements[0].form_elements[
        action.payload.menuGroupIndex
      ].form_elements = action.payload.updatedMenuItemsStructure;
    },
    setQuestionsStructureForMenuItem: (
      state: FormBuilderState,
      action: PayloadAction<SetQuestionsStructureForMenuItem>
    ) => {
      state.structure.form_elements[0].form_elements[0].form_elements[
        action.payload.menuGroupIndex
      ].form_elements[action.payload.menuItemIndex].form_elements =
        action.payload.updatedQuestionsStructure;
    },
    setQuestionsStructureForLayoutGroup: (
      state: FormBuilderState,
      action: PayloadAction<SetQuestionsStructureForLayoutGroup>
    ) => {
      state.structure.form_elements[0].form_elements[0].form_elements[
        action.payload.menuGroupIndex
      ].form_elements[action.payload.menuItemIndex].form_elements[
        action.payload.groupIndex
      ].form_elements = action.payload.updatedQuestionsStructure;
    },
    setFormTemplateStructure: (
      state: FormBuilderState,
      action: PayloadAction<SetFormTemplateStructure>
    ) => {
      state.structure = action.payload.structure;
    },
    setFormMenuElementTitle: (
      state: FormBuilderState,
      action: PayloadAction<string>
    ) => {
      state.structure.form_elements[0].config.title = action.payload;
      state.structure.form_elements[0].form_elements[0].config.title =
        action.payload;
    },
    setOriginalFormTemplateStructure: (
      state: FormBuilderState,
      action: PayloadAction<SetFormTemplateStructure>
    ) => {
      state.originalStructure = action.payload.structure;
    },
    setShowFormBuilder: (
      state: FormBuilderState,
      action: PayloadAction<boolean>
    ) => {
      state.showFormBuilder = action.payload;
    },
    setShowFormHeaderModal: (
      state: FormBuilderState,
      action: PayloadAction<boolean>
    ) => {
      state.showFormHeaderModal = action.payload;
    },
    setBrandingHeaderConfig: (
      state: FormBuilderState,
      action: PayloadAction<{ headerConfig: BrandingHeaderConfig }>
    ) => {
      state.structure.config = {
        ...(state.structure.config ? state.structure.config : {}),
        header: action.payload.headerConfig,
      };
    },
    setSettingsConfig: (
      state: FormBuilderState,
      action: PayloadAction<{ settings: SettingsConfig }>
    ) => {
      state.structure.config = {
        ...(state.structure.config ? state.structure.config : {}),
        settings: action.payload.settings,
      };
    },
    setPostProcessorsConfig: (
      state: FormBuilderState,
      action: PayloadAction<{ postProcessors: Array<Object> }>
    ) => {
      state.structure.config = {
        ...(state.structure.config ? state.structure.config : {}),
        post_processors: action.payload.postProcessors,
      };
    },
    resetFormBuilderStructure: (state: FormBuilderState) => {
      state.structure = initialState.structure;
    },
    resetFormBuilderMetadata: (state: FormBuilderState) => {
      state.metaData = initialState.metaData;
    },
    updateElementsState: (
      state: FormBuilderState,
      action: PayloadAction<UpdateElementsStateAction>
    ) => {
      state.elements = Object.assign(
        {},
        ...action.payload.elements.map(createFormElementsMap)
      );
    },
    updateConditionalElementsState: (
      state: FormBuilderState,
      action: PayloadAction<{ conditionalElementsMap: Object }>
    ) => {
      state.conditionalElements = action.payload.conditionalElementsMap;
    },
    updateFormElementById: (
      state: FormBuilderState,
      action: PayloadAction<{ id: number, newConfig: Object }>
    ) => {
      // $FlowIgnore[speculation-ambiguous] updateElementById returns Array<HumanInputFormElement>
      state.structure = {
        ...state.structure,
        form_elements: updateElementById(
          state.structure.form_elements,
          action.payload.id,
          action.payload.newConfig
        ),
      };
    },
  },
});

export const {
  setMetaDataField,
  resetMetaData,
  addMenuGroup,
  addMenuItemToCurrentMenuGroup,
  addQuestionToCurrentMenuItem,
  addContentElementToCurrentMenuItem,
  addGroupLayoutElementToCurrentMenuItem,
  addQuestionToCurrentGroupLayoutElement,
  addContentElementToCurrenLayoutGroupElement,
  updateQuestionFromGroupLayoutElement,
  deleteQuestionFromCurrentGroupLayoutElement,
  deleteMenuGroup,
  deleteMenuItem,
  deleteLayoutGroup,
  deleteQuestionFromCurrentMenuItem,
  duplicateMenuGroup,
  duplicateMenuItem,
  duplicateLayoutGroup,
  updateQuestion,
  setCurrentMenuGroupTitle,
  setCurrentMenuItemTitle,
  setCurrentMenuGroupIndex,
  setCurrentMenuItemIndex,
  setMenuFormStructure,
  setMenuItemsStructureForMenuGroup,
  setQuestionsStructureForMenuItem,
  setQuestionsStructureForLayoutGroup,
  setFormTemplateStructure,
  setShowFormBuilder,
  setFormMenuElementTitle,
  resetFormBuilderStructure,
  resetFormBuilderMetadata,
  setOriginalFormTemplateStructure,
  updateElementsState,
  updateConditionalElementsState,
  updateFormElementById,
  setShowFormHeaderModal,
  setBrandingHeaderConfig,
  setSettingsConfig,
  setPostProcessorsConfig,
} = formBuilderSlice.actions;
