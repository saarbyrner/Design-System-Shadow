// @flow

import { useFetchAthleteProfileFormQuery } from '@kitman/services/src/services/humanInput/humanInput';
import {
  useGetOrganisationQuery,
  useGetPermissionsQuery,
} from '@kitman/common/src/redux/global/services/globalApi';
import { usePopulateFormState, useGetAthleteIdFromPath } from './helperHooks';

type ReturnType = {
  isLoading: boolean,
  hasFailed: boolean,
  isSuccess: boolean,
};

const useFormStructure = (): ReturnType => {
  const athleteId = useGetAthleteIdFromPath();

  const {
    isLoading: isOrganisationLoading,
    isError: isOrganisationError,
    isSuccess: isOrganisationSuccess,
  } = useGetOrganisationQuery();

  const {
    isLoading: isPermissionsLoading,
    isError: isPermissionsError,
    isSuccess: isPermissionsSuccess,
  } = useGetPermissionsQuery();

  const {
    isLoading: isFormStructureLoading,
    isError: isFormStructureError,
    isSuccess: isFormStructureSuccess,
    data: formStructure,
  } = useFetchAthleteProfileFormQuery(athleteId);

  usePopulateFormState(formStructure);

  const isLoading = [
    isFormStructureLoading,
    isPermissionsLoading,
    isOrganisationLoading,
  ].includes(true);

  const hasFailed = [
    isFormStructureError,
    isPermissionsError,
    isOrganisationError,
  ].includes(true);

  const isSuccess = [
    isFormStructureSuccess,
    isPermissionsSuccess,
    isOrganisationSuccess,
  ].every((v) => v === true);

  return {
    isLoading,
    hasFailed,
    isSuccess,
  };
};

export default useFormStructure;
