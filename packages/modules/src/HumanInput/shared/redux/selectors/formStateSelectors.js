// @flow
import { createSelector } from '@reduxjs/toolkit';

import type {
  FieldState,
  HumanInputForm,
  Mode,
  FormConfig,
  Condition,
  FormElement,
  ElementState,
  Store,
  HumanInputFormElement,
  ElementTypes,
  FormStatus,
  LocalDraft,
} from '@kitman/modules/src/HumanInput/types/forms';
import { REDUCER_KEY } from '@kitman/modules/src/HumanInput/shared/redux/slices/formStateSlice';

import { evaluateCondition } from '@kitman/modules/src/HumanInput/shared/utils/conditional';

// Important to note, for league ops, we will be enforcing a structure on the registration form.
// Given a Form (form):
// form.form_template_version.form_elements wil have one elements of type Forms::Elements::Layouts::Section
// Forms::Elements::Layouts::Section wil have one element of type Forms::Elements::Layouts::Menu
// This is our entry point for the entire form.
// In order to use other forms with these selectors, the below will need to be adpated to suit
const getMenuRoot = (formElement: FormElement, depth: number) => {
  if (!formElement || depth > 2) {
    return null;
  }
  if (formElement.element_type === 'Forms::Elements::Layouts::Menu') {
    return formElement;
  }
  return getMenuRoot(formElement.form_elements[0], depth + 1);
};

export const getStore = (state: Store): Store => state;

export const getFormState = (state: Store): FieldState =>
  state[REDUCER_KEY].form;

export const getOriginalFormState = (state: Store): FieldState =>
  state[REDUCER_KEY].originalForm;

export const getElementState = (state: Store): ElementState =>
  state[REDUCER_KEY].elements;

export const getFormStructureState = (state: Store): HumanInputForm =>
  state[REDUCER_KEY].structure;

export const getFormConfigState = (state: Store): FormConfig =>
  state[REDUCER_KEY].config;

export const getFieldValueFactory = (id: number) =>
  createSelector([getFormState], (formState) => formState[id]);

export const getChildValuesFactory = (ids: Array<number>) =>
  createSelector([getFormState], (formState) => {
    return ids.reduce((acc, elementId) => {
      return { ...acc, [elementId]: formState[elementId] };
    }, {});
  });

export const getFormattedValueFactory = (id: number) =>
  createSelector(
    [getFormStructureState],
    (formStructure) =>
      formStructure?.form_answers?.find(
        (answer) => answer.form_element.id === id
      )?.value_formatted
  );

export const getElementFactory = (key: string) =>
  createSelector([getElementState], (elementState) => elementState[key] || {});

export const getFormTitleFactory = (): string =>
  createSelector(
    [getFormStructureState],
    (structureState) => structureState?.name || structureState?.form?.name || ''
  );

export const getFormBrandingHeaderConfigFactory = (): string =>
  createSelector(
    [getFormStructureState],
    (structureState) =>
      structureState?.form_template_version?.config?.header || null
  );

export const getFormSettingsConfigFactory = (): string =>
  createSelector(
    [getFormStructureState],
    (structureState) =>
      structureState?.form_template_version?.config?.settings || null
  );

export const getAthleteFactory = (): string =>
  createSelector(
    [getFormStructureState],
    (structureState) => structureState?.athlete
  );

export const getUserFactory = (): string =>
  createSelector(
    [getFormStructureState],
    (structureState) => structureState?.user
  );

export const getFormAnswerSetIdFactory = (): number =>
  createSelector(
    [getFormStructureState],
    (structureState) => structureState?.id
  );

export const getFormStructureElements = (): FormElement[] =>
  createSelector(
    [getFormStructureState],
    (structureState) => structureState?.form_template_version?.form_elements
  );

export const getFormStatusFactory = (): FormStatus =>
  createSelector(
    [getFormStructureState],
    (structureState) => structureState.status
  );

export const getFormAnswersFactory = () =>
  createSelector([getFormState], (formState) => formState);

export const getElementsFactory = () =>
  createSelector([getElementState], (elementsState) => elementsState);

export const getOriginalFormFactory = () =>
  createSelector([getOriginalFormState], (originalForm) => originalForm);

export const getShowMenuIconsFactory = (): boolean =>
  createSelector(
    [getFormConfigState],
    (configState) => configState?.showMenuIcons || false
  );

export const getShouldShowMenuFactory = (): boolean =>
  createSelector(
    [getFormConfigState],
    (configState) => configState?.shouldShowMenu ?? true
  );

export const getShouldShowRecoveryModalFactory = (): boolean =>
  createSelector(
    [getFormConfigState],
    (configState) => configState?.showRecoveryModal || false
  );

export const getLocalDraftFactory = (): ?LocalDraft =>
  createSelector(
    [getFormConfigState],
    (configState) => configState?.localDraft || null
  );

export const getShowUnsavedChangesModalFactory = (): boolean =>
  createSelector(
    [getFormConfigState],
    (configState) => configState?.showUnsavedChangesModal || false
  );

export const getModeFactory = (): Mode =>
  createSelector(
    [getFormConfigState],
    (configState) => configState?.mode || 'VIEW'
  );

