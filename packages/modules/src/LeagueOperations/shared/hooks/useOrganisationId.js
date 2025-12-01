// @flow
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import useGlobal from '@kitman/common/src/redux/global/hooks/useGlobal';

import { useGetPermissionsQuery } from '@kitman/common/src/redux/global/services/globalApi';
import useLocationSearch from '@kitman/common/src/hooks/useLocationSearch';
import { getCurrentOrganisation } from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/leagueOperationsSelectors';

import { useFetchRegistrationOrganisationQuery } from '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationOrganisationApi';

import {
  onSetId,
  onSetOrganisation,
} from '../redux/slices/registrationOrganisationSlice';

type ReturnType = {
  isLoading: boolean,
  isError: boolean,
  isSuccess: boolean,
};

/**
 * In order to support both SPA and Medinah, useLocationPathname is called
 * to use router params in the case of being within the SPA, or use
 * window.location.pathname in the case of Medinah.
 *
 * Within League Ops Registration, we have two cases where you can land on an organisation home page.
 *
 * 1: You are an association admin and are viewing an organisation
 * - We rely on the url param, a string, which is parsed via parseOrganisationIdRoute.
 * - If this returns null, we then default to case 2.
 *
 * 2: You are an organisation admin, viewing your organisation.
 * - You are viewing your own organisation, there are no url params available, so use the
 *   id that is returned from the getCurrentOrganisation within globalAPI.
 *
 * @returns {ReturnType}
 */

const useOrganisationId = (): ReturnType => {
  const {
    isLoading: isGlobalLoading,
    hasFailed: hasGlobalFailed,
    isSuccess: isGlobalSuccess,
  } = useGlobal();

  const dispatch = useDispatch();

  const urlParams = useLocationSearch();

  const locationId: ?string = urlParams?.get('id');
  const currentOrganisation = useSelector(getCurrentOrganisation());

  const {
    isLoading: isPermissionsLoading,
    isError: hasPermissionsFailed,
    isSuccess: isPermissionsSuccess,
  } = useGetPermissionsQuery();

  const {
    data: organisation,
    isLoading: isOrganisationLoading,
    isError: hasOrganisationFailed,
    isSuccess: isOrganisationSuccess,
  } = useFetchRegistrationOrganisationQuery(
    locationId ?? currentOrganisation?.id,
    { skip: !(locationId || currentOrganisation?.id) }
  );

  useEffect(() => {
    if (locationId || currentOrganisation?.id) {
      dispatch(onSetId({ id: locationId ?? currentOrganisation?.id }));
    }
    if (organisation) {
      dispatch(onSetOrganisation({ organisation }));
    }
  }, [locationId, currentOrganisation, organisation, dispatch]);

  const isLoading = [
    isPermissionsLoading,
    isOrganisationLoading,
    isGlobalLoading,
  ].includes(true);

  const isError = [
    hasPermissionsFailed,
    hasOrganisationFailed,
    hasGlobalFailed,
  ].includes(true);

  const isSuccess = [
    isOrganisationSuccess,
    isPermissionsSuccess,
    isGlobalSuccess,
  ].every((v) => v === true);

  return {
    isLoading,
    isError,
    isSuccess,
  };
};

export default useOrganisationId;
