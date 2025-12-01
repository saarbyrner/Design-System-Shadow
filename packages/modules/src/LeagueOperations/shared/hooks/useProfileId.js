// @flow
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import useGlobal from '@kitman/common/src/redux/global/hooks/useGlobal';
import useLocationSearch from '@kitman/common/src/hooks/useLocationSearch';

import { getCurrentUser } from '@kitman/modules/src/LeagueOperations/shared/redux/selectors/leagueOperationsSelectors';

import { useFetchRegistrationProfileQuery } from '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationProfileApi';

import {
  onSetId,
  onSetProfile,
} from '../redux/slices/registrationProfileSlice';

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
 * Within League Ops Registration, we have two cases where you can land on a user profile page.
 *
 * 1: You are an association or club admin and are viewing a staff member or an athlete
 * - We rely on the url param, a string, which is parsed via parseProfileIdRoute.
 * - If this returns null, we then default to case 2.
 *
 * 2: You are a staff member or an athlete and are viewing your own profile.
 * - You are viewing your own profile, there are no url params available, so use the
 *   id that is returned from the useGetCurrentUserQuery within globalAPI.
 *
 * Either way, we pivot off the user_id, regardless if an athlete or a staff member is being viewed.
 * @returns {ReturnType}
 */

const useProfileId = (): ReturnType => {
  const {
    isLoading: isGlobalLoading,
    hasFailed: hasGlobalFailed,
    isSuccess: isGlobalSuccess,
  } = useGlobal();
  const dispatch = useDispatch();

  const urlParams = useLocationSearch();

  const locationId: ?string = urlParams?.get('id');
  const currentUser = useSelector(getCurrentUser());

  const {
    data: profile,
    isLoading: isProfileLoading,
    isError: hasProfileFailed,
    isSuccess: isProfileSuccess,
  } = useFetchRegistrationProfileQuery(
    { id: locationId ?? currentUser?.id },
    { skip: !(locationId || currentUser?.id) }
  );

  useEffect(() => {
    if (locationId || currentUser?.id) {
      dispatch(onSetId({ id: locationId ?? currentUser?.id }));
    }
    if (profile) {
      dispatch(onSetProfile({ profile }));
    }
  }, [locationId, currentUser, profile, dispatch]);

  const isLoading = [isProfileLoading, isGlobalLoading].includes(true);

  const isError = [hasProfileFailed, hasGlobalFailed].includes(true);

  const isSuccess = [isProfileSuccess, isGlobalSuccess].every(
    (v) => v === true
  );

  return {
    isLoading,
    isError,
    isSuccess,
  };
};

export default useProfileId;
