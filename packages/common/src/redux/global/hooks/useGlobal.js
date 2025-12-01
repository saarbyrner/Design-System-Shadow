// @flow
import {
  useGetCurrentUserQuery,
  useGetOrganisationQuery,
  useGetPermissionsQuery,
  useGetPreferencesQuery,
  useGetActiveSquadQuery,
} from '@kitman/common/src/redux/global/services/globalApi';

type ReturnType = {
  isLoading: boolean,
  hasFailed: boolean,
  isSuccess: boolean,
};

const useGlobal = (): ReturnType => {
  const {
    isLoading: isActiveSquadLoading,
    isError: isActiveSquadError,
    isSuccess: isActiveSquadSuccess,
  } = useGetActiveSquadQuery();

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
    isLoading: isPreferencesLoading,
    isError: isPreferencesError,
    isSuccess: isPreferencesSuccess,
  } = useGetPreferencesQuery();

  const {
    isLoading: isCurrentUserLoading,
    isError: isCurrentUserError,
    isSuccess: isCurrentUserSuccess,
  } = useGetCurrentUserQuery();

  const isLoading = [
    isCurrentUserLoading,
    isOrganisationLoading,
    isPermissionsLoading,
    isPreferencesLoading,
    isCurrentUserLoading,
    isActiveSquadLoading,
  ].includes(true);
  const hasFailed = [
    isCurrentUserError,
    isOrganisationError,
    isPermissionsError,
    isPreferencesError,
    isCurrentUserError,
    isActiveSquadError,
  ].includes(true);
  const isSuccess = [
    isCurrentUserSuccess,
    isOrganisationSuccess,
    isPermissionsSuccess,
    isPreferencesSuccess,
    isCurrentUserSuccess,
    isActiveSquadSuccess,
  ].every((v) => v === true);

  return {
    isLoading,
    hasFailed,
    isSuccess,
  };
};

export default useGlobal;