// Also important to note
// We're enforcing a strict structure on the form menu
// Max depth is two.
// useNavigation hook won't work with depths greater than 2
export const getActiveMenuItemFactory = (
  menuGroupIndex: number,
  menuItemIndex: number
): string =>
  createSelector([getFormStructureState], (structureState) => {
    if (!structureState.form_template_version) return [];
    const root = getMenuRoot(
      structureState.form_template_version?.form_elements[0],
      0
    );
    return root
      ? root.form_elements[menuGroupIndex].form_elements[menuItemIndex]
      : structureState.form_template_version;
  });

export const getConditionElementsFactory = (conditions: Array<Condition>) =>
  createSelector([getElementState, getStore], (elementState, store) =>
    conditions.reduce(
      (acc, { conditions: childConditions, element_id: elementId }) => {
        if (childConditions && Array.isArray(childConditions)) {
          // Recursively process the nested conditions and flatten the result
          return acc.concat(
            getConditionElementsFactory(childConditions)(store)
          );
        }

        // If it's a simple condition, get the element and add it to the accumulator
        acc.push(elementState[elementId]);
        return acc;
      },
      []
    )
  );

export const getLastSavedFactory = (): string | null =>
  createSelector(
    [getFormConfigState],
    (configState) => configState?.lastSaved || null
  );

export const isConditionSatisfied = (condition: Condition) => {
  const conditions = condition.conditions || [];
  const elementId = condition.element_id || '';
  const conditionType = condition.type;

  // the 'and' and 'or' operators need to go through the conditions array
  // rather than the boolean logic like the rest of the operators.

  // Base case for non-'and'/'or' conditions
  if (conditionType !== 'and' && conditionType !== 'or') {
    return createSelector(
      [getElementFactory(elementId), getFormState],
      (element, formState) => {
        const { id } = element;
        const conditionOperand = formState[id];
        // For multiple choice elements, if the stored condition uses '==',
        // automatically switch to 'in' for backwards compatibility
        const operator =
          Array.isArray(conditionOperand) && conditionType === '=='
            ? 'in'
            : conditionType;
        const result = evaluateCondition({
          operator,
          variableA: condition.value,
          variableB: conditionOperand,
        });
        return result;
      }
    );
  }

  // Recursive evaluation for 'and'/'or' conditions
  return createSelector(
    [getConditionElementsFactory(conditions), getFormState, getStore],
    (conditionElements, formState, store) => {
      // Function to evaluate child conditions recursively
      const evaluateChildCondition = (childCondition: Condition) => {
        if (childCondition.type === 'and' || childCondition.type === 'or') {
          // If the child is 'and' or 'or', recurse and evaluate its sub-conditions
          return isConditionSatisfied(childCondition)(store);
        }

        // Otherwise, evaluate as a regular condition
        const element = conditionElements.find(
          (conditionElement) =>
            conditionElement.config.element_id === childCondition.element_id
        );
        const { id } = element;
        const conditionOperand = formState[id];
        // For multiple choice elements, if the stored condition uses '==',
        // automatically switch to 'in' for backwards compatibility
        const operator =
          Array.isArray(conditionOperand) && childCondition.type === '=='
            ? 'in'
            : childCondition.type;

        return evaluateCondition({
          operator,
          variableA: childCondition.value,
          variableB: conditionOperand,
        });
      };

      // For 'and', all child conditions must be satisfied
      if (conditionType === 'and') {
        return conditions.every(evaluateChildCondition);
      }

      // For 'or', at least one child condition must be satisfied
      if (conditionType === 'or') {
        return conditions.some(evaluateChildCondition);
      }

      return false;
    }
  );
};

export const isInEditableMode = (editableModes: Array<string>): boolean => {
  return createSelector([getModeFactory()], (mode) => {
    const result = !!editableModes?.find(
      (editableMode) => editableMode === mode
    );
    return result;
  });
};

export const getFormMenuGroups = (): HumanInputForm => {
  return createSelector([getFormStructureState], (structure) => {
    return structure?.form_template_version?.form_elements[0]?.form_elements[0]
      .form_elements;
  });
};

export const getFormMenuGroupFactory = (
  id: number
): Array<HumanInputFormElement> => {
  return createSelector([getFormMenuGroups()], (groups) => {
    return groups.find((element) => element.id === id);
  });
};

const getAllElementsByType = (
  elements: Array<HumanInputFormElement>,
  type: ElementTypes
): Array<HumanInputFormElement> => {
  let result = [];

  elements?.forEach((element) => {
    if (element.element_type === type) {
      result.push(element);
    }
    if (Array.isArray(element.form_elements)) {
      result = result.concat(getAllElementsByType(element.form_elements, type));
    }
  });

  return result;
};

export const getFormElementsByTypeFactory = (
  type: ElementTypes
): Array<HumanInputFormElement> => {
  return createSelector([getFormStructureElements()], (elements) => {
    return getAllElementsByType(elements, type);
  });
};

export const getElementByIdFactory = ({
  id,
  type,
}: {
  id: number,
  type: ElementTypes,
}): HumanInputFormElement => {
  return createSelector([getFormElementsByTypeFactory(type)], (elements) => {
    return elements.find((element) => element.id === id);
  });
};

export const getOrganisationFactory = (): number => {
  return createSelector([getFormStructureState], (structure) => {
    return structure?.organisation_id;
  });
};
