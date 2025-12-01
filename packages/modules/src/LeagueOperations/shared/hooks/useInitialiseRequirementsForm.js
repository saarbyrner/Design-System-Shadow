/* eslint-disable camelcase */
// @flow
import { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  getRequirementId,
  getUserId,
} from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/registrationRequirementsSelectors';
import {
  MODES,
  LAYOUT_ELEMENTS,
} from '@kitman/modules/src/HumanInput/shared/constants';
import { elementIsChildOfRepeatableGroup } from '@kitman/modules/src/HumanInput/shared/utils/form';
import {
  initializeRepeatableGroupsValidation,
  getAllDescendantIds,
} from '@kitman/modules/src/HumanInput/hooks/helperHooks/usePopulateFormState';
import { type HumanInputFormAnswer } from '@kitman/modules/src/HumanInput/types/forms';
import { useFetchRegistrationRequirementsQuery } from '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationFormApi';
import { getFormElementsByTypeFactory } from '@kitman/modules/src/HumanInput/shared/redux/selectors/formStateSelectors';
import {
  onBuildFormState,
  onSetFormStructure,
  onSetFormAnswersSet,
  onSetMode,
  onUpdateShowMenuIcons,
} from '@kitman/modules/src/HumanInput/shared/redux/slices/formStateSlice';
import { validateElement } from '@kitman/modules/src/HumanInput/shared/utils';
import {
  onBuildValidationState,
  onUpdateValidation,
} from '@kitman/modules/src/HumanInput/shared/redux/slices/formValidationSlice';
import { onBuildFormMenu } from '@kitman/modules/src/HumanInput/shared/redux/slices/formMenuSlice';
import {
  fetchAttachments,
  getInitialRepeatableGroupElementAttachments,
} from '@kitman/modules/src/HumanInput/shared/utils/attachments';
import {
  onUpdate,
  onBuildOriginalQueue,
} from '@kitman/modules/src/HumanInput/shared/redux/slices/formAttachmentSlice';

type ReturnType = {
  isLoading: boolean,
  isError: boolean,
  isSuccess: boolean,
};

const useInitialiseRequirementsForm = (): ReturnType => {
  const dispatch = useDispatch();

  const user_id = useSelector(getUserId);
  const requirement_id = useSelector(getRequirementId);

  const {
    data: formStructure,
    isLoading: isRegistrationRequirementsLoading,
    isError: isRegistrationRequirementsError,
    isSuccess: isRegistrationRequirementsSuccess,
  } = useFetchRegistrationRequirementsQuery(
    { user_id, requirement_id },
    { skip: !(user_id || requirement_id) }
  );

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
            message: `File accepted • Success`,
          },
        };

        dispatch(onBuildOriginalQueue(attachment));
        dispatch(onUpdate(attachment));
      }
    });
  };

  useEffect(() => {
    if (formStructure?.form_template_version?.form_elements) {
      dispatch(
        onSetFormStructure({
          structure: formStructure,
        })
      );
      dispatch(onSetMode({ mode: MODES.CREATE }));
      dispatch(onUpdateShowMenuIcons({ showMenuIcons: true }));

      const elements = formStructure.form_template_version.form_elements;
      const formAnswers = formStructure?.form_answers || [];

      if (formAnswers.length) {
        buildAttachmentsState(formAnswers);
      }

      dispatch(
        onBuildFormState({
          elements,
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
      dispatch(
        onSetFormAnswersSet({
          formAnswers,
        })
      );
    }
  }, [formStructure, dispatch]);

  useEffect(() => {
    const formAnswers = formStructure?.form_answers || [];

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
    formStructure?.form_answers,
    repeatableGroupElements,
    conditionalChildrenIds,
    dispatch,
  ]);

  // Purposely verbose, this may be expanded in the future
  const isLoading = [isRegistrationRequirementsLoading].includes(true);

  const isError = [isRegistrationRequirementsError].includes(true);

  const isSuccess = [isRegistrationRequirementsSuccess].every(
    (v) => v === true
  );

  return {
    isLoading,
    isError,
    isSuccess,
  };
};

export default useInitialiseRequirementsForm;
