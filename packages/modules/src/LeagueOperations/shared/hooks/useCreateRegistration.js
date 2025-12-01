/* eslint-disable camelcase */
// @flow
import { useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import useLocationAssign from '@kitman/common/src/hooks/useLocationAssign';
import {
  getRequirementId,
  getUserId,
} from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/registrationRequirementsSelectors';
import {
  useCreateRegistrationFormMutation,
  useFetchRegistrationRequirementsProfileFormQuery,
} from '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationFormApi';
import { useFetchRegistrationProfileQuery } from '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationProfileApi';
import {
  getFormAnswersFactory,
  getFormAnswerSetIdFactory,
} from '@kitman/modules/src/HumanInput/shared/redux/selectors/formStateSelectors';
import useStatus from '@kitman/modules/src/HumanInput/hooks/useStatus';
import createFormAnswersRequestBody from '@kitman/modules/src/HumanInput/shared/utils/common';
import type { FieldState } from '@kitman/modules/src/HumanInput/types/forms';
import type { ValidationStatus } from '@kitman/modules/src/HumanInput/types/validation';
import useFormToasts from './useFormToasts';

type ReturnType = {
  handleOnCreateRegistration: () => Promise<void>,
  isDisabled: boolean,
};

const useCreateRegistration = (): ReturnType => {
  const locationAssign = useLocationAssign();
  const {
    onClearToasts,
    onInvalidationToast,
    onSaveErrorToast,
    onSaveSuccessToast,
    onSaveRedirectToast,
  } = useFormToasts();

  const requirementId = useSelector(getRequirementId);
  const userId = useSelector(getUserId);

  const [
    createRegistration,
    {
      isLoading: isLoadingCreate,
      isError: isErrorCreate,
      isSuccess: isSuccessCreate,
    },
  ] = useCreateRegistrationFormMutation();

  const formAnswerSetId: number = useSelector(getFormAnswerSetIdFactory());
  const formAnswers: FieldState = useSelector(getFormAnswersFactory());

  const validationStatus: ValidationStatus = useStatus({
    fields: Object.keys(formAnswers).map(Number),
  });

  const isDisabled: boolean =
    validationStatus === 'INVALID' ||
    validationStatus === 'PENDING' ||
    isLoadingCreate;

  const { refetch: onRefetchRequirements } =
    useFetchRegistrationRequirementsProfileFormQuery(
      { user_id: userId, requirement_id: requirementId },
      { skip: !(userId || requirementId) }
    );

  const { refetch: onRefetchProfile } = useFetchRegistrationProfileQuery(
    { id: userId },
    { skip: !userId }
  );

  const onHandleRefreshProfile = useCallback(() => {
    onRefetchRequirements({ user_id: userId, requirement_id: requirementId });
    onRefetchProfile({ id: userId });
  }, [onRefetchRequirements, onRefetchProfile, userId, requirementId]);

  const onRedirect = useCallback(() => {
    onSaveRedirectToast();
    setTimeout(() => {
      onClearToasts();
      locationAssign(
        `/registration/requirements?requirement_id=${requirementId}&user_id=${userId}`
      );
    }, 2000);
  }, [
    requirementId,
    userId,
    locationAssign,
    onClearToasts,
    onSaveRedirectToast,
  ]);

  useEffect(() => {
    if (isSuccessCreate) {
      onHandleRefreshProfile();
      onSaveSuccessToast();
      onRedirect();
    }
  }, [isSuccessCreate]);

  useEffect(() => {
    onClearToasts();
    if (isErrorCreate) {
      onSaveErrorToast();
    }
  }, [isErrorCreate, onClearToasts]);

  const handleOnCreateRegistration = useCallback(async () => {
    if (validationStatus === 'INVALID') {
      onInvalidationToast();
    } else {
      const { answers, form_answers_set } = createFormAnswersRequestBody(
        formAnswerSetId,
        formAnswers
      );
      await createRegistration({
        id: userId,
        requirement_id: requirementId,
        answers,
        form_answers_set_id: form_answers_set.id,
      }).unwrap();
    }
  }, [
    onInvalidationToast,
    validationStatus,
    createRegistration,
    formAnswerSetId,
    formAnswers,
    requirementId,
    userId,
  ]);

  return {
    handleOnCreateRegistration,
    isDisabled,
  };
};

export default useCreateRegistration;
