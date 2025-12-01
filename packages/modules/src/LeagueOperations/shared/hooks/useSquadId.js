// @flow
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import useGlobal from '@kitman/common/src/redux/global/hooks/useGlobal';

import { useGetPermissionsQuery } from '@kitman/common/src/redux/global/services/globalApi';
import useLocationSearch from '@kitman/common/src/hooks/useLocationSearch';
import { getCurrentSquad } from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/leagueOperationsSelectors';
import { useFetchSquadQuery } from '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationSquadApi';

import { onSetSquad, onSetId } from '../redux/slices/registrationSquadSlice';

type ReturnType = {
  isLoading: boolean,
  isError: boolean,
  isSuccess: boolean,
};
/**
 * Custom hook to manage squad ID retrieval and state updates based on URL parameters or global state.
 * This hook supports both Single Page Application (SPA) and Medinah environments by utilizing
 * appropriate routing or window location methods to determine the current squad context.
 *
 * Usage scenarios:
 * 1. Association Admin View:
 *    - Retrieves the squad ID from the URL parameter 'id'.
 *    - If the URL parameter is absent, defaults to the second scenario.
 *
 * 2. Squad Admin View:
 *    - Directly uses the squad ID from the global state when no URL parameters are present.
 *
 * The hook triggers API calls to fetch squad data based on the resolved squad ID. It also handles loading, error, and success states to facilitate
 * the management of squad-related operations.
 *
 * @returns {ReturnType} Object containing the loading, error, and success status of the squad data retrieval.
 *   - isLoading: Boolean indicating if the squad data is currently being loaded.
 *   - isError: Boolean indicating if there was an error during the squad data retrieval.
 *   - isSuccess: Boolean indicating if the squad data was successfully retrieved.
 */

const useSquadId = (): ReturnType => {
  const {
    isLoading: isGlobalLoading,
    hasFailed: hasGlobalFailed,
    isSuccess: isGlobalSuccess,
  } = useGlobal();

  const dispatch = useDispatch();
  const urlParams = useLocationSearch();
  const locationId: ?string = urlParams?.get('id');
  const currentSquad = useSelector(getCurrentSquad());

  const {
    isLoading: isPermissionsLoading,
    isError: hasPermissionsFailed,
    isSuccess: isPermissionsSuccess,
  } = useGetPermissionsQuery();

  const {
    data: squad,
    isLoading: isSquadLoading,
    isError: hasSquadFailed,
    isSuccess: isSquadSuccess,
  } = useFetchSquadQuery(locationId ?? currentSquad?.id, {
    skip: !(locationId || currentSquad?.id),
  });

  useEffect(() => {
    if (locationId || currentSquad?.id) {
      dispatch(onSetId({ id: locationId }));
    }
    if (squad) {
      dispatch(onSetSquad({ squad }));
    }
  }, [locationId, currentSquad, squad, dispatch]);

  const isLoading = [
    isSquadLoading,
    isGlobalLoading,
    isPermissionsLoading,
  ].includes(true);

  const isError = [
    hasSquadFailed,
    hasGlobalFailed,
    hasPermissionsFailed,
  ].includes(true);

  const isSuccess = [
    isSquadSuccess,
    isGlobalSuccess,
    isPermissionsSuccess,
  ].every((v) => v === true);

  return {
    isLoading,
    isError,
    isSuccess,
  };
};
export default useSquadId;
