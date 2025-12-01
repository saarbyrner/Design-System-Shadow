// @flow
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { MultiRegistration } from '@kitman/modules/src/LeagueOperations/shared/types/common';
import {
  getRequirementById,
  getRequirementId,
  getUserId,
} from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/registrationRequirementsSelectors';
import { MODES } from '@kitman/modules/src/HumanInput/shared/constants';
import { useFetchCompletedRequirementsQuery } from '@kitman/modules/src/LeagueOperations/shared/redux/api/requirementSectionApi';

import useFormSetup from './useFormSetup';

type ReturnType = {
  isLoading: boolean,
  isError: boolean,
  isSuccess: boolean,
};

const useCompletedRequirementsForm = (): ReturnType => {
  const requirementId = useSelector(getRequirementId);
  const userId = useSelector(getUserId);
  const currentRequirement: ?MultiRegistration = useSelector(
    getRequirementById()
  );

  const { onInitialiseForm } = useFormSetup();

  const {
    data: completedRequirements,
    isLoading,
    isFetching,
    isError,
    isSuccess,
  } = useFetchCompletedRequirementsQuery(
    {
      registration_id: currentRequirement?.id,
      user_id: userId,
    },
    { skip: !(currentRequirement || requirementId || userId) }
  );

  useEffect(() => {
    if (completedRequirements?.registration_form) {
      const root = completedRequirements.registration_form;
      onInitialiseForm({
        root,
        mode: MODES.VIEW,
      });
    }
  }, [completedRequirements, onInitialiseForm]);

  return {
    isLoading: isLoading || isFetching,
    isError,
    isSuccess,
  };
};
export default useCompletedRequirementsForm;
