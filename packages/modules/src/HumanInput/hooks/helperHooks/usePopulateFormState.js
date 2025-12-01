// @flow

import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector, type Dispatch } from 'react-redux';
import { getFormElementsByTypeFactory } from '@kitman/modules/src/HumanInput/shared/redux/selectors/formStateSelectors';
import i18n from '@kitman/common/src/utils/i18n';
import {
  fetchAttachments,
  getInitialRepeatableGroupElementAttachments,
} from '@kitman/modules/src/HumanInput/shared/utils/attachments';
import {
  onUpdate,
  onBuildOriginalQueue,
} from '@kitman/modules/src/HumanInput/shared/redux/slices/formAttachmentSlice';
import {
  onBuildFormState,
  onSetFormStructure,
  onSetFormAnswersSet,
  onUpdateShouldShowMenu,
  onShowRecoveryModal,
} from '@kitman/modules/src/HumanInput/shared/redux/slices/formStateSlice';
import { elementIsChildOfRepeatableGroup } from '@kitman/modules/src/HumanInput/shared/utils/form';
import { validateElement } from '@kitman/modules/src/HumanInput/shared/utils';
import { LAYOUT_ELEMENTS } from '@kitman/modules/src/HumanInput/shared/constants';

import {
  onBuildValidationState,
  onUpdateValidation,
} from '@kitman/modules/src/HumanInput/shared/redux/slices/formValidationSlice';
import { onBuildFormMenu } from '@kitman/modules/src/HumanInput/shared/redux/slices/formMenuSlice';
import type {
  HumanInputFormAnswer,
  HumanInputForm,
  HumanInputFormElement,
} from '@kitman/modules/src/HumanInput/types/forms';

const createArtificialMenuGroup = (
  singleSection: HumanInputFormElement,
  numberOfMenuGroups: number
) => {
  const config = {
    ...singleSection.config,
  };
  const artificialMenuItem: HumanInputFormElement = {
    element_type: 'Forms::Elements::Layouts::MenuItem',
    id: singleSection.id,
    order: 1,
    form_elements: singleSection.form_elements,
    visible: true,
    config,
  };
  const artificialMenuGroup: HumanInputFormElement = {
    element_type: 'Forms::Elements::Layouts::MenuGroup',
    id: singleSection.id,
    order: numberOfMenuGroups + 1,
    visible: true,
    config,
    form_elements: [artificialMenuItem],
  };

  return artificialMenuGroup;
};

const transformVariationWithTwoSections = (data: HumanInputForm) => {
  const {
    form_template_version: { form_elements: formElements },
  } = data;
  const [menuElement, singleSection] = formElements;
  const menuGroups = menuElement.form_elements[0].form_elements;

  const artificialMenuGroup = createArtificialMenuGroup(
    singleSection,
    menuGroups.length
  );

  return {
    ...data,
    form_template_version: {
      ...data.form_template_version,
      form_elements: [
        {
          ...menuElement,
          form_elements: [
            {
              ...menuElement.form_elements[0],
              form_elements: [...menuGroups, artificialMenuGroup],
            },
          ],
        },
      ],
    },
  };
};

export const parseAndTransformFormVariation = (
  data: HumanInputForm,
  dispatch: Dispatch
): HumanInputForm | void => {
  const {
    form_template_version: { form_elements: formElements },
  } = data;

  const isSingleMenuVariation =
    formElements.length === 1 &&
    formElements[0].form_elements[0].element_type ===
      'Forms::Elements::Layouts::Menu';

  if (isSingleMenuVariation) {
    return data; // The structure is like in AthleteProfile, no changes needed
  }

  const isSingleSectionVariation =
    formElements.length === 1 &&
    formElements[0].element_type === 'Forms::Elements::Layouts::Section';
  if (isSingleSectionVariation) {
    dispatch(onUpdateShouldShowMenu(false));
    return data;
  }

  const isVariationWithTwoSections =
    formElements.length === 2 &&
    formElements.every(
      (child) => child.element_type === 'Forms::Elements::Layouts::Section'
    ) &&
    formElements[0].form_elements[0].element_type ===
      'Forms::Elements::Layouts::Menu';

  if (isVariationWithTwoSections) {
    return transformVariationWithTwoSections(data);
  }

  throw new Error('Unsupported Form Variation');
};

// Recursive function to get all descendant IDs of conditional groups
export const getAllDescendantIds = (
  elements: Array<HumanInputFormElement>,
  idSet: Set<number>
) => {
  elements.forEach((element) => {
    idSet.add(element.id);
    if (element.form_elements && element.form_elements.length > 0) {
      getAllDescendantIds(element.form_elements, idSet);
    }
  });
};

