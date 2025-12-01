/* eslint-disable camelcase */
// @flow
import { useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import {
  getRequirementId,
  getUserId,
} from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/registrationRequirementsSelectors';
import { useSaveRegistrationFormMutation } from '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationFormApi';
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
  handleOnSaveRegistration: () => Promise<void>,
  isSaveInProgress: boolean,
  isRefetchingProfile: boolean,
};

const useSaveRegistration = (): ReturnType => {
  const {
    onClearToasts,
    onSaveErrorToast,
    onSaveProgressToast,
    onInvalidationToast,
  } = useFormToasts();

  const requirementId = useSelector(getRequirementId);
  const userId = useSelector(getUserId);
  const formAnswerSetId: number = useSelector(getFormAnswerSetIdFactory());
  const formAnswers: FieldState = useSelector(getFormAnswersFactory());

  const [
    saveRegistrationProgress,
    {
      isError: isSaveProgressError,
      isSuccess: isSaveProgressSuccess,
      isLoading: isSaveInProgress,
    },
  ] = useSaveRegistrationFormMutation();

  const validationStatus: ValidationStatus = useStatus({
    fields: Object.keys(formAnswers).map(Number),
  });

  const { refetch: onRefetchProfile, isFetching: isRefetchingProfile } =
    useFetchRegistrationProfileQuery({ id: userId }, { skip: !userId });

  const onHandleRefreshProfile = useCallback(() => {
    onRefetchProfile({ id: userId });
  }, [onRefetchProfile, userId, requirementId]);

  useEffect(() => {
    if (isSaveProgressSuccess) {
      onHandleRefreshProfile();
      onSaveProgressToast();
    }
  }, [isSaveProgressSuccess]);

  useEffect(() => {
    onClearToasts();
    if (isSaveProgressError) {
      onSaveErrorToast();
    }
  }, [isSaveProgressError, onClearToasts]);

  const handleOnSaveRegistration = useCallback(async () => {
    if (validationStatus === 'INVALID') {
      onInvalidationToast();
    } else {
      const { answers, form_answers_set } = createFormAnswersRequestBody(
        formAnswerSetId,
        formAnswers,
        true
      );
      await saveRegistrationProgress({
        id: userId,
        requirement_id: requirementId,
        answers,
        form_answers_set_id: form_answers_set.id,
      }).unwrap();
    }
  }, [
    onInvalidationToast,
    validationStatus,
    saveRegistrationProgress,
    formAnswerSetId,
    formAnswers,
    requirementId,
    userId,
  ]);

  return {
    handleOnSaveRegistration,
    isSaveInProgress,
    isRefetchingProfile,
  };
};

export default useSaveRegistration;
