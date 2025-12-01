// @flow

import { useFetchAssignedFormsQuery } from '@kitman/services/src/services/humanInput/humanInput';
import type { FormAssignment } from '@kitman/modules/src/HumanInput/types/forms';

type UseFetchFormAnswersSetQueryReturnType = {
  isLoading: boolean,
  isError: boolean,
  isSuccess: boolean,
  data: FormAssignment,
};

type ReturnType = {
  isLoading: boolean,
  isError: boolean,
  isSuccess: boolean,
};

const useAthleteAssignedForms = (): ReturnType => {
  const {
    isLoading,
    isError,
    isSuccess,
    data: assignedFormsData,
  }: UseFetchFormAnswersSetQueryReturnType = useFetchAssignedFormsQuery({
    formId: '',
    formStatus: '',
    page: '1',
    perPage: '25',
  });

  return {
    isLoading,
    isError,
    isSuccess,
    assignedFormsData,
  };
};

export default useAthleteAssignedForms;