export const initializeRepeatableGroupsValidation = (
  element: HumanInputFormElement,
  value: Array<string | boolean | number | null>,
  dispatch: Dispatch,
  conditionalChildrenIds: Set<number>
) => {
  // Default to a valid state, which is correct for optional or conditional elements with no answers.
  const validationValue = [{ status: 'VALID', message: null }];

  // If there are values, the loop processes them and overwrites the default.
  for (let i = 0; i < value.length; i++) {
    const { status, message } = validateElement(element, value[i]);
    validationValue[i] = { status, message };
  }

  // For a non-conditional and required repeatable group with no answers,
  // clear the default 'VALID' state to ensure it's not considered valid.
  if (
    value.length === 0 &&
    !conditionalChildrenIds.has(element.id) &&
    !element.config.optional
  ) {
    validationValue.pop();
  }

  dispatch(
    onUpdateValidation({
      [element.id]: validationValue,
    })
  );
};

export const usePopulateFormState = (data: ?HumanInputForm) => {
  const dispatch = useDispatch();
  const groupElements = useSelector(
    getFormElementsByTypeFactory(LAYOUT_ELEMENTS.Group)
  );
  const repeatableGroupElements = groupElements.filter(
    (element) => element.config.repeatable
  );

  const conditionalChildrenIds = useMemo(() => {
    const conditionalGroupElements = groupElements.filter(
      (element) => element.config.condition
    );
    const idSet = new Set<number>();
    conditionalGroupElements.forEach((group) => {
      getAllDescendantIds(group.form_elements, idSet);
    });
    return idSet;
  }, [groupElements]);

  useEffect(() => {
    const buildAttachmentsState = async (
      formAnswers: Array<HumanInputFormAnswer>
    ) => {
      const attachmentsFiles = await fetchAttachments(formAnswers);

      attachmentsFiles.forEach((attachmentFile) => {
        if (Array.isArray(attachmentFile.attachment)) {
          const repeatableGroupElementAttachments =
            getInitialRepeatableGroupElementAttachments(
              attachmentFile.elementId,
              attachmentFile
            );
          dispatch(onBuildOriginalQueue(repeatableGroupElementAttachments));
          dispatch(onUpdate(repeatableGroupElementAttachments));
        } else {
          const attachment = {
            [attachmentFile.elementId]: {
              file: attachmentFile.attachment,
              state: 'SUCCESS',
              message: `${i18n.t('File accepted')} • ${i18n.t('Success')}`,
            },
          };
          dispatch(onBuildOriginalQueue(attachment));
          dispatch(onUpdate(attachment));
        }
      });
    };

    if (data?.form_template_version?.form_elements) {
      const transformedData = parseAndTransformFormVariation(data, dispatch);
      if (transformedData) {
        dispatch(
          onSetFormStructure({
            structure: transformedData,
          })
        );
        const elements = transformedData.form_template_version.form_elements;
        const formAnswers = transformedData.form_answers;

        // fetch the attachments files present as attachmentsId in form_answers
        // and build the formAttachmentSlice state
        if (formAnswers.length) {
          buildAttachmentsState(formAnswers);
        }

        dispatch(
          onBuildFormState({
            elements,
          })
        );
        dispatch(
          onSetFormAnswersSet({
            formAnswers,
          })
        );
        dispatch(
          onBuildFormMenu({
            elements,
          })
        );
        dispatch(
          onBuildValidationState({
            elements,
          })
        );
      }
    }
  }, [data, dispatch]);

  useEffect(() => {
    const formAnswers = data?.form_answers || [];

    formAnswers.forEach((formAnswer) => {
      const value = formAnswer.value;
      const element = formAnswer.form_element;

      if (
        elementIsChildOfRepeatableGroup(repeatableGroupElements, element.id) &&
        Array.isArray(value)
      ) {
        initializeRepeatableGroupsValidation(
          element,
          value,
          dispatch,
          conditionalChildrenIds
        );
      } else {
        const { status, message } = validateElement(element, value);

        dispatch(
          onUpdateValidation({
            [element.id]: {
              status,
              message,
            },
          })
        );
      }
    });
  }, [
    data?.form_answers,
    repeatableGroupElements,
    conditionalChildrenIds,
    dispatch,
  ]);

  // Effect to check for local draft in localStorage and show recovery modal if needed
  useEffect(() => {
    const handleLocalDraftRecovery = () => {
      const isAutosaveAsDraftSettingEnabled =
        data?.form_template_version?.config?.settings?.autosave_as_draft ||
        false;

      const isAutosaveEnabled =
        window.getFlag('cp-eforms-autosave-as-draft') &&
        isAutosaveAsDraftSettingEnabled;

      if (!isAutosaveEnabled || !data) {
        return;
      }

      const formId = data.form.id;
      const athleteId = data.athlete?.id || '';
      const serverTimestamp = data.form_template_version.updated_at;
      const localCopyKey = `autosave_form_${formId}_${athleteId}`;

      try {
        const localDataString = localStorage?.getItem(localCopyKey);

        if (localDataString) {
          const parsedData = JSON.parse(localDataString);

          // Compare timestamps to decide whether to show recovery modal
          if (new Date(parsedData.timestamp) > new Date(serverTimestamp)) {
            dispatch(onShowRecoveryModal(parsedData));
          } else {
            // If local copy is older, remove it
            localStorage?.removeItem(localCopyKey);
          }
        }
      } catch {
        localStorage?.removeItem(localCopyKey);
      }
    };

    handleLocalDraftRecovery();
  }, [data, dispatch]);
};
