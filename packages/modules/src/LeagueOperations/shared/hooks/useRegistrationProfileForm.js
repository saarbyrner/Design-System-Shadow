// @flow
import { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import useLocationSearch from '@kitman/common/src/hooks/useLocationSearch';
import { onUpdateValidation } from '@kitman/modules/src/HumanInput/shared/redux/slices/formValidationSlice';
import { validateElement } from '@kitman/modules/src/HumanInput/shared/utils';
import { getCurrentUser } from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/leagueOperationsSelectors';
import { elementIsChildOfRepeatableGroup } from '@kitman/modules/src/HumanInput/shared/utils/form';
import {
  initializeRepeatableGroupsValidation,
  getAllDescendantIds,
} from '@kitman/modules/src/HumanInput/hooks/helperHooks/usePopulateFormState';
import {
  MODES,
  LAYOUT_ELEMENTS,
} from '@kitman/modules/src/HumanInput/shared/constants';
import { useFetchRegistrationRequirementsProfileFormQuery } from '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationFormApi';
import { getFormElementsByTypeFactory } from '@kitman/modules/src/HumanInput/shared/redux/selectors/formStateSelectors';
import useFormSetup from './useFormSetup';

type ReturnType = {
  isLoading: boolean,
  isError: boolean,
  isSuccess: boolean,
};

const useRegistrationProfileForm = (): ReturnType => {
  const dispatch = useDispatch();
  const currentUser = useSelector(getCurrentUser());
  const layoutGroupElements = useSelector(
    getFormElementsByTypeFactory(LAYOUT_ELEMENTS.Group)
  );

  const urlParams = useLocationSearch();
  const userId: ?string = urlParams?.get('user_id') ?? currentUser.id;
  const requirementId: ?string = urlParams?.get('requirement_id');

  const { onInitialiseForm } = useFormSetup();

  const {
    data: formStructure,
    isLoading,
    isError,
    isSuccess,
  } = useFetchRegistrationRequirementsProfileFormQuery(
    { user_id: userId, requirement_id: requirementId },
    { skip: !(userId || requirementId) }
  );

  const repeatableGroups = layoutGroupElements.filter(
    (element) => element.config.repeatable
  );

  const conditionalChildrenIds = useMemo(() => {
    const conditionalGroupElements = layoutGroupElements.filter(
      (element) => element.config.condition
    );
    const idSet = new Set<number>();
    conditionalGroupElements.forEach((group) => {
      getAllDescendantIds(group.form_elements, idSet);
    });
    return idSet;
  }, [layoutGroupElements]);

  const handleFormAnswersValidation = () => {
    const answers = formStructure?.form_answers || [];
    answers.forEach((answer) => {
      const answerValue = answer.value;
      const formElement = answer.form_element;

      if (
        elementIsChildOfRepeatableGroup(repeatableGroups, formElement.id) &&
        Array.isArray(answerValue)
      ) {
        initializeRepeatableGroupsValidation(
          formElement,
          answerValue,
          dispatch,
          conditionalChildrenIds
        );
      } else {
        const { status, message } = validateElement(formElement, answerValue);

        dispatch(
          onUpdateValidation({
            [formElement.id]: {
              status,
              message,
            },
          })
        );
      }
    });
  };

  useEffect(() => {
    if (formStructure?.form_template_version?.form_elements) {
      const root = formStructure;

      onInitialiseForm({
        root,
        mode: MODES.VIEW,
      });
      handleFormAnswersValidation();
    }
  }, [formStructure, onInitialiseForm]);

  return {
    isLoading,
    isError,
    isSuccess,
  };
};
export default useRegistrationProfileForm;
